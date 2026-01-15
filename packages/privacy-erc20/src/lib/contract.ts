/**
 * Contract interaction utilities
 */

import { ethers } from 'ethers';
import { PRIVACY_TOKEN_ABI, PRIVACY_TOKEN_ADDRESS } from './constants';

/**
 * Get contract instance
 */
export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    PRIVACY_TOKEN_ADDRESS,
    PRIVACY_TOKEN_ABI,
    signerOrProvider
  );
}

/**
 * Get provider (MetaMask or fallback)
 */
export async function getProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

/**
 * Connect wallet
 */
export async function connectWallet(): Promise<ethers.Signer | null> {
  const provider = await getProvider();
  if (!provider) return null;
  
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

/**
 * Get current account
 */
export async function getCurrentAccount(): Promise<string | null> {
  const provider = await getProvider();
  if (!provider) return null;
  
  const accounts = await provider.send('eth_accounts', []);
  return accounts[0] || null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

