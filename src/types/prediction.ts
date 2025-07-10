export interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictions: PricePrediction[];
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  accuracy: number;
}

export interface PricePrediction {
  date: string;
  price: number;
  high: number;
  low: number;
  confidence: number;
}

export interface PredictionRequest {
  symbol: string;
  timeframe: '1d' | '1w' | '1m' | '3m' | '6m';
  model: 'linear' | 'sma' | 'ema' | 'lstm';
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}