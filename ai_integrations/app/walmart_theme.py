"""Walmart branding and theme configuration for TrustShield 360."""

import streamlit as st

# Brand Colors
WALMART_BLUE = "#004c91"
WALMART_YELLOW = "#ffc220"
WALMART_WHITE = "#FFFFFF"
WALMART_LIGHT_BLUE = "#0071ce"
WALMART_DARK_BLUE = "#001e3c"

def apply_walmart_theme():
    """Apply Walmart branding to Streamlit app."""
    st.markdown(
        f"""
        <style>
        .main {{
            padding-top: 1rem;
        }}

        .stApp {{
            # background: linear-gradient(135deg, {WALMART_WHITE} 0%, #f8f9fa 100%);
        }}

        .stApp > header {{
            background-color: transparent;
        }}

        /* Header styling */
        .walmart-header {{
            background: linear-gradient(90deg, {WALMART_BLUE} 0%, {WALMART_LIGHT_BLUE} 100%);
            padding: 1.5rem 2rem;
            border-radius: 0 0 15px 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }}

        .walmart-header h1 {{
            color: {WALMART_WHITE};
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            font-weight: bold;
            font-size: 1.75rem;
        }}

        .walmart-logo {{
            color: {WALMART_YELLOW};
            font-weight: bold;
        }}

        .walmart-header p {{
            color: {WALMART_WHITE};
            margin: 0.25rem 0 0 0;
            opacity: 0.9;
            font-size: 0.95rem;
        }}

        /* Form styling */
        .stForm {{
            # background: {WALMART_WHITE};
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-left: 4px solid {WALMART_YELLOW};
            margin: 1rem 0;
        }}

        /* Input field styling */
        .stTextInput > div > div > input,
        .stNumberInput > div > div > input,
        .stSelectbox > div > div > div {{
            border-radius: 8px;
            border: 2px solid #e2e8f0;
            padding: 0.5rem;
            font-size: 14px;
        }}

        .stTextInput > div > div > input:focus,
        .stNumberInput > div > div > input:focus {{
            border-color: {WALMART_LIGHT_BLUE};
            box-shadow: 0 0 0 2px rgba(0, 113, 206, 0.2);
        }}

        /* Button styling */
        .stButton > button {{
            background: linear-gradient(90deg, {WALMART_BLUE} 0%, {WALMART_LIGHT_BLUE} 100%);
            color: {WALMART_WHITE};
            border: none;
            border-radius: 8px;
            padding: 0.75rem 2rem;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }}

        .stButton > button:hover {{
            background: linear-gradient(90deg, {WALMART_LIGHT_BLUE} 0%, {WALMART_BLUE} 100%);
            box-shadow: 0 4px 8px rgba(0, 76, 145, 0.3);
            transform: translateY(-2px);
        }}

        .stButton > button:active {{
            transform: translateY(0px);
        }}

        /* Form submit button */
        .stForm .stButton > button {{
            background: linear-gradient(90deg, {WALMART_YELLOW} 0%, #ffcd3c 100%);
            color: {WALMART_DARK_BLUE};
            font-size: 18px;
            padding: 1rem 2rem;
            font-weight: bold;
        }}

        .stForm .stButton > button:hover {{
            background: linear-gradient(90deg, #ffcd3c 0%, {WALMART_YELLOW} 100%);
            box-shadow: 0 4px 8px rgba(255, 194, 32, 0.4);
        }}

        /* Metric cards */
        .stMetric {{
            # background: {WALMART_WHITE};
            padding: 1.5rem;
            border-radius: 10px;
            border-left: 4px solid {WALMART_YELLOW};
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin-bottom: 1rem;
        }}

        .stMetric > div {{
            text-align: center;
        }}

        /* Sidebar */
        section[data-testid="stSidebar"] {{
            background: linear-gradient(180deg, {WALMART_BLUE} 0%, {WALMART_DARK_BLUE} 100%);
        }}

        section[data-testid="stSidebar"] .stSelectbox label,
        section[data-testid="stSidebar"] .stMarkdown,
        section[data-testid="stSidebar"] h1,
        section[data-testid="stSidebar"] h2,
        section[data-testid="stSidebar"] h3 {{
            color: {WALMART_WHITE} !important;
            font-weight: bold;
        }}

        section[data-testid="stSidebar"] .stSelectbox > div > div > div {{
            background-color: {WALMART_WHITE};
            color: {WALMART_DARK_BLUE};
        }}

        /* Risk indicators */
        .risk-normal {{
            background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: bold;
            text-align: center;
            width: fit-content;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
        }}

        .risk-suspicious {{
            background: linear-gradient(90deg, #dc3545 0%, #fd7e14 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: bold;
            text-align: center;
            animation: pulse 2s infinite;
            width: fit-content;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
        }}

        @keyframes pulse {{
            0% {{ opacity: 1; transform: scale(1); }}
            50% {{ opacity: 0.8; transform: scale(1.02); }}
            100% {{ opacity: 1; transform: scale(1); }}
        }}

        /* Trust card */
        .trust-card {{
            # background: {WALMART_WHITE};
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-top: 4px solid {WALMART_YELLOW};
            margin: 1rem 0;
            text-align: center;
        }}

        .trust-card h3 {{
            margin: 1rem 0 0.5rem 0;
            font-size: 1.5rem;
        }}

        /* Fraud Ring Card */
        .fraud-ring-card {{
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border: 2px solid #fc8181;
            padding: 1.5rem;
            border-radius: 12px;
            margin: 1rem 0;
            box-shadow: 0 2px 8px rgba(252, 129, 129, 0.2);
        }}

        .fraud-ring-card h4 {{
            margin: 0 0 0.75rem 0;
            font-size: 1.1rem;
        }}

        /* Container spacing */
        .block-container {{
            padding-top: 2rem;
            padding-bottom: 2rem;
        }}

        /* Info/Success/Warning boxes */
        .stInfo, .stSuccess, .stWarning {{
            border-radius: 8px;
            padding: 1rem;
            margin: 0.5rem 0;
        }}

        /* Spinner */
        .stSpinner > div {{
            border-top-color: {WALMART_BLUE};
        }}

        /* Plotly chart container */
        .js-plotly-plot {{
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }}

        /* Section headers */
        h3 {{
            color: {WALMART_DARK_BLUE};
            border-bottom: 2px solid {WALMART_YELLOW};
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }}

        /* Labels */
        label {{
            font-weight: bold;
            color: {WALMART_DARK_BLUE};
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
            <p>Advanced AI-Powered Fraud Detection & Prevention System</p>
        </div>
        """,
        unsafe_allow_html=True
    )

