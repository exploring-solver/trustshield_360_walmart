# TrustShield Blockchain Node - Cloud Deployment Guide

This guide shows how to deploy your Hardhat blockchain node to various cloud platforms for remote access.

## 🚀 **Deployment Options**

### **Option 1: Render (Recommended - Free Tier)**

1. **Push your code to GitHub**
2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Create account and connect GitHub
   - Click "New Web Service"
   - Select your blockchain repository

3. **Configure the service:**
   - **Name:** `trustshield-blockchain`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start:server`
   - **Port:** `8545`

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=8545
   HOST=0.0.0.0
   ```

5. **Deploy!** Render will automatically deploy your blockchain node.

### **Option 2: Railway**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables in Railway dashboard**

### **Option 3: Heroku**

1. **Install Heroku CLI**
2. **Deploy:**
   ```bash
   heroku create trustshield-blockchain
   git push heroku main
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=8545
   ```

### **Option 4: DigitalOcean App Platform**

1. **Connect your GitHub repo**
2. **Configure as Node.js app**
3. **Set build command:** `npm install`
4. **Set run command:** `npm run start:server`

### **Option 5: AWS/GCP/Azure**

Use the provided `Dockerfile` and `docker-compose.yml`:

```bash
# Build and push to container registry
docker build -t trustshield-blockchain .
docker tag trustshield-blockchain your-registry/trustshield-blockchain
docker push your-registry/trustshield-blockchain

# Deploy to your cloud platform
```

## 🔧 **Local Testing**

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Test the server locally
npm run start:server

# Or use Docker
docker-compose up --build
```

## 🌐 **After Deployment**

Your blockchain node will be available at:
- **RPC Endpoint:** `https://your-app-name.onrender.com` (or your platform URL)
- **Health Check:** `https://your-app-name.onrender.com/health`

## 🔗 **Update Your Applications**

Update your TrustShield apps to use the deployed blockchain:

### **Web App (.env):**
```env
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS=0x...your_contract_address
```

### **CLI (.env):**
```env
TRUSTSHIELD_API_BASE=https://your-web-app-domain.com/api
```

## 📊 **Monitoring**

- **Health Check:** Visit `/health` endpoint
- **Logs:** Check your platform's logging dashboard
- **Metrics:** Monitor CPU, memory, and network usage

## 🔒 **Security Considerations**

- **CORS:** Already configured for web3 connections
- **Rate Limiting:** Consider adding rate limiting for production
- **Authentication:** Add API keys if needed
- **HTTPS:** Most platforms provide SSL automatically

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Port binding errors:**
   - Ensure `HOST=0.0.0.0` and `PORT=8545`

2. **Memory issues:**
   - Add memory limits in platform settings
   - Consider using larger instances

3. **Timeout errors:**
   - Increase timeout settings
   - Check network connectivity

4. **Build failures:**
   - Ensure all dependencies are in `package.json`
   - Check Node.js version compatibility

## 💰 **Cost Considerations**

- **Render:** Free tier available, $7/month for paid
- **Railway:** $5/month starting
- **Heroku:** $7/month starting
- **DigitalOcean:** $5/month starting
- **AWS/GCP/Azure:** Pay-as-you-go

## 🚀 **Production Checklist**

- [ ] Deploy to cloud platform
- [ ] Test RPC connectivity
- [ ] Deploy smart contract to the node
- [ ] Update application environment variables
- [ ] Test end-to-end functionality
- [ ] Set up monitoring and alerts
- [ ] Configure backups (if needed)

## 📞 **Support**

For deployment issues:
1. Check platform-specific documentation
2. Review logs in platform dashboard
3. Test locally first
4. Ensure all environment variables are set 