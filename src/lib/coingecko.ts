// CoinGecko API utilities
const API_KEY = 'CG-8gimvTUyM2tBe24m7KgEV2gr';
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Define types for API responses
export interface CryptoQuote {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  last_updated: string;
}

export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: CryptoQuote;
  };
}

export interface HistoricalDataPoint {
  timestamp: string;
  price: number;
  volume_24h: number;
  market_cap: number;
}

// CoinGecko specific interfaces
interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: { [key: string]: number };
  market_cap: { [key: string]: number };
  market_cap_rank: number;
  fully_diluted_valuation: { [key: string]: number };
  total_volume: { [key: string]: number };
  high_24h: { [key: string]: number };
  low_24h: { [key: string]: number };
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency: { [key: string]: number };
  price_change_percentage_24h_in_currency: { [key: string]: number };
  price_change_percentage_7d_in_currency: { [key: string]: number };
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: { [key: string]: number };
  ath_change_percentage: { [key: string]: number };
  ath_date: { [key: string]: string };
  atl: { [key: string]: number };
  atl_change_percentage: { [key: string]: number };
  atl_date: { [key: string]: string };
  last_updated: string;
}

interface CoinGeckoHistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

/**
 * Fetch latest cryptocurrency quotes
 */
export async function fetchLatestQuotes(symbols: string[] = ['BTC', 'ETH', 'XRP', 'BNB', 'SOL']): Promise<Record<string, CryptoData>> {
  try {
    // In a real-world scenario, this would be a server-side API call
    // For client-side, we need to use a proxy or serverless function
    const response = await fetch('/api/crypto/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbols }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching crypto quotes:', error);
    
    // For development purposes, return mock data
    return getMockCryptoData(symbols);
  }
}

/**
 * Fetch historical data for a cryptocurrency
 */
