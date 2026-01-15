/**
 * Contract constants and ABI
 */

// Contract address (deploy and update this)
export const PRIVACY_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

// Contract ABI
export const PRIVACY_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupplyCommitment() view returns (bytes32)',
  'function balanceCommitments(bytes32) view returns (bytes32)',
  'function nullifiers(bytes32) view returns (bool)',
  'function publicKeys(address) view returns (bytes32)',
  'function registeredAddresses(uint256) view returns (address)',
  'function getAnonymitySetSize() view returns (uint256)',
  'function getRingMembers(uint256) view returns (address[])',
  'function registerPublicKey(bytes32 publicKey)',
  'function mint(bytes32 commitment, uint256[2] proof_a, uint256[2][2] proof_b, uint256[2] proof_c, uint256[1] publicInputs)',
  'function privateTransfer(address[] ringMembers, bytes ringSignature, bytes32 nullifier, bytes32 newCommitment, uint256[2] proof_a, uint256[2][2] proof_b, uint256[2] proof_c, uint256[4] publicInputs)',
  'event Transfer(bytes32 indexed nullifier, bytes32 indexed newCommitment)',
  'event Mint(bytes32 indexed commitment, uint256 timestamp)',
  'event PublicKeyRegistered(address indexed account, bytes32 publicKey)'
];

// Network configuration
export const SUPPORTED_NETWORKS = {
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545'
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
  }
};

