/**
 * MetaMask Integration for Certificate Issuance
 * Handles: Connection, Signing, Deposits, On-Chain Payments
 */
class MetaMask {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
    this.chainId = null;
    this.CONTRACT_ADDRESS = '0x13660206fF34b48b07422a6658BfD93242b6a126';
    this.CHAIN_ID = 80002;
    this.RPC_URL = 'https://rpc-amoy.polygon.technology';
    this.BLOCK_EXPLORER = 'https://amoy.polygonscan.com';

    this.CONTRACT_ABI = [
      { inputs: [], name: 'depositGasFund', outputs: [], stateMutability: 'payable', type: 'function' },
      { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'universityBalance', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
      { inputs: [], name: 'gasLimitPerCertificate', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
      { inputs: [], name: 'gasPriceForCertificate', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
      { inputs: [{ internalType: 'string', name: 'certId', type: 'string' }], name: 'getCertificate', outputs: [{ components: [{ internalType: 'string', name: 'studentName', type: 'string' }, { internalType: 'string', name: 'courseName', type: 'string' }, { internalType: 'string', name: 'issueDate', type: 'string' }, { internalType: 'string', name: 'issuerName', type: 'string' }, { internalType: 'address', name: 'issuer', type: 'address' }, { internalType: 'bool', name: 'exists', type: 'bool' }], internalType: 'struct CertificateVerificationNoNonce.Certificate', name: '', type: 'tuple' }], stateMutability: 'view', type: 'function' },
      { inputs: [{ internalType: 'string', name: 'certId', type: 'string' }], name: 'verifyCertificate', outputs: [{ internalType: 'bool', name: 'exists', type: 'bool' }, { internalType: 'string', name: 'studentName', type: 'string' }, { internalType: 'string', name: 'courseName', type: 'string' }, { internalType: 'string', name: 'issueDate', type: 'string' }, { internalType: 'string', name: 'issuerName', type: 'string' }, { internalType: 'address', name: 'issuer', type: 'address' }], stateMutability: 'view', type: 'function' },
    ];
  }

  static isInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }

  async connect() {
    if (!MetaMask.isInstalled()) {
      throw new Error('MetaMask is not installed.');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask');
      }

      this.userAddress = accounts[0];
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      await this.switchToPolygonAmoy();
      this.setupEventListeners();

      return this.userAddress;
    } catch (error) {
      console.error('MetaMask connection failed:', error.message);
      throw error;
    }
  }

