import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign, Activity, Volume2, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { StockData, HistoricalPrice } from '../types/stock';
import { LoadingSpinner } from './LoadingSpinner';
import { API_CONFIG } from '../config/api';
import { alphaVantageService } from '../services/alphaVantageApi';

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockData;
}

// Generate realistic historical data
const generateHistoricalData = (stock: StockData, days: number): HistoricalPrice[] => {
  const historical: HistoricalPrice[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let currentPrice = stock.previousClose;
  const baseVolatility = 0.02; // 2% base volatility
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Create more realistic price movements
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (!isWeekend) {
      // Market trends and cycles
      const longTermTrend = Math.sin(i / 30) * 0.001; // Monthly cycle
      const shortTermTrend = Math.sin(i / 5) * 0.005; // Weekly cycle
      const randomWalk = (Math.random() - 0.5) * 2 * baseVolatility;
      
      // News events simulation (random spikes)
      const newsEvent = Math.random() < 0.05 ? (Math.random() - 0.5) * 0.1 : 0;
      
      const totalChange = longTermTrend + shortTermTrend + randomWalk + newsEvent;
      currentPrice = currentPrice * (1 + totalChange);
      
      // Ensure price doesn't go negative
      currentPrice = Math.max(currentPrice, stock.price * 0.1);
      
      const volatility = baseVolatility * currentPrice;
      const high = currentPrice * (1 + Math.random() * 0.02);
      const low = currentPrice * (1 - Math.random() * 0.02);
      const open = historical.length > 0 ? historical[historical.length - 1].close : currentPrice;
      
      historical.push({
        date: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 2000000) + 500000,
        formattedDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
  }
  
  return historical;
};

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ isOpen, onClose, stock }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '2Y'>('3M');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      
      const fetchHistoricalData = async () => {
        try {
          // Check if we should use real API data
          if (API_CONFIG.USE_REAL_DATA && API_CONFIG.ALPHA_VANTAGE_API_KEY !== 'demo') {
            const realData = await alphaVantageService.getHistoricalData(stock.symbol);
            if (realData.length > 0) {
              // Filter data based on timeframe
              const days = timeframe === '1M' ? 30 : 
                          timeframe === '3M' ? 90 : 
                          timeframe === '6M' ? 180 : 
                          timeframe === '1Y' ? 365 : 730;
              
              const filteredData = realData.slice(-days);
              setHistoricalData(filteredData);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Failed to fetch real historical data:', error);
        }
        
        // Fall back to demo data
        const days = timeframe === '1M' ? 30 : 
                    timeframe === '3M' ? 90 : 
                    timeframe === '6M' ? 180 : 
                    timeframe === '1Y' ? 365 : 730;
        
        const data = generateHistoricalData(stock, days);
        setHistoricalData(data);
        setLoading(false);
      };
      
      fetchHistoricalData();
    }
  }, [isOpen, stock, timeframe]);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    if (stock.symbol.includes('.NS') || stock.symbol.includes('.BO')) {
      return `₹${price.toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(1)}M`;
    return marketCap.toString();
  };

  const isPositive = stock.change >= 0;
  const chartColor = isPositive ? '#10B981' : '#EF4444';
  
  // Calculate price range for the period
  const prices = historicalData.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const rangePercent = ((priceRange / minPrice) * 100).toFixed(2);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-sm"><span className="text-gray-500">Open:</span> <span className="font-medium">{formatPrice(data.open)}</span></p>
            <p className="text-sm"><span className="text-gray-500">High:</span> <span className="font-medium text-green-600">{formatPrice(data.high)}</span></p>
            <p className="text-sm"><span className="text-gray-500">Low:</span> <span className="font-medium text-red-600">{formatPrice(data.low)}</span></p>
            <p className="text-sm"><span className="text-gray-500">Close:</span> <span className="font-medium">{formatPrice(data.close)}</span></p>
            <p className="text-sm"><span className="text-gray-500">Volume:</span> <span className="font-medium">{formatVolume(data.volume)}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{stock.symbol}</h2>
              <p className="text-gray-600">{stock.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Current Price Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm opacity-90">Current Price</div>
                <div className="text-3xl font-bold">{formatPrice(stock.price)}</div>
                <div className={`flex items-center space-x-1 mt-1 ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{isPositive ? '+' : ''}{formatPrice(stock.change)} ({stock.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm opacity-90">Market Cap</div>
                <div className="text-xl font-bold">{formatMarketCap(stock.marketCap)}</div>
                <div className="text-sm opacity-75">Total Value</div>
              </div>
              
              <div>
                <div className="text-sm opacity-90">Volume</div>
                <div className="text-xl font-bold">{formatVolume(stock.volume)}</div>
                <div className="text-sm opacity-75">Shares Traded</div>
              </div>
              
              <div>
                <div className="text-sm opacity-90">Day Range</div>
                <div className="text-xl font-bold">{formatPrice(stock.low)} - {formatPrice(stock.high)}</div>
                <div className="text-sm opacity-75">Today's Range</div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Activity className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Price History</h3>
              </div>
              
              <div className="flex space-x-2">
                {(['1M', '3M', '6M', '1Y', '2Y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeframe === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="formattedDate" 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={chartColor}
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {!loading && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-600">Period High</div>
                  <div className="font-bold text-green-600">{formatPrice(maxPrice)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-600">Period Low</div>
                  <div className="font-bold text-red-600">{formatPrice(minPrice)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-600">Range</div>
                  <div className="font-bold text-gray-900">{rangePercent}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="text-green-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Open Price</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(stock.open)}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="text-blue-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Previous Close</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(stock.previousClose)}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="text-green-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Day High</span>
              </div>
              <div className="text-xl font-bold text-green-600">{formatPrice(stock.high)}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="text-red-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Day Low</span>
              </div>
              <div className="text-xl font-bold text-red-600">{formatPrice(stock.low)}</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Calendar className="text-yellow-600 mt-0.5" size={16} />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Historical Data Notice</p>
                <p>
                  The historical price data shown is simulated for demonstration purposes. 
                  In a production environment, this would be replaced with real market data from financial APIs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};