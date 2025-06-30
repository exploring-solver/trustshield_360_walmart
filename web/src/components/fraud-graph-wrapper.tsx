"use client"

import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const FraudGraph = dynamic(() => import("@/components/fraud-graph"), {
  ssr: false,
  loading: () => (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center">
          <TrendingUp className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading fraud network visualization...</p>
        </div>
      </CardContent>
    </Card>
  ),
})

export default function FraudGraphWrapper() {
  return <FraudGraph />
}
