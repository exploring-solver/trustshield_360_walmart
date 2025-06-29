/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// File: src/app/(main)/secure-flow/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {  CheckCircle, XCircle, Link as LinkIcon, Loader2 } from 'lucide-react';

// This component will display the log of operations
const StatusLog = ({ logs }: { logs: string[] }) => {
  return (
    <div className="w-full p-4 mt-4 space-y-2 font-mono text-sm text-left bg-gray-900 rounded-lg text-gray-50">
      {logs.map((log, index) => {
        let Icon = Loader2;
        let color = 'text-blue-400';
        if (log.includes('✓')) {
          Icon = CheckCircle;
          color = 'text-green-400';
        } else if (log.includes('✗')) {
          Icon = XCircle;
          color = 'text-red-400';
        }

        return (
          <div key={index} className={`flex items-start ${color}`}>
            <Icon className={`flex-shrink-0 h-5 w-5 mr-2 mt-0.5 ${Icon === Loader2 ? 'animate-spin' : ''}`} />
            <span className="flex-1">{log}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function SecureFlowPage() {
  const [amount, setAmount] = useState<string>('125.50');
  const [items, setItems] = useState<string>('Groceries and a bottle of wine');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<{ type: 'success' | 'failure'; message: string } | null>(null);

  const processSecureTransaction = async () => {
    setIsLoading(true);
    setError(null);
    setLogs([]);
    setFinalResult(null);

    try {
      // --- STEP 1: PQC HANDSHAKE ---
      setLogs(prev => [...prev, '1. Performing PQC Handshake...']);
      const handshakeRes = await fetch('/api/crypto/handshake', { method: 'POST' });
      if (!handshakeRes.ok) throw new Error('PQC Handshake failed.');
      await handshakeRes.json();
      setLogs(prev => [...prev.slice(0, -1), '1. PQC Handshake Complete ✓']);

      // --- STEP 2: AI CORTEX ANALYSIS ---
      setLogs(prev => [...prev, '2. Sending transaction to AI Fraud Cortex...']);
      const transactionData = {
        amount: parseFloat(amount),
        items: [{ name: items, quantity: 1 }],
        timestamp: new Date().toISOString(),
        shippingAddress: { city: "Bentonville" },
        billingAddress: { city: "Bentonville" },
      };
      const cortexRes = await fetch('/api/cortex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      if (!cortexRes.ok) throw new Error('AI Cortex analysis failed.');
      const cortexData = await cortexRes.json();
      setLogs(prev => [...prev.slice(0, -1), `2. AI Cortex Analysis Complete ✓ (Risk Score: ${cortexData.riskScore})`]);

      // --- STEP 3: BLOCKCHAIN LOGGING (CONDITIONAL) ---
      if (cortexData.riskScore >= 0.8) {
        setLogs(prev => [...prev, '3. High risk score detected. Transaction blocked by policy. ✗']);
        setFinalResult({ type: 'failure', message: `Transaction Blocked. The AI Cortex flagged this transaction with a high risk score of ${cortexData.riskScore}.` });
        return;
      }

      setLogs(prev => [...prev, '3. Logging verified transaction to the immutable ledger...']);
      const blockchainRes = await fetch('/api/blockchain/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: cortexData.transactionId,
          amount: transactionData.amount,
          riskScore: cortexData.riskScore,
        }),
      });
      if (!blockchainRes.ok) throw new Error('Blockchain logging failed.');
      const blockchainData = await blockchainRes.json();
      const finalLogMessage = `3. Transaction logged to blockchain ✓`;
      setLogs(prev => [...prev.slice(0, -1), finalLogMessage]);
      setFinalResult({ type: 'success', message: `Transaction successfully recorded on the blockchain with hash: ${blockchainData.transactionHash}` });

    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(errorMessage);
      setLogs(prev => [...prev.slice(0, -1), `${prev.length}. Operation Failed ✗`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto  p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>ShopLifter&apos;s 360 End-to-End Flow</CardTitle>
          <CardDescription>
            Test the full transaction lifecycle from a quantum-safe handshake to an immutable blockchain record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Transaction Amount</Label>
              <Input id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 125.50" />
            </div>
            <div>
              <Label htmlFor="items">Item Description</Label>
              <Input id="items" value={items} onChange={e => setItems(e.target.value)} placeholder="e.g., Groceries and electronics" />
            </div>
          </div>

          <StatusLog logs={logs} />

          {error && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {finalResult && (
             <Alert variant={finalResult.type === 'success' ? 'default' : 'destructive'} className="mt-4 bg-opacity-20">
              {finalResult.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{finalResult.type === 'success' ? 'Flow Complete' : 'Flow Halted'}</AlertTitle>
              <AlertDescription className="break-words">{finalResult.message}</AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={processSecureTransaction} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Processing...' : 'Process Secure Transaction'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}