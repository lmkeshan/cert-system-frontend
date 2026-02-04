import React from 'react'
import AdminHeader from '../../components/AdminHeader'

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

export default function Pending() {
  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Pending Approvals"
        subtitle="Review and approve or reject university registration requests"
        showLogout={false}
      />

      <div className="mt-6 bg-white rounded-2xl shadow-[0_10px_22px_rgba(0,0,0,0.08)] px-6 py-5 overflow-x-auto transition-transform duration-200 hover:scale-[1.01]">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="text-gray-600">
            <tr className="border-b border-gray-300">
              <th className="py-3 font-semibold">University Name</th>
              <th className="py-3 font-semibold">Email</th>
              <th className="py-3 font-semibold">Wallet Address</th>
              <th className="py-3 font-semibold">Logo</th>
              <th className="py-3 font-semibold">Verification Doc</th>
              <th className="py-3 font-semibold">Registered</th>
              <th className="py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4">Test University</td>
              <td>testuni@gmail.com</td>
              <td>0xAbC1234Ef5678901234567890abcdef12345678</td>
              <td><ImagePlaceholder /></td>
              <td><a className="text-blue-600 underline" href="#">View Doc</a></td>
              <td>1/16/2026</td>
              <td className="space-y-2">
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6l-11 11-5-5" />
                  </svg>
                  Approve
                </button>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
