# Privacy Token Smart Contract

## Overview

This is a privacy-preserving ERC20 token implementation using:
- **Ring Signatures**: Hide the sender among a group of possible signers
- **Zero-Knowledge Proofs**: Prove transaction validity without revealing amounts
- **Pedersen Commitments**: Hide balances using cryptographic commitments
- **Nullifiers**: Prevent double-spending without revealing transaction links

## Contract: PrivacyToken.sol

### Key Features

1. **No Public Balances**: All balances are stored as cryptographic commitments
2. **Anonymous Transfers**: Ring signatures hide the actual sender
3. **Hidden Amounts**: Zero-knowledge proofs verify transactions without revealing amounts
4. **Nullifier System**: Prevents double-spending while maintaining privacy

### Deployment

#### Using Hardhat

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Create hardhat.config.js
npx hardhat init

# Deploy
npx hardhat run scripts/deploy.js --network <network-name>
```

#### Using Foundry

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy
forge create --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  contracts/PrivacyToken.sol:PrivacyToken \
  --constructor-args <VERIFIER_ADDRESS>
```

#### Using Remix

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file and paste `PrivacyToken.sol`
3. Compile with Solidity 0.8.20+
4. Deploy with a verifier contract address (use 0x0000000000000000000000000000000000000000 for testing)

### After Deployment

1. Copy the deployed contract address
2. Update `src/lib/constants.ts`:
   ```typescript
   export const PRIVACY_TOKEN_ADDRESS = '0xYourContractAddress';
   ```

### Contract Functions

#### Public Functions

- `registerPublicKey(bytes32 publicKey)`: Register to participate in anonymity sets
- `mint(...)`: Mint tokens with a commitment (requires ZK proof)
- `privateTransfer(...)`: Transfer tokens privately using ring signature and ZK proof
- `getAnonymitySetSize()`: Get the number of registered users
- `getRingMembers(uint256 count)`: Get addresses for forming anonymity sets

#### View Functions

- `name()`: Token name
- `symbol()`: Token symbol
- `decimals()`: Token decimals (18)
- `balanceCommitments(bytes32)`: Get balance commitment
- `nullifiers(bytes32)`: Check if nullifier is used
- `publicKeys(address)`: Get registered public key

## Security Considerations

⚠️ **This is an educational implementation**

For production use, you need:

1. **Audited ZK Circuits**: Use properly audited circom circuits
2. **Verifier Contract**: Deploy a real Groth16/PLONK verifier
3. **Security Audit**: Full smart contract security audit
4. **Gas Optimization**: Optimize for lower transaction costs
5. **Key Management**: Secure private key storage solution

## Privacy Guarantees

✅ **What is hidden:**
- Sender identity (hidden in ring)
- Receiver identity (commitment-based)
- Transaction amounts (ZK proofs)
- Account balances (commitments)

⚠️ **What is NOT hidden:**
- Transaction existence (visible on-chain)
- Transaction timing
- Gas costs
- Ring member addresses (but not which one is the sender)

## Testing

```solidity
// Example test flow
1. Deploy contract
2. Register 5+ users with public keys
3. Mint tokens to user commitments
4. Perform private transfer with ring signature
5. Verify nullifier prevents double-spend
```

## Gas Costs (Estimated)

- Register Public Key: ~50,000 gas
- Mint: ~100,000 gas
- Private Transfer: ~300,000 - 500,000 gas (depends on ring size)

## Further Reading

- [Ring Signatures](https://en.wikipedia.org/wiki/Ring_signature)
- [Zero-Knowledge Proofs](https://z.cash/technology/zksnarks/)
- [Pedersen Commitments](https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_4.pdf)
- [Circom Documentation](https://docs.circom.io/)

