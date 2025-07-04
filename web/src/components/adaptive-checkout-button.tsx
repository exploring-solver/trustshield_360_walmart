/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/adaptive-checkout-button.tsx
'use client';
import { useRef } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, ShieldAlert, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

// --- NEW: This component will hold the full transaction logic ---
export default function AdaptiveCheckoutButton() {
    const { user } = useUser();
    const [trustScore, setTrustScore] = useState(0.7);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); // For transaction flow
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
    
    // --- Behavioral Biometrics Simulation (Optimized) ---
    const [mouseSpeed, setMouseSpeed] = useState(0);
    const mouseSpeedRef = useRef(mouseSpeed);
    const lastUpdateRef = useRef(0);

    useEffect(() => {
        let lastPos = { x: 0, y: 0 };
        
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const speed = Math.sqrt(Math.pow(e.pageX - lastPos.x, 2) + Math.pow(e.pageY - lastPos.y, 2));
            lastPos = { x: e.pageX, y: e.pageY };
            
            // Only update if significant movement and not too frequent
            if (speed > 5 && now - lastUpdateRef.current > 1000) {
                setMouseSpeed(speed);
                mouseSpeedRef.current = speed;
                lastUpdateRef.current = now;
            }
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // --- Trust Score Fetching Logic (No changes needed) ---
    const getTrustScore = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        const behavioralScoreAdjustment =
            (mouseSpeedRef.current > 150 || (mouseSpeedRef.current < 2 && mouseSpeedRef.current > 0))
                ? -0.1
                : 0.02;
        const res = await fetch('/api/trust-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, behavioralScoreAdjustment }),
        });
        if (res.ok) {
            const data = await res.json();
            setTrustScore(data.trustScore);
        }
        setIsLoading(false);
    }, [user]);
    
    useEffect(() => {
        if (user) getTrustScore();
        const interval = setInterval(() => { if (user) getTrustScore() }, 30000); // Reduced from 5s to 30s
        return () => clearInterval(interval);
    }, [user, getTrustScore]);


    // --- NEW: Full Transaction Flow Logic ---
    const executeTransactionFlow = async () => {
        setIsProcessing(true);
        setStatus({ type: 'info', message: 'Initiating secure transaction...' });

        // Dummy transaction data
        const transactionData = { amount: 125.50, items: [{ name: 'Groceries', quantity: 1 }] };

        try {
            // Step 1: PQC Handshake (can be skipped for highest trust)
            if (trustScore < 0.8) {
                setStatus({ type: 'info', message: 'Performing PQC Handshake...' });
                const handshakeRes = await fetch('/api/crypto/handshake', { method: 'POST' });
                if (!handshakeRes.ok) throw new Error('Handshake Failed');
            }

            // Step 2: AI Cortex Analysis
            setStatus({ type: 'info', message: 'Analyzing transaction with AI Cortex...' });
            const cortexRes = await fetch('/api/cortex', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...transactionData, timestamp: new Date().toISOString() }),
            });
            if (!cortexRes.ok) throw new Error('AI Cortex Failed');
            const cortexData = await cortexRes.json();

            // Step 3: Conditional Blockchain Logging
            if (cortexData.riskScore >= 0.8) {
                throw new Error(`Transaction Blocked by AI. High Risk Score: ${cortexData.riskScore}`);
            }

            setStatus({ type: 'info', message: 'Logging to immutable blockchain...' });
            const blockchainRes = await fetch('/api/blockchain/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transactionId: cortexData.transactionId,
                    amount: transactionData.amount,
                    riskScore: cortexData.riskScore,
                }),
            });
            if (!blockchainRes.ok) throw new Error('Blockchain Logging Failed');
            const blockchainData = await blockchainRes.json();
            
            setStatus({ type: 'success', message: `Success! Tx Hash: ${blockchainData.transactionHash}` });

        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setIsProcessing(false);
        }
    };


    // --- NEW: HandleClick with different paths based on trust score ---
    const handleClick = () => {
        setStatus(null); // Clear previous status
        if (trustScore < 0.5) {
            setStatus({ type: 'error', message: 'Security check failed. Please contact support.' });
            return;
        }
        executeTransactionFlow();
    };

    const getButtonState = () => {
        if (isLoading || isProcessing) {
            return { text: isProcessing ? 'Processing...' : 'Analyzing...', color: 'bg-gray-500', icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" /> };
        }
        if (trustScore > 0.8) {
            return { text: 'Express Pay', color: 'bg-green-600 hover:bg-green-700', icon: <ShieldCheck className="mr-2 h-4 w-4" /> };
        }
        if (trustScore >= 0.5) {
            return { text: 'Verify & Pay', color: 'bg-blue-600 hover:bg-blue-700', icon: <Shield className="mr-2 h-4 w-4" /> };
        }
        return { text: 'Security Check Required', color: 'bg-yellow-500 hover:bg-yellow-600 text-black', icon: <ShieldAlert className="mr-2 h-4 w-4" /> };
    };

    const { text, color, icon } = getButtonState();

    if (!user) {
        return <p>Please sign in to use the checkout.</p>;
    }

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Dynamic & Adaptive Checkout</CardTitle>
                <CardDescription>This checkout flow is powered by your live Trust Score.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className={`w-full text-white ${color}`} onClick={handleClick} disabled={isLoading || isProcessing}>
                    {icon}
                    {text}
                </Button>
                <div className='text-center mt-2 text-xs font-mono text-muted-foreground'>
                    Live Trust Score: {trustScore.toFixed(2)}
                </div>
                {status && (
                    <Alert
                        className='mt-4'
                        variant={
                            status.type === 'error'
                                ? 'destructive'
                                : 'default'
                        }
                    >
                        {status.type === 'success' && <CheckCircle className="h-4 w-4" />}
                        {status.type === 'error' && <XCircle className="h-4 w-4" />}
                        <AlertTitle>{status.type.charAt(0).toUpperCase() + status.type.slice(1)}</AlertTitle>
                        <AlertDescription className='break-words'>{status.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}