'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-[#1a1a1a] to-[#121212]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our AI Crypto Research Platform</h1>
            <p className="text-gray-400 text-lg mb-8">
              We combine advanced machine learning with comprehensive market data to help crypto investors make more informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-[#1e1e1e] rounded-lg border border-[#333] p-4 shadow-xl">
                <div className="bg-[#252525] rounded-md h-[400px] w-full relative overflow-hidden">
                  <Image 
                    src="/images/crypto-assets-new-technologies-can-help-combat-amlcft.webp"
                    alt="Cryptocurrency Technologies"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-400 mb-4">
                Our mission is to democratize access to advanced cryptocurrency analysis tools that were previously available only to institutional investors and whale traders. We believe that by leveraging the power of artificial intelligence and machine learning, we can level the playing field for retail crypto investors.
              </p>
              <p className="text-gray-400 mb-6">
                We're committed to providing accurate, transparent, and actionable insights that help you navigate the volatile crypto markets and make better investment decisions, regardless of your experience level or portfolio size.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#252525] p-4 rounded-lg">
                  <div className="text-green-500 font-bold text-2xl mb-1">92%</div>
                  <div className="text-sm text-gray-400">Accuracy in trend predictions</div>
                </div>
                <div className="bg-[#252525] p-4 rounded-lg">
                  <div className="text-green-500 font-bold text-2xl mb-1">65K+</div>
                  <div className="text-sm text-gray-400">Active users worldwide</div>
                </div>
                <div className="bg-[#252525] p-4 rounded-lg">
                  <div className="text-green-500 font-bold text-2xl mb-1">8M+</div>
                  <div className="text-sm text-gray-400">Predictions generated</div>
                </div>
                <div className="bg-[#252525] p-4 rounded-lg">
                  <div className="text-green-500 font-bold text-2xl mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Real-time market analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Technology */}
      <section className="py-16 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
            <p className="text-gray-400">
              Our platform leverages cutting-edge AI and machine learning technologies to analyze cryptocurrency market data and generate accurate predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333] hover:border-blue-500 transition-all">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Neural Networks</h3>
              <p className="text-gray-400">
                Our custom neural network architecture is specifically designed for time series forecasting and pattern recognition in highly volatile cryptocurrency markets.
              </p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333] hover:border-blue-500 transition-all">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-gray-400">
                We process millions of data points daily, including price movements, trading volumes, on-chain metrics, exchange flows, news sentiment, and social media trends.
              </p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333] hover:border-blue-500 transition-all">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Predictive Models</h3>
              <p className="text-gray-400">
                Our models are continuously trained and validated on historical crypto market data to ensure the highest possible accuracy in various market conditions, from bull runs to bear markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">
              Our platform makes it easy to get started with AI-powered cryptocurrency analysis and predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333] relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-lg font-bold mb-3 mt-2">Search</h3>
              <p className="text-gray-400 text-sm">
                Enter a cryptocurrency symbol or name to access our comprehensive database of market information and historical data.
              </p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333] relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-lg font-bold mb-3 mt-2">Analyze</h3>
              <p className="text-gray-400 text-sm">
                Our AI analyzes historical data, market trends, on-chain metrics, and various technical indicators to identify patterns.
              </p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333] relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-lg font-bold mb-3 mt-2">Predict</h3>
              <p className="text-gray-400 text-sm">
                Our neural network generates price predictions and trend forecasts based on the analyzed data, accounting for crypto market volatility.
              </p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333] relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <h3 className="text-lg font-bold mb-3 mt-2">Decide</h3>
              <p className="text-gray-400 text-sm">
                Use our actionable insights and visualizations to make more informed cryptocurrency investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Try Our AI Crypto Predictor?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start making data-driven cryptocurrency investment decisions with our advanced AI tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/crypto-predictor" className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300">
              Try It Now
            </Link>
            <Link href="/register" className="bg-transparent hover:bg-white/10 text-white border border-white font-medium py-3 px-8 rounded-lg transition duration-300">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}