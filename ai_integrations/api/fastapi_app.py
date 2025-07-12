from __future__ import annotations

"""FastAPI service for TrustShield 360 AI Cortex.
Run:
    uvicorn api.fastapi_app:app --reload --port 8000
"""

import os
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile, WebSocket  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
import json
import io
import time
from datetime import datetime, timedelta

from cortex.fraud_detection import FraudDetector
from cortex.tab_transformer_detector import TabTransformerDetector
from cortex.graph_analytics import build_transaction_graph, detect_fraud_rings, ring_stats
from cortex.gnn_ring_risk import score_rings, RingRiskGNN
from alerts.fraud_alerter import send_fraud_alert, get_recent_alerts
from crypto.quantum_simulator import QuantumResistantSession
from blockchain.fraud_logger import log_fraud_to_blockchain, get_wallet_reputation, _blockchain_logger
from analytics.fraud_analytics import generate_fraud_analytics_report

# -----------------------------------------------------
# Model loading at startup
# -----------------------------------------------------
DATA_PATH = Path(os.environ.get("TS360_DATA", "data/sample_transactions.jsonl"))
if DATA_PATH.exists():
    _hist_df = FraudDetector.load_jsonl(DATA_PATH)
else:
    from main import _generate_synthetic_transactions  # type: ignore

    _hist_df = _generate_synthetic_transactions(500)

# Train both models
_iso_detector = FraudDetector().fit(_hist_df)
_tab_detector = TabTransformerDetector(epochs=3).fit(_hist_df)  # shorter train for demo


class ModelChoice(str, Enum):
    isolation_forest = "isolation_forest"
    tab_transformer = "tab_transformer"


class Transaction(BaseModel):
    timestamp: str
    transaction_id: str | None = None
    source_id: str
    target_id: str
    amount: float
    channel: str


app = FastAPI(title="TrustShield 360 API", version="0.1.0")

# Allow local dev origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------------
# Helpers
# -----------------------------------------------------

def _predict_one(txn_dict: Dict[str, Any], model: ModelChoice):
    df = pd.DataFrame([txn_dict])
    if model == ModelChoice.tab_transformer:
        score = float(_tab_detector.predict_score(df)[0])
        pred = -1 if score > 0.5 else 1  # simple threshold
    else:
        pred = int(_iso_detector.predict(df)[0])
        score = float(_iso_detector.score_samples(df)[0])
    return {"prediction": pred, "score": score}


def _detect_rings():
    g = build_transaction_graph(_hist_df)
    cycles = detect_fraud_rings(g)
    return ring_stats(cycles)


# -----------------------------------------------------
# Routes
# -----------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(txn: Transaction, model: ModelChoice = ModelChoice.isolation_forest):
    result = _predict_one(txn.dict(), model)
    
    # Send alert if high risk
    if result["prediction"] == -1 or abs(result["score"]) > 0.7:
        await send_fraud_alert(txn.dict(), abs(result["score"]), model.value)
    
    return result


@app.post("/batch_predict")
async def batch_predict(
    file: UploadFile = File(...),
    model: ModelChoice = ModelChoice.isolation_forest,
):
    if file.content_type not in {"text/csv", "application/json", "application/jsonl", "application/octet-stream"}:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()
    # Try CSV first
    df: pd.DataFrame | None = None
    try:
        df = pd.read_csv(io.StringIO(contents.decode()))
    except Exception:
        try:
            # assume JSONL
            lines = contents.decode().splitlines()
            records = [json.loads(l) for l in lines if l.strip()]
            df = pd.DataFrame.from_records(records)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Failed to parse file") from e

    if df is None or df.empty:
        raise HTTPException(status_code=400, detail="Parsed file is empty")

    if model == ModelChoice.tab_transformer:
        scores = _tab_detector.predict_score(df)
        preds = (-1 * (scores > 0.5).astype(int)) + (scores <= 0.5).astype(int)  # map True->-1, False->1
    else:
        preds = _iso_detector.predict(df)
        scores = _iso_detector.score_samples(df)

    result = df.copy()
    result["prediction"] = preds
    result["score"] = scores

    return result.to_dict(orient="records")


@app.get("/graph/stats")
async def graph_stats():
    return _detect_rings()


@app.get("/metrics")
async def get_metrics():
    """Real-time metrics for dashboard display."""
    # Simulate real-time metrics (would come from database in production)
    now = datetime.now()
    
    # Basic transaction stats
    total_transactions = len(_hist_df) + 47391
    fraud_blocked_today = 127 + int(time.time()) % 10
    money_saved = 89432 + (fraud_blocked_today * 704)  # avg $704 per blocked fraud
    
    # Performance metrics
    iso_predictions = 1000 + int(time.time()) % 100
    tab_predictions = 500 + int(time.time()) % 50
    
    # Model comparison (simulated)
    iso_accuracy = 0.94 + (int(time.time()) % 100) / 1000
    tab_accuracy = 0.97 + (int(time.time()) % 100) / 1000
    iso_speed_ms = 15 + int(time.time()) % 10
    tab_speed_ms = 125 + int(time.time()) % 20
    
    return {
        "total_transactions": total_transactions,
        "fraud_blocked_today": fraud_blocked_today,
        "money_saved_today": f"${money_saved:,}",
        "system_uptime": "99.97%",
        "models": {
            "isolation_forest": {
                "predictions_today": iso_predictions,
                "accuracy": f"{iso_accuracy:.2%}",
                "avg_speed_ms": iso_speed_ms,
                "false_positives": int(iso_predictions * 0.05)
            },
            "tab_transformer": {
                "predictions_today": tab_predictions,
                "accuracy": f"{tab_accuracy:.2%}",
                "avg_speed_ms": tab_speed_ms,
                "false_positives": int(tab_predictions * 0.03)
            }
        },
        "hourly_stats": [
            {"hour": (now - timedelta(hours=i)).strftime("%H:00"), 
             "transactions": 1200 + (i * 100) + int(time.time()) % 200,
             "fraud_detected": 5 + i + int(time.time()) % 3}
            for i in range(24, 0, -1)
        ]
    }


