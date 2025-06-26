/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/dashboard/activity-log-table.tsx
"use client"; // This component is now interactive

import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { ActivityEvent } from "@/lib/data"; // Assuming this is your data type
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

// Define a type for the API response data for better type-safety
interface IpCheckResult {
  data: {
    ipAddress: string;
    isPublic: boolean;
    abuseConfidenceScore: number;
    countryName: string;
    usageType: string;
    isp: string;
    domain: string;
    totalReports: number;
    lastReportedAt: string;
  };
}

export function ActivityLogTable({ activities }: { activities: ActivityEvent[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ipData, setIpData] = useState<IpCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIp = async (ip: string) => {
    setSelectedIp(ip);
    setIsDialogOpen(true);
    setIsLoading(true);
    setError(null);
    setIpData(null);

    try {
      const response = await fetch('/api/check-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipAddress: ip }),
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred');
      }
      
      setIpData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadgeVariant = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead className="hidden md:table-cell">Device</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="text-right">Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                <div className="font-medium">{activity.event}</div>
                <div className="text-sm text-muted-foreground">{activity.date}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{activity.device}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{activity.ipAddress}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCheckIp(activity.ipAddress)}
                  >
                    Analyze
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={getRiskBadgeVariant(activity.riskLevel)}>
                  {activity.riskLevel}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>IP Reputation Analysis</DialogTitle>
            <DialogDescription>
              Live threat intelligence from AbuseIPDB for IP: {selectedIp}
            </DialogDescription>
          </DialogHeader>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Analyzing...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center p-4 text-center bg-red-50 text-red-700 rounded-md">
                <AlertCircle className="h-8 w-8" />
                <p className="font-semibold mt-2">Analysis Failed</p>
                <p className="text-sm">{error}</p>
            </div>
          )}
          {ipData && (
             <div className="space-y-4">
                <div className={`p-4 rounded-lg flex items-center gap-4 ${ipData.data.abuseConfidenceScore > 50 ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'}`}>
                    <ShieldCheck className="h-10 w-10"/>
                    <div>
                        <p className="text-lg font-bold">Abuse Confidence Score: {ipData.data.abuseConfidenceScore}%</p>
                        <p className="text-sm">{ipData.data.abuseConfidenceScore > 50 ? "This IP is considered suspicious." : "This IP appears to be safe."}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-semibold">Country:</div> <div>{ipData.data.countryName || 'N/A'}</div>
                    <div className="font-semibold">ISP:</div> <div>{ipData.data.isp || 'N/A'}</div>
                    <div className="font-semibold">Usage Type:</div> <div>{ipData.data.usageType || 'N/A'}</div>
                    <div className="font-semibold">Total Reports:</div> <div>{ipData.data.totalReports}</div>
                    <div className="font-semibold">Last Reported:</div> <div>{ipData.data.lastReportedAt ? new Date(ipData.data.lastReportedAt).toLocaleDateString() : 'Never'}</div>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
