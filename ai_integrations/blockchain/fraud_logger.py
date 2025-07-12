from __future__ import annotations

"""Blockchain-based fraud logging and supply chain transparency."""

import json
import os
import time
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Dict, List, Any, Optional

from web3 import Web3  # type: ignore
from eth_account import Account  # type: ignore


@dataclass
class FraudLogEntry:
    """Immutable fraud log entry for blockchain storage."""
    
    transaction_id: str
    fraud_score: float
    model_used: str
    timestamp: int
    source_wallet: str
    target_wallet: str
    amount: float
    verified_by: str = "TrustShield360"
    
    def to_blockchain_data(self) -> bytes:
        """Convert to blockchain-compatible bytes."""
        data = asdict(self)
        return json.dumps(data).encode('utf-8')


@dataclass  
class SupplyChainEvent:
    """Supply chain tracking event."""
    
    product_id: str
    event_type: str  # MANUFACTURED, SHIPPED, RECEIVED, VERIFIED
    location: str
    timestamp: int
    verified: bool = True
    details: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.details is None:
            self.details = {}


class MockBlockchain:
    """Mock blockchain implementation for demonstration."""
    
    def __init__(self):
        self.blocks = []
        self.pending_transactions = []
        self.fraud_logs = []
        self.supply_chain_records = []
        
    def add_fraud_log(self, entry: FraudLogEntry) -> str:
        """Add fraud log to mock blockchain."""
        block_hash = f"0x{''.join([f'{ord(c):02x}' for c in entry.transaction_id])}"
        
        self.fraud_logs.append({
            "hash": block_hash,
            "entry": entry,
            "block_number": len(self.blocks) + 1,
            "confirmations": 12
        })
        
        # Simulate block mining
        block = {
            "number": len(self.blocks) + 1,
            "hash": block_hash,
            "timestamp": int(time.time()),
            "transactions": [entry.to_blockchain_data()],
            "fraud_entry": asdict(entry)
        }
        self.blocks.append(block)
        
        return block_hash
    
    def add_supply_chain_event(self, event: SupplyChainEvent) -> str:
        """Add supply chain event to blockchain."""
        event_hash = f"0x{''.join([f'{ord(c):02x}' for c in event.product_id[:8]])}"
        
        self.supply_chain_records.append({
            "hash": event_hash,
            "event": event,
            "block_number": len(self.blocks) + 1,
            "confirmations": 6
        })
        
        block = {
            "number": len(self.blocks) + 1,
            "hash": event_hash,
            "timestamp": int(time.time()),
            "supply_event": asdict(event)
        }
        self.blocks.append(block)
        
        return event_hash
    
    def get_fraud_history(self, wallet_address: str) -> List[Dict[str, Any]]:
        """Get fraud history for a wallet."""
        return [
            {
                "hash": log["hash"],
                "fraud_score": log["entry"].fraud_score,
                "timestamp": log["entry"].timestamp,
                "amount": log["entry"].amount,
                "model": log["entry"].model_used
            }
            for log in self.fraud_logs
            if log["entry"].source_wallet == wallet_address or log["entry"].target_wallet == wallet_address
        ]
    
    def get_supply_chain_trace(self, product_id: str) -> List[Dict[str, Any]]:
        """Get complete supply chain trace for product."""
        return [
            {
                "hash": record["hash"],
                "event_type": record["event"].event_type,
                "location": record["event"].location,
                "timestamp": record["event"].timestamp,
                "verified": record["event"].verified,
                "details": record["event"].details
            }
            for record in self.supply_chain_records
            if record["event"].product_id == product_id
        ]


class LoyaltyTokenContract:
    """Walmart loyalty token smart contract simulation."""
    
    def __init__(self):
        self.balances = {}
        self.total_supply = 1000000  # 1M loyalty tokens
        self.rewards_pool = 100000
        self.exchange_rate = 0.01  # $0.01 per token
        
    def earn_tokens(self, wallet: str, transaction_amount: float, fraud_score: float) -> int:
        """Earn loyalty tokens based on legitimate transactions."""
        if fraud_score > 0.5:  # Suspicious transaction
            return 0
            
        # Earn 1 token per $10 spent, bonus for low fraud score
        base_tokens = int(transaction_amount / 10)
        fraud_bonus = int((1 - fraud_score) * 10)  # Up to 10 bonus tokens
        
        total_earned = base_tokens + fraud_bonus
        
        if wallet not in self.balances:
            self.balances[wallet] = 0
        self.balances[wallet] += total_earned
        
        return total_earned
    
    def redeem_tokens(self, wallet: str, amount: int) -> bool:
        """Redeem tokens for discounts."""
        if wallet not in self.balances or self.balances[wallet] < amount:
            return False
            
        self.balances[wallet] -= amount
        return True
    
    def get_balance(self, wallet: str) -> int:
        """Get token balance for wallet."""
        return self.balances.get(wallet, 0)


