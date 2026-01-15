'use client';

import { useState } from 'react';
import { connectWallet, getContract } from '@/lib/contract';
import { generateKeyPair } from '@/lib/crypto';

export default function RegisterKey() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');

  const handleRegister = async () => {
    setIsRegistering(true);
    setStatus('Generating key pair...');
    
    try {
      // Generate key pair
      const keyPair = await generateKeyPair();
      setPublicKey(keyPair.publicKey);
      
      // Store private key in local storage (in production, use secure storage)
      localStorage.setItem('privacy_token_private_key', keyPair.privateKey.toString());
      
      setStatus('Connecting to wallet...');
      const signer = await connectWallet();
      if (!signer) {
        throw new Error('Failed to connect wallet');
      }
      
      setStatus('Registering public key...');
      const contract = getContract(signer);
      const tx = await contract.registerPublicKey(keyPair.publicKey);
      
      setStatus('Waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ Successfully registered!');
    } catch (error: any) {
      console.error('Registration failed:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Register for Privacy</h2>
      <p className="text-gray-400 mb-6">
        Register your public key to participate in the anonymity set. This allows you to send and receive private transactions.
      </p>
      
      <button
        onClick={handleRegister}
        disabled={isRegistering}
        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
      >
        {isRegistering ? 'Registering...' : 'Register Public Key'}
      </button>
      
      {status && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
          <p className="text-sm">{status}</p>
        </div>
      )}
      
      {publicKey && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Your Public Key:</p>
          <p className="text-xs font-mono break-all">{publicKey}</p>
        </div>
      )}
    </div>
  );
}

