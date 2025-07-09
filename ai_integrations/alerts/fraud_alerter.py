from __future__ import annotations

"""Real-time fraud alerting system supporting multiple channels."""

import asyncio
import json
import os
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Any, Optional

import aiosmtplib  # type: ignore
from email.message import EmailMessage


@dataclass
class FraudAlert:
    transaction_id: str
    source_id: str
    target_id: str
    amount: float
    risk_score: float
    model_used: str
    timestamp: datetime = field(default_factory=datetime.now)
    severity: str = "HIGH"  # LOW, MEDIUM, HIGH, CRITICAL
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "transaction_id": self.transaction_id,
            "source_id": self.source_id,
            "target_id": self.target_id,
            "amount": self.amount,
            "risk_score": self.risk_score,
            "model_used": self.model_used,
            "timestamp": self.timestamp.isoformat(),
            "severity": self.severity
        }


class AlertChannel:
    """Base class for alert channels."""
    
    async def send_alert(self, alert: FraudAlert) -> bool:
        raise NotImplementedError


class EmailAlerter(AlertChannel):
    """Email alert channel using SMTP."""
    
    def __init__(self, smtp_host: str = "smtp.gmail.com", smtp_port: int = 587):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.username = os.getenv("SMTP_USERNAME", "")
        self.password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("ALERT_FROM_EMAIL", "trustshield@walmart.com")
        self.to_emails = os.getenv("ALERT_TO_EMAILS", "security@walmart.com").split(",")
    
    async def send_alert(self, alert: FraudAlert) -> bool:
        if not self.username or not self.password:
            print(f"[EMAIL] Mock alert: {alert.transaction_id} - Risk: {alert.risk_score:.3f}")
            return True
            
        try:
            message = EmailMessage()
            message["From"] = self.from_email
            message["To"] = ", ".join(self.to_emails)
            message["Subject"] = f"🚨 TrustShield Alert: {alert.severity} Risk Transaction"
            
            body = f"""
TrustShield 360 Fraud Alert

Transaction ID: {alert.transaction_id}
Amount: ${alert.amount:,.2f}
Risk Score: {alert.risk_score:.3f}
Model: {alert.model_used}
Time: {alert.timestamp.strftime('%Y-%m-%d %H:%M:%S')}
Severity: {alert.severity}

Source: {alert.source_id}
Target: {alert.target_id}

This transaction has been flagged for manual review.
            """
            message.set_content(body)
            
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                start_tls=True,
                username=self.username,
                password=self.password,
            )
            return True
        except Exception as e:
            print(f"Email alert failed: {e}")
            return False


class SlackAlerter(AlertChannel):
    """Slack alert channel using webhook."""
    
    def __init__(self):
        self.webhook_url = os.getenv("SLACK_WEBHOOK_URL", "")
    
    async def send_alert(self, alert: FraudAlert) -> bool:
        if not self.webhook_url:
            print(f"[SLACK] Mock alert: Transaction {alert.transaction_id} flagged with risk {alert.risk_score:.3f}")
            return True
            
        try:
            import aiohttp  # type: ignore
            
            severity_colors = {
                "LOW": "#36a64f",
                "MEDIUM": "#ff9500", 
                "HIGH": "#ff0000",
                "CRITICAL": "#8b0000"
            }
            
            payload = {
                "attachments": [{
                    "color": severity_colors.get(alert.severity, "#ff0000"),
                    "title": f"🚨 TrustShield Fraud Alert - {alert.severity}",
                    "fields": [
                        {"title": "Transaction ID", "value": alert.transaction_id, "short": True},
                        {"title": "Amount", "value": f"${alert.amount:,.2f}", "short": True},
                        {"title": "Risk Score", "value": f"{alert.risk_score:.3f}", "short": True},
                        {"title": "Model", "value": alert.model_used, "short": True},
                        {"title": "Source → Target", "value": f"{alert.source_id} → {alert.target_id}", "short": False}
                    ],
                    "footer": "Walmart TrustShield 360",
                    "ts": int(alert.timestamp.timestamp())
                }]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(self.webhook_url, json=payload) as resp:
                    return resp.status == 200
                    
        except Exception as e:
            print(f"Slack alert failed: {e}")
            return False


class SMSAlerter(AlertChannel):
    """SMS alert channel (mock implementation)."""
    
    def __init__(self):
        self.phone_numbers = os.getenv("ALERT_PHONE_NUMBERS", "+1234567890").split(",")
    
    async def send_alert(self, alert: FraudAlert) -> bool:
        # Mock SMS (would integrate with Twilio/AWS SNS in production)
        sms_text = f"TrustShield Alert: Transaction {alert.transaction_id} flagged. Risk: {alert.risk_score:.2f}. Amount: ${alert.amount:,.2f}"
        print(f"[SMS] Sending to {len(self.phone_numbers)} numbers: {sms_text}")
        return True


class FraudAlerter:
    """Central alerting system that manages multiple channels."""
    
    def __init__(self):
        self.channels: List[AlertChannel] = [
            EmailAlerter(),
            SlackAlerter(),
            SMSAlerter()
        ]
        self.alert_history: List[FraudAlert] = []
        self.thresholds = {
            "CRITICAL": 0.9,
            "HIGH": 0.7,
            "MEDIUM": 0.5,
            "LOW": 0.3
        }
    
    def _determine_severity(self, risk_score: float) -> str:
        """Determine alert severity based on risk score."""
        for severity, threshold in self.thresholds.items():
            if risk_score >= threshold:
                return severity
        return "LOW"
    
    async def send_fraud_alert(
        self, 
        transaction_data: Dict[str, Any], 
        risk_score: float, 
        model_used: str
    ) -> List[bool]:
        """Send fraud alert across all configured channels."""
        
        severity = self._determine_severity(risk_score)
        
        alert = FraudAlert(
            transaction_id=transaction_data.get("transaction_id", "UNKNOWN"),
            source_id=transaction_data.get("source_id", "UNKNOWN"),
            target_id=transaction_data.get("target_id", "UNKNOWN"),
            amount=float(transaction_data.get("amount", 0)),
            risk_score=risk_score,
            model_used=model_used,
            severity=severity
        )
        
        # Send alerts in parallel
        tasks = [channel.send_alert(alert) for channel in self.channels]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Store in history
        self.alert_history.append(alert)
        
        # Keep only last 1000 alerts
        if len(self.alert_history) > 1000:
            self.alert_history = self.alert_history[-1000:]
        
        return [r for r in results if isinstance(r, bool)]
    
    def get_recent_alerts(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent fraud alerts for dashboard display."""
        return [alert.to_dict() for alert in self.alert_history[-limit:]]


# Global alerter instance
_alerter = FraudAlerter()


async def send_fraud_alert(transaction_data: Dict[str, Any], risk_score: float, model_used: str) -> List[bool]:
    """Convenience function to send fraud alerts."""
    return await _alerter.send_fraud_alert(transaction_data, risk_score, model_used)


def get_recent_alerts(limit: int = 10) -> List[Dict[str, Any]]:
    """Get recent alerts for API/dashboard."""
    return _alerter.get_recent_alerts(limit) 