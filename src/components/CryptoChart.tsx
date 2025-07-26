'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
} from 'chart.js';
import { fetchHistoricalData, HistoricalDataPoint } from '@/lib/coingecko';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface CryptoChartProps {
  symbol: string;
  interval?: string;
  count?: number;
  title?: string;
  height?: number;
  className?: string;
  showPrediction?: boolean;
}

export default function CryptoChart({
  symbol,
  interval = 'daily',
  count = 30,
  title = '',
  height = 300,
  className = '',
  showPrediction = false
}: CryptoChartProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<{date: string; price: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchHistoricalData(symbol, interval, count);
        setHistoricalData(data);
        
        // Generate prediction data if enabled
        if (showPrediction) {
          const predictions = generatePredictions(data);
          setPredictionData(predictions);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, interval, count, showPrediction]);

  // Simple function to generate price predictions for the next 7 days
  const generatePredictions = (data: HistoricalDataPoint[]): {date: string; price: number}[] => {
    if (data.length < 7) return [];
    
    // Use the last 7 days to calculate the average daily change
    const lastSevenDays = data.slice(-7);
    let avgDailyChange = 0;
    
    // Calculate average daily percentage change
    for (let i = 1; i < lastSevenDays.length; i++) {
      const prevPrice = lastSevenDays[i-1].price;
      const currentPrice = lastSevenDays[i].price;
      const dailyChange = (currentPrice - prevPrice) / prevPrice;
      avgDailyChange += dailyChange;
    }
    
    avgDailyChange = avgDailyChange / (lastSevenDays.length - 1);
    
    // Add some randomness to the prediction (between 0.5x and 1.5x the average)
    const volatilityFactor = 0.5 + Math.random();
    const predictedDailyChange = avgDailyChange * volatilityFactor;
    
    // Generate predictions for the next 7 days
    const predictions: {date: string; price: number}[] = [];
    let lastPrice = data[data.length - 1].price;
    const lastDate = new Date(data[data.length - 1].timestamp);
    
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      
      // Apply the daily change with some randomness
      const randomFactor = 0.98 + (Math.random() * 0.04); // Between 0.98 and 1.02
      lastPrice = lastPrice * (1 + predictedDailyChange * randomFactor);
      
      predictions.push({
        date: nextDate.toISOString(),
        price: lastPrice
      });
    }
    
    return predictions;
  };

  // Prepare chart data
  const chartData: ChartData<'line'> = {
    labels: [
      ...historicalData.map(item => {
        const date = new Date(item.timestamp);
        return interval === 'daily' 
          ? date.toLocaleDateString([], { month: 'short', day: 'numeric' })
          : interval === 'weekly'
          ? date.toLocaleDateString([], { month: 'short', day: 'numeric' })
          : date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      }),
      ...(showPrediction ? predictionData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }) : [])
    ],
    datasets: [
      {
        label: `${symbol} Price`,
        data: historicalData.map(item => item.price),
        borderColor: '#3b82f6', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      ...(showPrediction && predictionData.length > 0 ? [
        {
          label: `${symbol} Prediction`,
          data: [
            ...Array(historicalData.length).fill(null),
            ...predictionData.map(item => item.price)
          ],
          borderColor: '#10b981', // green-500
          borderDash: [5, 5],
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 4,
        }
      ] : [])
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showPrediction,
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        }
      },
      title: {
        display: !!title,
        text: title,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 700,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#333',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af', // gray-400
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)', // gray-600 with opacity
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af', // gray-400
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
  };

  if (loading && historicalData.length === 0) {
    return (
      <div 
        className={`bg-[#252525] rounded-lg animate-pulse ${className}`}
        style={{ height: `${height}px` }}
      ></div>
    );
  }

  if (error && historicalData.length === 0) {
    return (
      <div 
        className={`bg-[#252525] rounded-lg flex items-center justify-center ${className}`}
        style={{ height: `${height}px` }}
      >
        <p className="text-red-500">Failed to load chart data</p>
      </div>
    );
  }

  return (
    <div 
      className={`bg-[#252525] rounded-lg p-4 ${className}`}
      style={{ height: `${height}px` }}
    >
      <Line data={chartData} options={chartOptions} />
    </div>
  );
} 