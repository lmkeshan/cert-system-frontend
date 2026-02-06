import React, { useState, useEffect } from 'react'
import AdminHeader from '../../components/AdminHeader'
import { adminAPI } from '../../services/api'

function ImagePlaceholder() {
  return (
    <div className="w-9 h-9 rounded-md border border-gray-400 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8" cy="8" r="1.5" />
        <path d="M21 16l-5-5-4 4-2-2-5 5" />
      </svg>
    </div>
  )
}

export default function Universities() {
  const [institutes, setInstitutes] = useState([])
  const [issuerStatus, setIssuerStatus] = useState({})
  const [actionLoading, setActionLoading] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInstitutes()
  }, [])

  const loadInstitutes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminAPI.getInstitutes()
      // Extract the array from response.data (could be nested in a property)
      let data = response.data
      if (!Array.isArray(data)) {
        // Try common property names
        data = data.institutes || data.universities || data.data || data.results || []
      }
      setInstitutes(data)
      // Check on-chain issuer status for each institute
      data.forEach(institute => {
        if (institute.wallet_address) {
          checkIssuerStatus(institute.institute_id)
        }
      })
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load institutes')
    } finally {
      setLoading(false)
    }
  }

  const checkIssuerStatus = async (instituteId) => {
    try {
      const response = await adminAPI.getIssuerStatus(instituteId)
      setIssuerStatus(prev => ({
        ...prev,
        [instituteId]: response.data.isIssuer ? 'Issuer' : 'Not Issuer'
      }))
    } catch (err) {
      setIssuerStatus(prev => ({
        ...prev,
        [instituteId]: 'Error'
      }))
    }
  }

  const handleRevoke = async (institute) => {
    const instituteId = institute.institute_id
    if (!instituteId) return
    const confirmed = window.confirm(`Revoke issuer access for "${institute.institute_name || 'this university'}"?`)
    if (!confirmed) return

    try {
      setActionLoading(prev => ({ ...prev, [instituteId]: true }))
      await adminAPI.revokeInstitute(instituteId, { reason: 'Revoked by admin' })
      setInstitutes(prev => prev.map(item => (
        item.institute_id === instituteId
          ? { ...item, verification_status: 'rejected' }
          : item
      )))
      setIssuerStatus(prev => ({ ...prev, [instituteId]: 'Not Issuer' }))
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to revoke institute')
    } finally {
      setActionLoading(prev => ({ ...prev, [instituteId]: false }))
    }
  }

  const handleApprove = async (institute) => {
    const instituteId = institute.institute_id
    if (!instituteId) return
    const confirmed = window.confirm(`Re-approve "${institute.institute_name || 'this university'}"?`)
    if (!confirmed) return

    try {
      setActionLoading(prev => ({ ...prev, [instituteId]: true }))
      await adminAPI.approveInstitute(instituteId, { notes: 'Re-approved by admin' })
      setInstitutes(prev => prev.map(item => (
        item.institute_id === instituteId
          ? { ...item, verification_status: 'approved' }
          : item
      )))
      await checkIssuerStatus(instituteId)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to approve institute')
    } finally {
      setActionLoading(prev => ({ ...prev, [instituteId]: false }))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US')
  }

  const truncateAddress = (address) => {
    if (!address) return '-'
    return address.substring(0, 10) + '...' + address.substring(address.length - 8)
  }

  const resolveFileUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `http://localhost:3001${path}`
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Manage Universities" subtitle="Loading..." showLogout={false} />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d34d6] mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching universities...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Manage Universities" subtitle="Error loading data" showLogout={false} />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mt-6">
          <p className="font-bold text-lg">Error Loading Universities</p>
          <p className="text-sm mt-2">{error}</p>
          <button onClick={loadInstitutes} className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Manage Universities"
        subtitle="View all registered universities and manage their issuer status"
        showLogout={false}
      />

      <div className="mt-6 bg-white rounded-2xl shadow-[0_10px_22px_rgba(0,0,0,0.08)] px-6 py-5 overflow-x-auto transition-transform duration-200 hover:scale-[1.01]">
        {institutes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No universities found</p>
          </div>
        ) : (
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="text-gray-600">
              <tr className="border-b border-gray-300">
                <th className="py-3 font-semibold">University Name</th>
                <th className="py-3 font-semibold">Email</th>
                <th className="py-3 font-semibold">Logo</th>
                <th className="py-3 font-semibold">Wallet Address</th>
                <th className="py-3 font-semibold">On-chain Issuer</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Registered</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutes.map((institute) => (
                <tr key={institute.institute_id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 font-medium text-gray-900">{institute.institute_name || '-'}</td>
                  <td className="py-4 text-gray-600">{institute.email || '-'}</td>
                  <td className="py-4">
                    {institute.logo_url ? (
                      <img
                        src={resolveFileUrl(institute.logo_url)}
                        alt={`${institute.institute_name || 'University'} logo`}
                        className="w-9 h-9 rounded-md object-cover border border-gray-200"
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </td>
                  <td className="py-4 font-mono text-xs text-gray-600" title={institute.wallet_address}>
                    {truncateAddress(institute.wallet_address)}
                  </td>
                  <td className="py-4 text-gray-600">
                    {issuerStatus[institute.institute_id] || 'Loading...'}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      institute.verification_status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : institute.verification_status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {institute.verification_status?.charAt(0).toUpperCase() + institute.verification_status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600">{formatDate(institute.created_at)}</td>
                  <td className="py-4">
                    {institute.verification_status === 'approved' ? (
                      <button
                        onClick={() => handleRevoke(institute)}
                        disabled={actionLoading[institute.institute_id]}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                        {actionLoading[institute.institute_id] ? 'Revoking...' : 'Revoke'}
                      </button>
                    ) : institute.verification_status === 'rejected' ? (
                      <button
                        onClick={() => handleApprove(institute)}
                        disabled={actionLoading[institute.institute_id]}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6l-11 11-5-5" />
                        </svg>
                        {actionLoading[institute.institute_id] ? 'Approving...' : 'Re-Approve'}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
