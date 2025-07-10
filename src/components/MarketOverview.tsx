import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { MarketIndex } from '../types/stock';

interface MarketOverviewProps {
  indices: MarketIndex[];
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ indices }) => {
  return (
    <div className="bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center space-x-2 mb-4">
        <Activity size={24} />
        <h2 className="text-xl font-bold">Global Market Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div key={index.symbol} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{index.name}</span>
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span className="text-xs">{isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%</span>
                </div>
              </div>
              <div className="text-lg font-bold">
                {index.symbol.includes('NIFTY') || index.symbol === 'SENSEX' || index.symbol === 'BANKNIFTY' 
                  ? index.price.toFixed(2) 
                  : `$${index.price.toFixed(2)}`}
              </div>
              <div className={`text-sm ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                {isPositive ? '+' : ''}{index.change.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};