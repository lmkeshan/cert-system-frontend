import React from 'react'

export default function Header({ open, setOpen }) {
  return (
    <header className="bg-white/60 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle sidebar"
            onClick={() => setOpen(!open)}
            className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600"
          >
            <span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>➤</span>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage Universities, approve registrations, and monitor system statistics</p>
          </div>
        </div>

        <div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full">Log Out</button>
        </div>
      </div>
    </header>
  )
}
