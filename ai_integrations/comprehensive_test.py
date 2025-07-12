import json
import requests
import time
from rich.console import Console
from rich.table import Table
from rich.progress import track

console = Console()
BASE_URL = "http://localhost:8000"

def test_multiple_predictions():
    """Test multiple transaction predictions"""
    test_cases = [
        {
            "name": "Normal Web Transaction",
            "data": {
                "timestamp": "2025-07-09T23:25:00Z",
                "transaction_id": "T100001", 
                "source_id": "U0001",
                "target_id": "M0001",
                "amount": 125.50,
                "channel": "web"
            }
        },
        {
            "name": "High Value Mobile Transaction",
            "data": {
                "timestamp": "2025-07-09T23:26:00Z",
                "transaction_id": "T100002", 
                "source_id": "U0002",
                "target_id": "M0002",
                "amount": 5000.0,
                "channel": "mobile"
            }
        },
        {
            "name": "Small POS Transaction",
            "data": {
                "timestamp": "2025-07-09T23:27:00Z",
                "transaction_id": "T100003", 
                "source_id": "U0003",
                "target_id": "M0003",
                "amount": 5.99,
                "channel": "pos"
            }
        },
        {
            "name": "Unusual Amount",
            "data": {
                "timestamp": "2025-07-09T23:28:00Z",
                "transaction_id": "T100004", 
                "source_id": "U0004",
                "target_id": "M0004",
                "amount": 99999.99,
                "channel": "web"
            }
        }
    ]
    
    results = []
    for test_case in track(test_cases, description="Testing predictions..."):
        try:
            response = requests.post(f"{BASE_URL}/predict", json=test_case["data"])
            if response.status_code == 200:
                result = response.json()
                results.append({
                    "name": test_case["name"],
                    "prediction": "FRAUD" if result["prediction"] == -1 else "NORMAL",
                    "score": round(result["score"], 4),
                    "status": "✅ PASS"
                })
            else:
                results.append({
                    "name": test_case["name"],
                    "prediction": "ERROR",
                    "score": "N/A",
                    "status": "❌ FAIL"
                })
        except Exception as e:
            results.append({
                "name": test_case["name"],
                "prediction": "ERROR",
                "score": str(e)[:30],
                "status": "❌ FAIL"
            })
    
    return results

def test_error_handling():
    """Test error handling"""
    error_tests = [
        {
            "name": "Empty JSON",
            "data": {},
            "expected_status": 400
        },
        {
            "name": "Missing Fields",
            "data": {"amount": 100},
            "expected_status": 500  # Will fail in preprocessing
        },
        {
            "name": "Invalid JSON",
            "data": None,
            "expected_status": 400
        }
    ]
    
    results = []
    for test in error_tests:
        try:
            if test["data"] is None:
                response = requests.post(f"{BASE_URL}/predict")
            else:
                response = requests.post(f"{BASE_URL}/predict", json=test["data"])
            
            if response.status_code == test["expected_status"]:
                results.append({"name": test["name"], "status": "✅ PASS"})
            else:
                results.append({"name": test["name"], "status": f"❌ FAIL (got {response.status_code})"})
        except Exception as e:
            results.append({"name": test["name"], "status": f"❌ ERROR: {str(e)[:20]}"})
    
    return results

def main():
    console.print("[bold blue]🧪 Comprehensive API Testing[/bold blue]\n")
    
    # Test basic endpoints
    console.print("[yellow]Testing basic endpoints...[/yellow]")
    health_response = requests.get(f"{BASE_URL}/health")
    if health_response.status_code == 200:
        console.print("✅ Health check: PASS")
    else:
        console.print("❌ Health check: FAIL")
        return
    
    stats_response = requests.get(f"{BASE_URL}/graph/stats")
    if stats_response.status_code == 200:
        console.print("✅ Graph stats: PASS")
    else:
        console.print("❌ Graph stats: FAIL")
    
    # Test multiple predictions
    console.print("\n[yellow]Testing fraud predictions...[/yellow]")
    prediction_results = test_multiple_predictions()
    
    pred_table = Table(title="Fraud Prediction Tests")
    pred_table.add_column("Test Case", style="cyan")
    pred_table.add_column("Prediction", style="magenta")
    pred_table.add_column("Score", style="green")
    pred_table.add_column("Status", style="bold")
    
    for result in prediction_results:
        pred_table.add_row(
            result["name"],
            result["prediction"],
            str(result["score"]),
            result["status"]
        )
    
    console.print("\n")
    console.print(pred_table)
    
    # Test error handling
    console.print("\n[yellow]Testing error handling...[/yellow]")
    error_results = test_error_handling()
    
    error_table = Table(title="Error Handling Tests")
    error_table.add_column("Test Case", style="cyan")
    error_table.add_column("Status", style="bold")
    
    for result in error_results:
        error_table.add_row(result["name"], result["status"])
    
    console.print("\n")
    console.print(error_table)
    
    # Summary
    total_tests = len(prediction_results) + len(error_results) + 2
    passed_tests = (
        sum(1 for r in prediction_results if "PASS" in r["status"]) +
        sum(1 for r in error_results if "PASS" in r["status"]) +
        (1 if health_response.status_code == 200 else 0) +
        (1 if stats_response.status_code == 200 else 0)
    )
    
    console.print(f"\n[bold]Summary: {passed_tests}/{total_tests} tests passed[/bold]")
    
    if passed_tests == total_tests:
        console.print("🎉 [green]All tests passed! Server is working correctly.[/green]")
    else:
        console.print("⚠️ [red]Some tests failed. Please check the results above.[/red]")

if __name__ == "__main__":
    main()
