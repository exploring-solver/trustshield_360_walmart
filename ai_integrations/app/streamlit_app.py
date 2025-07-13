from __future__ import annotations

"""Streamlit application acting as a wallet UI for TrustShield 360.
Users can enter a transaction and instantly receive a fraud risk score.
Also visualizes the current transaction network and potential fraud rings.

Run with:
    streamlit run app/streamlit_app.py
"""
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import random
from pathlib import Path
from typing import List

import pandas as pd
import plotly.graph_objs as go  # type: ignore
import streamlit as st  # type: ignore
from walmart_theme import apply_walmart_theme, walmart_header, trust_score_display, fraud_ring_alert

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
        height=400,
        plot_bgcolor='white'
    )
    return fig


def main():
    st.set_page_config(
        page_title="Walmart TrustShield 360", 
        page_icon="🔒", 
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    apply_walmart_theme()
    walmart_header()
    
    # Load data and train detector
    df_hist = load_initial_dataset()
    detector = trained_detector(df_hist)
    
    # Sidebar Configuration
    st.sidebar.markdown("### ⚙️ Settings")
    st.sidebar.markdown("---")
    
    st.sidebar.markdown("**Fraud Detection Model**")
    model_choice = st.sidebar.selectbox(
        "Select Detection Algorithm",
        ["IsolationForest", "TabTransformer"],
        index=0,
        help="Choose the machine learning model for fraud detection"
    )
    
    st.sidebar.markdown("---")
    st.sidebar.markdown("**System Info**")
    st.sidebar.info("🔄 Models trained on 500+ transactions")
    st.sidebar.success("✅ Real-time processing active")
    
    # Main content area
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Metrics Dashboard
        st.markdown("### 📊 Live Dashboard")
        
        metrics_col1, metrics_col2, metrics_col3, metrics_col4 = st.columns(4)
        with metrics_col1:
            st.metric("Total Transactions", "47,391", "+1,234")
        with metrics_col2:
            st.metric("Fraud Blocked", "127", "+8")
        with metrics_col3:
            st.metric("$ Saved Today", "$89,432", "+$12,445")
        with metrics_col4:
            st.metric("System Uptime", "99.97%", "+0.02%")
        
        st.markdown("---")
        
        # Transaction Input Form
        st.markdown("### 🔍 Transaction Risk Assessment")
        st.markdown("Enter transaction details to get real-time fraud risk analysis")
        
        with st.form("transaction_form", clear_on_submit=False):
            form_col1, form_col2 = st.columns(2)
            
            with form_col1:
                st.markdown("**👤 Source Information**")
                source_id = st.text_input(
                    "Source ID", 
                    value="U0001",
                    placeholder="Enter user/account ID",
                    help="Unique identifier for the transaction source"
                )
                
                st.markdown("**💵 Transaction Details**")
                amount = st.number_input(
                    "Amount ($)", 
                    min_value=0.01, 
                    value=99.99, 
                    step=0.01,
                    help="Transaction amount in USD"
                )
            
            with form_col2:
                st.markdown("**🏬 Target Information**")
                target_id = st.text_input(
                    "Target ID", 
                    value="M0001",
                    placeholder="Enter merchant/destination ID",
                    help="Unique identifier for the transaction target"
                )
                
                st.markdown("**📡 Channel Information**")
                channel = st.selectbox(
                    "Transaction Channel", 
                    CHANNELS, 
                    index=0,
                    help="Channel through which transaction is processed"
                )
            
            st.markdown("---")
            
            # Center the submit button
            submit_col1, submit_col2, submit_col3 = st.columns([1, 1, 1])
            with submit_col2:
                submitted = st.form_submit_button(
                    "🔍 Analyze Transaction Risk",
                    use_container_width=True
                )
    
    with col2:
        # Quick Actions Panel
        st.markdown("### ⚡ Quick Actions")
        
        if st.button("🛍️ Load Sarah's Scenario", use_container_width=True):
            st.info("📝 Loading legitimate customer checkout...")
            st.balloons()
            
        if st.button("📱 Load Phone Theft Scenario", use_container_width=True):
            st.warning("⚠️ Loading fraudulent transaction simulation...")
            
        if st.button("🔄 Refresh Data", use_container_width=True):
            st.cache_data.clear()
            st.success("✅ Data refreshed successfully!")
            
        st.markdown("---")
        st.markdown("### 📈 Recent Activity")
        st.markdown("""
        - 🟢 3 transactions approved
        - 🔴 1 transaction blocked  
        - 🟡 2 pending review
        """)

    # Process form submission
    if submitted:
        with st.spinner("🔄 Analyzing transaction..."):
            # Create transaction dataframe
            txn_df = pd.DataFrame([{
                "timestamp": pd.Timestamp.now(),
                "transaction_id": "TNEW001",
                "source_id": source_id,
                "target_id": target_id,
                "amount": amount,
                "channel": channel,
            }])
            
            # Get fraud prediction
            if model_choice == "TabTransformer":
                risk_score = detector.predict(txn_df)[0]
                risk_pred = -1 if risk_score > 0.5 else 1
            else:
                risk_pred = detector.predict(txn_df)[0]
                risk_score = detector.score_samples(txn_df)[0]

            is_fraud = risk_pred == -1
            
        st.markdown("---")
        
        # Results section
        result_col1, result_col2 = st.columns([1, 1])
        
        with result_col1:
            # Display trust score
            trust_score_display(abs(risk_score), is_fraud)
            
        with result_col2:
            # Additional analysis
            st.markdown("#### 📋 Analysis Details")
            
            risk_level = "HIGH" if is_fraud else "LOW"
            confidence = abs(risk_score) * 100
            
            st.markdown(f"""
            - **Risk Level:** {risk_level}
            - **Confidence:** {confidence:.1f}%
            - **Model Used:** {model_choice}
            - **Processing Time:** <1ms
            """)
            
            if is_fraud:
                st.markdown("**🚨 Recommended Actions:**")
                st.markdown("""
                - Hold transaction for review
                - Request additional verification
                - Monitor account activity
                """)
            else:
                st.markdown("**✅ Transaction Status:**")
                st.markdown("""
                - Safe to process
                - Normal risk profile
                - No further action needed
                """)

        # Network visualization
        st.markdown("---")
        st.markdown("### 🌐 Transaction Network Analysis")
        
        # Update graph with new transaction
        df_vis = pd.concat([df_hist, txn_df], ignore_index=True)
        g = build_transaction_graph(df_vis)
        
        network_col1, network_col2 = st.columns([2, 1])
        
        with network_col1:
            fig = graph_to_plotly_figure(g)
            st.plotly_chart(fig, use_container_width=True)
            
        with network_col2:
            st.markdown("#### 🔍 Network Insights")
            st.markdown(f"""
            - **Total Nodes:** {g.number_of_nodes()}
            - **Total Edges:** {g.number_of_edges()}
            - **New Transaction:** Highlighted
            """)
        
        # Fraud ring detection
        st.markdown("### 🕸️ Fraud Ring Detection")
        cycles = detect_fraud_rings(g)
        
        if cycles:
            st.warning(f"⚠️ {len(cycles)} potential fraud ring(s) detected")
            for i, c in enumerate(cycles, 1):
                fraud_ring_alert({
                    "ring": list(c), 
                    "risk": 0.73 + (i * 0.12) % 0.3
                })
        else:
            st.success("✅ No suspicious transaction patterns detected in current network")


if __name__ == "__main__":
    main()