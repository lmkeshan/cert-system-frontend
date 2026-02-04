import React from 'react'
import AdminHeader from '../../components/AdminHeader'

export default function Universities() {
  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Manage Universities"
        subtitle="View all registered universities and manage their issuer status"
        showLogout={false}
      />

      <div className="mt-6 bg-white rounded-2xl shadow-[0_10px_22px_rgba(0,0,0,0.08)] px-6 py-5 overflow-x-auto transition-transform duration-200 hover:scale-[1.01]">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="text-gray-600">
            <tr className="border-b border-gray-300">
              <th className="py-3 font-semibold">University Name</th>
              <th className="py-3 font-semibold">Email</th>
              <th className="py-3 font-semibold">Wallet Address</th>
              <th className="py-3 font-semibold">On-chain Issuer</th>
              <th className="py-3 font-semibold">Status</th>
              <th className="py-3 font-semibold">Registered</th>
              <th className="py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4">Test University</td>
              <td>testuni@gmail.com</td>
              <td>0xAbC1234Ef5678901234567890abcdef12345678</td>
              <td>Not Issuer</td>
              <td className="text-green-600 font-semibold">Approved</td>
              <td>1/16/2026</td>
              <td>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                  Revoke
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
