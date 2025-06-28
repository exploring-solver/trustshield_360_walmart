/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import FraudGraphWrapper from '@/components/fraud-graph-wrapper';
import VisionGuardUI from "@/components/vision-guard-ui";
import WalletUI from "@/components/wallet-ui";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Mock Cortex Caller component for demonstration
async function CortexDemo() {
  // A normal transaction
  const normalTransaction = {
      id: "txn_123",
      amount: 85.50,
      items: [{ name: "Groceries", quantity: 5 }],
      timestamp: new Date().toISOString(),
      shippingAddress: { city: "Bentonville" },
      billingAddress: { city: "Bentonville" },
  };

  // A fraudulent transaction
  const fraudTransaction = {
      id: "txn_456",
      amount: 1500.00,
      items: [
          { name: "Laptop", quantity: 1 },
          { name: "Gift Card", quantity: 3 }
      ],
      timestamp: new Date(new Date().setUTCHours(3)).toISOString(), // 3 AM
      shippingAddress: { city: "Miami" },
      billingAddress: { city: "New York" },
  };

  const analyze = async (transaction: any) => {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/cortex`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(transaction),
        cache: 'no-store'
    });
    return res.json();
  }

  const normalResult = await analyze(normalTransaction);
  const fraudResult = await analyze(fraudTransaction);

  return (
    <div className="space-y-4">
         <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>AI Fraud Cortex Simulation</AlertTitle>
            <AlertDescription>
               The following are results from the mock AI Fraud Cortex API route.
            </AlertDescription>
         </Alert>
         <div className="p-4 border rounded-lg">
            <h4 className="font-semibold">Normal Transaction Analysis</h4>
            <p>Risk Score: <span className="font-bold">{normalResult.riskScore}</span></p>
            <p>Status: <span className="text-green-600 font-semibold">{normalResult.status}</span></p>
            <p>Explanation: {normalResult.explanations.join(' ')}</p>
         </div>
         <div className="p-4 border rounded-lg">
            <h4 className="font-semibold">Suspicious Transaction Analysis</h4>
            <p>Risk Score: <span className="font-bold text-red-600">{fraudResult.riskScore}</span></p>
            <p>Status: <span className="text-red-600 font-semibold">{fraudResult.status}</span></p>
            <p>Explanations:</p>
            <ul className="list-disc list-inside">
                {fraudResult.explanations.map((exp: string, i: number) => <li key={i}>{exp}</li>)}
            </ul>
         </div>
    </div>
  )
}


export default function DashboardPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
         <h1 className="text-4xl font-bold tracking-tight">ShopLifter&apos;s 360</h1>
         <p className="text-lg text-muted-foreground">A unified view of next-generation retail security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 space-y-8">
             <Suspense fallback={<p>Loading Cortex Demo...</p>}>
                <CortexDemo />
             </Suspense>
        </div>
        <div className="space-y-8">
            <WalletUI />
            <VisionGuardUI />
        </div>
        <div className="space-y-8">
             <Suspense fallback={<p>Loading Fraud Graph...</p>}>
                <FraudGraphWrapper />
             </Suspense>
        </div>
      </div>
    </main>
  );
}