def trust_score_display(score: float, is_fraud: bool):
    """Display trust score with Walmart styling."""
    status_class = "risk-suspicious" if is_fraud else "risk-normal"
    status_text = "🛑 SUSPICIOUS TRANSACTION" if is_fraud else "✅ TRUSTED TRANSACTION"
    
    score_display = f"{score:.3f}" if score < 1 else f"{score:.1f}"
    
    st.markdown(
        f"""
        <div class="trust-card">
            <div class="{status_class}">
                {status_text}
            </div>
            <h3 style="color: {WALMART_BLUE};">
                Trust Score: {score_display}
            </h3>
            <p style="color: #333; margin: 0.5rem 0 0 0; font-size: 16px;">
                {"⚠️ Transaction has been flagged for manual review and additional verification." if is_fraud else "✅ Transaction appears legitimate and is safe to process immediately."}
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

def fraud_ring_alert(ring_data):
    """Display fraud ring alert with Walmart styling."""
    participants = ring_data.get('ring', [])
    risk_percentage = ring_data.get('risk', 0) * 100
    
    st.markdown(
        f"""
        <div class="fraud-ring-card">
            <h4 style="color: #c53030;">⚠️ Potential Fraud Ring Detected</h4>
            <p style="margin: 0.5rem 0; color: #2d3748; font-weight: bold;">
                <strong>Participants:</strong> {', '.join(participants[:3])}{'...' if len(participants) > 3 else ''}
            </p>
            <p style="margin: 0.5rem 0 0 0; color: #2d3748;">
                <strong>Risk Level:</strong> {risk_percentage:.1f}% | <strong>Pattern:</strong> Suspicious network activity
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )