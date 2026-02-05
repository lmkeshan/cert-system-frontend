import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * React Hook for MetaMask Integration
 * Provides easy access to wallet connection, signing, and contract interactions
 */
export const useMetaMask = () => {
  const [metamask, setMetamask] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [contractBalance, setContractBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize MetaMask
  useEffect(() => {
    const initMetaMask = async () => {
      try {
        if (typeof window.ethers === 'undefined') {
          setTimeout(initMetaMask, 500);
          return;
        }

        if (typeof window.MetaMask === 'undefined') {
          setTimeout(initMetaMask, 500);
          return;
        }

        if (!window.MetaMask.isInstalled()) {
          setError('MetaMask extension not installed. Please install it first.');
          return;
        }

        const instance = new window.MetaMask();
        setMetamask(instance);

        if (instance.isConnected && typeof instance.isConnected === 'function') {
          const isAlreadyConnected = instance.isConnected();
          if (isAlreadyConnected) {
            await autoConnect(instance);
          }
        }
      } catch (err) {
        setError('Failed to initialize MetaMask: ' + err.message);
      }
    };

    initMetaMask();
  }, []);

  // Auto-connect if previously connected
  const autoConnect = useCallback(async (instance) => {
    try {
      const addr = await instance.connect();
      setAddress(addr);
      setConnected(true);
      await refreshBalance(instance, addr);
    } catch {
    }
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async (instance, addr = null) => {
    try {
      const nativeBalance = await instance.getNativeBalance();
      setBalance(nativeBalance.toFixed(4));

      if (addr) {
        const contractBal = await instance.getContractBalance(addr);
        setContractBalance(contractBal.pol.toFixed(4));
      }
    } catch {
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!metamask) {
      setError('MetaMask not initialized. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const addr = await metamask.connect();
      setAddress(addr);
      setConnected(true);
      await refreshBalance(metamask, addr);
      return addr;
    } catch (err) {
      const errorMsg = err.message || 'Failed to connect';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [metamask, refreshBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    if (metamask) {
      metamask.disconnect();
      setConnected(false);
      setAddress(null);
      setBalance('0.00');
      setContractBalance('0.00');
    }
  }, [metamask]);

  // Sign certificate
  const signCertificate = useCallback(async (certData) => {
    if (!metamask || !connected) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const signedData = await metamask.signAndIssueCertificate(certData);
      return signedData;
    } catch (err) {
      const errorMsg = err.message || 'Failed to sign certificate';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [metamask, connected]);

  // Deposit funds
  const deposit = useCallback(async (amountPol) => {
    if (!metamask || !connected) {
      const msg = 'Wallet not connected. Please connect MetaMask first.';
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);

    try {
      const result = await metamask.depositGasFunds(amountPol);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await refreshBalance(metamask, address);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to deposit';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [metamask, connected, address, refreshBalance]);

  // Get gas cost
  const getGasCost = useCallback(async () => {
    if (!metamask || !connected) {
      throw new Error('Wallet not connected');
    }

    try {
      return await metamask.getGasCost();
    } catch (err) {
      throw err;
    }
  }, [metamask, connected]);

  // Verify certificate
  const verifyCertificate = useCallback(async (certId) => {
    if (!metamask) {
      throw new Error('MetaMask not initialized');
    }

    try {
      return await metamask.verifyCertificate(certId);
    } catch (err) {
      throw err;
    }
  }, [metamask]);

  // Send issuance transaction
  const sendIssuance = useCallback(async (signedData) => {
    if (!metamask || !connected) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      return await metamask.sendIssuanceTransaction(signedData);
    } catch (err) {
      const errorMsg = err.message || 'Failed to send issuance';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [metamask, connected]);

  return {
    // State
    connected,
    address,
    balance,
    contractBalance,
    loading,
    error,
    metamask,

    // Methods
    connect,
    disconnect,
    signCertificate,
    deposit,
    getGasCost,
    verifyCertificate,
    sendIssuance,
    refreshBalance: () => refreshBalance(metamask, address),

    // Utilities
    isInstalled: window.MetaMaskIntegration?.isMetaMaskInstalled?.() || false,
    getNetworkInfo: metamask?.getNetworkInfo?.bind(metamask)
  };
};

export default useMetaMask;
