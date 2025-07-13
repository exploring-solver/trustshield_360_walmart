# TrustShield Blockchain Node - Render Deployment Guide

This guide will help you deploy your TrustShield blockchain node to Render.com.

## 🚀 **Quick Deployment Steps**

### 1. **Push Code to GitHub**
Make sure your `blockchain_test` folder is pushed to GitHub with all the files:
- `Dockerfile.simple`
- `render.yaml`
- `simple-server.js`
- `package.json`
- All contract files

### 2. **Deploy to Render**

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login** and connect your GitHub account
3. **Click "New +" → "Web Service"**
4. **Connect your repository** (the one containing `blockchain_test`)
5. **Configure the service:**

   **Basic Settings:**
   - **Name:** `trustshield-blockchain`
   - **Environment:** `Docker`
   - **Region:** Choose closest to you
   - **Branch:** `main` (or your default branch)

   **Advanced Settings:**
   - **Dockerfile Path:** `blockchain_test/Dockerfile.simple`
   - **Port:** `8545`

6. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=8545
   HOST=0.0.0.0
   ```

7. **Click "Create Web Service"**

### 3. **Wait for Deployment**
- Render will automatically build and deploy your blockchain node
- This may take 5-10 minutes for the first deployment
- You can monitor the build logs in real-time

## 🔗 **After Deployment**

Your blockchain node will be available at:
- **URL:** `https://your-app-name.onrender.com`
- **Health Check:** `https://your-app-name.onrender.com/health`
- **RPC Endpoint:** `https://your-app-name.onrender.com`

## 📝 **Update Your Applications**

### **Web App (.env):**
```env
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_BLOCKCHAIN_CONTRACT_ADDRESS=0x...your_contract_address
```

### **CLI (.env):**
```env
TRUSTSHIELD_API_BASE=https://your-web-app-domain.com/api
```

## 🧪 **Test Your Deployment**

1. **Health Check:**
   ```bash
   curl https://your-app-name.onrender.com/health
   ```

2. **Deploy Contract:**
   ```bash
   # Update your hardhat.config.ts to include the deployed network
   npx hardhat run scripts/deploy.ts --network render
   ```

3. **Test RPC Connection:**
   ```javascript
   // Test with Web3.js or Ethers.js
   const provider = new ethers.providers.JsonRpcProvider('https://your-app-name.onrender.com');
   const blockNumber = await provider.getBlockNumber();
   console.log('Block number:', blockNumber);
   ```

## 🔧 **Troubleshooting**

### **Build Fails:**
- Check that all files are committed to GitHub
- Ensure `Dockerfile.simple` exists in the `blockchain_test` folder
- Verify `package.json` has all required dependencies

### **Service Won't Start:**
- Check the logs in Render dashboard
- Ensure port 8545 is exposed
- Verify environment variables are set correctly

### **RPC Connection Issues:**
- Test the health endpoint first
- Check if the service is running (green status in Render)
- Verify the URL is correct

## 💰 **Cost**
- **Free Tier:** 750 hours/month (enough for continuous deployment)
- **Paid Tier:** $7/month for unlimited usage

## 🔄 **Auto-Deploy**
Render will automatically redeploy when you push changes to your GitHub repository.

## 📊 **Monitoring**
- **Logs:** Available in Render dashboard
- **Metrics:** CPU, memory, and network usage
- **Health:** Automatic health checks every 30 seconds

## 🚨 **Important Notes**
- The free tier will spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Consider upgrading to paid tier for production use

## 🆘 **Support**
If you encounter issues:
1. Check Render's status page
2. Review build logs in Render dashboard
3. Test locally first with `docker-compose up --build`
4. Contact Render support if needed 