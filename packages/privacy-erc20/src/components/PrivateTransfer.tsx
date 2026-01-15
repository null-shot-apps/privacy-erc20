'use client';

import { useState, useEffect } from 'react';
import { connectWallet, getContract } from '@/lib/contract';
import { createCommitment, generateRingSignature, generateNullifier, encodeRingSignature, generateTransferProof } from '@/lib/crypto';

export default function PrivateTransfer() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [ringSize, setRingSize] = useState(5);
  const [anonymitySetSize, setAnonymitySetSize] = useState(0);

  useEffect(() => {
    loadAnonymitySetSize();
  }, []);

  const loadAnonymitySetSize = async () => {
    try {
      const signer = await connectWallet();
      if (!signer) return;
      
      const contract = getContract(signer);
      const size = await contract.getAnonymitySetSize();
      setAnonymitySetSize(Number(size));
    } catch (error) {
      console.error('Failed to load anonymity set size:', error);
    }
  };

  const handleTransfer = async () => {
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      setStatus('❌ Please enter valid recipient and amount');
      return;
    }

    setIsTransferring(true);
    setStatus('Preparing private transfer...');
    
    try {
      // Get private key from storage
      const privateKeyStr = localStorage.getItem('privacy_token_private_key');
      if (!privateKeyStr) {
        throw new Error('Please register your public key first');
      }
      const privateKey = BigInt(privateKeyStr);
      
      // Get commitments from storage
      const commitments = JSON.parse(localStorage.getItem('privacy_token_commitments') || '[]');
      if (commitments.length === 0) {
        throw new Error('No balance available. Please mint tokens first.');
      }
      
      // Use the first commitment as sender
      const senderCommitment = {
        commitment: commitments[0].commitment,
        randomness: BigInt(commitments[0].randomness),
        value: BigInt(commitments[0].value)
      };
      
      setStatus('Creating receiver commitment...');
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e18));
      const receiverCommitment = await createCommitment(amountBigInt);
      
      setStatus('Connecting to wallet...');
      const signer = await connectWallet();
      if (!signer) {
        throw new Error('Failed to connect wallet');
      }
      
      const contract = getContract(signer);
      
      setStatus('Building anonymity set...');
      const ringMembers = await contract.getRingMembers(Math.min(ringSize, anonymitySetSize));
      
      if (ringMembers.length < 3) {
        throw new Error('Not enough registered users for anonymity set');
      }
      
      setStatus('Generating ring signature...');
      const message = `transfer_${Date.now()}`;
      const ringSignature = await generateRingSignature(
        message,
        ringMembers.map((addr: string) => addr), // In production, use actual public keys
        privateKey,
        0 // Assuming sender is first in ring
      );
      
      setStatus('Generating nullifier...');
      const nullifier = await generateNullifier(senderCommitment, BigInt(Date.now()));
      
      setStatus('Generating zero-knowledge proof...');
      const proof = await generateTransferProof(
        senderCommitment,
        receiverCommitment,
        amountBigInt
      );
      
      setStatus('Submitting private transfer...');
      const tx = await contract.privateTransfer(
        ringMembers,
        encodeRingSignature(ringSignature),
        nullifier,
        receiverCommitment.commitment,
        proof.proof_a,
        proof.proof_b,
        proof.proof_c,
        proof.publicInputs
      );
      
      setStatus('Waiting for confirmation...');
      await tx.wait();
      
      // Update local storage
      commitments.shift(); // Remove used commitment
      commitments.push({
        commitment: receiverCommitment.commitment,
        randomness: receiverCommitment.randomness.toString(),
        value: receiverCommitment.value.toString(),
        timestamp: Date.now()
      });
      localStorage.setItem('privacy_token_commitments', JSON.stringify(commitments));
      
      setStatus(`✅ Successfully transferred ${amount} PRIV tokens privately!`);
      setRecipient('');
      setAmount('');
    } catch (error: any) {
      console.error('Transfer failed:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Private Transfer</h2>
      <p className="text-gray-400 mb-6">
        Send tokens privately using ring signatures. Your transaction is hidden among {anonymitySetSize} registered users.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-sm"
            disabled={isTransferring}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
            disabled={isTransferring}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Ring Size: {ringSize} (Anonymity Set)
          </label>
          <input
            type="range"
            min="3"
            max={Math.min(20, anonymitySetSize)}
            value={ringSize}
            onChange={(e) => setRingSize(parseInt(e.target.value))}
            className="w-full"
            disabled={isTransferring || anonymitySetSize < 3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Larger ring = more privacy, but higher gas costs
          </p>
        </div>
        
        <button
          onClick={handleTransfer}
          disabled={isTransferring || !recipient || !amount || anonymitySetSize < 3}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {isTransferring ? 'Transferring...' : 'Send Private Transfer'}
        </button>
      </div>
      
      {status && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
          <p className="text-sm">{status}</p>
        </div>
      )}
      
      {anonymitySetSize < 3 && (
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <p className="text-sm text-yellow-400">
            ⚠️ Need at least 3 registered users for private transfers. Current: {anonymitySetSize}
          </p>
        </div>
      )}
    </div>
  );
}

