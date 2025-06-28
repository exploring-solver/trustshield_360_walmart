'use client';

import dynamic from 'next/dynamic';

const FraudGraph = dynamic(() => import('@/components/fraud-graph'), {
  ssr: false,
  loading: () => <p>Loading fraud graph...</p>,
});

export default function FraudGraphWrapper() {
  return <FraudGraph />;
}
