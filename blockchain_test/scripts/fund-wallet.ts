// File: blockchain/scripts/fund-wallet.ts

import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  // Get the signer accounts
  const [owner, ...otherAccounts] = await ethers.getSigners();
  
  // Get the wallet address from environment variable
  const walletAddress = process.env.BLOCKCHAIN_SIGNER_PRIVATE_KEY 
    ? new ethers.Wallet(process.env.BLOCKCHAIN_SIGNER_PRIVATE_KEY).address
    : process.env.WALLET_ADDRESS;
    
  if (!walletAddress) {
    console.error("No wallet address found. Set BLOCKCHAIN_SIGNER_PRIVATE_KEY or WALLET_ADDRESS");
    return;
  }

  console.log(`Funding wallet: ${walletAddress}`);
  console.log(`Owner address: ${owner.address}`);

  // Check current balance
  const balance = await ethers.provider.getBalance(walletAddress);
  console.log(`Current balance: ${ethers.formatEther(balance)} ETH`);

  if (balance > ethers.parseEther("0.1")) {
    console.log("Wallet already has sufficient funds");
    return;
  }

  // Send 1 ETH to the wallet
  const tx = await owner.sendTransaction({
    to: walletAddress,
    value: ethers.parseEther("1.0")
  });

  await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);

  // Check new balance
  const newBalance = await ethers.provider.getBalance(walletAddress);
  console.log(`New balance: ${ethers.formatEther(newBalance)} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 