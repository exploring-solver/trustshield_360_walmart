const axios = require('axios');

async function testRenderServer() {
  const baseUrl = 'http://localhost:8545';
  
  try {
    console.log('🧪 Testing TrustShield Blockchain Server...');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test RPC endpoint
    console.log('2. Testing RPC endpoint...');
    const rpcResponse = await axios.post(`${baseUrl}`, {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1
    });
    console.log('✅ RPC call successful:', rpcResponse.data);
    
    console.log('🎉 All tests passed! Server is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testRenderServer();
}

module.exports = { testRenderServer }; 