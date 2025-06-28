/* eslint-disable @typescript-eslint/no-explicit-any */
// File: components/fraud-graph.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';
import 'vis-network/styles/vis-network.css';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function FraudGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGraphData() {
      try {
        const res = await fetch('/api/fraud-rings');
        if (!res.ok) throw new Error('Failed to fetch fraud ring data');
        const data = await res.json();
        setGraphData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGraphData();
  }, []);

  useEffect(() => {
    if (containerRef.current && graphData) {
      const options = {
        layout: { hierarchical: false },
        edges: { color: '#000000' },
        nodes: { shape: 'dot', size: 20 },
        groups: {
          user: {
            color: { background: '#3b82f6', border: '#1e40af' },
            font: { color: 'white' }
          },
          device: {
            color: { background: '#ef4444', border: '#b91c1c' },
            font: { color: 'white' },
            shape: 'square'
          }
        },
        height: '500px'
      };

      const network = new Network(containerRef.current, graphData, options);
      return () => network.destroy();
    }
  }, [graphData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Fraud Graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Ring Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} style={{ height: '500px' }} />
      </CardContent>
    </Card>
  );
}
