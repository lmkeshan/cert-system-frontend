import React from 'react';
import { Wallet, Copy, CheckCircle2 } from 'lucide-react';

const WalletPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
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
          <h3 className="text-5xl font-extrabold mb-2">0.573</h3>
          <p className="text-xs font-medium opacity-80 uppercase tracking-widest font-sans">Polygon (pol)</p>
        </div>
        {/* Subtle background circle deco */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* 3. Wallet Address Section (Desktop Only Styling) */}
      <div className="bg-[#DBEAFE]/50 rounded-2xl p-6 border border-[#BFDBFE]">
        <h4 className="text-sm font-bold text-gray-800 mb-3">Wallet Address</h4>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-xs md:text-sm font-mono text-gray-500 break-all bg-white/50 p-2 rounded border border-gray-100">
            0x0000000000000000000000000000000000000000
          </p>
          <button className="bg-[#8B5CF6] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#7C3AED] transition-all flex items-center gap-2 w-max">
            <Copy size={14} /> Copy Address
          </button>
        </div>
      </div>

      {/* 4. Balance Breakdown Cards */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-50">
         <h3 className="text-lg font-bold text-gray-800 mb-6">Balance Breakdown</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-md">
               <p className="text-sm font-bold text-gray-700 mb-2">Prepaid Balance</p>
               <p className="text-3xl font-extrabold text-black mb-1">0.5730</p>
               <p className="text-[10px] text-gray-400 font-medium">POL available for certificates</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-md">
               <p className="text-sm font-bold text-gray-700 mb-2">Total GAS spent</p>
               <p className="text-3xl font-extrabold text-black mb-1">0.0000</p>
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
            Connect your MetaMask wallet and deposit Polygon(POL) tokens directly to your contact balance. 
            Each certificate issuance will deduct gas fees from your prepaid balance.
          </p>
        </div>

        {/* Green Success Status */}
        <div className="bg-[#DCFCE7] border border-[#BBF7D0] p-3 rounded-lg flex items-center gap-3">
          <div className="bg-green-500 text-white p-0.5 rounded-full">
            <CheckCircle2 size={14} />
          </div>
          <p className="text-[#15803D] font-bold text-sm">
            MetaMask Status : <span className="font-medium text-gray-700 ml-2">Connection success.</span>
          </p>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Amount (POL)</label>
          <input 
            type="text" 
            placeholder="Enter amount to deposit" 
            className="w-full p-3.5 rounded-xl border-2 border-gray-200 focus:border-[#9366E4] outline-none text-sm font-medium placeholder:text-gray-300" 
          />
        </div>

        <button className="w-full bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-extrabold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
          Deposit POL
        </button>
      </div>

      {/* 6. Cost Estimation */}
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-50">
        <h3 className="text-center text-lg font-bold text-gray-800 mb-6">Certificate Cost Estimation</h3>
        <hr className="mb-8 border-gray-100" />
        <div className="bg-[#DBEAFE] border-l-4 border-[#3B82F6] p-6 rounded-r-xl max-w-2xl mx-auto">
           <p className="text-[#1E42AF] font-bold text-sm mb-4">Average GAS cost</p>
           <div className="flex items-baseline gap-2">
             <span className="text-2xl font-extrabold text-black">0.009000</span>
             <span className="text-xs text-gray-400 font-bold uppercase">POL per certificate</span>
           </div>
        </div>
      </div>

    </div>
  );
};

export default WalletPage;