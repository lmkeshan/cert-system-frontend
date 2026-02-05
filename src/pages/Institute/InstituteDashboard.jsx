import React from 'react';

const Overview = () => {
  // Data for the metric cards as seen in the screenshot
  const stats = [
    { label: 'Total Certificates', value: '0' },
    { label: 'Verification Status', value: 'Approved' },
    { label: 'Wallet Balance', value: '0.5730' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Main Dashboard Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-300 p-5 md:p-6 flex items-start gap-4 shadow-sm">
        <div className="bg-[#E9D5FF] p-2 rounded-lg flex items-center justify-center">
          {/* Using Emoji to match the visual icon in screenshot */}
          <span className="text-2xl" role="img" aria-label="dashboard-icon">📄🔍</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">University Dashboard</h2>
          <p className="text-sm text-gray-400 font-medium">
            Manage your institution's digital certificate issuance on the blockchain
          </p>
        </div>
      </div>

      {/* 2. Welcome Message Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800">Welcome to Certificate Verification Portal</h3>
        <p className="text-sm text-gray-400 font-medium">
          Issue and manage blockchain-verified certificates for your students
        </p>
      </div>

      {/* 3. Metric Stats Grid (Responsive: 1 col on mobile, 3 cols on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-8 md:p-10 rounded-2xl shadow-md text-center border border-gray-50 flex flex-col items-center justify-center"
          >
            <h4 className="text-[#374151] font-bold mb-4 text-base md:text-lg">
              {stat.label}
            </h4>
            <p className="text-4xl md:text-5xl font-extrabold text-[#8B5CF6]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* 4. Quick Actions Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Quick Actions</h3>
        
        {/* Horizontal Divider exactly as in screenshot */}
        <hr className="mb-6 border-gray-200" />
        
        <div className="flex flex-col md:flex-row gap-4">
          <button className="bg-[#8B5CF6] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#7C3AED] transition-all shadow-md active:scale-95">
            Issue Single Certificate
          </button>
          
          <button className="border-2 border-[#8B5CF6] text-[#8B5CF6] px-6 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-all active:scale-95">
            Bulk Upload CSV
          </button>
          
          <button className="bg-[#9366E4] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#7C3AED] transition-all shadow-md active:scale-95">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;