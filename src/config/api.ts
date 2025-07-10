// API Configuration
// To use real data, sign up at https://www.alphavantage.co/support/#api-key
// and replace 'demo' with your actual API key

export const API_CONFIG = {
  // Replace 'demo' with your Alpha Vantage API key
  ALPHA_VANTAGE_API_KEY: 'demo',
  ALPHA_VANTAGE_BASE_URL: 'https://www.alphavantage.co/query',
  
  // Set to true to use real API data, false for demo data
  USE_REAL_DATA: false,
  
  // Rate limiting (Alpha Vantage free tier: 25 requests per day, 5 per minute)
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 5,
    REQUESTS_PER_DAY: 25
  }
};

// API endpoints
export const API_ENDPOINTS = {
  QUOTE: 'GLOBAL_QUOTE',
  INTRADAY: 'TIME_SERIES_INTRADAY',
  DAILY: 'TIME_SERIES_DAILY',
  SEARCH: 'SYMBOL_SEARCH'
};

// Stock symbol mappings for different markets
export const SYMBOL_MAPPINGS = {
  // Indian stocks (NSE)
  'TCS': 'TCS.BSE',
  'INFY': 'INFY.BSE',
  'RELIANCE': 'RELIANCE.BSE',
  'HDFCBANK': 'HDFCBANK.BSE',
  'ICICIBANK': 'ICICIBANK.BSE',
  'SBIN': 'SBIN.BSE',
  'ITC': 'ITC.BSE',
  'HINDUNILVR': 'HINDUNILVR.BSE',
  'BHARTIARTL': 'BHARTIARTL.BSE',
  'KOTAKBANK': 'KOTAKBANK.BSE',
  
  // US stocks (already in correct format)
  'AAPL': 'AAPL',
  'GOOGL': 'GOOGL',
  'MSFT': 'MSFT',
  'TSLA': 'TSLA',
  'NVDA': 'NVDA'
};