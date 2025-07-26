import { NextRequest, NextResponse } from 'next/server';

const CG_API_KEY = 'CG-8gimvTUyM2tBe24m7KgEV2gr';
const CG_BASE_URL = 'https://api.coingecko.com/api/v3';

interface CryptoQuote {
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

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: CryptoQuote;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Search query must be at least 2 characters',
      }, { status: 400 });
    }
    
    // Call CoinGecko API
    const url = new URL(`${CG_BASE_URL}/search`);
    url.searchParams.append('query', query);
    
    const response = await fetch(url.toString(), {
      headers: {
        'x-cg-demo-api-key': CG_API_KEY
      }
    });
    
    if (!response.ok) {
      console.error('CoinGecko API error:', response.status, await response.text());
      // Fallback to mock data if API fails
      const mockData = searchMockCryptoData(query);
      return NextResponse.json({ 
        status: 'success',
        data: mockData
      });
    }
    
    const coinGeckoData = await response.json();
    const coins = coinGeckoData.coins || [];
    
    // We need to get additional data for these coins
    // For simplicity, we'll just return the basic data and mock the rest
    const formattedData: CryptoData[] = coins.slice(0, 10).map((coin: any) => {
      return {
        id: coin.market_cap_rank || 0,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        quote: {
          USD: {
            id: coin.market_cap_rank || 0,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            slug: coin.id,
            price: 0, // We don't have price data from the search endpoint
            percent_change_1h: 0,
            percent_change_24h: 0,
            percent_change_7d: 0,
            market_cap: 0,
            volume_24h: 0,
            circulating_supply: 0,
            total_supply: 0,
            max_supply: 0,
            last_updated: new Date().toISOString()
          }
        }
      };
    });
    
    // If we have coin IDs, we could make a second call to get market data
    // But for simplicity, we'll just return the basic data
    return NextResponse.json({ 
      status: 'success',
      data: formattedData
    });
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    
    // Fallback to mock data
    const query = request.nextUrl.searchParams.get('query') || '';
    const mockData = searchMockCryptoData(query);
    
    return NextResponse.json({ 
      status: 'success',
      data: mockData
    });
  }
}

function searchMockCryptoData(query: string): CryptoData[] {
  const allCryptos: Record<string, CryptoData> = {
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
    },
    ADA: {
      id: 6,
      name: 'Cardano',
      symbol: 'ADA',
      quote: {
        USD: {
          id: 6,
          name: 'Cardano',
          symbol: 'ADA',
          slug: 'cardano',
          price: 0.45,
          percent_change_1h: 0.12,
          percent_change_24h: -1.23,
          percent_change_7d: 2.34,
          market_cap: 16000000000,
          volume_24h: 450000000,
          circulating_supply: 35000000000,
          total_supply: 45000000000,
          max_supply: 45000000000,
          last_updated: new Date().toISOString()
        }
      }
    },
    DOGE: {
      id: 7,
      name: 'Dogecoin',
      symbol: 'DOGE',
      quote: {
        USD: {
          id: 7,
          name: 'Dogecoin',
          symbol: 'DOGE',
          slug: 'dogecoin',
          price: 0.12,
          percent_change_1h: 0.45,
          percent_change_24h: 5.67,
          percent_change_7d: -3.21,
          market_cap: 17000000000,
          volume_24h: 800000000,
          circulating_supply: 140000000000,
          total_supply: 140000000000,
          max_supply: 0,
          last_updated: new Date().toISOString()
        }
      }
    }
  };
  
  // Simple search implementation
  const lowerQuery = query.toLowerCase();
  return Object.values(allCryptos).filter(crypto => 
    crypto.symbol.toLowerCase().includes(lowerQuery) || 
    crypto.name.toLowerCase().includes(lowerQuery)
  );
} 