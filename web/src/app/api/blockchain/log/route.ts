/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/app/api/blockchain/log/route.ts

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// The ABI (Application Binary Interface) of our contract.
// This can be found in blockchain/artifacts/contracts/TransactionLedger.sol/TransactionLedger.json
import TransactionLedgerABI from '@/utils/TransactionLedger.json';

export async function POST(request: Request) {
  try {
    const { transactionId, amount, riskScore } = await request.json();

    if (!transactionId || amount === undefined || riskScore === undefined) {
      return NextResponse.json({ error: 'Missing required transaction data.' }, { status: 400 });
    }

    // Connect to the local Hardhat blockchain node
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL);

    // Create a signer instance using a private key from one of the Hardhat accounts
    const signer = new ethers.Wallet(process.env.BLOCKCHAIN_SIGNER_PRIVATE_KEY!, provider);

    // Create an instance of the contract
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS!,
      TransactionLedgerABI.abi,
      signer
    );
    // const amountInCents = Math.round(Number(amount) * 100);
    // Call the smart contract function to log the transaction
    const tx = await contract.logTransaction(
      transactionId,
      ethers.parseUnits(amount.toString(), 2), // For 2 decimals
      Math.round(riskScore * 100)
    );

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Return the transaction hash as proof of logging
    return NextResponse.json({
      message: 'Transaction successfully logged to the blockchain.',
      transactionHash: receipt.hash,
    });

  } catch (error: any) {
    console.error('Blockchain logging error:', error);
    return NextResponse.json({ error: 'Failed to log transaction.', details: error.message }, { status: 500 });
  }
}