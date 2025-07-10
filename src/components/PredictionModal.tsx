import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Brain, Calendar, Target, BarChart3, AlertTriangle } from 'lucide-react';
import { StockData } from '../types/stock';
import { PredictionData, PredictionRequest } from '../types/prediction';
import { mlPredictionService } from '../services/mlPredictionService';
import { LoadingSpinner } from './LoadingSpinner';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockData;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({ isOpen, onClose, stock }) => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<PredictionRequest>({
    symbol: stock.symbol,
    timeframe: '1w',
    model: 'ema'
  });

  if (!isOpen) return null;

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mlPredictionService.predictStock(stock, request);
      setPrediction(result);
    } catch (err) {
      setError('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (stock.symbol.includes('.NS') || stock.symbol.includes('.BO')) {
      return `₹${price.toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (currentPrice: number, predictedPrice: number) => {
    const change = predictedPrice - currentPrice;
    const changePercent = (change / currentPrice) * 100;
    const isPositive = change >= 0;
    
    return {
      change: formatPrice(Math.abs(change)),
      changePercent: Math.abs(changePercent).toFixed(2),
      isPositive
    };
  };

  const modelInfo = mlPredictionService.getModelInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Brain className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Price Prediction</h2>
              <p className="text-gray-600">{stock.name} ({stock.symbol})</p>
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
          {/* Configuration Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Frame
                </label>
                <select
                  value={request.timeframe}
                  onChange={(e) => setRequest({ ...request, timeframe: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1d">1 Day</option>
                  <option value="1w">1 Week</option>
                  <option value="1m">1 Month</option>
                  <option value="3m">3 Months</option>
                  <option value="6m">6 Months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ML Model
                </label>
                <select
                  value={request.model}
                  onChange={(e) => setRequest({ ...request, model: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="linear">Linear Regression</option>
                  <option value="sma">Simple Moving Average</option>
                  <option value="ema">Exponential Moving Average</option>
                  <option value="lstm">Pattern Recognition</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <BarChart3 className="text-blue-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {modelInfo[request.model].name}
                  </p>
                  <p className="text-sm text-blue-700">
                    {modelInfo[request.model].description}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Accuracy: {(modelInfo[request.model].accuracy * 100).toFixed(0)}% • 
                    Best for: {modelInfo[request.model].bestFor}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Target size={20} />
                  <span>Generate Prediction</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-red-600" size={16} />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Prediction Results */}
          {prediction && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Prediction Summary</h3>
                  <div className={`flex items-center space-x-2 ${
                    prediction.trend === 'bullish' ? 'text-green-300' : 
                    prediction.trend === 'bearish' ? 'text-red-300' : 'text-yellow-300'
                  }`}>
                    {prediction.trend === 'bullish' ? <TrendingUp size={20} /> : 
                     prediction.trend === 'bearish' ? <TrendingDown size={20} /> : 
                     <BarChart3 size={20} />}
                    <span className="capitalize font-medium">{prediction.trend}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm opacity-90">Current Price</div>
                    <div className="text-2xl font-bold">{formatPrice(prediction.currentPrice)}</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm opacity-90">Predicted Price</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(prediction.predictions[prediction.predictions.length - 1].price)}
                    </div>
                    {(() => {
                      const { change, changePercent, isPositive } = formatChange(
                        prediction.currentPrice,
                        prediction.predictions[prediction.predictions.length - 1].price
                      );
                      return (
                        <div className={`text-sm ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                          {isPositive ? '+' : '-'}{change} ({changePercent}%)
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm opacity-90">Confidence</div>
                    <div className="text-2xl font-bold">{(prediction.confidence * 100).toFixed(0)}%</div>
                    <div className="text-sm opacity-90">Model Accuracy: {(prediction.accuracy * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              {/* Detailed Predictions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Calendar size={20} />
                  <span>Detailed Forecast</span>
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid gap-3 max-h-64 overflow-y-auto">
                    {prediction.predictions.slice(0, 10).map((pred, index) => {
                      const { change, changePercent, isPositive } = formatChange(prediction.currentPrice, pred.price);
                      
                      return (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-gray-600">
                              {new Date(pred.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(pred.price)}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-xs text-gray-500">
                              Range: {formatPrice(pred.low)} - {formatPrice(pred.high)}
                            </div>
                            <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : '-'}{changePercent}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {(pred.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important Disclaimer</p>
                    <p>
                      These predictions are generated using machine learning models for educational purposes. 
                      Stock market predictions are inherently uncertain and should not be used as the sole basis 
                      for investment decisions. Always consult with financial advisors and conduct your own research.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};