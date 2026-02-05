import React, { useState, useEffect } from 'react';
import { Wallet, Copy, CheckCircle2 } from 'lucide-react';
import { universityAPI, authAPI } from '../../services/api';
import { useMetaMask } from '../../hooks/useMetaMask';

const WalletPage = () => {
  const [walletData, setWalletData] = useState({
    balance: '0.00',
    gasSpent: '0.00',
    walletAddress: '-',
    estimatedGasCost: '0.009000'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copied, setCopied] = useState(false);
  const [depositing, setDepositing] = useState(false);
  
  // MetaMask integration
  const { 
    connected: metamaskConnected, 
    address: metamaskAddress, 
    balance: metamaskBalance,
    connect: connectMetaMask, 
    deposit: depositToContract,
    loading: metamaskLoading,
    error: metamaskError
  } = useMetaMask();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Get profile to get wallet address
      const profileResponse = await universityAPI.getProfile();
      const profile = profileResponse.data;

      const walletAddr = profile?.institute?.wallet_address || 
                        profile?.institute?.walletAddress || 
                        profile?.wallet_address || '-';
      
      if (walletAddr === '-') {
        setError('No wallet address assigned to your institution');
        setLoading(false);
        return;
      }

      // Step 2: Get balance from payment/balance endpoint using wallet address
      try {
        const balanceResponse = await fetch(`http://localhost:3001/api/payment/balance?address=${walletAddr}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('instituteToken')}`
          }
        });

        if (!balanceResponse.ok) {
          throw new Error(`Balance endpoint returned ${balanceResponse.status}`);
        }

        const balancePayload = await balanceResponse.json();
        const balancePol = parseFloat(balancePayload.data?.balancePol || '0.00').toFixed(4);
        const gasSpentPol = parseFloat(balancePayload.data?.gasSpentPol || '0.00').toFixed(4);

        console.log('💰 Balance:', balancePol, 'POL');
        console.log('⛽ Gas spent:', gasSpentPol, 'POL');

        setWalletData({
          balance: balancePol,
          gasSpent: gasSpentPol,
          walletAddress: walletAddr,
          estimatedGasCost: '0.009000'
        });
      } catch (balanceErr) {
        console.error('❌ Balance fetch failed:', balanceErr);
        // Fallback: show wallet address but unable to load balance
        setWalletData(prev => ({
          ...prev,
          walletAddress: walletAddr,
          balance: '0.00',
          gasSpent: '0.00'
        }));
        setError('Unable to load balance information. Please try again later.');
      }
    } catch (err) {
      console.error('❌ Failed to load wallet data:', err);
      setError(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = () => {
    if (walletData.walletAddress !== '-') {
      navigator.clipboard.writeText(walletData.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      setMessage({ type: 'error', text: '❌ Please enter a valid amount' });
      return;
    }

    // Check if MetaMask is connected
    if (!metamaskConnected) {
      setMessage({ 
        type: 'error', 
        text: '❌ Please connect MetaMask first to deposit POL' 
      });
      return;
    }

    setMessage({ type: '', text: '' });
    setDepositing(true);
    
    try {
      // Call MetaMask deposit function
      const result = await depositToContract(depositAmount);
      
      setMessage({ 
        type: 'success', 
        text: `✅ Successfully deposited ${depositAmount} POL! TX: ${result.hash.substring(0, 10)}...${result.hash.substring(result.hash.length - 8)}` 
      });
      
      setDepositAmount('');
      
      // Reload wallet data after deposit
      setTimeout(() => {
        loadWalletData();
      }, 2000);
      
    } catch (err) {
      console.error('Deposit error:', err);
      setMessage({ 
        type: 'error', 
        text: `❌ Deposit failed: ${err.message}` 
      });
    } finally {
      setDepositing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallet information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-300 p-5 md:p-6 flex items-start gap-4 shadow-sm">
        <div className="text-2xl bg-orange-50 p-2 rounded-lg">
          <span role="img" aria-label="wallet">👛</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-sans tracking-tight">Wallet & Balance Management</h2>
          <p className="text-sm text-gray-400 font-medium font-sans">View your prepaid balance and manage certificate issuance funds</p>
        </div>
      </div>

      {/* 2. Current Balance Gradient Card */}
      <div className="bg-gradient-to-r from-[#9366E4] to-[#7C3AED] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm font-bold opacity-90 mb-1">Current Balance</p>
          <h3 className="text-5xl font-extrabold mb-2">{walletData.balance}</h3>
          <p className="text-xs font-medium opacity-80 uppercase tracking-widest font-sans">Polygon (POL)</p>
        </div>
        {/* Subtle background circle deco */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* 3. Wallet Address Section (Desktop Only Styling) */}
      <div className="bg-[#DBEAFE]/50 rounded-2xl p-6 border border-[#BFDBFE]">
        <h4 className="text-sm font-bold text-gray-800 mb-3">Wallet Address</h4>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-xs md:text-sm font-mono text-gray-500 break-all bg-white/50 p-2 rounded border border-gray-100">
            {walletData.walletAddress}
          </p>
          <button 
            onClick={handleCopyAddress}
            disabled={walletData.walletAddress === '-'}
            className="bg-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#7C3AED] transition-all flex items-center gap-2 w-max"
          >
            <Copy size={14} /> {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>
      </div>

      {/* 4. Balance Breakdown Cards */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-50">
         <h3 className="text-lg font-bold text-gray-800 mb-6">Balance Breakdown</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-md">
               <p className="text-sm font-bold text-gray-700 mb-2">Prepaid Balance</p>
               <p className="text-3xl font-extrabold text-black mb-1">{walletData.balance}</p>
               <p className="text-[10px] text-gray-400 font-medium">POL available for certificates</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-md">
               <p className="text-sm font-bold text-gray-700 mb-2">Total GAS Spent</p>
               <p className="text-3xl font-extrabold text-black mb-1">{walletData.gasSpent}</p>
               <p className="text-[10px] text-gray-400 font-medium">POL consumed for issuance</p>
            </div>
         </div>
      </div>

      {/* 5. Top-Up Section */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-50 space-y-6">
        <h3 className="text-center md:text-left text-xl font-bold text-gray-800">Top-Up Your Balance</h3>
        
        {/* Blue Info Box */}
        <div className="bg-[#DBEAFE] border-l-4 border-[#3B82F6] p-5 rounded-r-xl">
          <h4 className="text-[#1E42AF] font-bold text-sm mb-1">How to Top-Up</h4>
          <p className="text-[#1E42AF] text-[11px] md:text-xs leading-relaxed opacity-80">
            Connect your MetaMask wallet and deposit Polygon(POL) tokens directly to your contract balance. 
            Each certificate issuance will deduct gas fees from your prepaid balance.
          </p>
        </div>

        {/* Status Message */}
        <div className="bg-[#DCFCE7] border border-[#BBF7D0] p-3 rounded-lg flex items-center gap-3">
          <div className="bg-green-500 text-white p-0.5 rounded-full">
            <CheckCircle2 size={14} />
          </div>
          <p className="text-[#15803D] font-bold text-sm">
            Wallet Address: <span className="font-medium text-gray-700 ml-2 font-mono text-xs">{walletData.walletAddress === '-' ? 'Not set' : 'Connected'}</span>
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* MetaMask Connection Status */}
        {!metamaskConnected ? (
          <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <p className="text-sm text-orange-800 mb-3 font-semibold">
              🔗 Connect MetaMask to deposit POL to your prepaid balance
            </p>
            <button
              onClick={connectMetaMask}
              disabled={metamaskLoading}
              className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {metamaskLoading ? 'Connecting...' : '🦊 Connect MetaMask'}
            </button>
          </div>
        ) : (
          <div className="p-3 bg-green-50 border-2 border-green-200 rounded-xl">
            <p className="text-sm text-green-800 font-semibold">
              ✅ MetaMask Connected: {metamaskAddress?.substring(0, 6)}...{metamaskAddress?.substring(metamaskAddress.length - 4)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              💰 Wallet Balance: {metamaskBalance} POL
            </p>
          </div>
        )}

        {/* Amount Input */}
        <form onSubmit={handleDeposit} className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Amount (POL)</label>
          <input 
            type="number"
            min="0.001"
            step="0.001"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount to deposit" 
            disabled={!metamaskConnected || depositing}
            className="w-full p-3.5 rounded-xl border-2 border-gray-200 focus:border-[#9366E4] outline-none text-sm font-medium placeholder:text-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed" 
          />

          <button 
            type="submit"
            disabled={!metamaskConnected || depositing}
            className="w-full bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-extrabold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {depositing ? '⏳ Processing...' : '💳 Deposit POL'}
          </button>
          
          {metamaskConnected && (
            <p className="text-xs text-gray-500 text-center mt-2">
              💡 Transaction will be sent via MetaMask to Polygon Amoy
            </p>
          )}
        </form>
      </div>

      {/* 6. Cost Estimation */}
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-50">
        <h3 className="text-center text-lg font-bold text-gray-800 mb-6">Certificate Cost Estimation</h3>
        <hr className="mb-8 border-gray-100" />
        <div className="bg-[#DBEAFE] border-l-4 border-[#3B82F6] p-6 rounded-r-xl max-w-2xl mx-auto">
           <p className="text-[#1E42AF] font-bold text-sm mb-4">Average GAS Cost</p>
           <div className="flex items-baseline gap-2">
             <span className="text-2xl font-extrabold text-black">{walletData.estimatedGasCost}</span>
             <span className="text-xs text-gray-400 font-bold uppercase">POL per certificate</span>
           </div>
           <p className="text-[#1E42AF] text-xs mt-3 opacity-80">Bulk uploads may have lower per-certificate costs</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;