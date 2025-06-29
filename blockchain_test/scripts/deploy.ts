// File: blockchain/scripts/deploy.ts

import { ethers } from "hardhat";

async function main() {
  const transactionLedger = await ethers.deployContract("TransactionLedger");

  await transactionLedger.waitForDeployment();

  console.log(
    `TransactionLedger deployed to: ${transactionLedger.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});