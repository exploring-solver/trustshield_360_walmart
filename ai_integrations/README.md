# Walmart AI/ML Fraud Detection System 🛡️

A sophisticated fraud detection system built with PyTorch, featuring graph neural networks, explainable AI, and real-time API endpoints for integration into web applications.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**macOS/Linux:**
```bash
git clone <repository-url>
cd walmart-aiml
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
git clone <repository-url>
cd walmart-aiml
setup.bat
```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd walmart-aiml
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   
   # Activate (macOS/Linux)
   source .venv/bin/activate
   
   # Activate (Windows)
   .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   # Install PyTorch first
   pip install torch>=2.0.0
   
   # Install PyTorch Geometric
   pip install torch-geometric torch-scatter torch-sparse torch-cluster torch-spline-conv
   
   # Install remaining dependencies
   pip install -r requirements.txt
   ```

## 🌐 Web API Usage

### Start the Server
```bash
python -m api.server
```

The API will be available at `http://localhost:8000`

### API Endpoints

#### 1. Health Check
```bash
GET /health
```
**Response:**
```json
{"status": "ok"}
```

#### 2. Fraud Prediction
```bash
POST /predict
Content-Type: application/json

{
  "timestamp": "2025-07-09T23:25:00Z",
  "transaction_id": "T123456",
  "source_id": "U001", 
  "target_id": "M001",
  "amount": 1500.00,
  "channel": "web"
}
```

**Response:**
```json
{
  "prediction": 1,
  "score": -0.3427785753414952
}
```

- `prediction`: 1 = Normal, -1 = Fraud
- `score`: Anomaly score (lower = more suspicious)

#### 3. Graph Statistics
```bash
GET /graph/stats
```
**Response:**
```json
{
  "ring_count": 2,
  "largest_ring": 5,
  "rings": [
    {"nodes": ["U001", "U002", "U003"], "size": 3},
    {"nodes": ["U004", "U005"], "size": 2}
  ]
}
```

### Integration Examples

#### JavaScript/Node.js
```javascript
const axios = require('axios');

// Predict fraud for a transaction
async function checkFraud(transaction) {
  try {
    const response = await axios.post('http://localhost:8000/predict', {
      timestamp: new Date().toISOString(),
      transaction_id: transaction.id,
      source_id: transaction.userId,
      target_id: transaction.merchantId,
      amount: transaction.amount,
      channel: transaction.channel
    });
    
    return {
      isFraud: response.data.prediction === -1,
      confidence: Math.abs(response.data.score),
      riskLevel: response.data.score < -0.5 ? 'HIGH' : 'LOW'
    };
  } catch (error) {
    console.error('Fraud check failed:', error);
    return { isFraud: false, confidence: 0, riskLevel: 'UNKNOWN' };
  }
}
```

#### Python/Django
```python
import requests
from django.conf import settings

class FraudDetectionService:
    BASE_URL = getattr(settings, 'FRAUD_API_URL', 'http://localhost:8000')
    
    @classmethod
    def check_transaction(cls, transaction_data):
        try:
            response = requests.post(f'{cls.BASE_URL}/predict', json={
                'timestamp': transaction_data['timestamp'],
                'transaction_id': transaction_data['id'],
                'source_id': transaction_data['user_id'],
                'target_id': transaction_data['merchant_id'],
                'amount': float(transaction_data['amount']),
                'channel': transaction_data['channel']
            })
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'is_fraud': result['prediction'] == -1,
                    'risk_score': abs(result['score']),
                    'should_flag': result['score'] < -0.4
                }
        except Exception as e:
            print(f"Fraud check error: {e}")
            
        return {'is_fraud': False, 'risk_score': 0, 'should_flag': False}
```

#### React/Frontend
```javascript
import React, { useState } from 'react';

const FraudChecker = ({ transaction }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkFraud = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          transaction_id: transaction.id,
          source_id: transaction.userId,
          target_id: transaction.merchantId,
          amount: transaction.amount,
          channel: transaction.channel
        })
      });
      
      const data = await response.json();
      setResult({
        isFraud: data.prediction === -1,
        score: data.score,
        riskLevel: data.score < -0.5 ? 'HIGH' : 'MEDIUM'
      });
    } catch (error) {
      console.error('Fraud check failed:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={checkFraud} disabled={loading}>
        {loading ? 'Checking...' : 'Check for Fraud'}
      </button>
      
      {result && (
        <div className={`alert ${result.isFraud ? 'alert-danger' : 'alert-success'}`}>
          <strong>Result:</strong> {result.isFraud ? 'FRAUD DETECTED' : 'Transaction Normal'}
          <br />
          <strong>Risk Level:</strong> {result.riskLevel}
          <br />
          <strong>Score:</strong> {result.score.toFixed(4)}
        </div>
      )}
    </div>
  );
};
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```bash
# Server Configuration
PORT=8000
DEBUG=true

# Data Path
TS360_DATA=data/sample_transactions.jsonl

# Model Configuration
FRAUD_CONTAMINATION=0.01
RANDOM_SEED=42

# Optional: Database URL for production
DATABASE_URL=postgresql://user:pass@localhost:5432/fraud_db
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "-m", "api.server"]
```

Build and run:
```bash
docker build -t walmart-fraud-api .
docker run -p 8000:8000 walmart-fraud-api
```

### Production Deployment

#### Using Gunicorn (Recommended)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 api.server:app
```

#### Using uWSGI
```bash
pip install uwsgi
uwsgi --http :8000 --module api.server:app --processes 4
```

## 📊 Features

- **Real-time Fraud Detection**: ML-powered transaction analysis
- **Graph Analytics**: Detect fraud rings and suspicious patterns
- **Explainable AI**: SHAP-based model explanations
- **RESTful API**: Easy integration with any web framework
- **Scalable Architecture**: Ready for production deployment
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🛠️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │───▶│   Flask API     │───▶│  ML Pipeline    │
│  (React/Vue/JS) │    │  (api/server.py)│    │ (cortex/fraud_  │
└─────────────────┘    └─────────────────┘    │  detection.py)  │
                                              └─────────────────┘
                                                       │
                                              ┌─────────────────┐
                                              │ Graph Analytics │
                                              │ (cortex/graph_  │
                                              │  analytics.py)  │
                                              └─────────────────┘
```

## 📋 Requirements

- Python 3.8+
- 4GB+ RAM
- 2GB+ disk space
- Internet connection (for initial setup)

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid JSON or missing required fields
- **500 Internal Server Error**: Model prediction failures
- **415 Unsupported Media Type**: Missing Content-Type header

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section below

### Troubleshooting

**Port already in use error:**
```bash
# Find and kill processes using port 8000
lsof -i :8000
kill -9 <PID>
```

**PyTorch installation issues:**
```bash
# For Apple Silicon Macs
pip install torch --index-url https://download.pytorch.org/whl/cpu

# For CUDA GPU support
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

**Missing dependencies:**
```bash
# Reinstall all dependencies
pip install --force-reinstall -r requirements.txt
```
