'use client';

import { useState, useEffect } from 'react';
import { connectWallet, getCurrentAccount } from '@/lib/contract';

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  const checkConnection = async () => {
    const currentAccount = await getCurrentAccount();
    setAccount(currentAccount);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const signer = await connectWallet();
      if (signer) {
        const address = await signer.getAddress();
        setAccount(address);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-mono">{formatAddress(account)}</span>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}

