# TrustShield Blockchain Deployment Guide

This guide will help you deploy the TrustShield TransactionLedger smart contract to various networks.

## Prerequisites

1. **Node.js and npm** installed
2. **Hardhat** project set up (already done)
3. **Ethereum wallet** with some ETH for gas fees
4. **Environment variables** configured

## Quick Start (Local Development)

### 1. Start Local Blockchain
```bash
cd blockchain_test
npx hardhat node
```
This starts a local Ethereum network on `http://127.0.0.1:8545`

### 2. Deploy Contract (in new terminal)
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Copy Contract Address
The deployment script will output the contract address. Copy it and add to your `.env` file:
```env
NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS=0x...your_contract_address_here
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
```

## Production Deployment

### Option 1: Deploy to Testnet (Sepolia)

1. **Get Sepolia ETH** from a faucet
2. **Set up environment variables**:
   ```env
   PRIVATE_KEY=your_wallet_private_key
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ```

3. **Update hardhat.config.ts** (uncomment Sepolia network)
4. **Deploy**:
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

### Option 2: Deploy to Mainnet

⚠️ **WARNING**: This requires real ETH and costs money!

1. **Ensure you have sufficient ETH** for gas fees
2. **Set up environment variables**:
   ```env
   PRIVATE_KEY=your_wallet_private_key
   MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
   ```

3. **Update hardhat.config.ts** to include mainnet
4. **Deploy**:
   ```bash
   npx hardhat run scripts/deploy.ts --network mainnet
   ```

## Environment Variables

Create a `.env` file in the `blockchain_test` directory:

```env
# For local development
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS=0x...your_contract_address

# For production deployment
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
```

## Integration with TrustShield

After deployment, update your main application's `.env` file:

```env
# TrustShield Web App
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS=0x...your_contract_address

# TrustShield CLI
TRUSTSHIELD_API_BASE=http://localhost:3000/api
```

## Contract Functions

The deployed `TransactionLedger` contract provides:

- `logTransaction(string transactionId, uint256 amount, uint256 riskScore)` - Log a new transaction
- `getTransaction(string transactionId)` - Retrieve transaction details
- `TransactionLogged` event - Emitted when transactions are logged

## Troubleshooting

### "Sender doesn't have enough funds"
- Ensure your wallet has ETH for gas fees
- For local development, use one of the pre-funded Hardhat accounts

### "Contract deployment failed"
- Check your RPC URL is correct
- Verify your private key is valid
- Ensure sufficient ETH balance

### "Network not found"
- Check your `hardhat.config.ts` has the correct network configuration
- Verify the network name matches your deployment command

## Security Notes

- ⚠️ **Never commit private keys to version control**
- 🔒 **Use environment variables for sensitive data**
- 🧪 **Test thoroughly on testnets before mainnet**
- 📝 **Keep deployment addresses and transaction hashes**

## Support

For issues with blockchain deployment, check:
1. Hardhat documentation
2. Network status (RPC endpoints)
3. Gas price and network congestion
4. Contract compilation errors 