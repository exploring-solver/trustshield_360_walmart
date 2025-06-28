// File: components/vision-guard-ui.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type AnalysisResult = {
  behavior: string;
  confidence: number;
  objects: string[];
};

export default function VisionGuardUI() {
  const [selectedImage, setSelectedImage] = useState('real_camera.png');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    const response = await fetch('/api/vision-guard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId: selectedImage }),
    });
    const data = await response.json();
    setResult(data);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VisionGuard In-Store Threat Detection</CardTitle>
        <CardDescription>Select a camera feed and run analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-2 mb-4">
             <Button variant={selectedImage === 'real_camera.png' ? 'default' : 'outline'} onClick={() => setSelectedImage('real_camera.png')}>Camera 1 (Normal)</Button>
             <Button variant={selectedImage === 'fake_camera.png' ? 'default' : 'outline'} onClick={() => setSelectedImage('fake_camera.png')}>Camera 2 (Suspicious)</Button>
        </div>

        <div className="w-full h-auto p-2 border rounded-md">
            <Image
                src={`/${selectedImage}`}
                alt="Simulated camera feed"
                width={1280}
                height={720}
                className="rounded"
            />
        </div>

        <div className="flex justify-center">
            <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Analyze Feed
            </Button>
        </div>

        {result && (
          <Card className="mt-4 bg-secondary">
              <CardHeader>
                  <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                  <p><strong>Behavior:</strong> <Badge variant={result.confidence < 0.95 ? "destructive" : "default"}>{result.behavior}</Badge></p>
                  <p><strong>Confidence:</strong> { (result.confidence * 100).toFixed(2) }%</p>
                  <p><strong>Detected Objects:</strong> {result.objects.join(', ')}</p>
              </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}