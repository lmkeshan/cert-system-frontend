import React, { createContext, useContext, useEffect, useState } from 'react';

const MetaMaskContext = createContext();

/**
 * MetaMask Context Provider
 * Provides MetaMask functionality to entire app
 */
export const MetaMaskProvider = ({ children }) => {
  const [instance, setInstance] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [contractBalance, setContractBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize MetaMask on mount
  useEffect(() => {
    const initMetaMask = async () => {
      try {
        if (typeof window.ethers === 'undefined') {
          console.warn('ethers.js required for MetaMask integration');
          return;
        }

        if (typeof window.MetaMaskIntegration === 'undefined') {
          console.warn('MetaMaskIntegration class not found');
          return;
        }

        const mm = new window.MetaMaskIntegration();
        setInstance(mm);

        // Try auto-connect if already connected
        if (window.MetaMaskIntegration.isMetaMaskInstalled()) {
          try {
            const accounts = await window.ethereum.request({
              method: 'eth_accounts'
            });

            if (accounts && accounts.length > 0) {
              const addr = accounts[0];
              setAddress(addr);
              setConnected(true);
              await refreshBalances(mm, addr);
            }
          } catch (autoErr) {
            console.log('Auto-connect skipped (user interaction needed)');
          }
        }
      } catch (err) {
        console.error('MetaMask initialization error:', err);
        setError(err.message);
      }
    };

    initMetaMask();
  }, []);

  const refreshBalances = async (mm, addr) => {
    try {
      // Get native balance
      const nativeBal = await mm.getNativeBalance();
      setBalance(nativeBal.toFixed(4));

      // Get contract balance
      if (addr) {
        const contractBal = await mm.getContractBalance(addr);
        setContractBalance(contractBal.pol.toFixed(4));
      }
    } catch (err) {
      console.error('Failed to refresh balances:', err);
    }
  };

  const connect = async () => {
    if (!instance) {
      throw new Error('MetaMask not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const addr = await instance.connect();
      setAddress(addr);
      setConnected(true);
      await refreshBalances(instance, addr);
      return addr;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    if (instance) {
      instance.disconnect();
    }
    setConnected(false);
    setAddress(null);
    setBalance('0');
    setContractBalance('0');
  };

  const value = {
    // State
    instance,
    connected,
    address,
    balance,
    contractBalance,
    loading,
    error,

    // Methods
    connect,
    disconnect,
    refreshBalances: () => instance && refreshBalances(instance, address),

    // Status checks
    isInstalled: window.MetaMaskIntegration?.isMetaMaskInstalled?.() || false
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
};

/**
 * Hook to use MetaMask context
 */
export const useMetaMaskContext = () => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMaskContext must be used within MetaMaskProvider');
  }
  return context;
};

export default MetaMaskContext;
