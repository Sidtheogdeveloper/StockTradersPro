import { PredictionData, PredictionRequest, HistoricalPrice, PricePrediction } from '../types/prediction';
import { StockData } from '../types/stock';

// Simulate historical data generation
const generateHistoricalData = (stock: StockData, days: number): HistoricalPrice[] => {
  const historical: HistoricalPrice[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let currentPrice = stock.previousClose;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate price movement with some volatility
    const volatility = 0.02; // 2% daily volatility
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trend = Math.sin(i / 10) * 0.001; // Add some trend component
    
    currentPrice = currentPrice * (1 + randomChange + trend);
    
    const high = currentPrice * (1 + Math.random() * 0.01);
    const low = currentPrice * (1 - Math.random() * 0.01);
    const open = historical.length > 0 ? historical[historical.length - 1].close : currentPrice;
    
    historical.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  
  return historical;
};

// Simple Moving Average prediction
const smaPredict = (historical: HistoricalPrice[], periods: number): number[] => {
  const prices = historical.map(h => h.close);
  const predictions: number[] = [];
  
  for (let i = 0; i < periods; i++) {
    const window = Math.min(20, prices.length); // 20-day SMA
    const recentPrices = prices.slice(-window);
    const sma = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    
    // Add some trend and volatility
    const trend = (prices[prices.length - 1] - prices[prices.length - 10]) / 10;
    const volatility = Math.random() * 0.01 - 0.005;
    
    const nextPrice = sma + trend + (sma * volatility);
    predictions.push(Number(nextPrice.toFixed(2)));
    prices.push(nextPrice); // Add prediction to price series for next iteration
  }
  
  return predictions;
};

// Exponential Moving Average prediction
const emaPredict = (historical: HistoricalPrice[], periods: number): number[] => {
  const prices = historical.map(h => h.close);
  const alpha = 2 / (12 + 1); // 12-period EMA
  let ema = prices[0];
  
  // Calculate current EMA
  for (let i = 1; i < prices.length; i++) {
    ema = alpha * prices[i] + (1 - alpha) * ema;
  }
  
  const predictions: number[] = [];
  
  for (let i = 0; i < periods; i++) {
    // Project EMA forward with trend and volatility
    const trend = (prices[prices.length - 1] - prices[prices.length - 5]) / 5;
    const volatility = Math.random() * 0.015 - 0.0075;
    
    ema = alpha * (ema + trend + (ema * volatility)) + (1 - alpha) * ema;
    predictions.push(Number(ema.toFixed(2)));
  }
  
  return predictions;
};

// Linear regression prediction
const linearPredict = (historical: HistoricalPrice[], periods: number): number[] => {
  const prices = historical.map(h => h.close);
  const n = prices.length;
  
  // Calculate linear regression
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += prices[i];
    sumXY += i * prices[i];
    sumXX += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const predictions: number[] = [];
  
  for (let i = 0; i < periods; i++) {
    const x = n + i;
    const prediction = slope * x + intercept;
    
    // Add some noise to make it more realistic
    const noise = (Math.random() - 0.5) * prediction * 0.02;
    predictions.push(Number((prediction + noise).toFixed(2)));
  }
  
  return predictions;
};

// Simplified LSTM-like prediction (using pattern recognition)
const lstmPredict = (historical: HistoricalPrice[], periods: number): number[] => {
  const prices = historical.map(h => h.close);
  const sequenceLength = 10;
  
  if (prices.length < sequenceLength) {
    return smaPredict(historical, periods); // Fallback to SMA
  }
  
  // Find similar patterns in historical data
  const lastSequence = prices.slice(-sequenceLength);
  const patterns: number[][] = [];
  
  for (let i = 0; i <= prices.length - sequenceLength - 1; i++) {
    const sequence = prices.slice(i, i + sequenceLength);
    const nextPrice = prices[i + sequenceLength];
    
    // Calculate similarity (correlation)
    const similarity = calculateCorrelation(lastSequence, sequence);
    
    if (similarity > 0.7) { // High similarity threshold
      patterns.push([...sequence, nextPrice]);
    }
  }
  
  const predictions: number[] = [];
  let currentSequence = [...lastSequence];
  
  for (let i = 0; i < periods; i++) {
    if (patterns.length > 0) {
      // Average the next prices from similar patterns
      const nextPrices = patterns.map(pattern => pattern[pattern.length - 1]);
      const avgNextPrice = nextPrices.reduce((sum, price) => sum + price, 0) / nextPrices.length;
      
      // Add trend and volatility
      const recentTrend = (currentSequence[currentSequence.length - 1] - currentSequence[0]) / sequenceLength;
      const volatility = (Math.random() - 0.5) * avgNextPrice * 0.01;
      
      const prediction = avgNextPrice + recentTrend + volatility;
      predictions.push(Number(prediction.toFixed(2)));
      
      // Update sequence for next prediction
      currentSequence = [...currentSequence.slice(1), prediction];
    } else {
      // Fallback to trend-based prediction
      const trend = (currentSequence[currentSequence.length - 1] - currentSequence[0]) / sequenceLength;
      const nextPrice = currentSequence[currentSequence.length - 1] + trend;
      predictions.push(Number(nextPrice.toFixed(2)));
      currentSequence = [...currentSequence.slice(1), nextPrice];
    }
  }
  
  return predictions;
};

// Helper function to calculate correlation
const calculateCorrelation = (arr1: number[], arr2: number[]): number => {
  const n = arr1.length;
  const sum1 = arr1.reduce((a, b) => a + b, 0);
  const sum2 = arr2.reduce((a, b) => a + b, 0);
  const sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
  const pSum = arr1.reduce((a, b, i) => a + b * arr2[i], 0);
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return den === 0 ? 0 : num / den;
};

// Main prediction service
export const mlPredictionService = {
  async predictStock(stock: StockData, request: PredictionRequest): Promise<PredictionData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate historical data
    const historicalDays = request.timeframe === '1d' ? 30 : 
                          request.timeframe === '1w' ? 90 : 
                          request.timeframe === '1m' ? 180 : 
                          request.timeframe === '3m' ? 365 : 730;
    
    const historical = generateHistoricalData(stock, historicalDays);
    
    // Determine prediction periods
    const periods = request.timeframe === '1d' ? 1 : 
                   request.timeframe === '1w' ? 7 : 
                   request.timeframe === '1m' ? 30 : 
                   request.timeframe === '3m' ? 90 : 180;
    
    // Get predictions based on model
    let predictions: number[];
    let confidence: number;
    let accuracy: number;
    
    switch (request.model) {
      case 'linear':
        predictions = linearPredict(historical, periods);
        confidence = 0.65;
        accuracy = 0.72;
        break;
      case 'sma':
        predictions = smaPredict(historical, periods);
        confidence = 0.70;
        accuracy = 0.68;
        break;
      case 'ema':
        predictions = emaPredict(historical, periods);
        confidence = 0.75;
        accuracy = 0.74;
        break;
      case 'lstm':
        predictions = lstmPredict(historical, periods);
        confidence = 0.80;
        accuracy = 0.78;
        break;
      default:
        predictions = smaPredict(historical, periods);
        confidence = 0.70;
        accuracy = 0.68;
    }
    
    // Generate prediction data with confidence intervals
    const predictionData: PricePrediction[] = predictions.map((price, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index + 1);
      
      const confidenceRange = price * 0.05; // 5% confidence range
      
      return {
        date: date.toISOString().split('T')[0],
        price: price,
        high: Number((price + confidenceRange).toFixed(2)),
        low: Number((price - confidenceRange).toFixed(2)),
        confidence: Math.max(0.5, confidence - (index * 0.02)) // Decreasing confidence over time
      };
    });
    
    // Determine trend
    const firstPrice = predictions[0];
    const lastPrice = predictions[predictions.length - 1];
    const priceChange = (lastPrice - stock.price) / stock.price;
    
    const trend = priceChange > 0.02 ? 'bullish' : 
                 priceChange < -0.02 ? 'bearish' : 'neutral';
    
    return {
      symbol: stock.symbol,
      currentPrice: stock.price,
      predictions: predictionData,
      confidence,
      trend,
      accuracy
    };
  },
  
  // Get model information
  getModelInfo() {
    return {
      linear: {
        name: 'Linear Regression',
        description: 'Uses linear trend analysis to predict future prices',
        accuracy: 0.72,
        bestFor: 'Short-term trends'
      },
      sma: {
        name: 'Simple Moving Average',
        description: 'Based on average price over recent periods',
        accuracy: 0.68,
        bestFor: 'Stable markets'
      },
      ema: {
        name: 'Exponential Moving Average',
        description: 'Gives more weight to recent price movements',
        accuracy: 0.74,
        bestFor: 'Trending markets'
      },
      lstm: {
        name: 'Pattern Recognition',
        description: 'Identifies similar historical patterns',
        accuracy: 0.78,
        bestFor: 'Complex market patterns'
      }
    };
  }
};