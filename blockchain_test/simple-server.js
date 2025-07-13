const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8545;
const HOST = process.env.HOST || '0.0.0.0';

// Enable CORS for web3 connections
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'TrustShield Blockchain Node',
    timestamp: new Date().toISOString(),
    message: 'Blockchain node is running'
  });
});

// Start the Hardhat node directly
console.log('🚀 Starting TrustShield Blockchain Node...');

const hardhatNode = spawn('npx', ['hardhat', 'node', '--host', '0.0.0.0', '--port', PORT.toString()], {
  stdio: 'inherit', // This will show Hardhat output directly
  shell: true,
  env: {
    ...process.env,
    HOST: '0.0.0.0',
    PORT: PORT.toString()
  }
});

// Handle process signals
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  hardhatNode.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  hardhatNode.kill('SIGINT');
  process.exit(0);
});

hardhatNode.on('close', (code) => {
  console.log(`🔴 Hardhat node exited with code ${code}`);
  process.exit(code);
}); 