  async switchToPolygonAmoy() {
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    const amoyChainId = '0x' + this.CHAIN_ID.toString(16);

    if (currentChainId !== amoyChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: amoyChainId }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await this.addPolygonAmoyNetwork();
        } else {
          throw switchError;
        }
      }
    }

    this.chainId = this.CHAIN_ID;
  }

  async addPolygonAmoyNetwork() {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x' + this.CHAIN_ID.toString(16),
          chainName: 'Polygon Amoy Testnet',
          rpcUrls: [this.RPC_URL],
          nativeCurrency: {
            name: 'Polygon',
            symbol: 'POL',
            decimals: 18
          },
          blockExplorerUrls: [this.BLOCK_EXPLORER]
        }
      ]
    });
  }

  setupEventListeners() {
    window.ethereum.on('accountsChanged', (accounts) => {
      this.userAddress = accounts[0] || null;
      if (this.userAddress && this.provider) {
        this.signer = this.provider.getSigner();
      }
      window.dispatchEvent(
        new CustomEvent('metamask:accountChanged', { detail: accounts[0] })
      );
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('disconnect', () => {
      this.disconnect();
      window.dispatchEvent(new CustomEvent('metamask:disconnected'));
    });
  }

  createMessageHash(certId, studentName, courseName, issueDate, issuerName, signerAddress) {
    return ethers.solidityKeccak256(
      ['string', 'string', 'string', 'string', 'string', 'address'],
      [certId, studentName, courseName, issueDate, issuerName, signerAddress]
    );
  }

  async signMessageHash(messageHash) {
    if (!messageHash || !messageHash.startsWith('0x') || messageHash.length < 66) {
      throw new Error('Invalid messageHash format');
    }

    if (!this.userAddress) {
      throw new Error('Wallet not connected. Please connect MetaMask first.');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [messageHash, this.userAddress]
      });
      return signature;
    } catch (error) {
      console.error('Signing failed:', error.message);
      throw error;
    }
  }

  async signAndIssueCertificate(certData) {
    if (!this.userAddress) {
      throw new Error('Wallet not connected');
    }

    const messageHash = this.createMessageHash(
      certData.certId,
      certData.studentName,
      certData.courseName,
      certData.issueDate,
      certData.issuerName,
      this.userAddress
    );

    const signature = await this.signMessageHash(messageHash);

    return {
      messageHash,
      signature,
      signerAddress: this.userAddress,
      certData
    };
  }

  getContractWithSigner() {
    if (!this.signer) {
      throw new Error('Signer not ready. Please connect MetaMask first.');
    }
    return new ethers.Contract(
      this.CONTRACT_ADDRESS,
      this.CONTRACT_ABI,
      this.signer
    );
  }

  async depositGasFunds(amountPol) {
    if (!amountPol || Number(amountPol) <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    try {
      const contract = this.getContractWithSigner();
      const amountWei = ethers.parseEther(String(amountPol));

      const tx = await contract.depositGasFund({
        value: amountWei,
        gasLimit: 200000n
      });

      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        receipt: receipt
      };
    } catch (error) {
      console.error('Deposit failed:', error.message);
      throw error;
    }
  }

  async getContractBalance(address = null) {
    try {
      const contract = this.getContractWithSigner();
      const targetAddress = address || this.userAddress;

      const bal = await contract.universityBalance(targetAddress);
      const balPol = Number(ethers.formatEther(bal));

      return {
        wei: bal.toString(),
        pol: balPol
      };
    } catch (error) {
      console.error('Balance fetch failed:', error.message);
      throw error;
    }
  }

  async getGasCost() {
    try {
      const contract = this.getContractWithSigner();

      const [limit, price] = await Promise.all([
        contract.gasLimitPerCertificate(),
        contract.gasPriceForCertificate()
      ]);

      const cost = BigInt(limit.toString()) * BigInt(price.toString());
      const costPol = Number(ethers.formatEther(cost));

      return {
        wei: cost.toString(),
        pol: costPol,
        limit: limit.toString(),
        price: price.toString()
      };
    } catch (error) {
      console.error('Gas cost fetch failed:', error.message);
      throw error;
    }
  }

  async sendIssuanceTransaction(signedData) {
    if (!this.userAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await fetch('/api/payment/issue-with-metamask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('instituteToken')}`
        },
        body: JSON.stringify({
          ...signedData.certData,
          messageHash: signedData.messageHash,
          signature: signedData.signature,
          signerAddress: signedData.signerAddress
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Issuance transaction failed:', error.message);
      throw error;
    }
  }

  async getNativeBalance() {
    if (!this.provider || !this.userAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const balWei = await this.provider.getBalance(this.userAddress);
      return Number(ethers.formatEther(balWei));
    } catch (error) {
      console.error('Balance fetch failed:', error.message);
      throw error;
    }
  }

  async verifyCertificate(certId) {
    try {
      const contract = this.getContractWithSigner();
      const cert = await contract.verifyCertificate(certId);

      return {
        exists: cert.exists,
        studentName: cert.studentName,
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        issuerName: cert.issuerName,
        issuer: cert.issuer
      };
    } catch (error) {
      console.error('Verification failed:', error.message);
      throw error;
    }
  }

  getAddress() {
    return this.userAddress;
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    return this.signer;
  }

  isConnected() {
    return !!this.userAddress;
  }

  disconnect() {
    this.userAddress = null;
    this.provider = null;
    this.signer = null;
    this.chainId = null;
  }

  getNetworkInfo() {
    return {
      networkName: 'Polygon Amoy',
      chainId: this.CHAIN_ID,
      rpcUrl: this.RPC_URL,
      blockExplorer: this.BLOCK_EXPLORER,
      contractAddress: this.CONTRACT_ADDRESS
    };
  }
}

if (typeof window !== 'undefined') {
  window.MetaMask = MetaMask;
  window.MetaMaskIntegration = MetaMask;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MetaMask;
}