export async function fetchHistoricalData(
  symbol: string,
  interval: string = 'daily',
  count: number = 30
): Promise<HistoricalDataPoint[]> {
  try {
    // In a real-world scenario, this would be a server-side API call
    const response = await fetch(`/api/crypto/historical?symbol=${symbol}&interval=${interval}&count=${count}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    
    // For development purposes, return mock data
    return getMockHistoricalData(symbol, count);
  }
}

/**
 * Search for cryptocurrencies
 */
export async function searchCryptos(query: string): Promise<CryptoData[]> {
  try {
    const response = await fetch(`/api/crypto/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    
    // For development purposes, return mock data
    return Object.values(getMockCryptoData(['BTC', 'ETH']));
  }
}

/**
 * Format a price with proper formatting
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format based on price magnitude
  if (numPrice >= 1000) {
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else if (numPrice >= 1) {
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  } else if (numPrice >= 0.01) {
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6
    });
  } else {
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 8
    });
  }
}

/**
 * Format percentage change with proper formatting
 */
export function formatPercentChange(change: number | string): string {
  const numChange = typeof change === 'string' ? parseFloat(change) : change;
  const sign = numChange >= 0 ? '+' : '';
  return `${sign}${numChange.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`;
}

/**
 * Get color class based on price change
 */
export function getPriceChangeColorClass(change: number | string): string {
  const numChange = typeof change === 'string' ? parseFloat(change) : change;
  if (numChange > 0) return 'text-green-500';
  if (numChange < 0) return 'text-red-500';
  return 'text-gray-400';
}

/**
 * Format market cap or volume with proper formatting
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  } else if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  } else {
    return `$${num.toFixed(2)}`;
  }
}

// CoinGecko ID mapping for common symbols
export const symbolToId: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'XRP': 'ripple',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'LINK': 'chainlink',
  'AVAX': 'avalanche-2',
  'UNI': 'uniswap',
  'SHIB': 'shiba-inu',
  'LTC': 'litecoin',
  'ATOM': 'cosmos'
};

// Mock data for development purposes
function getMockCryptoData(symbols: string[]): Record<string, CryptoData> {
  const mockData: Record<string, CryptoData> = {
    BTC: {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      quote: {
        USD: {
          id: 1,
          name: 'Bitcoin',
          symbol: 'BTC',
          slug: 'bitcoin',
          price: 65432.12,
          percent_change_1h: 0.25,
          percent_change_24h: 2.34,
          percent_change_7d: -1.45,
          market_cap: 1278000000000,
          volume_24h: 32500000000,
          circulating_supply: 19500000,
          total_supply: 21000000,
          max_supply: 21000000,
          last_updated: new Date().toISOString()
        }
      }
    },
    ETH: {
      id: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      quote: {
        USD: {
          id: 2,
          name: 'Ethereum',
          symbol: 'ETH',
          slug: 'ethereum',
          price: 3456.78,
          percent_change_1h: -0.12,
          percent_change_24h: 1.56,
          percent_change_7d: 5.67,
          market_cap: 415000000000,
          volume_24h: 15700000000,
          circulating_supply: 120000000,
          total_supply: 120000000,
          max_supply: 0,
          last_updated: new Date().toISOString()
        }
      }
    },
    XRP: {
      id: 3,
      name: 'XRP',
      symbol: 'XRP',
      quote: {
        USD: {
          id: 3,
          name: 'XRP',
          symbol: 'XRP',
          slug: 'xrp',
          price: 0.5678,
          percent_change_1h: 0.34,
          percent_change_24h: -2.45,
          percent_change_7d: 3.21,
          market_cap: 30500000000,
          volume_24h: 1200000000,
          circulating_supply: 53700000000,
          total_supply: 100000000000,
          max_supply: 100000000000,
          last_updated: new Date().toISOString()
        }
      }
    },
    BNB: {
      id: 4,
      name: 'Binance Coin',
      symbol: 'BNB',
      quote: {
        USD: {
          id: 4,
          name: 'Binance Coin',
          symbol: 'BNB',
          slug: 'binance-coin',
          price: 567.89,
          percent_change_1h: 0.56,
          percent_change_24h: 3.45,
          percent_change_7d: 7.89,
          market_cap: 87500000000,
          volume_24h: 2300000000,
          circulating_supply: 154000000,
          total_supply: 166800000,
          max_supply: 166800000,
          last_updated: new Date().toISOString()
        }
      }
    },
    SOL: {
      id: 5,
      name: 'Solana',
      symbol: 'SOL',
      quote: {
        USD: {
          id: 5,
          name: 'Solana',
          symbol: 'SOL',
          slug: 'solana',
          price: 123.45,
          percent_change_1h: -0.78,
          percent_change_24h: 4.56,
          percent_change_7d: 12.34,
          market_cap: 54300000000,
          volume_24h: 2100000000,
          circulating_supply: 440000000,
          total_supply: 535000000,
          max_supply: 0,
          last_updated: new Date().toISOString()
        }
      }
    }
  };
  
  // Return only requested symbols
  return symbols.reduce((acc, symbol) => {
    if (mockData[symbol]) {
      acc[symbol] = mockData[symbol];
    }
    return acc;
  }, {} as Record<string, CryptoData>);
}

function getMockHistoricalData(symbol: string, count: number): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const basePrice = symbol === 'BTC' ? 65000 : 
                    symbol === 'ETH' ? 3400 : 
                    symbol === 'XRP' ? 0.55 : 
                    symbol === 'BNB' ? 560 : 
                    symbol === 'SOL' ? 120 : 100;
  
  const baseVolume = symbol === 'BTC' ? 30000000000 : 
                     symbol === 'ETH' ? 15000000000 : 
                     symbol === 'XRP' ? 1000000000 : 
                     symbol === 'BNB' ? 2000000000 : 
                     symbol === 'SOL' ? 2000000000 : 1000000000;
  
  const baseCap = symbol === 'BTC' ? 1250000000000 : 
                  symbol === 'ETH' ? 410000000000 : 
                  symbol === 'XRP' ? 30000000000 : 
                  symbol === 'BNB' ? 85000000000 : 
                  symbol === 'SOL' ? 53000000000 : 10000000000;
  
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Create some realistic price movement
    const randomFactor = 0.98 + (Math.random() * 0.04); // Between 0.98 and 1.02
    const previousPrice = i === count - 1 ? basePrice : data[count - i - 2].price;
    const price = previousPrice * randomFactor;
    
    // Volume varies day by day
    const volumeFactor = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
    const volume = baseVolume * volumeFactor;
    
    // Market cap follows price
    const marketCap = baseCap * (price / basePrice);
    
    data.push({
      timestamp: date.toISOString(),
      price,
      volume_24h: volume,
      market_cap: marketCap
    });
  }
  
  return data;
} 