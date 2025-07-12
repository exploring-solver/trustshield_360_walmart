import argparse
import random
from pathlib import Path
from typing import List

import pandas as pd

from cortex.fraud_detection import FraudDetector
from cortex.graph_analytics import build_transaction_graph, detect_fraud_rings, ring_stats


SAMPLE_FIELDS = [
    "timestamp",
    "transaction_id",
    "source_id",
    "target_id",
    "amount",
    "channel",
]

CHANNELS = ["web", "mobile", "pos", "kiosk"]


def _generate_synthetic_transactions(n: int = 500) -> pd.DataFrame:
    """Create a quick synthetic dataset for demo purposes."""
    rows: List[dict] = []
    for i in range(n):
        rows.append(
            {
                "timestamp": pd.Timestamp.now() - pd.Timedelta(minutes=i),
                "transaction_id": f"T{i:06d}",
                "source_id": f"U{random.randint(1, 50):04d}",
                "target_id": f"M{random.randint(1, 30):04d}",
                "amount": round(random.random() * 1000, 2),
                "channel": random.choice(CHANNELS),
            }
        )
    return pd.DataFrame(rows)


def run_demo(args: argparse.Namespace):
    if args.input:
        df = FraudDetector.load_jsonl(args.input)
    else:
        print("[INFO] No input specified. Generating synthetic dataset...")
        df = _generate_synthetic_transactions()

    # Split into train (80% assumed legit) and test (20%)
    train_df = df.sample(frac=0.8, random_state=1)
    test_df = df.drop(train_df.index)

    detector = FraudDetector()
    detector.fit(train_df)
    preds = detector.predict(test_df)
    scores = detector.score_samples(test_df)

    print("=== Fraud Detector Results (negative score = suspicious) ===")
    test_df = test_df.assign(pred=preds, score=scores)
    print(test_df.head(10))

    # Graph analytics
    g = build_transaction_graph(df)
    cycles = detect_fraud_rings(g)
    stats = ring_stats(cycles)
    print("\n=== Graph Fraud Ring Stats ===")
    print(stats)

    if args.output:
        FraudDetector.save_scores(test_df, scores, args.output)
        print(f"Saved scored transactions to {args.output}")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Walmart TrustShield 360 - AI Cortex demo")
    p.add_argument("--input", type=Path, help="Path to JSONL transactions file")
    p.add_argument("--output", type=Path, help="Optional CSV path to save scored output")
    return p.parse_args()


def main():
    args = parse_args()
    run_demo(args)


if __name__ == "__main__":
    main()