@app.get("/benchmark")
async def benchmark_models():
    """Performance benchmark comparing models."""
    import time as timing
    
    # Create test dataset
    test_df = _hist_df.head(100)
    
    # Benchmark IsolationForest
    start = timing.time()
    iso_preds = _iso_detector.predict(test_df)
    iso_scores = _iso_detector.score_samples(test_df)
    iso_time = timing.time() - start
    
    # Benchmark TabTransformer
    start = timing.time()
    tab_scores = _tab_detector.predict_score(test_df)
    tab_preds = (-1 * (tab_scores > 0.5).astype(int)) + (tab_scores <= 0.5).astype(int)
    tab_time = timing.time() - start
    
    return {
        "test_size": len(test_df),
        "isolation_forest": {
            "time_seconds": round(iso_time, 4),
            "predictions_per_second": round(len(test_df) / iso_time, 2),
            "anomalies_detected": int(sum(iso_preds == -1)),
            "avg_score": float(iso_scores.mean())
        },
        "tab_transformer": {
            "time_seconds": round(tab_time, 4),
            "predictions_per_second": round(len(test_df) / tab_time, 2),
            "anomalies_detected": int(sum(tab_preds == -1)),
            "avg_score": float(tab_scores.mean())
        }
    }


# -----------------------------------------------------
# GNN Ring Risk endpoint
# -----------------------------------------------------

_ring_model = RingRiskGNN()


@app.get("/ring_risk")
async def ring_risk():
    g = build_transaction_graph(_hist_df)  # type: ignore[arg-type]
    cycles = detect_fraud_rings(g)
    scores = score_rings(g, cycles, _ring_model)
    return [{"ring": list(c), "risk": s} for c, s in zip(cycles, scores)]


# -----------------------------------------------------
# WebSocket streaming predictions
# -----------------------------------------------------

@app.websocket("/ws/predict")
async def ws_predict(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            model_name = data.get("model", "isolation_forest")
            txn = {k: v for k, v in data.items() if k != "model"}
            try:
                pred = _predict_one(txn, ModelChoice(model_name))  # type: ignore[arg-type]
                await websocket.send_json(pred)
            except Exception as exc:  # noqa
                await websocket.send_json({"error": str(exc)})
    except Exception:
        await websocket.close() 


@app.get("/alerts")
async def recent_alerts(limit: int = 20):
    """Get recent fraud alerts."""
    return get_recent_alerts(limit) 


# -----------------------------------------------------
# Quantum-Resistant Crypto Endpoints
# -----------------------------------------------------

_quantum_session = QuantumResistantSession()


@app.get("/quantum/session")
async def quantum_session():
    """Establish quantum-resistant session."""
    return _quantum_session.establish_session()


@app.get("/quantum/threat_simulation")
async def quantum_threat():
    """Simulate quantum computer attack on classical crypto."""
    return _quantum_session.simulate_quantum_attack()


# -----------------------------------------------------
# Blockchain Integration Endpoints
# -----------------------------------------------------

@app.get("/blockchain/wallet/{wallet_address}/reputation")
async def wallet_reputation(wallet_address: str):
    """Get blockchain-verified wallet reputation."""
    return get_wallet_reputation(wallet_address)


@app.post("/blockchain/product/track")
async def track_product(product_id: str, event_type: str, location: str):
    """Track product through blockchain supply chain."""
    return _blockchain_logger.track_product_journey(product_id, event_type, location)


@app.get("/blockchain/product/{product_id}/provenance")
async def product_provenance(product_id: str):
    """Get complete blockchain-verified product journey."""
    return _blockchain_logger.get_product_provenance(product_id)


@app.get("/analytics/report")
async def analytics_report():
    """Generate comprehensive fraud analytics report."""
    # Convert historical data to list of dicts for analytics
    hist_data = _hist_df.to_dict('records')
    
    # Add some recent transaction activity (simulated)
    recent_transactions = []
    now = datetime.now()
    for i in range(50):  # simulate 50 recent transactions
        recent_transactions.append({
            "timestamp": (now - timedelta(minutes=i*5)).timestamp(),
            "source_id": f"U{1000 + (i % 200)}",
            "target_id": f"TARGET_{i % 10}",
            "amount": 50.0 + (i * 10) + (i % 100),
            "location": ["New_York_NY", "Los_Angeles_CA", "Chicago_IL", "Miami_FL"][i % 4],
            "is_fraud": (i % 7 == 0),  # simulate some fraud
            "fraud_score": 0.9 if (i % 7 == 0) else 0.1 + (i % 5) * 0.1
        })
    
    # Combine historical and recent data
    all_data = hist_data + recent_transactions
    
    # Generate comprehensive analytics report
    report = generate_fraud_analytics_report(all_data)
    
    return report 