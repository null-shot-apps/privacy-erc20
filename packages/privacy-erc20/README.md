# Privacy Token Platform

A privacy-preserving ERC20 token platform built with Ring Signatures and Zero-Knowledge Proofs on EVM.

## 🔒 Features

- **Complete Privacy**: No transaction amounts, sender identities, or balances visible on-chain
- **Ring Signatures**: Hide the actual sender among a group of possible signers
- **Zero-Knowledge Proofs**: Prove transaction validity without revealing sensitive data
- **Pedersen Commitments**: Cryptographically hide balances and amounts
- **Nullifier System**: Prevent double-spending while maintaining privacy
- **EVM Compatible**: Works on any Ethereum-compatible blockchain

## 🏗️ Architecture

### Smart Contract Layer
- `contracts/PrivacyToken.sol`: Main privacy token contract
- Ring signature verification
- ZK proof verification
- Commitment and nullifier management

### Cryptography Layer
- `src/lib/crypto.ts`: Cryptographic utilities
  - Pedersen commitment generation
  - Ring signature creation and verification
  - ZK proof generation (simplified)
  - Nullifier generation

### Frontend Layer
- Next.js 15 with App Router
- React components for wallet interaction
- Real-time transaction status
- Educational information panels

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Deploy Smart Contract

You need to deploy the `PrivacyToken.sol` contract to an EVM-compatible network.

**Option A: Using Remix (Easiest)**
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Copy `contracts/PrivacyToken.sol`
3. Compile with Solidity 0.8.20+
4. Deploy with verifier address (use `0x0000000000000000000000000000000000000000` for testing)

**Option B: Using Hardhat**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Update Contract Address

Edit `src/lib/constants.ts`:
```typescript
export const PRIVACY_TOKEN_ADDRESS = '0xYourDeployedContractAddress';
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:8000](http://localhost:8000)

## 📖 How It Works

### 1. Registration
Users register a public key to join the anonymity set. This allows them to participate in ring signatures.

### 2. Minting
Tokens are minted to a cryptographic commitment instead of a public address. Only the user knows the actual amount.

### 3. Private Transfer
Transfers use:
- **Ring Signature**: Proves the sender is one of N registered users (but doesn't reveal which one)
- **ZK Proof**: Proves the sender has sufficient balance and the transaction is valid
- **Commitment**: Creates a new commitment for the receiver
- **Nullifier**: Prevents the same commitment from being spent twice

## 🔬 Technical Details

### Ring Signatures
```
Signer proves: "I am one of these N people, but you can't tell which one"
- Uses Poseidon hash for efficiency on EVM
- Linkable to prevent double-signing
- Configurable ring size (3-20 members)
```

### Zero-Knowledge Proofs
```
Prover demonstrates:
1. Knowledge of commitment opening (balance)
2. Sufficient balance for transfer
3. Correct formation of new commitments
Without revealing: actual amounts or balances
```

### Commitments
```
C = H(value || randomness)
- Hides the actual value
- Allows homomorphic operations
- Binding and hiding properties
```

### Nullifiers
```
N = H(commitment_secret || nonce)
- Unique per transaction
- Prevents double-spending
- Unlinkable to original commitment
```

## 🛡️ Privacy Guarantees

### What is Hidden ✅
- ✅ Sender identity (hidden in ring)
- ✅ Receiver identity (commitment-based)
- ✅ Transaction amounts (ZK proofs)
- ✅ Account balances (commitments)
- ✅ Transaction graph (unlinkable)

### What is NOT Hidden ⚠️
- ⚠️ Transaction existence (visible on-chain)
- ⚠️ Transaction timing
- ⚠️ Gas costs
- ⚠️ Ring member addresses (but not which is sender)

## 📁 Project Structure

```
privacy-erc20/
├── contracts/
│   ├── PrivacyToken.sol          # Main privacy token contract
│   └── README.md                 # Contract documentation
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── WalletConnect.tsx     # Wallet connection
│   │   ├── RegisterKey.tsx       # Public key registration
│   │   ├── MintTokens.tsx        # Token minting
│   │   ├── PrivateTransfer.tsx   # Private transfers
│   │   └── InfoPanel.tsx         # Information display
│   └── lib/
│       ├── crypto.ts             # Cryptographic utilities
│       ├── contract.ts           # Contract interaction
│       └── constants.ts          # Configuration
└── package.json
```

## 🔧 Configuration

### Network Configuration
Edit `src/lib/constants.ts` to add networks:

```typescript
export const SUPPORTED_NETWORKS = {
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545'
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
  }
};
```

## 🧪 Testing

### Manual Testing Flow
1. Connect wallet (MetaMask)
2. Register public key
3. Mint tokens (creates commitment)
4. Wait for 3+ users to register
5. Perform private transfer
6. Verify transaction on block explorer (only commitment visible)

### What to Verify
- ✅ No amounts visible on-chain
- ✅ No sender/receiver addresses in events
- ✅ Only commitments and nullifiers stored
- ✅ Ring signature verification passes
- ✅ Nullifiers prevent double-spend

## ⚠️ Security Warnings

**This is an educational implementation. For production:**

1. **Audit Required**: Full security audit needed
2. **Real ZK Circuits**: Use audited circom circuits with proper setup
3. **Verifier Contract**: Deploy real Groth16/PLONK verifier
4. **Key Management**: Implement secure key storage
5. **Gas Optimization**: Optimize for production costs
6. **Testing**: Comprehensive test suite
7. **Formal Verification**: Consider formal verification of circuits

## 📚 Resources

- [Ring Signatures Explained](https://en.wikipedia.org/wiki/Ring_signature)
- [Zero-Knowledge Proofs](https://z.cash/technology/zksnarks/)
- [Circom Documentation](https://docs.circom.io/)
- [Tornado Cash Architecture](https://docs.tornado.cash/) (similar privacy approach)
- [Aztec Protocol](https://aztec.network/) (advanced ZK privacy)

## 🤝 Contributing

This is an educational project. Contributions welcome:
- Improve ZK circuits
- Add more privacy features
- Optimize gas costs
- Enhance documentation

## 📄 License

MIT License - Educational purposes only

## 🙏 Acknowledgments

Built with:
- Next.js 15
- ethers.js
- snarkjs
- circomlibjs
- Tailwind CSS

Inspired by:
- Tornado Cash
- Zcash
- Monero
- Aztec Protocol

