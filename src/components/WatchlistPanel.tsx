import React from 'react';
import { Star, StarOff, TrendingUp, TrendingDown } from 'lucide-react';
import { StockData } from '../types/stock';

interface WatchlistPanelProps {
  watchlist: string[];
  stocks: StockData[];
  onToggleWatchlist: (symbol: string) => void;
  onStockSelect: (symbol: string) => void;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  watchlist,
  stocks,
  onToggleWatchlist,
  onStockSelect
}) => {
  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

  if (watchlist.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="text-yellow-500" size={20} />
          <h3 className="text-lg font-bold text-gray-900">My Watchlist</h3>
        </div>
        <div className="text-center py-8">
          <Star className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 mb-2">Your watchlist is empty</p>
          <p className="text-sm text-gray-500">Click the star icon on any stock to add it to your watchlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-500" size={20} />
          <h3 className="text-lg font-bold text-gray-900">My Watchlist</h3>
        </div>
        <span className="text-sm text-gray-600">{watchlist.length} stocks</span>
      </div>
      
      <div className="space-y-3">
        {watchlistStocks.map((stock) => {
          const isPositive = stock.change >= 0;
          return (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onStockSelect(stock.symbol)}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(stock.symbol);
                  }}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <Star size={16} fill="currentColor" />
                </button>
                <div>
                  <div className="font-medium text-gray-900">{stock.symbol}</div>
                  <div className="text-sm text-gray-600 truncate max-w-32">{stock.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {stock.symbol.includes('.NS') || stock.symbol.includes('.BO') 
                    ? `₹${stock.price.toFixed(2)}` 
                    : `$${stock.price.toFixed(2)}`}
                </div>
                <div className={`text-sm flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};