#!/bin/bash

# Walmart AI/ML Fraud Detection - Production Deployment Script

echo "🚀 Deploying Walmart AI/ML Fraud Detection System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t walmart-fraud-api .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop walmart-fraud-api 2>/dev/null || true
docker rm walmart-fraud-api 2>/dev/null || true

# Run the container
echo "🏃 Starting fraud detection API..."
docker run -d \
    --name walmart-fraud-api \
    --restart unless-stopped \
    -p 8000:8000 \
    -v $(pwd)/data:/app/data \
    -e PORT=8000 \
    -e DEBUG=false \
    walmart-fraud-api

# Wait for container to start
echo "⏳ Waiting for API to start..."
sleep 10

# Test the API
echo "🧪 Testing API endpoints..."
if curl -s http://localhost:8000/health | grep -q '"status":"ok"'; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker logs walmart-fraud-api --tail 20
    exit 1
fi

# Test prediction endpoint
echo "🔍 Testing prediction endpoint..."
RESULT=$(curl -s -X POST http://localhost:8000/predict \
    -H "Content-Type: application/json" \
    -d '{
        "timestamp": "2025-07-09T23:25:00Z",
        "transaction_id": "T999999",
        "source_id": "U9999",
        "target_id": "M9999",
        "amount": 1000.0,
        "channel": "web"
    }')

if echo "$RESULT" | grep -q '"prediction"'; then
    echo "✅ Prediction endpoint working!"
    echo "   Sample result: $RESULT"
else
    echo "❌ Prediction endpoint failed!"
    exit 1
fi

echo ""
echo "🎉 Deployment successful!"
echo "📊 API is running at: http://localhost:8000"
echo "📋 Available endpoints:"
echo "   - GET  /health      → Health check"
echo "   - POST /predict     → Fraud prediction"
echo "   - GET  /graph/stats → Graph statistics"
echo ""
echo "🔧 Management commands:"
echo "   - View logs:    docker logs walmart-fraud-api"
echo "   - Stop API:     docker stop walmart-fraud-api"
echo "   - Restart API:  docker restart walmart-fraud-api"
echo "   - Remove API:   docker rm -f walmart-fraud-api" 