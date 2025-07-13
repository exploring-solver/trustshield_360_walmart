const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

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
    timestamp: new Date().toISOString()
  });
});

// Proxy all other requests to Hardhat node
app.use('/', createProxyMiddleware({
  target: 'http://127.0.0.1:8545',
  changeOrigin: true,
  logLevel: 'silent'
}));

// Start the Hardhat node
function startHardhatNode() {
  console.log('🚀 Starting TrustShield Blockchain Node...');
  
  // Hardhat node runs on localhost by default, we'll proxy it
  const hardhatNode = spawn('npx', ['hardhat', 'node'], {
    stdio: 'pipe',
    shell: true,
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: '8545'
    }
  });

  hardhatNode.stdout.on('data', (data) => {
    console.log(`📡 Blockchain: ${data.toString().trim()}`);
  });

  hardhatNode.stderr.on('data', (data) => {
    console.error(`❌ Blockchain Error: ${data.toString().trim()}`);
  });

  hardhatNode.on('close', (code) => {
    console.log(`🔴 Hardhat node exited with code ${code}`);
  });

  return hardhatNode;
}

// Start the Express server
app.listen(PORT, HOST, () => {
  console.log(`🌐 TrustShield Blockchain Server running on ${HOST}:${PORT}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
  console.log(`⛓️  Blockchain RPC: http://${HOST}:${PORT}`);
  
  // Start the Hardhat node
  startHardhatNode();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});