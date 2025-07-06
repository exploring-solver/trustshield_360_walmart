import { NextResponse } from 'next/server';

export async function GET() {
  const modelPerformance = {
    tabTransformer: {
      accuracy: 0.997,
      precision: 0.994,
      recall: 0.991,
      f1Score: 0.992,
      lastTraining: '2024-01-15T10:00:00Z',
      datasetSize: 2547891,
      features: 47,
      status: 'active'
    },
    gnn: {
      accuracy: 0.985,
      precision: 0.987,
      recall: 0.983,
      f1Score: 0.985,
      lastTraining: '2024-01-14T14:30:00Z',
      graphNodes: 1247832,
      graphEdges: 5891234,
      status: 'active'
    },
    visionGuard: {
      accuracy: 0.962,
      precision: 0.958,
      recall: 0.966,
      f1Score: 0.962,
      lastTraining: '2024-01-13T08:15:00Z',
      imageDataset: 892347,
      classes: 12,
      status: 'active'
    },
    ensemble: {
      accuracy: 0.999,
      precision: 0.998,
      recall: 0.997,
      f1Score: 0.997,
      weightedVoting: true,
      models: ['tabTransformer', 'gnn', 'visionGuard'],
      status: 'active'
    }
  };

  return NextResponse.json(modelPerformance);
}