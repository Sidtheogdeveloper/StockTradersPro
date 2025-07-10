import { useState, useEffect, useCallback } from 'react';
import { StockData, MarketIndex } from '../types/stock';
import { getStockData, getMarketIndices, searchStocks } from '../services/stockApi';

export const useStockData = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [stockData, indicesData] = await Promise.all([
        getStockData(),
        getMarketIndices()
      ]);
      setStocks(stockData);
      setIndices(indicesData);
    } catch (err) {
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchForStocks = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchData();
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const results = await searchStocks(query);
      setStocks(results);
    } catch (err) {
      setError('Failed to search stocks');
    } finally {
      setIsSearching(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    stocks,
    indices,
    loading,
    error,
    isSearching,
    searchForStocks,
    refetch: fetchData
  };
};