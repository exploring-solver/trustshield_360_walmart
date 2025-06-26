// src/components/dashboard/active-sessions.tsx
"use client"; // This component needs client-side interactivity

import React, { useState } from 'react';
import { Smartphone, Monitor, Tablet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ActiveSession } from '@/lib/data';

interface ActiveSessionsProps {
  sessions: ActiveSession[];
}

const DeviceIcon = ({ device }: { device: string }) => {
  if (device.toLowerCase().includes('iphone')) return <Smartphone className="h-5 w-5" />;
  if (device.toLowerCase().includes('macos') || device.toLowerCase().includes('chrome')) return <Monitor className="h-5 w-5" />;
  if (device.toLowerCase().includes('tab')) return <Tablet className="h-5 w-5" />;
  return <Smartphone className="h-5 w-5" />;
};

export function ActiveSessions({ sessions }: ActiveSessionsProps) {
  const [sessionList, setSessionList] = useState(sessions);

  const handleRevoke = (sessionId: string) => {
    // In a real app, this would be an API call.
    console.log(`Revoking session ${sessionId}`);
    setSessionList(sessionList.filter(s => s.id !== sessionId));
  };

  return (
    <div className="space-y-4">
      {sessionList.map((session) => (
        <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <DeviceIcon device={session.device} />
            <div>
              <p className="font-semibold">{session.device} {session.isCurrent && <span className="text-green-600">(Current)</span>}</p>
              <p className="text-sm text-muted-foreground">{session.location} • {session.lastSeen}</p>
            </div>
          </div>
          {!session.isCurrent && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Revoke
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will sign you out from the device &quot;{session.device}&quot; in {session.location}. You will need to log in again on that device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleRevoke(session.id)}>
                    Yes, Revoke Access
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ))}
    </div>
  );
}
