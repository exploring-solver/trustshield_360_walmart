// File: components/wallet-ui.tsx
'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, Shield, Wine } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WalletUI() {
    const { user } = useUser();
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // This simulates presenting a Verifiable Credential from the user's wallet.
    const handleVerifyAge = () => {
        setShowSuccess(false);
        // In a real scenario, this would trigger a cryptographic handshake
        // with the user's digital wallet app (e.g., via QR code or NFC).
        // For this mock, we'll just simulate a successful verification.
        setTimeout(() => {
            setIsAgeVerified(true);
            setShowSuccess(true);
        }, 1000);
    };

    if (!user) {
        return <p>Please sign in to view your wallet.</p>;
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Walmart TrustShield Wallet</CardTitle>
                <CardDescription>Hi {user.firstName}, manage your credentials and purchases.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">My Verifiable Credentials</h3>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                        <div className="flex items-center">
                            <Shield className="h-6 w-6 text-green-600 mr-3" />
                            <div>
                                <p className="font-bold">Digital Identity</p>
                                <p className="text-sm text-muted-foreground">Issued by Walmart</p>
                            </div>
                        </div>
                        <Badge variant="secondary">Verified</Badge>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">In-Store Action: Age Verification</h3>
                    <div className="flex items-center">
                        <Wine className="h-8 w-8 text-purple-600 mr-4"/>
                        <p>Attempting to purchase: Bottle of Wine</p>
                    </div>
                </div>

                {showSuccess && (
                     <Alert className="bg-green-50 border-green-200">
                         <CheckCircle className="h-4 w-4 text-green-700" />
                       <AlertTitle className="text-green-800">Verification Successful!</AlertTitle>
                       <AlertDescription className="text-green-700">
                         Age confirmed as &quot;Over 21&quot;. Your privacy was preserved.
                       </AlertDescription>
                     </Alert>
                )}

            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleVerifyAge}
                    disabled={isAgeVerified}
                >
                    {isAgeVerified ? <CheckCircle className="mr-2 h-4 w-4" /> : null}
                    {isAgeVerified ? 'Age Verified' : 'Verify Age with Digital ID'}
                </Button>
            </CardFooter>
        </Card>
    );
}