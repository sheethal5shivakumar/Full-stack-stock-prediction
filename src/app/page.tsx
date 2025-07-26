'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CryptoTicker from '@/components/CryptoTicker';
import CryptoIcon from '@/components/CryptoIcon';
import { fetchLatestQuotes, formatPrice, getPriceChangeColorClass } from '@/lib/coinmarketcap';

export default function Home() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [popularCryptos, setPopularCryptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cryptoSymbols = ["BTC", "ETH", "XRP", "BNB", "SOL"];

  useEffect(() => {
    setMounted(true);

    // Fetch popular cryptos data
    const fetchCryptos = async () => {
      try {
        const data = await fetchLatestQuotes(cryptoSymbols);
        
        // Convert to array and add symbol
        const cryptosArray = Object.entries(data).map(([symbol, crypto]) => ({
          symbol,
          name: crypto.name,
          price: crypto.quote.USD.price,
          change: crypto.quote.USD.percent_change_24h
        }));
        
        setPopularCryptos(cryptosArray);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  // Only render client-side to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Crypto ticker */}
      <div className="mb-8">
        <CryptoTicker symbols={cryptoSymbols} />
      </div>
      
      {/* Hero section */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI-Powered Crypto Research Made <span className="text-green-500">Simple</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Our platform combines advanced AI technology with comprehensive market data to help you make smarter cryptocurrency investment decisions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/crypto-predictor" className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg">
              Try AI Predictor 
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/dashboard" className="inline-flex items-center px-6 py-3 bg-[#333] hover:bg-[#444] text-white font-medium rounded-lg transition-colors border border-[#444]">
              Crypto Explorer
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute inset-0 bg-blue-600 bg-opacity-20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular cryptocurrencies section */}
      <h2 className="text-2xl font-bold mb-6">Popular Cryptocurrencies:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {loading ? (
          // Loading placeholders
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="bg-[#1e1e1e] p-4 rounded-lg border border-[#333] animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-[#333] rounded w-20"></div>
                <div className="h-6 bg-[#333] rounded w-16"></div>
              </div>
              <div className="h-8 bg-[#333] rounded w-24 mt-2"></div>
            </div>
          ))
        ) : (
          popularCryptos.map((crypto) => {
            const colorClass = getPriceChangeColorClass(crypto.change);
            return (
              <Link 
                href={`/crypto-predictor?symbol=${crypto.symbol}`}
                key={crypto.symbol} 
                className="bg-[#1e1e1e] p-4 rounded-lg border border-[#333] hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CryptoIcon symbol={crypto.symbol} size={24} className="mr-2" />
                    <h3 className="font-bold">{crypto.symbol}</h3>
                  </div>
                  <span className={`${colorClass}`}>{crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%</span>
                </div>
                <p className="text-xl font-semibold mt-1">${formatPrice(crypto.price)}</p>
                <p className="text-gray-400 text-sm mt-1">{crypto.name}</p>
              </Link>
            );
          })
        )}
      </div>
      
      {/* Features section */}
      <h2 className="text-2xl font-bold mb-6">Platform Features:</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333]">
          <div className="bg-blue-600 bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">AI Price Predictions</h3>
          <p className="text-gray-300">Our advanced AI models analyze historical data and market trends to provide price predictions for cryptocurrencies.</p>
        </div>
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333]">
          <div className="bg-green-600 bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Portfolio Tracking</h3>
          <p className="text-gray-300">Track your cryptocurrency portfolio performance with real-time updates and personalized insights.</p>
        </div>
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333]">
          <div className="bg-purple-600 bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Market Insights</h3>
          <p className="text-gray-300">Get expert analysis and market insights to help you make informed investment decisions.</p>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold mb-2">Ready to start investing smarter?</h2>
            <p className="text-lg opacity-90">Join thousands of investors using AI to gain an edge in the market.</p>
          </div>
          <div className="flex space-x-4">
            {!session ? (
              <>
                <Link href="/register" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Sign Up Free
                </Link>
                <Link href="/login" className="px-6 py-3 bg-transparent border border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  Login
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Calendar links */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/economic-calendar" className="inline-flex items-center px-6 py-3 bg-[#1e1e1e] hover:bg-[#333] text-white font-medium rounded-full transition-colors border border-[#333]">
          Economic Calendar
        </Link>
        <Link href="/earnings-calendar" className="inline-flex items-center px-6 py-3 bg-[#1e1e1e] hover:bg-[#333] text-white font-medium rounded-full transition-colors border border-[#333]">
          Earnings Calendar
        </Link>
      </div>
    </div>
  );
}
