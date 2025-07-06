// File: src/components/copilot-trigger.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bot } from 'lucide-react';
import { CopilotChat } from './copilot-chat';

// Define the shape of a security event object
interface SecurityEvent {
  type: string;
  ip?: string;
  user?: string;
  device?: string;
  riskScore?: number;
  abuseConfidence?: number;
  timestamp: string;
}

interface CopilotTriggerProps {
  event: SecurityEvent;
}

export function CopilotTrigger({ event }: CopilotTriggerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Bot className="w-4 h-4 mr-2" />
          Ask Copilot
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>TrustShield Copilot</SheetTitle>
        </SheetHeader>
        {/* The chat component is rendered inside the sheet, receiving the event context */}
        <CopilotChat event={event} />
      </SheetContent>
    </Sheet>
  );
}