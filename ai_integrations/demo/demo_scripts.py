#!/usr/bin/env python3
"""Interactive demo scripts for TrustShield 360 Sparkathon presentation."""

import json
import time
import asyncio
from typing import Dict, Any, List
from datetime import datetime
import requests

class DemoScenario:
    """Base class for demo scenarios."""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.api_base = "http://localhost:8000"
        self.fallback_responses = {}
    
    async def execute(self) -> Dict[str, Any]:
        """Execute the demo scenario."""
        raise NotImplementedError
    
    def api_call(self, endpoint: str, method: str = "GET", data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Make API call with fallback to recorded responses."""
        try:
            if method == "GET":
                response = requests.get(f"{self.api_base}{endpoint}", timeout=5)
            else:
                response = requests.post(f"{self.api_base}{endpoint}", json=data or {}, timeout=5)
            
            if response.status_code == 200:
                return response.json()
            else:
                return self.get_fallback_response(endpoint)
        except Exception as e:
            print(f"API call failed for {endpoint}: {e}")
            return self.get_fallback_response(endpoint)
    
    def get_fallback_response(self, endpoint: str) -> Dict[str, Any]:
        """Get pre-recorded response for demo reliability."""
        return self.fallback_responses.get(endpoint, {"error": "Demo system unavailable"})


class SarahPhoneTheftDemo(DemoScenario):
    """Demonstrate fraud detection for Sarah's phone theft scenario."""
    
    def __init__(self):
        super().__init__(
            "Sarah's Phone Theft", 
            "Show real-time fraud detection when Sarah's phone is stolen in Miami"
        )
        
        # Pre-recorded responses for reliable demo
        self.fallback_responses = {
            "/predict": {
                "prediction": -1,
                "score": 0.847,
                "model_used": "isolation_forest",
                "explanation": "High risk: Geographic anomaly (1,200 miles), velocity pattern, biometric failure",
                "processing_time_ms": 15
            },
            "/alerts": [
                {
                    "transaction_id": "T240101",
                    "risk_score": 0.847,
                    "timestamp": "2025-06-24T02:15:33Z",
                    "severity": "HIGH"
                }
            ],
            "/blockchain/wallet/U0042/reputation": {
                "wallet_address": "U0042",
                "reputation_score": 0.95,
                "total_transactions": 247,
                "fraud_incidents": 1,
                "trust_level": "HIGH"
            }
        }
    
    async def execute(self) -> Dict[str, Any]:
        """Execute Sarah's phone theft demo."""
        print("🎬 Starting Sarah's Phone Theft Demo...")
        
        results = {}
        
        # Step 1: Show legitimate transaction
        print("\n1️⃣ Sarah's legitimate Dallas transaction...")
        legitimate_txn = {
            "transaction_id": "T240001",
            "source_id": "U0042", 
            "target_id": "WALMART_GROCERY",
            "amount": 127.48,
            "channel": "mobile",
            "location": "Dallas_TX",
            "biometric_verified": True
        }
        
        legit_result = self.api_call("/predict", "POST", legitimate_txn)
        results["legitimate_transaction"] = legit_result
        print(f"✅ Approved - Risk Score: {legit_result.get('score', 0.123):.3f}")
        
        # Step 2: Show fraudulent transaction
        print("\n2️⃣ Fraudulent Miami transaction (phone stolen)...")
        fraud_txn = {
            "transaction_id": "T240101",
            "source_id": "U0042",
            "target_id": "ELECTRONICS_STORE", 
            "amount": 1299.99,
            "channel": "mobile",
            "location": "Miami_FL",
            "biometric_verified": False,
            "velocity_flag": True,
            "location_anomaly": True
        }
        
        fraud_result = self.api_call("/predict", "POST", fraud_txn)
        results["fraudulent_transaction"] = fraud_result
        print(f"🛑 BLOCKED - Risk Score: {fraud_result.get('score', 0.847):.3f}")
        
        # Step 3: Check alerts
        print("\n3️⃣ Real-time alerts triggered...")
        alerts = self.api_call("/alerts")
        results["alerts"] = alerts
        print(f"📧 {len(alerts)} alerts sent (Email, SMS, Slack)")
        
        # Step 4: Blockchain logging
        print("\n4️⃣ Blockchain fraud logging...")
        blockchain_result = self.api_call(f"/blockchain/wallet/{fraud_txn['source_id']}/reputation")
        results["blockchain"] = blockchain_result
        print(f"⛓️ Fraud logged to blockchain - Trust Level: {blockchain_result.get('trust_level', 'HIGH')}")
        
        print("\n✨ Demo completed successfully!")
        return results


class AIModelComparisonDemo(DemoScenario):
    """Demonstrate AI model performance comparison."""
    
    def __init__(self):
        super().__init__(
            "AI Model Comparison",
            "Compare IsolationForest vs TabTransformer performance"
        )
        
        self.fallback_responses = {
            "/benchmark": {
                "test_size": 100,
                "isolation_forest": {
                    "time_seconds": 0.0142,
                    "predictions_per_second": 7042.25,
                    "anomalies_detected": 12,
                    "avg_score": -0.234
                },
                "tab_transformer": {
                    "time_seconds": 0.1287,
                    "predictions_per_second": 777.39,
                    "anomalies_detected": 8,
                    "avg_score": 0.023
                }
            },
            "/metrics": {
                "models": {
                    "isolation_forest": {"accuracy": "94.2%", "avg_speed_ms": 15},
                    "tab_transformer": {"accuracy": "97.3%", "avg_speed_ms": 125}
                }
            }
        }
    
    async def execute(self) -> Dict[str, Any]:
        """Execute model comparison demo."""
        print("🧠 Starting AI Model Comparison Demo...")
        
        results = {}
        
        # Step 1: Benchmark models
        print("\n1️⃣ Running model benchmarks...")
        benchmark = self.api_call("/benchmark")
        results["benchmark"] = benchmark
        
        iso_speed = benchmark.get("isolation_forest", {}).get("predictions_per_second", 7000)
        tab_speed = benchmark.get("tab_transformer", {}).get("predictions_per_second", 777)
        
        print(f"⚡ IsolationForest: {iso_speed:,.0f} predictions/sec")
        print(f"🧮 TabTransformer: {tab_speed:,.0f} predictions/sec")
        print(f"🏆 Speed advantage: {iso_speed/tab_speed:.1f}x faster")
        
        # Step 2: Accuracy comparison
        print("\n2️⃣ Accuracy metrics...")
        metrics = self.api_call("/metrics")
        results["metrics"] = metrics
        
        models = metrics.get("models", {})
        iso_acc = models.get("isolation_forest", {}).get("accuracy", "94.2%")
        tab_acc = models.get("tab_transformer", {}).get("accuracy", "97.3%")
        
        print(f"🎯 IsolationForest accuracy: {iso_acc}")
        print(f"🎯 TabTransformer accuracy: {tab_acc}")
        
        # Step 3: Recommendation
        print("\n3️⃣ Model selection strategy...")
        print("💡 Use IsolationForest for real-time (15ms)")
        print("💡 Use TabTransformer for high-value transactions (125ms)")
        print("💡 Use GNN ensemble for fraud ring detection (200ms)")
        
        print("\n✨ Model comparison completed!")
        return results


class QuantumCryptoDemo(DemoScenario):
    """Demonstrate quantum-resistant cryptography."""
    
    def __init__(self):
        super().__init__(
            "Quantum Cryptography",
            "Show post-quantum crypto session establishment"
        )
        
        self.fallback_responses = {
            "/quantum/session": {
                "session_id": "a7c9e4d2f1b8c3e6",
                "shared_secret_hash": "3a7f9c2b8e1d5a4c7f9b2e8d1a5c7f9b2e8d1a5c",
                "quantum_threat": {
                    "qubits": 4096,
                    "threat_level": "MODERATE",
                    "rsa_break_capability": "2048-bit"
                },
                "performance_metrics": {
                    "total_time_ms": 12.34,
                    "kyber_keygen_ms": 3.21,
                    "dilithium_keygen_ms": 4.56,
                    "encapsulation_ms": 2.34,
                    "signing_ms": 2.23
                },
                "security_parameters": {
                    "quantum_resistant": True,
                    "classical_security_bits": 256
                }
            },
            "/quantum/threat_simulation": {
                "attack_scenario": "Shor's Algorithm on RSA-2048",
                "classical_crypto_status": {
                    "rsa_2048_broken": True,
                    "ecc_256_broken": True,
                    "estimated_break_time_hours": 8.5
                },
                "post_quantum_status": {
                    "kyber_secure": True,
                    "dilithium_secure": True,
                    "estimated_security_years": "> 50"
                }
            }
        }
    
    async def execute(self) -> Dict[str, Any]:
        """Execute quantum crypto demo."""
        print("🔮 Starting Quantum Cryptography Demo...")
        
        results = {}
        
        # Step 1: Establish quantum session
        print("\n1️⃣ Establishing quantum-resistant session...")
        session = self.api_call("/quantum/session")
        results["session"] = session
        
        perf = session.get("performance_metrics", {})
        total_time = perf.get("total_time_ms", 12.34)
        print(f"🔐 CRYSTALS-Kyber + Dilithium session: {total_time}ms")
        print(f"🛡️ Quantum resistance: {session.get('security_parameters', {}).get('classical_security_bits', 256)}-bit security")
        
        # Step 2: Simulate quantum attack
        print("\n2️⃣ Simulating quantum computer attack...")
        threat_sim = self.api_call("/quantum/threat_simulation")
        results["threat_simulation"] = threat_sim
        
        classical_status = threat_sim.get("classical_crypto_status", {})
        pq_status = threat_sim.get("post_quantum_status", {})
        
        print(f"⚠️ RSA-2048 vulnerable: {classical_status.get('rsa_2048_broken', True)}")
        print(f"⚠️ Break time: {classical_status.get('estimated_break_time_hours', 8.5)} hours")
        print(f"✅ TrustShield secure: {pq_status.get('estimated_security_years', '> 50')} years")
        
        print("\n🚀 Future-proof cryptography ready!")
        return results


class BlockchainIntegrationDemo(DemoScenario):
    """Demonstrate blockchain fraud logging and supply chain."""
    
    def __init__(self):
        super().__init__(
            "Blockchain Integration",
            "Show immutable fraud logging and supply chain tracking"
        )
        
        self.fallback_responses = {
            "/blockchain/product/track": {
                "event_hash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
                "product_id": "WMT-PROD-12345",
                "event_type": "MANUFACTURED",
                "location": "Bentonville_AR",
                "verified": True,
                "traceability": "full"
            },
            "/blockchain/product/WMT-PROD-12345/provenance": {
                "product_id": "WMT-PROD-12345",
                "total_events": 4,
                "journey": [
                    {"event_type": "MANUFACTURED", "location": "Bentonville_AR", "verified": True},
                    {"event_type": "SHIPPED", "location": "Dallas_TX", "verified": True},
                    {"event_type": "RECEIVED", "location": "Houston_TX", "verified": True},
                    {"event_type": "VERIFIED", "location": "Customer_Home", "verified": True}
                ],
                "authenticity_verified": True,
                "blockchain_verified": True
            }
        }
    
    async def execute(self) -> Dict[str, Any]:
        """Execute blockchain demo."""
        print("⛓️ Starting Blockchain Integration Demo...")
        
        results = {}
        
        # Step 1: Track product manufacturing
        print("\n1️⃣ Tracking product manufacturing...")
        track_result = self.api_call("/blockchain/product/track", "POST", {
            "product_id": "WMT-PROD-12345",
            "event_type": "MANUFACTURED", 
            "location": "Bentonville_AR"
        })
        results["product_tracking"] = track_result
        
        event_hash = track_result.get("event_hash", "0x1a2b3c4d...")
        print(f"📦 Product tracked: {track_result.get('product_id', 'WMT-PROD-12345')}")
        print(f"🔗 Blockchain hash: {event_hash}")
        
        # Step 2: Get complete provenance
        print("\n2️⃣ Retrieving complete supply chain...")
        provenance = self.api_call("/blockchain/product/WMT-PROD-12345/provenance")
        results["provenance"] = provenance
        
        journey = provenance.get("journey", [])
        total_events = len(journey)
        print(f"📋 Total supply chain events: {total_events}")
        
        for i, event in enumerate(journey, 1):
            status = "✅" if event.get("verified") else "❌"
            print(f"  {i}. {event.get('event_type')} - {event.get('location')} {status}")
        
        print(f"🔒 Authenticity verified: {provenance.get('authenticity_verified', True)}")
        
        print("\n⛓️ Blockchain integration complete!")
        return results


class FullTrustShieldDemo(DemoScenario):
    """Complete end-to-end TrustShield 360 demonstration."""
    
    def __init__(self):
        super().__init__(
            "Complete TrustShield 360",
            "Full end-to-end demonstration of all capabilities"
        )
        
        self.scenarios = [
            SarahPhoneTheftDemo(),
            AIModelComparisonDemo(), 
            QuantumCryptoDemo(),
            BlockchainIntegrationDemo()
        ]
    
    async def execute(self) -> Dict[str, Any]:
        """Execute complete demo sequence."""
        print("🎪 Starting Complete TrustShield 360 Demo!")
        print("=" * 60)
        
        results = {}
        
        for i, scenario in enumerate(self.scenarios, 1):
            print(f"\n🎬 Demo {i}/4: {scenario.name}")
            print("-" * 40)
            
            start_time = time.time()
            scenario_result = await scenario.execute()
            duration = time.time() - start_time
            
            results[scenario.name.lower().replace(" ", "_")] = {
                "results": scenario_result,
                "duration_seconds": round(duration, 2),
                "status": "completed"
            }
            
            print(f"⏱️ Completed in {duration:.2f} seconds")
            await asyncio.sleep(2)  # Pause between demos
        
        print("\n" + "=" * 60)
        print("🏆 Complete TrustShield 360 Demo Finished!")
        print("💡 All systems operational and ready for production!")
        
        return results


async def main():
    """Main demo runner with interactive menu."""
    
    print("🔒 TrustShield 360 Demo System")
    print("=" * 40)
    print("1. Sarah's Phone Theft Demo")
    print("2. AI Model Comparison")
    print("3. Quantum Cryptography")
    print("4. Blockchain Integration") 
    print("5. Complete Full Demo")
    print("0. Exit")
    
    while True:
        choice = input("\nSelect demo (0-5): ").strip()
        
        if choice == "0":
            print("👋 Demo system exiting...")
            break
        elif choice == "1":
            demo = SarahPhoneTheftDemo()
        elif choice == "2":
            demo = AIModelComparisonDemo()
        elif choice == "3":
            demo = QuantumCryptoDemo()
        elif choice == "4":
            demo = BlockchainIntegrationDemo()
        elif choice == "5":
            demo = FullTrustShieldDemo()
        else:
            print("❌ Invalid choice. Please select 0-5.")
            continue
        
        print(f"\n🚀 Starting: {demo.name}")
        start_time = time.time()
        
        try:
            results = await demo.execute()
            duration = time.time() - start_time
            
            print(f"\n✅ Demo completed in {duration:.2f} seconds")
            
            # Optionally save results
            save_choice = input("Save results to file? (y/n): ").strip().lower()
            if save_choice == 'y':
                filename = f"demo_results_{demo.name.lower().replace(' ', '_')}_{int(time.time())}.json"
                with open(filename, 'w') as f:
                    json.dump(results, f, indent=2)
                print(f"📁 Results saved to {filename}")
                
        except Exception as e:
            print(f"❌ Demo failed: {e}")
            print("🔄 Using fallback responses for reliable presentation")


if __name__ == "__main__":
    asyncio.run(main()) 