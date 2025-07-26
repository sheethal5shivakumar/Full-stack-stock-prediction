declare module './CryptoChart' {
  import { ReactNode } from 'react';

  export interface CryptoChartProps {
    symbol: string;
    interval?: string;
    count?: number;
    title?: string;
    height?: number;
    className?: string;
    showPrediction?: boolean;
  }

  export default function CryptoChart(props: CryptoChartProps): ReactNode;
} 