'use client';

import { useState, useEffect } from 'react';
import { fetchLatestQuotes, formatPrice, formatPercentChange, getPriceChangeColorClass, CryptoData } from '@/lib/coingecko';
import CryptoIcon from './CryptoIcon';

interface CryptoTickerProps {
  symbols?: string[];
  refreshInterval?: number; // in milliseconds
  className?: string;
}

export default function CryptoTicker({ 
  symbols = ['BTC', 'ETH', 'XRP', 'BNB', 'SOL'], 
  refreshInterval = 60000, // 1 minute by default
  className = ''
}: CryptoTickerProps) {
  const [cryptos, setCryptos] = useState<Record<string, CryptoData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch crypto quotes
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setLoading(true);
        const data = await fetchLatestQuotes(symbols);
        setCryptos(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch crypto data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initially
    fetchCryptos();

    // Set up interval for refreshing data
    const intervalId = window.setInterval(fetchCryptos, refreshInterval);

    // Clean up interval
    return () => window.clearInterval(intervalId);
  }, [symbols, refreshInterval]);

  // Rotate through cryptos
  useEffect(() => {
    if (symbols.length <= 1) return;
    
    const rotationIntervalId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % symbols.length);
    }, 3000); // Rotate every 3 seconds
    
    return () => window.clearInterval(rotationIntervalId);
  }, [symbols]);

  // Handle loading and error states
  if (loading && Object.keys(cryptos).length === 0) {
    return (
      <div className={`bg-[#1a1a1a] p-4 rounded-lg border border-[#333] overflow-hidden ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-[#333] rounded-full mr-2"></div>
              <div className="h-6 bg-[#333] rounded w-16"></div>
            </div>
            <div className="h-6 bg-[#333] rounded w-24"></div>
          </div>
          <div className="h-6 bg-[#333] rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error && Object.keys(cryptos).length === 0) {
    return (
      <div className={`bg-[#1a1a1a] p-4 rounded-lg border border-[#333] overflow-hidden ${className}`}>
        <p className="text-red-500">Error loading crypto data</p>
      </div>
    );
  }

  // If we have at least some data, show it
  const currentSymbol = symbols[currentIndex];
  const currentCrypto = cryptos[currentSymbol];

  if (!currentCrypto) {
    return (
      <div className={`bg-[#1a1a1a] p-4 rounded-lg border border-[#333] overflow-hidden ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CryptoIcon symbol={currentSymbol} size={24} className="mr-2" />
              <span className="text-xl font-bold">{currentSymbol}</span>
            </div>
            <span className="text-xl">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const price = currentCrypto.quote.USD.price;
  const percentChange = currentCrypto.quote.USD.percent_change_24h;
  const colorClass = getPriceChangeColorClass(percentChange);

  return (
    <div className={`bg-[#1a1a1a] p-4 rounded-lg border border-[#333] overflow-hidden ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <CryptoIcon symbol={currentSymbol} size={24} className="mr-2" />
            <span className="text-xl font-bold">{currentSymbol}</span>
          </div>
          <span className="text-xl">${formatPrice(price)}</span>
        </div>
        <span className={`text-lg ${colorClass}`}>
          {formatPercentChange(percentChange)}
        </span>
      </div>
    </div>
  );
} 