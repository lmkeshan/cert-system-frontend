import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { universityAPI } from '../../services/api';

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    { label: 'Total Certificates', value: '0', key: 'totalCertificates' },
    { label: 'Verification Status', value: 'Loading...', key: 'verificationStatus' },
    { label: 'Wallet Balance', value: '0.00', key: 'walletBalance' },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await universityAPI.getDashboard();
      
      if (response.data) {
        const data = response.data;
        let walletBalance = '0.00';
        
        // Get wallet balance from payment endpoint if wallet address exists
        if (data.institute?.wallet_address) {
          try {
            const balanceResponse = await fetch(`http://localhost:3001/api/payment/balance?address=${data.institute.wallet_address}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('instituteToken')}`
              }
            });

            if (balanceResponse.ok) {
              const balanceData = await balanceResponse.json();
              walletBalance = parseFloat(balanceData.data?.balancePol || '0.00').toFixed(4);
            } else {
              console.log('⚠️ Balance endpoint returned:', balanceResponse.status);
            }
          } catch (balanceErr) {
            console.error('❌ Failed to fetch balance:', balanceErr);
          }
        }
        
        setStats([
          { 
            label: 'Total Certificates', 
            value: data.totalCertificates?.toString() || '0',
            key: 'totalCertificates' 
          },
          { 
            label: 'Verification Status', 
            value: data.institute?.verification_status || 'Approved',
            key: 'verificationStatus' 
          },
          { 
            label: 'Wallet Balance', 
            value: walletBalance,
            key: 'walletBalance' 
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
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
          <button 
            onClick={() => navigate('/institute/issue-certificate')}
            className="bg-[#8B5CF6] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#7C3AED] transition-all shadow-md active:scale-95"
          >
            Issue Single Certificate
          </button>
          
          <button 
            onClick={() => navigate('/institute/bulk-issue')}
            className="border-2 border-[#8B5CF6] text-[#8B5CF6] px-6 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-all active:scale-95"
          >
            Bulk Upload CSV
          </button>
          
          <button 
            onClick={() => navigate('/institute/history')}
            className="bg-[#9366E4] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#7C3AED] transition-all shadow-md active:scale-95"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;