# Blockchain Setup Guide

## Issue: "Sender doesn't have enough funds to send tx"

This error occurs because the wallet used for blockchain transactions has 0 ETH balance.

## Solution:

### 1. Start the Hardhat Network
```bash
npx hardhat node
```

### 2. Deploy the Contract (in a new terminal)
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Fund the Wallet (in a new terminal)
```bash
npx hardhat run scripts/fund-wallet.ts --network localhost
```

### 4. Set Environment Variables
Make sure your `.env` file has:
```
BLOCKCHAIN_SIGNER_PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS=deployed_contract_address
```

### 5. Alternative: Use a Pre-funded Account
If you don't want to run the funding script, you can use one of the pre-funded Hardhat accounts:
- Copy a private key from the Hardhat node output
- Set it as `BLOCKCHAIN_SIGNER_PRIVATE_KEY` in your `.env`

## Quick Fix Commands:
```bash
# Terminal 1: Start blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Fund wallet
npx hardhat run scripts/fund-wallet.ts --network localhost
```

After running these commands, the blockchain logging should work properly. 