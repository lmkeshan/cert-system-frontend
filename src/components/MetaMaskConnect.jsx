import React, { useState } from 'react';
import { useMetaMaskContext } from '../context/MetaMaskContext';

/**
 * MetaMask Connection Button Component
 * Shows connection status and allows user to connect/disconnect wallet
 */
const MetaMaskConnect = ({ className = '' }) => {
  const { connected, address, balance, loading, connect, disconnect, isInstalled } = useMetaMaskContext();
  const [showMenu, setShowMenu] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      setShowMenu(false);
    } catch (err) {
      console.error('Connection failed:', err);
      // Error is handled by context
    }
  };

  if (!isInstalled) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-all ${className}`}
      >
        📱 Install MetaMask
      </a>
    );
  }

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        disabled={loading}
        className={`bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all ${className}`}
      >
        {loading ? '⏳ Connecting...' : '🔌 Connect Wallet'}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
      >
        <span className="text-lg">✅</span>
        <span className="hidden sm:inline">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
        <span className="sm:hidden">Connected</span>
        <span className="text-xs">▼</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-2">
            <div className="text-sm">
              <p className="text-gray-600 font-semibold">Wallet Address</p>
              <p className="text-xs font-mono text-gray-500 break-all bg-gray-50 p-2 rounded mt-1">
                {address}
              </p>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-semibold">Native Balance</p>
                <p className="text-sm font-bold text-purple-600">{balance} POL</p>
              </div>
            </div>

            <hr className="my-2" />

            <button
              onClick={() => {
                disconnect();
                setShowMenu(false);
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-all text-sm"
            >
              🔌 Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;
