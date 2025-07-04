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

    // Check wallet balance before attempting transaction
    const balance = await provider.getBalance(signer.address);
    const estimatedGas = ethers.parseUnits("0.001", "ether"); // Rough estimate
    
    if (balance < estimatedGas) {
      console.error(`Insufficient funds. Balance: ${ethers.formatEther(balance)} ETH, Required: ~${ethers.formatEther(estimatedGas)} ETH`);
      return NextResponse.json({ 
        error: 'Insufficient blockchain funds. Please run the funding script first.',
        details: `Wallet balance: ${ethers.formatEther(balance)} ETH`
      }, { status: 402 }); // Payment Required
    }

    // Create an instance of the contract
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS!,
      TransactionLedgerABI.abi,
      signer
    );

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
    
    // Check if it's a funding issue
    if (error.message && error.message.includes("doesn't have enough funds")) {
      return NextResponse.json({ 
        error: 'Blockchain wallet needs funding. Please run the funding script.',
        details: 'The wallet used for blockchain transactions has insufficient funds.'
      }, { status: 402 });
    }
    
    return NextResponse.json({ error: 'Failed to log transaction.', details: error.message }, { status: 500 });
  }
}