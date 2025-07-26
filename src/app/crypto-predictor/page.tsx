'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CryptoDetail from '@/components/CryptoDetail';
import CryptoChart from '@/components/CryptoChart';
import { searchCryptos, fetchLatestQuotes } from '@/lib/coingecko';
import CryptoIcon from '@/components/CryptoIcon';

export default function CryptoPredictor() {
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get('symbol') || 'BTC';
  
  const [symbol, setSymbol] = useState(initialSymbol);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [showChartPrediction, setShowChartPrediction] = useState(false);
  const [marketStats, setMarketStats] = useState({
    btcPrice: 0,
    ethPrice: 0,
    btcChange: 0,
    ethChange: 0,
    loading: true
  });

  // Fetch market stats for the header
  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        const data = await fetchLatestQuotes(['BTC', 'ETH']);
        setMarketStats({
          btcPrice: data.BTC?.quote?.USD?.price || 0,
          ethPrice: data.ETH?.quote?.USD?.price || 0,
          btcChange: data.BTC?.quote?.USD?.percent_change_24h || 0,
          ethChange: data.ETH?.quote?.USD?.percent_change_24h || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching market stats:', error);
        setMarketStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchMarketStats();
  }, []);

  // Handle search input change
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await searchCryptos(query);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle crypto selection
  const handleSelectCrypto = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setSearchQuery('');
    setSearchResults([]);
    
    // Reset prediction when changing crypto
    setPrediction(null);
  };

  // Generate AI prediction
  const generatePrediction = async () => {
    setPredictionLoading(true);
    
    try {
      // In a real app, this would call an API endpoint with a trained model
      // For demo purposes, we'll simulate a prediction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const randomChange = (Math.random() * 20) - 10; // Random between -10% and +10%
      const direction = randomChange > 0 ? 'up' : 'down';
      const confidence = Math.round(50 + Math.abs(randomChange) * 3); // Higher for more extreme predictions
      
      setPrediction({
        symbol,
        direction,
        percentChange: Math.abs(randomChange).toFixed(2),
        confidence: Math.min(confidence, 95), // Cap at 95%
        timeframe: '7 days',
        factors: [
          'Market sentiment analysis',
          'Technical indicators',
          'Trading volume patterns',
          'Historical price action',
          'Market correlation analysis'
        ]
      });
      
      // Automatically show chart prediction when AI prediction is generated
      setShowChartPrediction(true);
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setPredictionLoading(false);
    }
  };

  // Format price with appropriate decimal places
  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (price >= 1) return price.toLocaleString(undefined, { maximumFractionDigits: 4 });
    return price.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Crypto Price Predictor</h1>
        
        {/* Market stats card replacing the image */}
        <div className="bg-[#252525] rounded-lg border border-[#333] p-3 mt-4 md:mt-0 w-full md:w-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <CryptoIcon symbol="BTC" size={20} className="mr-2" />
              <div>
                <div className="text-xs text-gray-400">Bitcoin</div>
                {marketStats.loading ? (
                  <div className="h-4 bg-[#333] rounded w-16 animate-pulse"></div>
                ) : (
                  <div className="text-sm font-medium flex items-center">
                    ${formatPrice(marketStats.btcPrice)}
                    <span className={`ml-1 text-xs ${marketStats.btcChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketStats.btcChange >= 0 ? '▲' : '▼'} 
                      {Math.abs(marketStats.btcChange).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <CryptoIcon symbol="ETH" size={20} className="mr-2" />
              <div>
                <div className="text-xs text-gray-400">Ethereum</div>
                {marketStats.loading ? (
                  <div className="h-4 bg-[#333] rounded w-16 animate-pulse"></div>
                ) : (
                  <div className="text-sm font-medium flex items-center">
                    ${formatPrice(marketStats.ethPrice)}
                    <span className={`ml-1 text-xs ${marketStats.ethChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketStats.ethChange >= 0 ? '▲' : '▼'} 
                      {Math.abs(marketStats.ethChange).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="mb-8 relative">
        <div className="flex">
          <input
            type="text"
            placeholder="Search for a cryptocurrency..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 bg-[#252525] border border-[#444] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        
        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-[#1e1e1e] border border-[#444] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.symbol}
                className="w-full px-4 py-3 text-left hover:bg-[#333] flex items-center"
                onClick={() => handleSelectCrypto(result.symbol)}
              >
                <CryptoIcon symbol={result.symbol} size={20} className="mr-2" />
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-gray-400">{result.symbol}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Crypto detail and chart */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <CryptoIcon symbol={symbol} size={24} className="mr-2" />
                <h2 className="text-xl font-bold">{symbol} Price Chart</h2>
              </div>
              <div className="flex items-center">
                <label htmlFor="showChartPrediction" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      id="showChartPrediction" 
                      type="checkbox" 
                      className="sr-only" 
                      checked={showChartPrediction}
                      onChange={() => setShowChartPrediction(!showChartPrediction)}
                    />
                    <div className={`block w-10 h-6 rounded-full ${showChartPrediction ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showChartPrediction ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-300">
                    Show 7-Day Prediction
                  </div>
                </label>
              </div>
            </div>
            <CryptoChart 
              symbol={symbol}
              interval="daily"
              count={30}
              height={350}
              showPrediction={showChartPrediction}
            />
            {showChartPrediction && (
              <div className="mt-2 bg-[#252525] p-3 rounded-lg border border-[#333] text-sm text-gray-400">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Disclaimer:</strong> Chart predictions are based on historical patterns and should not be used as financial advice.
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <CryptoDetail symbol={symbol} />
        </div>
        
        {/* Prediction panel */}
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333]">
          <h2 className="text-2xl font-bold mb-4">AI Price Prediction</h2>
          <p className="text-gray-300 mb-6">
            Our advanced AI model analyzes historical data, market trends, and sentiment to predict price movements.
          </p>
          
          {!prediction ? (
            <button
              onClick={generatePrediction}
              disabled={predictionLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold ${
                predictionLoading
                  ? 'bg-blue-800 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {predictionLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Prediction...
                </div>
              ) : (
                'Generate Price Prediction'
              )}
            </button>
          ) : (
            <div>
              <div className="bg-[#252525] p-4 rounded-lg mb-6">
                <div className="text-center mb-4">
                  <p className="text-gray-400">7-Day Prediction for {prediction.symbol}</p>
                  <div className={`text-2xl font-bold ${prediction.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {prediction.direction === 'up' ? '▲' : '▼'} {prediction.percentChange}%
                  </div>
                  <p className="text-gray-400">Confidence: {prediction.confidence}%</p>
                </div>
                
                <div className="w-full bg-[#333] rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${prediction.direction === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="font-bold mb-2">Key Factors:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {prediction.factors.map((factor: string, index: number) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>This prediction is for educational purposes only. Do not make financial decisions based solely on this information.</p>
              </div>
              
              <button
                onClick={() => {
                  setPrediction(null);
                  setShowChartPrediction(false);
                }}
                className="mt-6 w-full py-2 px-4 bg-[#333] hover:bg-[#444] rounded-lg transition-colors"
              >
                Reset Prediction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 