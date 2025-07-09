from __future__ import annotations

"""Simple Flask REST API for TrustShield 360 AI Cortex.

Endpoints:
    GET  /health               → {"status": "ok"}
    POST /predict              → JSON body = single transaction, returns fraud flag + score
    GET  /graph/stats          → stats on fraud rings for current history

Run with:
    python -m api.server  (default: localhost:8000)
"""

import os
from pathlib import Path
from typing import Dict, Any

import pandas as pd
from flask import Flask, jsonify, request

from cortex.fraud_detection import FraudDetector
from cortex.graph_analytics import build_transaction_graph, detect_fraud_rings, ring_stats

app = Flask(__name__)

# ---------------------------------------------------------------------
# Load & train model at startup
# ---------------------------------------------------------------------
DATA_PATH = Path(os.environ.get("TS360_DATA", "data/sample_transactions.jsonl"))
if DATA_PATH.exists():
    hist_df = FraudDetector.load_jsonl(DATA_PATH)
else:
    # fallback synthetic dataset
    from main import _generate_synthetic_transactions  # type: ignore

    hist_df = _generate_synthetic_transactions(500)

_detector = FraudDetector().fit(hist_df)


# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------

def _predict_single(txn: Dict[str, Any]):
    df = pd.DataFrame([txn])
    pred = _detector.predict(df)[0]
    score = _detector.score_samples(df)[0]
    return {"prediction": int(pred), "score": float(score)}


# ---------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------
@app.route("/health")
def health():
    return jsonify(status="ok")


@app.route("/predict", methods=["POST"])
def predict():
    if not request.json:
        return jsonify(error="JSON body required"), 400
    result = _predict_single(request.json)
    return jsonify(result)


@app.route("/graph/stats")
def graph_stats():
    g = build_transaction_graph(hist_df)
    cycles = detect_fraud_rings(g)
    return jsonify(ring_stats(cycles))


if __name__ == "__main__":
    # default port 8000
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), debug=True) 