class BlockchainFraudLogger:
    """Main blockchain integration for TrustShield 360."""
    
    def __init__(self):
        self.blockchain = MockBlockchain()
        self.loyalty_contract = LoyaltyTokenContract()
        
        # In production, these would be real blockchain connections
        self.fraud_contract_address = "0x1234567890abcdef1234567890abcdef12345678"
        self.supply_contract_address = "0xfedcba0987654321fedcba0987654321fedcba09"
        
    async def log_fraud_detection(
        self, 
        transaction_id: str,
        source_wallet: str,
        target_wallet: str,
        amount: float,
        fraud_score: float,
        model_used: str
    ) -> Dict[str, Any]:
        """Log fraud detection result to blockchain."""
        
        entry = FraudLogEntry(
            transaction_id=transaction_id,
            fraud_score=fraud_score,
            model_used=model_used,
            timestamp=int(time.time()),
            source_wallet=source_wallet,
            target_wallet=target_wallet,
            amount=amount
        )
        
        # Add to blockchain
        block_hash = self.blockchain.add_fraud_log(entry)
        
        # Handle loyalty tokens
        tokens_earned = 0
        if fraud_score < 0.5:  # Legitimate transaction
            tokens_earned = self.loyalty_contract.earn_tokens(source_wallet, amount, fraud_score)
        
        return {
            "block_hash": block_hash,
            "contract_address": self.fraud_contract_address,
            "fraud_score": fraud_score,
            "tokens_earned": tokens_earned,
            "immutable_record": True,
            "confirmations": 12,
            "gas_used": 21000,  # Simulated
            "status": "confirmed"
        }
    
    def track_product_journey(self, product_id: str, event_type: str, location: str, details: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Track product through supply chain."""
        
        event = SupplyChainEvent(
            product_id=product_id,
            event_type=event_type,
            location=location,
            timestamp=int(time.time()),
            details=details or {}
        )
        
        event_hash = self.blockchain.add_supply_chain_event(event)
        
        return {
            "event_hash": event_hash,
            "contract_address": self.supply_contract_address,
            "product_id": product_id,
            "event_type": event_type,
            "location": location,
            "timestamp": event.timestamp,
            "verified": True,
            "traceability": "full"
        }
    
    def get_wallet_reputation(self, wallet_address: str) -> Dict[str, Any]:
        """Get blockchain-verified wallet reputation."""
        
        fraud_history = self.blockchain.get_fraud_history(wallet_address)
        loyalty_balance = self.loyalty_contract.get_balance(wallet_address)
        
        if not fraud_history:
            reputation_score = 0.8  # New wallet
        else:
            avg_fraud_score = sum(log["fraud_score"] for log in fraud_history) / len(fraud_history)
            reputation_score = max(0.1, 1.0 - avg_fraud_score)
        
        return {
            "wallet_address": wallet_address,
            "reputation_score": reputation_score,
            "total_transactions": len(fraud_history),
            "loyalty_tokens": loyalty_balance,
            "fraud_incidents": len([log for log in fraud_history if log["fraud_score"] > 0.7]),
            "verified_on_blockchain": True,
            "trust_level": "HIGH" if reputation_score > 0.8 else "MEDIUM" if reputation_score > 0.5 else "LOW"
        }
    
    def get_product_provenance(self, product_id: str) -> Dict[str, Any]:
        """Get complete blockchain-verified product journey."""
        
        supply_trace = self.blockchain.get_supply_chain_trace(product_id)
        
        return {
            "product_id": product_id,
            "total_events": len(supply_trace),
            "journey": supply_trace,
            "authenticity_verified": all(event["verified"] for event in supply_trace),
            "current_location": supply_trace[-1]["location"] if supply_trace else "Unknown",
            "manufactured_date": supply_trace[0]["timestamp"] if supply_trace else None,
            "blockchain_verified": True
        }


# Global blockchain logger instance
_blockchain_logger = BlockchainFraudLogger()


async def log_fraud_to_blockchain(transaction_id: str, source_wallet: str, target_wallet: str, 
                                amount: float, fraud_score: float, model_used: str) -> Dict[str, Any]:
    """Convenience function to log fraud to blockchain."""
    return await _blockchain_logger.log_fraud_detection(
        transaction_id, source_wallet, target_wallet, amount, fraud_score, model_used
    )


def get_wallet_reputation(wallet_address: str) -> Dict[str, Any]:
    """Get wallet reputation from blockchain."""
    return _blockchain_logger.get_wallet_reputation(wallet_address) 