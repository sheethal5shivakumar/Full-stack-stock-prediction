'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StockPredictorRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/crypto-predictor');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-400">The Stock Predictor has been replaced with our new Crypto Predictor.</p>
        <div className="mt-4 animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto"></div>
      </div>
    </div>
  );
} 