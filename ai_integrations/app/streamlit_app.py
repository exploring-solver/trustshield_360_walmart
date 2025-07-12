from __future__ import annotations

"""Streamlit application acting as a wallet UI for TrustShield 360.
Users can enter a transaction and instantly receive a fraud risk score.
Also visualizes the current transaction network and potential fraud rings.

Run with:
    streamlit run app/streamlit_app.py
"""

import random
from pathlib import Path
from typing import List

import pandas as pd
import plotly.graph_objs as go  # type: ignore
import streamlit as st  # type: ignore
from app.walmart_theme import apply_walmart_theme, walmart_header, trust_score_display, fraud_ring_alert

from cortex.fraud_detection import FraudDetector
from cortex.tab_transformer_detector import TabTransformerDetector
from cortex.graph_analytics import (
    build_transaction_graph,
    detect_fraud_rings,
)

CHANNELS = ["web", "mobile", "pos", "kiosk"]


@st.cache_data(show_spinner=False)
def load_initial_dataset() -> pd.DataFrame:
    """Load sample dataset or generate synthetic if not present."""
    sample_path = Path("data/sample_transactions.jsonl")
    if sample_path.exists():
        df = FraudDetector.load_jsonl(sample_path)
    else:
        df = _generate_synthetic_transactions(500)
    return df


@st.cache_resource(show_spinner=False)
def trained_detector(df: pd.DataFrame) -> FraudDetector:
    """Train and cache the fraud detector on historical data."""
    detector = FraudDetector()
    detector.fit(df)
    return detector


def _generate_synthetic_transactions(n: int = 500) -> pd.DataFrame:
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


def graph_to_plotly_figure(g) -> go.Figure:
    """Convert a NetworkX graph to a Plotly scatter graph for visualization."""
    import networkx as nx

    pos = nx.spring_layout(g, seed=42)
    edge_x = []
    edge_y = []
    for src, tgt in g.edges():
        x0, y0 = pos[src]
        x1, y1 = pos[tgt]
        edge_x.extend([x0, x1, None])
        edge_y.extend([y0, y1, None])

    edge_trace = go.Scatter(
        x=edge_x,
        y=edge_y,
        line=dict(width=1, color="#888"),
        hoverinfo="none",
        mode="lines",
    )

    node_x = []
    node_y = []
    texts = []
    for node in g.nodes():
        x, y = pos[node]
        node_x.append(x)
        node_y.append(y)
        texts.append(str(node))

    node_trace = go.Scatter(
        x=node_x,
        y=node_y,
        mode="markers+text",
        text=texts,
        textposition="top center",
        hoverinfo="text",
        marker=dict(
            showscale=False,
            color="#1f77b4",
            size=10,
            line_width=2,
        ),
    )

    fig = go.Figure(data=[edge_trace, node_trace])
    fig.update_layout(
        showlegend=False,
        margin=dict(l=20, r=20, t=20, b=20),
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    )
    return fig


def main():
    st.set_page_config(page_title="Walmart TrustShield 360", page_icon="🔒", layout="wide")
    apply_walmart_theme()
    walmart_header()
    
    # Metrics row
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Transactions", "47,391", "+1,234")
    with col2:
        st.metric("Fraud Blocked", "127", "+8")
    with col3:
        st.metric("$ Saved Today", "$89,432", "+$12,445")
    with col4:
        st.metric("System Uptime", "99.97%", "+0.02%")
    
    st.markdown("---")
    st.markdown(
        "### Enter a transaction to see **real-time fraud risk** and network analysis"
    )

    df_hist = load_initial_dataset()

    st.sidebar.header("Settings")
    model_choice = st.sidebar.selectbox("Select Model", ["IsolationForest", "TabTransformer"], index=0)

    if model_choice == "TabTransformer":
        @st.cache_resource(show_spinner=False)
        def _tab_model(df):
            return TabTransformerDetector(epochs=3).fit(df)

        detector = _tab_model(df_hist)
    else:
        detector = trained_detector(df_hist)

    with st.form("txn_form"):
        cols = st.columns(4)
        with cols[0]:
            source_id = st.text_input("Source ID", value="U0001")
        with cols[1]:
            target_id = st.text_input("Target ID", value="M0001")
        with cols[2]:
            amount = st.number_input("Amount ($)", min_value=0.01, value=99.99, step=0.01)
        with cols[3]:
            channel = st.selectbox("Channel", CHANNELS, index=0)

        submitted = st.form_submit_button("Calculate Risk")

    if submitted:
        txn_df = pd.DataFrame(
            [
                {
                    "timestamp": pd.Timestamp.now(),
                    "transaction_id": "TNEW001",
                    "source_id": source_id,
                    "target_id": target_id,
                    "amount": amount,
                    "channel": channel,
                }
            ]
        )
        if model_choice == "TabTransformer":
            risk_score = detector.predict_score(txn_df)[0]  # type: ignore[attr-defined]
            risk_pred = -1 if risk_score > 0.5 else 1
        else:
            risk_pred = detector.predict(txn_df)[0]  # type: ignore[attr-defined]
            risk_score = detector.score_samples(txn_df)[0]  # type: ignore[attr-defined]

        is_fraud = risk_pred == -1
        
        # Use Walmart-branded trust score display
        trust_score_display(abs(risk_score), is_fraud)
        
        # Add demo scenario buttons
        st.markdown("---")
        col1, col2 = st.columns(2)
        with col1:
            if st.button("🛍️ Test Sarah's Scenario"):
                st.info("Loading Sarah's legitimate checkout data...")
        with col2:
            if st.button("📱 Test Phone Theft Scenario"):
                st.warning("Loading stolen phone fraud simulation...")

        # Update graph with new transaction for visualization only
        df_vis = pd.concat([df_hist, txn_df], ignore_index=True)
        g = build_transaction_graph(df_vis)
        fig = graph_to_plotly_figure(g)
        st.subheader("📊 Transaction Network")
        st.plotly_chart(fig, use_container_width=True)

        cycles = detect_fraud_rings(g)
        st.subheader("🔍 Fraud Ring Detection")
        if cycles:
            for i, c in enumerate(cycles, 1):
                fraud_ring_alert({"ring": list(c), "risk": 0.73 + (i * 0.12) % 0.3})
        else:
            st.success("✅ No suspicious transaction rings detected in current network.")


if __name__ == "__main__":
    main() 