"""Walmart branding and theme configuration for TrustShield 360."""

import streamlit as st  # type: ignore

# Walmart brand colors
WALMART_BLUE = "#004c91"
WALMART_YELLOW = "#ffc220"
WALMART_WHITE = "#ffffff"
WALMART_LIGHT_BLUE = "#0071ce"
WALMART_DARK_BLUE = "#001e3c"

def apply_walmart_theme():
    """Apply Walmart branding to Streamlit app."""
    st.markdown(
        f"""
        <style>
        .main {{
            padding-top: 2rem;
        }}
        
        .stApp > header {{
            background-color: transparent;
        }}
        
        .stApp {{
            background: linear-gradient(135deg, {WALMART_WHITE} 0%, #f8f9fa 100%);
        }}
        
        /* Header styling */
        .walmart-header {{
            background: linear-gradient(90deg, {WALMART_BLUE} 0%, {WALMART_LIGHT_BLUE} 100%);
            padding: 1rem 2rem;
            margin: -1rem -1rem 2rem -1rem;
            border-radius: 0 0 15px 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        
        .walmart-header h1 {{
            color: {WALMART_WHITE};
            margin: 0;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
        }}
        
        .walmart-logo {{
            color: {WALMART_YELLOW};
            font-size: 1.2em;
            font-weight: bold;
        }}
        
        /* Button styling */
        .stButton > button {{
            background: linear-gradient(90deg, {WALMART_BLUE} 0%, {WALMART_LIGHT_BLUE} 100%);
            color: {WALMART_WHITE};
            border: none;
            border-radius: 8px;
            padding: 0.5rem 2rem;
            font-weight: bold;
            transition: all 0.3s ease;
        }}
        
        .stButton > button:hover {{
            background: linear-gradient(90deg, {WALMART_LIGHT_BLUE} 0%, {WALMART_BLUE} 100%);
            box-shadow: 0 4px 8px rgba(0, 76, 145, 0.3);
            transform: translateY(-2px);
        }}
        
        /* Metric styling */
        .stMetric {{
            background: {WALMART_WHITE};
            padding: 1rem;
            border-radius: 10px;
            border-left: 4px solid {WALMART_YELLOW};
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }}
        
        /* Sidebar styling */
        .css-1d391kg {{
            background: linear-gradient(180deg, {WALMART_BLUE} 0%, {WALMART_DARK_BLUE} 100%);
        }}
        
        .css-1d391kg .stSelectbox label {{
            color: {WALMART_WHITE};
            font-weight: bold;
        }}
        
        /* Risk indicators */
        .risk-normal {{
            background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            text-align: center;
        }}
        
        .risk-suspicious {{
            background: linear-gradient(90deg, #dc3545 0%, #fd7e14 100%);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            text-align: center;
            animation: pulse 2s infinite;
        }}
        
        @keyframes pulse {{
            0% {{ opacity: 1; }}
            50% {{ opacity: 0.7; }}
            100% {{ opacity: 1; }}
        }}
        
        /* Cards */
        .trust-card {{
            background: {WALMART_WHITE};
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-top: 4px solid {WALMART_YELLOW};
            margin: 1rem 0;
        }}
        
        .fraud-ring-card {{
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border: 2px solid #fc8181;
            padding: 1rem;
            border-radius: 10px;
            margin: 0.5rem 0;
        }}
        
        </style>
        """,
        unsafe_allow_html=True
    )

def walmart_header():
    """Render Walmart-branded header."""
    st.markdown(
        f"""
        <div class="walmart-header">
            <h1>🔒 <span class="walmart-logo">Walmart</span> TrustShield 360</h1>
            <p style="color: {WALMART_WHITE}; margin: 0; opacity: 0.9;">
                Advanced AI-Powered Fraud Detection & Prevention
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

def trust_score_display(score: float, is_fraud: bool):
    """Display trust score with Walmart styling."""
    status_class = "risk-suspicious" if is_fraud else "risk-normal"
    status_text = "🛑 SUSPICIOUS" if is_fraud else "✅ TRUSTED"
    
    return st.markdown(
        f"""
        <div class="trust-card">
            <div class="{status_class}">
                {status_text}
            </div>
            <h3 style="color: {WALMART_BLUE}; margin-top: 1rem;">
                Trust Score: {score:.3f}
            </h3>
            <p style="color: #666; margin: 0;">
                {"Transaction flagged for review" if is_fraud else "Transaction approved for processing"}
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

def fraud_ring_alert(ring_data):
    """Display fraud ring alert with Walmart styling."""
    return st.markdown(
        f"""
        <div class="fraud-ring-card">
            <h4 style="color: #c53030; margin: 0 0 0.5rem 0;">⚠️ Fraud Ring Detected</h4>
            <p style="margin: 0; color: #2d3748;">
                <strong>Participants:</strong> {', '.join(ring_data.get('ring', []))}
            </p>
            <p style="margin: 0.25rem 0 0 0; color: #2d3748;">
                <strong>Risk Level:</strong> {ring_data.get('risk', 0):.1%}
            </p>
        </div>
        """,
        unsafe_allow_html=True
    ) 