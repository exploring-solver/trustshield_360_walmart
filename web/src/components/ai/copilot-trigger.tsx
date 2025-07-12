// File: src/components/copilot-trigger.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bot, Sparkles, Shield } from 'lucide-react'
import { CopilotChat } from "./copilot-chat"

// Define the shape of a security event object
interface SecurityEvent {
  type: string
  ip?: string
  user?: string
  device?: string
  riskScore?: number
  abuseConfidence?: number
  timestamp: string
}

interface CopilotTriggerProps {
  event: SecurityEvent
}

export function CopilotTrigger({ event }: CopilotTriggerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-accent hover:border-accent-foreground hover:text-accent-foreground dark:hover:bg-accent dark:hover:border-accent-foreground dark:hover:text-accent-foreground transition-all duration-200"
        >
          <div className="w-4 h-4 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center mr-2">
            <Bot className="w-2.5 h-2.5 text-white" />
          </div>
          Ask AI
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[600px] p-0 flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-slate-200 dark:border-slate-800 h-full">
        <SheetHeader className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-accent to-accent/50 dark:from-accent/30 dark:to-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-foreground rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                TrustShield AI Assistant
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Get instant insights about this security event
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary dark:text-primary" />
              <span className="text-xs text-muted-foreground">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-foreground dark:text-accent-foreground" />
              <span className="text-xs text-muted-foreground">Quantum-Safe</span>
            </div>
          </div>
        </SheetHeader>
        {/* The chat component is rendered inside the sheet, receiving the event context */}
        <div className="flex-1 min-h-0">
          <CopilotChat event={event} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
