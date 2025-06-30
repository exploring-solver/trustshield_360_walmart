// File: components/vision-guard-ui.tsx

"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye, Camera, AlertTriangle, CheckCircle, Activity } from "lucide-react"

type AnalysisResult = {
  behavior: string
  confidence: number
  objects: string[]
}

export default function VisionGuardUI() {
  const [selectedImage, setSelectedImage] = useState("real_camera.png")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    setIsLoading(true)
    setResult(null)

    const response = await fetch("/api/vision-guard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: selectedImage }),
    })

    const data = await response.json()
    setResult(data)
    setIsLoading(false)
  }

  const cameras = [
    { id: "real_camera.png", name: "Camera 1", location: "Electronics Section", status: "Normal" },
    { id: "fake_camera.png", name: "Camera 2", location: "Self-Checkout Area", status: "Alert" },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>VisionGuard AI Surveillance</CardTitle>
        </div>
        <CardDescription>
          Real-time in-store threat detection using computer vision and behavioral analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Camera Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Select Camera Feed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cameras.map((camera) => (
              <Button
                key={camera.id}
                variant={selectedImage === camera.id ? "default" : "outline"}
                onClick={() => setSelectedImage(camera.id)}
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-medium">{camera.name}</span>
                  <Badge variant={camera.status === "Normal" ? "secondary" : "destructive"} className="text-xs">
                    {camera.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{camera.location}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Camera Feed Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Live Feed</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {cameras.find((c) => c.id === selectedImage)?.location}
            </Badge>
          </div>

          <div className="relative w-full border rounded-lg overflow-hidden bg-black">
            <Image
              src={`/${selectedImage}`}
              alt="Simulated camera feed"
              width={1280}
              height={720}
              className="w-full h-auto"
              priority
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">LIVE</div>
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Analysis Button */}
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full h-11" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Feed...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Run AI Analysis
            </>
          )}
        </Button>

        {/* Analysis Results */}
        {result && (
          <Card className="bg-muted/30 border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Analysis Results</CardTitle>
                {result.confidence >= 0.95 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Detected Behavior</div>
                  <Badge variant={result.confidence >= 0.95 ? "destructive" : "secondary"} className="text-sm">
                    {result.behavior}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Confidence Level</div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold">{(result.confidence * 100).toFixed(1)}%</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          result.confidence >= 0.95
                            ? "bg-red-500"
                            : result.confidence >= 0.7
                              ? "bg-orange-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Objects Detected</div>
                <div className="flex flex-wrap gap-2">
                  {result.objects.map((object, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {object}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
