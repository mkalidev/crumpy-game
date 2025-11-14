/**
 * Contract ABI (Application Binary Interface)
 * 
 * Replace this array with your contract's ABI.
 * You can get the ABI from:
 * - Your contract compilation output (artifacts)
 * - Etherscan (if verified)
 * - Your development environment (Hardhat, Truffle, etc.)
 */

export const contractABI = [
  // Paste your contract ABI here
  // Example:
  // {
  //   "inputs": [],
  //   "name": "functionName",
  //   "outputs": [{ "type": "uint256" }],
  //   "stateMutability": "view",
  //   "type": "function"
  // }
];

/**
 * Contract Address
 * Replace with your deployed contract address
 */
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

