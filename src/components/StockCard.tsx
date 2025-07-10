import React from 'react';
import { TrendingUp, TrendingDown, Star, Brain } from 'lucide-react';
import { StockData } from '../types/stock';
import { PredictionModal } from './PredictionModal';

interface StockCardProps {
  stock: StockData;
  onSelect?: (symbol: string) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (symbol: string) => void;
  showWatchlistButton?: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({ 
  stock, 
  onSelect, 
  isInWatchlist = false, 
  onToggleWatchlist,
  showWatchlistButton = false 
}) => {
  const [showPrediction, setShowPrediction] = React.useState(false);
  const isPositive = stock.change >= 0;
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e5) return `$${(num / 1e5).toFixed(1)}L`; // Lakhs for Indian context
    return `$${num.toLocaleString()}`;
  };

  const formatPrice = (price: number, symbol: string) => {
    // Indian stocks show in INR, US stocks in USD
    if (symbol.includes('.NS') || symbol.includes('.BO')) {
      return `₹${price.toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number, symbol: string) => {
    const prefix = change >= 0 ? '+' : '';
    if (symbol.includes('.NS') || symbol.includes('.BO')) {
      return `${prefix}₹${change.toFixed(2)}`;
    }
    return `${prefix}$${change.toFixed(2)}`;
  };
  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200"
      onClick={() => onSelect?.(stock.symbol)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPrediction(true);
            }}
            className="p-1 rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="AI Price Prediction"
          >
            <Brain size={16} />
          </button>
          {showWatchlistButton && onToggleWatchlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(stock.symbol);
              }}
              className={`p-1 rounded-full transition-colors ${
                isInWatchlist 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <Star size={16} fill={isInWatchlist ? 'currentColor' : 'none'} />
            </button>
          )}
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-medium">{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-2xl font-bold text-gray-900">{formatPrice(stock.price, stock.symbol)}</span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatChange(stock.change, stock.symbol)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Volume</span>
            <p className="font-medium">{(stock.volume / 1e6).toFixed(1)}M</p>
          </div>
          <div>
            <span className="text-gray-500">Market Cap</span>
            <p className="font-medium">{formatNumber(stock.marketCap)}</p>
          </div>
          <div>
            <span className="text-gray-500">High</span>
            <p className="font-medium">{formatPrice(stock.high, stock.symbol)}</p>
          </div>
          <div>
            <span className="text-gray-500">Low</span>
            <p className="font-medium">{formatPrice(stock.low, stock.symbol)}</p>
          </div>
        </div>
      </div>
      
      <PredictionModal
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        stock={stock}
      />
    </div>
  );
};