//src/app/api/vision-guard/route.ts
import { NextResponse } from "next/server";

// Mock detection logic
const mockAnalysis = (imageId: string) => {
    if (imageId === 'fake_camera.png') {
        return {
            behavior: "Potential Shoplifting Detected",
            confidence: 0.92,
            objects: ["concealed item", "rapid movement"],
            timestamp: new Date().toISOString()
        };
    }
    return {
        behavior: "Normal Shopper Activity",
        confidence: 0.98,
        objects: ["shopping cart", "Browse aisle"],
        timestamp: new Date().toISOString()
    };
};

export async function POST(request: Request) {
    try {
        const { imageId } = await request.json();

        if (!imageId) {
            return NextResponse.json({ error: "Image ID is required." }, { status: 400 });
        }

        // Simulate network delay and processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const results = mockAnalysis(imageId);
        return NextResponse.json(results);

    } catch (error) {
        console.error("Error in VisionGuard:", error);
        return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
    }
}