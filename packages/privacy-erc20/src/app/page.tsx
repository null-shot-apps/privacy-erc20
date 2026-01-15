'use client';

import WalletConnect from '@/components/WalletConnect';
import RegisterKey from '@/components/RegisterKey';
import MintTokens from '@/components/MintTokens';
import PrivateTransfer from '@/components/PrivateTransfer';
import InfoPanel from '@/components/InfoPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Privacy Token
            </h1>
            <p className="text-xs text-gray-400">Ring Signatures + Zero-Knowledge Proofs</p>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Truly Private Transactions
          </h2>
          <p className="text-xl text-gray-300">
            The first ERC20 token with complete on-chain privacy using Ring Signatures and Zero-Knowledge Proofs
          </p>
        </div>

        {/* Info Panel */}
        <div className="mb-12">
          <InfoPanel />
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1: Register */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold">Register</h3>
            </div>
            <RegisterKey />
          </div>

          {/* Step 2: Mint */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold">Mint</h3>
            </div>
            <MintTokens />
          </div>

          {/* Step 3: Transfer */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold">Transfer</h3>
            </div>
            <PrivateTransfer />
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🔬 Technical Implementation</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ <strong>Ring Signatures:</strong> Linkable ring signatures using Poseidon hash</li>
              <li>✅ <strong>ZK-SNARKs:</strong> Groth16 proofs for transaction validity</li>
              <li>✅ <strong>Pedersen Commitments:</strong> Hide balances and amounts</li>
              <li>✅ <strong>Nullifier System:</strong> Prevent double-spending</li>
              <li>✅ <strong>EVM Compatible:</strong> Runs on any Ethereum-compatible chain</li>
            </ul>
          </div>

          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🛡️ Privacy Guarantees</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>🔒 <strong>Hidden Sender:</strong> Ring signature hides who sent the transaction</li>
              <li>🔒 <strong>Hidden Receiver:</strong> Commitment scheme hides the recipient</li>
              <li>🔒 <strong>Hidden Amount:</strong> Zero-knowledge proofs hide transfer amounts</li>
              <li>🔒 <strong>Hidden Balance:</strong> All balances stored as commitments</li>
              <li>🔒 <strong>No Metadata:</strong> Minimal on-chain information</li>
            </ul>
          </div>
        </div>

        {/* Deployment Instructions */}
        <div className="mt-12 bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">⚠️ Deployment Required</h3>
          <p className="text-sm text-gray-300 mb-4">
            To use this platform, you need to deploy the PrivacyToken smart contract. Follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Deploy the contract from <code className="bg-black/30 px-2 py-1 rounded">contracts/PrivacyToken.sol</code></li>
            <li>Update the contract address in <code className="bg-black/30 px-2 py-1 rounded">src/lib/constants.ts</code></li>
            <li>Deploy a ZK verifier contract (optional for production)</li>
            <li>Connect your wallet and start using private transactions!</li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-8 text-center text-gray-400 text-sm">
          <p>Privacy Token - Built with Ring Signatures and Zero-Knowledge Proofs on EVM</p>
          <p className="mt-2">⚠️ Educational implementation - Audit before production use</p>
        </div>
      </footer>
    </div>
  );
}

