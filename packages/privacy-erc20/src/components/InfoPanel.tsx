'use client';

export default function InfoPanel() {
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">🔒 How Privacy Works</h2>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-purple-400 mb-2">🎭 Ring Signatures</h3>
          <p className="text-gray-300">
            Your transaction is signed as one of many possible signers. Observers can verify the signature is valid, 
            but cannot determine which member of the ring actually signed it.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-400 mb-2">🔐 Zero-Knowledge Proofs</h3>
          <p className="text-gray-300">
            Prove you have sufficient balance and the transaction is valid without revealing your actual balance or amount transferred.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-green-400 mb-2">🎲 Commitments</h3>
          <p className="text-gray-300">
            Balances are hidden using Pedersen commitments. Only you know the actual value, while the blockchain only sees cryptographic commitments.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-yellow-400 mb-2">🚫 Nullifiers</h3>
          <p className="text-gray-300">
            Prevent double-spending without revealing which commitment was spent. Each transaction creates a unique nullifier that can only be used once.
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-black/30 rounded-lg">
        <p className="text-xs text-gray-400">
          <strong>Privacy Guarantee:</strong> No transaction amounts, sender identities, or balances are visible on-chain. 
          Only cryptographic commitments and proofs are stored.
        </p>
      </div>
    </div>
  );
}

