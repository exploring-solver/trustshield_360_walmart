// File: blockchain/scripts/deploy.ts

import { ethers, network } from "hardhat";

async function main() {
  console.log("🚀 Deploying TrustShield TransactionLedger contract...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying contracts with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);

  // Deploy the TransactionLedger contract
  const transactionLedger = await ethers.deployContract("TransactionLedger");
  console.log("⏳ Waiting for deployment...");

  await transactionLedger.waitForDeployment();
  const contractAddress = await transactionLedger.getAddress();

  console.log("✅ TransactionLedger deployed successfully!");
  console.log(`📍 Contract address: ${contractAddress}`);
  console.log(`🔗 Network: ${network.name}`);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const deployedContract = await ethers.getContractAt("TransactionLedger", contractAddress);
  console.log("✅ Contract verification successful!");
  
  console.log("\n📋 Deployment Summary:");
  console.log(`   Contract: TransactionLedger`);
  console.log(`   Address: ${contractAddress}`);
  console.log(`   Network: ${network.name}`);
  console.log(`   Deployer: ${deployer.address}`);
  
  console.log("\n💡 Next steps:");
  console.log("   1. Copy the contract address above");
  console.log("   2. Update your .env file with:");
  console.log(`      NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("   3. Restart your application");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});