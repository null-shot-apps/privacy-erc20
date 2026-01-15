'use client';

import { useState } from 'react';
import { connectWallet, getContract } from '@/lib/contract';
import { createCommitment } from '@/lib/crypto';

export default function MintTokens() {
  const [amount, setAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [commitment, setCommitment] = useState<string>('');

  const handleMint = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setStatus('❌ Please enter a valid amount');
      return;
    }

    setIsMinting(true);
    setStatus('Creating commitment...');
    
    try {
      // Create commitment for the amount
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e18));
      const comm = await createCommitment(amountBigInt);
      setCommitment(comm.commitment);
      
      // Store commitment details in local storage
      const commitments = JSON.parse(localStorage.getItem('privacy_token_commitments') || '[]');
      commitments.push({
        commitment: comm.commitment,
        randomness: comm.randomness.toString(),
        value: comm.value.toString(),
        timestamp: Date.now()
      });
      localStorage.setItem('privacy_token_commitments', JSON.stringify(commitments));
      
      setStatus('Connecting to wallet...');
      const signer = await connectWallet();
      if (!signer) {
        throw new Error('Failed to connect wallet');
      }
      
      setStatus('Minting tokens...');
      const contract = getContract(signer);
      
      // Generate dummy proof (in production, use real ZK proof)
      const proof_a: [bigint, bigint] = [BigInt(1), BigInt(2)];
      const proof_b: [[bigint, bigint], [bigint, bigint]] = [[BigInt(3), BigInt(4)], [BigInt(5), BigInt(6)]];
      const proof_c: [bigint, bigint] = [BigInt(7), BigInt(8)];
      const publicInputs: [bigint] = [BigInt(comm.commitment)];
      
      const tx = await contract.mint(
        comm.commitment,
        proof_a,
        proof_b,
        proof_c,
        publicInputs
      );
      
      setStatus('Waiting for confirmation...');
      await tx.wait();
      
      setStatus(`✅ Successfully minted ${amount} PRIV tokens!`);
      setAmount('');
    } catch (error: any) {
      console.error('Minting failed:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Mint Private Tokens</h2>
      <p className="text-gray-400 mb-6">
        Mint tokens with a hidden balance. Only you know the actual amount.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
            disabled={isMinting}
          />
        </div>
        
        <button
          onClick={handleMint}
          disabled={isMinting || !amount}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {isMinting ? 'Minting...' : 'Mint Tokens'}
        </button>
      </div>
      
      {status && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
          <p className="text-sm">{status}</p>
        </div>
      )}
      
      {commitment && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Commitment:</p>
          <p className="text-xs font-mono break-all">{commitment}</p>
        </div>
      )}
    </div>
  );
}

