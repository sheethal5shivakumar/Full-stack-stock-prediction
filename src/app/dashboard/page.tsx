'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { fetchLatestQuotes, formatPrice, formatLargeNumber, getPriceChangeColorClass } from '@/lib/coingecko';
import CryptoChart from '@/components/CryptoChart';
import CryptoIcon from '@/components/CryptoIcon';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  
  // List of top cryptocurrencies to display
  const cryptoSymbols = ['BTC', 'ETH', 'XRP', 'BNB', 'SOL', 'ADA', 'DOGE', 'DOT', 'MATIC', 'LINK'];

  const fetchCryptoData = async () => {
    try {
      setRefreshing(true);
      const data = await fetchLatestQuotes(cryptoSymbols);
      
      // Convert to array for easier rendering
      const cryptosArray = Object.entries(data).map(([symbol, crypto]) => ({
        symbol,
        name: crypto.name,
        price: crypto.quote.USD.price,
        marketCap: crypto.quote.USD.market_cap,
        volume24h: crypto.quote.USD.volume_24h,
        change1h: crypto.quote.USD.percent_change_1h,
        change24h: crypto.quote.USD.percent_change_24h,
        change7d: crypto.quote.USD.percent_change_7d,
        circulatingSupply: crypto.quote.USD.circulating_supply,
      }));
      
      // Sort by market cap
      cryptosArray.sort((a, b) => b.marketCap - a.marketCap);
      
      setCryptos(cryptosArray);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    
    // Refresh data every 30 seconds for more real-time updates
    const intervalId = setInterval(fetchCryptoData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Get change value based on selected timeframe
  const getChangeValue = (crypto: any) => {
    switch (selectedTimeframe) {
      case '1h': return crypto.change1h;
      case '7d': return crypto.change7d;
      default: return crypto.change24h;
    }
  };

  // Calculate total market cap
  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0);
  
  // Calculate total 24h volume
  const total24hVolume = cryptos.reduce((sum, crypto) => sum + crypto.volume24h, 0);

  // Format the last updated time using native JavaScript
  const formattedLastUpdated = lastUpdated 
    ? lastUpdated.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Never';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Crypto Market Overview</h1>
        
        <div className="mt-2 md:mt-0 flex items-center">
          <div className="text-sm text-gray-400 mr-4">
            Last updated: {formattedLastUpdated}
            {refreshing && <span className="ml-2 inline-block animate-spin">⟳</span>}
          </div>
          <button 
            onClick={fetchCryptoData}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {/* Market summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333]">
          <div className="text-gray-400 text-sm mb-1">Total Market Cap</div>
          <div className="text-2xl font-bold">{formatLargeNumber(totalMarketCap)}</div>
        </div>
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333]">
          <div className="text-gray-400 text-sm mb-1">24h Trading Volume</div>
          <div className="text-2xl font-bold">{formatLargeNumber(total24hVolume)}</div>
        </div>
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333]">
          <div className="text-gray-400 text-sm mb-1">BTC Dominance</div>
          <div className="text-2xl font-bold">
            {totalMarketCap > 0 && cryptos.length > 0 
              ? ((cryptos.find(c => c.symbol === 'BTC')?.marketCap || 0) / totalMarketCap * 100).toFixed(2) + '%'
              : '0.00%'
            }
          </div>
        </div>
      </div>
      
      {/* Featured chart */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex items-center">
            <CryptoIcon symbol="BTC" size={24} className="mr-2" />
            <h2 className="text-xl font-bold">Bitcoin Price Chart</h2>
          </div>
          <div className="flex flex-wrap mt-2 md:mt-0">
            <div className="flex items-center mr-4">
              <label htmlFor="showPrediction" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    id="showPrediction" 
                    type="checkbox" 
                    className="sr-only" 
                    checked={showPrediction}
                    onChange={() => setShowPrediction(!showPrediction)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${showPrediction ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showPrediction ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-2 text-sm font-medium text-gray-300">
                  Show 7-Day Prediction
                </div>
              </label>
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <button 
                onClick={() => setSelectedTimeframe('24h')}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedTimeframe === '24h' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
                }`}
              >
                24H
              </button>
              <button 
                onClick={() => setSelectedTimeframe('7d')}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedTimeframe === '7d' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
                }`}
              >
                7D
              </button>
            </div>
          </div>
        </div>
        <CryptoChart 
          symbol="BTC" 
          interval={selectedTimeframe === '24h' ? 'daily' : 'weekly'} 
          count={selectedTimeframe === '24h' ? 30 : 12}
          height={400}
          showPrediction={showPrediction}
        />
        {showPrediction && (
          <div className="mt-2 bg-[#252525] p-3 rounded-lg border border-[#333] text-sm text-gray-400">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <strong>Disclaimer:</strong> Predictions are based on historical patterns and should not be used as financial advice. 
                The prediction algorithm uses a simple moving average with randomness and does not account for market events, news, or other factors.
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Cryptocurrency table */}
      <h2 className="text-xl font-bold mb-4">Top Cryptocurrencies</h2>
      
      {/* Timeframe selector for table */}
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => setSelectedTimeframe('1h')}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedTimeframe === '1h' 
              ? 'bg-blue-600 text-white' 
              : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
          }`}
        >
          1H
        </button>
        <button 
          onClick={() => setSelectedTimeframe('24h')}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedTimeframe === '24h' 
              ? 'bg-blue-600 text-white' 
              : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
          }`}
        >
          24H
        </button>
        <button 
          onClick={() => setSelectedTimeframe('7d')}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedTimeframe === '7d' 
              ? 'bg-blue-600 text-white' 
              : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
          }`}
        >
          7D
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-[#1e1e1e] rounded-lg border border-[#333] overflow-hidden">
          <thead className="bg-[#252525]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                {selectedTimeframe === '1h' ? '1h %' : selectedTimeframe === '24h' ? '24h %' : '7d %'}
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 hidden md:table-cell">Market Cap</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 hidden md:table-cell">Volume (24h)</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-300 hidden lg:table-cell">Circulating Supply</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {loading ? (
              // Loading placeholders
              Array(10).fill(0).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 bg-[#333] rounded w-4"></div></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-6 w-6 bg-[#333] rounded-full mr-2"></div>
                      <div className="h-4 bg-[#333] rounded w-32"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right"><div className="h-4 bg-[#333] rounded w-20 ml-auto"></div></td>
                  <td className="px-4 py-4 text-right"><div className="h-4 bg-[#333] rounded w-16 ml-auto"></div></td>
                  <td className="px-4 py-4 text-right hidden md:table-cell"><div className="h-4 bg-[#333] rounded w-24 ml-auto"></div></td>
                  <td className="px-4 py-4 text-right hidden md:table-cell"><div className="h-4 bg-[#333] rounded w-24 ml-auto"></div></td>
                  <td className="px-4 py-4 text-right hidden lg:table-cell"><div className="h-4 bg-[#333] rounded w-28 ml-auto"></div></td>
                </tr>
              ))
            ) : (
              cryptos.map((crypto, index) => {
                const changeValue = getChangeValue(crypto);
                const changeColorClass = getPriceChangeColorClass(changeValue);
                
                return (
                  <tr key={crypto.symbol} className="hover:bg-[#252525] transition-colors">
                    <td className="px-4 py-4 text-sm">{index + 1}</td>
                    <td className="px-4 py-4">
                      <Link href={`/crypto-predictor?symbol=${crypto.symbol}`} className="flex items-center">
                        <CryptoIcon symbol={crypto.symbol} size={24} className="mr-2" />
                        <div>
                          <span className="font-medium">{crypto.symbol}</span>
                          <span className="ml-2 text-sm text-gray-400">{crypto.name}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-right font-medium">${formatPrice(crypto.price)}</td>
                    <td className={`px-4 py-4 text-right font-medium ${changeColorClass}`}>
                      {changeValue > 0 ? '+' : ''}{changeValue.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-right text-gray-300 hidden md:table-cell">{formatLargeNumber(crypto.marketCap)}</td>
                    <td className="px-4 py-4 text-right text-gray-300 hidden md:table-cell">{formatLargeNumber(crypto.volume24h)}</td>
                    <td className="px-4 py-4 text-right text-gray-300 hidden lg:table-cell">
                      {crypto.circulatingSupply ? crypto.circulatingSupply.toLocaleString() : 'N/A'} {crypto.symbol}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Real-time update notice */}
      <div className="mt-4 text-sm text-gray-400 text-center">
        Data automatically refreshes every 30 seconds. Click the refresh button for immediate updates.
      </div>
    </div>
  );
}
