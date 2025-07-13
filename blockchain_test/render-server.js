const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8545;

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

// Start the Express server first
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 TrustShield Blockchain Server running on 0.0.0.0:${PORT}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`⛓️  Blockchain RPC: http://0.0.0.0:${PORT}`);
  
  // Start Hardhat node after Express server is running
  startHardhatNode();
});

// Start the Hardhat node
function startHardhatNode() {
  console.log('🚀 Starting TrustShield Blockchain Node...');
  
  // Start Hardhat node on localhost:8546
  const hardhatNode = spawn('npx', ['hardhat', 'node', '--port', '8546'], {
    stdio: 'pipe',
    shell: true
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

  // Wait for Hardhat to start, then set up proxy
  setTimeout(() => {
    console.log('✅ Setting up proxy to Hardhat node...');
    
    // Proxy all RPC requests to Hardhat node
    app.use('/', createProxyMiddleware({
      target: 'http://127.0.0.1:8546',
      changeOrigin: true,
      logLevel: 'silent',
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'Blockchain node not ready' });
      }
    }));
    
    console.log('✅ Proxy setup complete!');
  }, 8000); // Increased wait time
}

// Handle process signals
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
}); 