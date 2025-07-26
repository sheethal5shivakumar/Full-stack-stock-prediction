'use client';

import { useState, useEffect } from 'react';
import { fetchLatestQuotes, formatPrice, formatPercentChange, formatLargeNumber, getPriceChangeColorClass, CryptoData } from '@/lib/coingecko';
// @ts-ignore - Import CryptoChart component
import CryptoChart from './CryptoChart';
import CryptoIcon from './CryptoIcon';

interface CryptoDetailProps {
  symbol: string;
  className?: string;
}

export default function CryptoDetail({ symbol, className = '' }: CryptoDetailProps) {
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<string>('daily');

  // Fetch crypto data
  useEffect(() => {
    const fetchCrypto = async () => {
      if (!symbol) return;
      
      try {
        setLoading(true);
        const data = await fetchLatestQuotes([symbol]);
        setCrypto(data[symbol] || null);
        setError(null);
      } catch (err) {
        setError('Failed to fetch crypto data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchCrypto();

    // Refresh every minute
    const intervalId = window.setInterval(fetchCrypto, 60000);
    
    // Cleanup
    return () => window.clearInterval(intervalId);
  }, [symbol]);

  if (loading && !crypto) {
    return (
      <div className={`bg-[#1e1e1e] p-6 rounded-lg border border-[#333] ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-[#333] rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-[#333] rounded w-1/4 mb-8"></div>
          <div className="h-[300px] bg-[#333] rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-[#333] rounded"></div>
            <div className="h-20 bg-[#333] rounded"></div>
            <div className="h-20 bg-[#333] rounded"></div>
            <div className="h-20 bg-[#333] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !crypto) {
    return (
      <div className={`bg-[#1e1e1e] p-6 rounded-lg border border-[#333] ${className}`}>
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className={`bg-[#1e1e1e] p-6 rounded-lg border border-[#333] ${className}`}>
        <div className="text-gray-400">No data available for {symbol}</div>
      </div>
    );
  }

  const { quote } = crypto;
  const usdQuote = quote.USD;
  
  const price = usdQuote.price;
  const percentChange1h = usdQuote.percent_change_1h;
  const percentChange24h = usdQuote.percent_change_24h;
  const percentChange7d = usdQuote.percent_change_7d;
  const marketCap = usdQuote.market_cap;
  const volume24h = usdQuote.volume_24h;
  const colorClass24h = getPriceChangeColorClass(percentChange24h);

  return (
    <div className={`bg-[#1e1e1e] p-6 rounded-lg border border-[#333] ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <CryptoIcon symbol={symbol} size={32} className="mr-3" />
          <div>
            <h2 className="text-2xl font-bold">{crypto.name} ({symbol})</h2>
            <p className="text-gray-400">Rank #{crypto.id}</p>
          </div>
        </div>
        <div className="mt-2 md:mt-0 flex flex-col items-end">
          <div className="text-2xl font-bold">${formatPrice(price)}</div>
          <div className={`flex items-center ${colorClass24h}`}>
            <span>{formatPercentChange(percentChange24h)} (24h)</span>
          </div>
        </div>
      </div>

      {/* Interval selector */}
      <div className="mb-4 flex space-x-2">
        {['daily', 'weekly', 'monthly'].map((int) => (
          <button
            key={int}
            onClick={() => setInterval(int)}
            className={`px-3 py-1 rounded-md text-sm ${
              interval === int
                ? 'bg-blue-600 text-white'
                : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
            }`}
          >
            {int === 'daily' ? 'Daily' : int === 'weekly' ? 'Weekly' : 'Monthly'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <CryptoChart 
          symbol={symbol} 
          interval={interval}
          count={interval === 'daily' ? 30 : interval === 'weekly' ? 12 : 6}
          height={300}
        />
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Market Cap</div>
          <div className="text-lg font-medium">{formatLargeNumber(marketCap)}</div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">24h Volume</div>
          <div className="text-lg font-medium">{formatLargeNumber(volume24h)}</div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Circulating Supply</div>
          <div className="text-lg font-medium">{usdQuote.circulating_supply.toLocaleString()}</div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Max Supply</div>
          <div className="text-lg font-medium">{usdQuote.max_supply ? usdQuote.max_supply.toLocaleString() : 'Unlimited'}</div>
        </div>
      </div>

      {/* Price changes */}
      <h3 className="text-lg font-bold mb-3">Price Change</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">1 Hour</div>
          <div className={`text-lg font-medium ${getPriceChangeColorClass(percentChange1h)}`}>
            {formatPercentChange(percentChange1h)}
          </div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">24 Hours</div>
          <div className={`text-lg font-medium ${colorClass24h}`}>
            {formatPercentChange(percentChange24h)}
          </div>
        </div>
        <div className="bg-[#252525] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">7 Days</div>
          <div className={`text-lg font-medium ${getPriceChangeColorClass(percentChange7d)}`}>
            {formatPercentChange(percentChange7d)}
          </div>
        </div>
      </div>
    </div>
  );
} 