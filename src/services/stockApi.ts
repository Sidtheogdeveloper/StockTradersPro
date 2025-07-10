import { StockData, MarketIndex } from '../types/stock';
import { API_CONFIG } from '../config/api';
import { alphaVantageService } from './alphaVantageApi';

// Comprehensive Indian stock data from NSE and BSE
const indianStocks: StockData[] = [
  // IT Sector
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services',
    price: 3542.75,
    change: 45.20,
    changePercent: 1.29,
    volume: 2345678,
    marketCap: 12850000000000,
    high: 3565.00,
    low: 3520.30,
    open: 3530.00,
    previousClose: 3497.55
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys Limited',
    price: 1456.80,
    change: -12.45,
    changePercent: -0.85,
    volume: 3456789,
    marketCap: 6020000000000,
    high: 1475.20,
    low: 1445.60,
    open: 1469.25,
    previousClose: 1469.25
  },
  {
    symbol: 'WIPRO.NS',
    name: 'Wipro Limited',
    price: 425.60,
    change: 8.30,
    changePercent: 1.99,
    volume: 4567890,
    marketCap: 2340000000000,
    high: 428.90,
    low: 420.15,
    open: 422.00,
    previousClose: 417.30
  },
  {
    symbol: 'HCLTECH.NS',
    name: 'HCL Technologies',
    price: 1234.50,
    change: 15.75,
    changePercent: 1.29,
    volume: 1234567,
    marketCap: 3350000000000,
    high: 1245.80,
    low: 1225.40,
    open: 1230.00,
    previousClose: 1218.75
  },
  {
    symbol: 'TECHM.NS',
    name: 'Tech Mahindra',
    price: 1089.25,
    change: -18.60,
    changePercent: -1.68,
    volume: 2345678,
    marketCap: 1070000000000,
    high: 1112.30,
    low: 1085.70,
    open: 1107.85,
    previousClose: 1107.85
  },

  // Banking & Financial Services
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank Limited',
    price: 1642.30,
    change: 22.85,
    changePercent: 1.41,
    volume: 5678901,
    marketCap: 12450000000000,
    high: 1655.20,
    low: 1635.40,
    open: 1640.00,
    previousClose: 1619.45
  },
  {
    symbol: 'ICICIBANK.NS',
    name: 'ICICI Bank Limited',
    price: 978.45,
    change: -8.75,
    changePercent: -0.89,
    volume: 6789012,
    marketCap: 6850000000000,
    high: 992.60,
    low: 975.20,
    open: 987.20,
    previousClose: 987.20
  },
  {
    symbol: 'SBIN.NS',
    name: 'State Bank of India',
    price: 567.80,
    change: 12.40,
    changePercent: 2.23,
    volume: 7890123,
    marketCap: 5070000000000,
    high: 572.90,
    low: 560.15,
    open: 562.00,
    previousClose: 555.40
  },
  {
    symbol: 'AXISBANK.NS',
    name: 'Axis Bank Limited',
    price: 1045.60,
    change: -15.30,
    changePercent: -1.44,
    volume: 4567890,
    marketCap: 3200000000000,
    high: 1065.80,
    low: 1042.20,
    open: 1060.90,
    previousClose: 1060.90
  },
  {
    symbol: 'KOTAKBANK.NS',
    name: 'Kotak Mahindra Bank',
    price: 1789.25,
    change: 28.70,
    changePercent: 1.63,
    volume: 2345678,
    marketCap: 3550000000000,
    high: 1798.40,
    low: 1775.60,
    open: 1780.00,
    previousClose: 1760.55
  },

  // Oil & Gas
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    price: 2456.75,
    change: 35.20,
    changePercent: 1.45,
    volume: 8901234,
    marketCap: 16600000000000,
    high: 2475.30,
    low: 2440.80,
    open: 2445.00,
    previousClose: 2421.55
  },
  {
    symbol: 'ONGC.NS',
    name: 'Oil & Natural Gas Corp',
    price: 189.45,
    change: -2.85,
    changePercent: -1.48,
    volume: 9012345,
    marketCap: 2380000000000,
    high: 194.20,
    low: 187.60,
    open: 192.30,
    previousClose: 192.30
  },
  {
    symbol: 'IOC.NS',
    name: 'Indian Oil Corporation',
    price: 98.75,
    change: 1.45,
    changePercent: 1.49,
    volume: 5678901,
    marketCap: 1400000000000,
    high: 99.80,
    low: 97.20,
    open: 97.80,
    previousClose: 97.30
  },

  // Automobiles
  {
    symbol: 'MARUTI.NS',
    name: 'Maruti Suzuki India',
    price: 10245.60,
    change: 125.80,
    changePercent: 1.24,
    volume: 1234567,
    marketCap: 3100000000000,
    high: 10285.40,
    low: 10180.20,
    open: 10200.00,
    previousClose: 10119.80
  },
  {
    symbol: 'TATAMOTORS.NS',
    name: 'Tata Motors Limited',
    price: 567.30,
    change: -8.95,
    changePercent: -1.55,
    volume: 6789012,
    marketCap: 2080000000000,
    high: 580.40,
    low: 565.20,
    open: 576.25,
    previousClose: 576.25
  },
  {
    symbol: 'M&M.NS',
    name: 'Mahindra & Mahindra',
    price: 1456.80,
    change: 22.45,
    changePercent: 1.56,
    volume: 2345678,
    marketCap: 1800000000000,
    high: 1468.90,
    low: 1442.30,
    open: 1445.00,
    previousClose: 1434.35
  },
  {
    symbol: 'BAJAJ-AUTO.NS',
    name: 'Bajaj Auto Limited',
    price: 4567.25,
    change: -45.80,
    changePercent: -0.99,
    volume: 987654,
    marketCap: 1320000000000,
    high: 4625.60,
    low: 4555.40,
    open: 4613.05,
    previousClose: 4613.05
  },

  // Pharmaceuticals
  {
    symbol: 'SUNPHARMA.NS',
    name: 'Sun Pharmaceutical',
    price: 1089.45,
    change: 18.60,
    changePercent: 1.74,
    volume: 3456789,
    marketCap: 2610000000000,
    high: 1095.80,
    low: 1075.20,
    open: 1078.00,
    previousClose: 1070.85
  },
  {
    symbol: 'DRREDDY.NS',
    name: 'Dr Reddys Laboratories',
    price: 5234.70,
    change: -68.45,
    changePercent: -1.29,
    volume: 1234567,
    marketCap: 870000000000,
    high: 5315.80,
    low: 5225.60,
    open: 5303.15,
    previousClose: 5303.15
  },
  {
    symbol: 'CIPLA.NS',
    name: 'Cipla Limited',
    price: 1234.50,
    change: 15.75,
    changePercent: 1.29,
    volume: 2345678,
    marketCap: 1000000000000,
    high: 1245.80,
    low: 1225.40,
    open: 1230.00,
    previousClose: 1218.75
  },

  // FMCG
  {
    symbol: 'HINDUNILVR.NS',
    name: 'Hindustan Unilever',
    price: 2345.80,
    change: 28.45,
    changePercent: 1.23,
    volume: 1876543,
    marketCap: 5500000000000,
    high: 2358.90,
    low: 2330.20,
    open: 2335.00,
    previousClose: 2317.35
  },
  {
    symbol: 'ITC.NS',
    name: 'ITC Limited',
    price: 456.75,
    change: -3.25,
    changePercent: -0.71,
    volume: 8765432,
    marketCap: 5680000000000,
    high: 462.40,
    low: 454.80,
    open: 460.00,
    previousClose: 460.00
  },
  {
    symbol: 'NESTLEIND.NS',
    name: 'Nestle India Limited',
    price: 23456.80,
    change: 345.60,
    changePercent: 1.50,
    volume: 123456,
    marketCap: 2260000000000,
    high: 23598.40,
    low: 23280.20,
    open: 23350.00,
    previousClose: 23111.20
  },

  // Metals & Mining
  {
    symbol: 'TATASTEEL.NS',
    name: 'Tata Steel Limited',
    price: 123.45,
    change: 2.85,
    changePercent: 2.36,
    volume: 9876543,
    marketCap: 1520000000000,
    high: 125.80,
    low: 121.60,
    open: 122.00,
    previousClose: 120.60
  },
  {
    symbol: 'JSWSTEEL.NS',
    name: 'JSW Steel Limited',
    price: 789.25,
    change: -12.45,
    changePercent: -1.55,
    volume: 5432109,
    marketCap: 1950000000000,
    high: 805.60,
    low: 785.40,
    open: 801.70,
    previousClose: 801.70
  },
  {
    symbol: 'HINDALCO.NS',
    name: 'Hindalco Industries',
    price: 456.80,
    change: 8.95,
    changePercent: 2.00,
    volume: 4321098,
    marketCap: 1020000000000,
    high: 462.30,
    low: 450.20,
    open: 452.00,
    previousClose: 447.85
  },

  // Cement
  {
    symbol: 'ULTRACEMCO.NS',
    name: 'UltraTech Cement',
    price: 8765.40,
    change: 125.80,
    changePercent: 1.46,
    volume: 654321,
    marketCap: 2520000000000,
    high: 8825.60,
    low: 8680.20,
    open: 8720.00,
    previousClose: 8639.60
  },
  {
    symbol: 'SHREECEM.NS',
    name: 'Shree Cement Limited',
    price: 23456.70,
    change: -285.40,
    changePercent: -1.20,
    volume: 87654,
    marketCap: 840000000000,
    high: 23785.60,
    low: 23380.20,
    open: 23742.10,
    previousClose: 23742.10
  },

  // Telecom
  {
    symbol: 'BHARTIARTL.NS',
    name: 'Bharti Airtel Limited',
    price: 876.45,
    change: 12.85,
    changePercent: 1.49,
    volume: 7654321,
    marketCap: 4950000000000,
    high: 885.60,
    low: 870.20,
    open: 872.00,
    previousClose: 863.60
  },
  {
    symbol: 'JIO.NS',
    name: 'Reliance Jio Infocomm',
    price: 234.50,
    change: -2.85,
    changePercent: -1.20,
    volume: 8765432,
    marketCap: 1500000000000,
    high: 238.90,
    low: 232.40,
    open: 237.35,
    previousClose: 237.35
  },

  // Power
  {
    symbol: 'NTPC.NS',
    name: 'NTPC Limited',
    price: 234.75,
    change: 4.25,
    changePercent: 1.84,
    volume: 6543210,
    marketCap: 2280000000000,
    high: 237.80,
    low: 232.40,
    open: 233.00,
    previousClose: 230.50
  },
  {
    symbol: 'POWERGRID.NS',
    name: 'Power Grid Corp of India',
    price: 189.60,
    change: -1.85,
    changePercent: -0.97,
    volume: 5432109,
    marketCap: 1780000000000,
    high: 192.40,
    low: 188.20,
    open: 191.45,
    previousClose: 191.45
  },

  // Consumer Durables
  {
    symbol: 'BAJAJFINSV.NS',
    name: 'Bajaj Finserv Limited',
    price: 1567.80,
    change: 25.45,
    changePercent: 1.65,
    volume: 1987654,
    marketCap: 2510000000000,
    high: 1585.60,
    low: 1555.20,
    open: 1560.00,
    previousClose: 1542.35
  },
  {
    symbol: 'TITAN.NS',
    name: 'Titan Company Limited',
    price: 2987.45,
    change: -38.60,
    changePercent: -1.28,
    volume: 1654321,
    marketCap: 2650000000000,
    high: 3035.80,
    low: 2975.20,
    open: 3026.05,
    previousClose: 3026.05
  },

  // Additional Popular Stocks
  {
    symbol: 'ADANIPORTS.NS',
    name: 'Adani Ports & SEZ',
    price: 789.25,
    change: 15.80,
    changePercent: 2.04,
    volume: 4321098,
    marketCap: 1700000000000,
    high: 798.60,
    low: 780.40,
    open: 785.00,
    previousClose: 773.45
  },
  {
    symbol: 'ASIANPAINT.NS',
    name: 'Asian Paints Limited',
    price: 3456.70,
    change: -45.25,
    changePercent: -1.29,
    volume: 987654,
    marketCap: 3320000000000,
    high: 3515.80,
    low: 3445.60,
    open: 3501.95,
    previousClose: 3501.95
  },
  {
    symbol: 'BRITANNIA.NS',
    name: 'Britannia Industries',
    price: 4567.80,
    change: 68.45,
    changePercent: 1.52,
    volume: 765432,
    marketCap: 1100000000000,
    high: 4598.60,
    low: 4520.40,
    open: 4535.00,
    previousClose: 4499.35
  },
  {
    symbol: 'DIVISLAB.NS',
    name: 'Divis Laboratories',
    price: 3789.25,
    change: -58.70,
    changePercent: -1.53,
    volume: 543210,
    marketCap: 1010000000000,
    high: 3865.80,
    low: 3775.40,
    open: 3847.95,
    previousClose: 3847.95
  },
  {
    symbol: 'EICHERMOT.NS',
    name: 'Eicher Motors Limited',
    price: 3456.80,
    change: 45.25,
    changePercent: 1.33,
    volume: 432109,
    marketCap: 940000000000,
    high: 3485.60,
    low: 3425.40,
    open: 3435.00,
    previousClose: 3411.55
  },
  {
    symbol: 'GRASIM.NS',
    name: 'Grasim Industries',
    price: 1789.45,
    change: 28.60,
    changePercent: 1.62,
    volume: 1098765,
    marketCap: 1190000000000,
    high: 1805.80,
    low: 1775.20,
    open: 1780.00,
    previousClose: 1760.85
  },
  {
    symbol: 'HEROMOTOCO.NS',
    name: 'Hero MotoCorp Limited',
    price: 2987.60,
    change: -42.85,
    changePercent: -1.41,
    volume: 876543,
    marketCap: 590000000000,
    high: 3045.80,
    low: 2975.40,
    open: 3030.45,
    previousClose: 3030.45
  },
  {
    symbol: 'INDUSINDBK.NS',
    name: 'IndusInd Bank Limited',
    price: 1234.70,
    change: 18.95,
    changePercent: 1.56,
    volume: 2109876,
    marketCap: 960000000000,
    high: 1248.60,
    low: 1225.40,
    open: 1230.00,
    previousClose: 1215.75
  },
  {
    symbol: 'LT.NS',
    name: 'Larsen & Toubro',
    price: 2345.80,
    change: 35.45,
    changePercent: 1.53,
    volume: 1543210,
    marketCap: 3290000000000,
    high: 2365.60,
    low: 2325.40,
    open: 2335.00,
    previousClose: 2310.35
  }
];

// US stocks for comparison
const usStocks: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.52,
    change: 2.34,
    changePercent: 1.30,
    volume: 45234567,
    marketCap: 2900000000000,
    high: 184.20,
    low: 180.10,
    open: 181.00,
    previousClose: 180.18
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: -1.45,
    changePercent: -1.04,
    volume: 28456789,
    marketCap: 1750000000000,
    high: 140.50,
    low: 137.80,
    open: 139.66,
    previousClose: 139.66
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 374.58,
    change: 4.12,
    changePercent: 1.11,
    volume: 23567890,
    marketCap: 2780000000000,
    high: 376.00,
    low: 371.20,
    open: 372.00,
    previousClose: 370.46
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.87,
    change: -3.21,
    changePercent: -1.27,
    volume: 67890123,
    marketCap: 790000000000,
    high: 252.00,
    low: 246.50,
    open: 251.30,
    previousClose: 252.08
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.43,
    change: 12.67,
    changePercent: 1.47,
    volume: 34567890,
    marketCap: 2160000000000,
    high: 878.90,
    low: 862.10,
    open: 865.00,
    previousClose: 862.76
  }
];

// Combined stock data
const allStocks = [...indianStocks, ...usStocks];

// Indian market indices
const indianIndices: MarketIndex[] = [
  { symbol: 'NIFTY', name: 'NIFTY 50', price: 19674.25, change: 145.80, changePercent: 0.75 },
  { symbol: 'SENSEX', name: 'BSE SENSEX', price: 65953.48, change: 287.35, changePercent: 0.44 },
  { symbol: 'BANKNIFTY', name: 'BANK NIFTY', price: 44567.80, change: -125.45, changePercent: -0.28 },
  { symbol: 'NIFTYNEXT50', name: 'NIFTY NEXT 50', price: 42345.60, change: 89.25, changePercent: 0.21 }
];

// US indices for comparison
const usIndices: MarketIndex[] = [
  { symbol: 'SPY', name: 'S&P 500', price: 4567.89, change: 23.45, changePercent: 0.52 },
  { symbol: 'QQQ', name: 'NASDAQ 100', price: 378.12, change: -2.34, changePercent: -0.61 },
  { symbol: 'DIA', name: 'Dow Jones', price: 342.67, change: 1.89, changePercent: 0.55 }
];

const allIndices = [...indianIndices, ...usIndices];

// Simulate real-time price updates
const simulateRealTimeUpdate = (stock: StockData): StockData => {
  const randomChange = (Math.random() - 0.5) * 2; // -1 to 1
  const newPrice = Math.max(0.01, stock.price + randomChange);
  const change = newPrice - stock.previousClose;
  const changePercent = (change / stock.previousClose) * 100;
  
  return {
    ...stock,
    price: Number(newPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2))
  };
};

const simulateIndexUpdate = (index: MarketIndex): MarketIndex => {
  const randomChange = (Math.random() - 0.5) * 10; // -5 to 5
  const newPrice = Math.max(0.01, index.price + randomChange);
  const change = index.change + (Math.random() - 0.5) * 2;
  const changePercent = (change / newPrice) * 100;
  
  return {
    ...index,
    price: Number(newPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2))
  };
};

export const getStockData = async (symbol?: string): Promise<StockData[]> => {
  // Check if we should use real API data
  if (API_CONFIG.USE_REAL_DATA && API_CONFIG.ALPHA_VANTAGE_API_KEY !== 'demo') {
    try {
      if (symbol) {
        const stock = await alphaVantageService.getQuote(symbol);
        return stock ? [stock] : [];
      }
      
      // For multiple stocks, get popular ones
      const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'TCS', 'INFY', 'RELIANCE'];
      const stocks: StockData[] = [];
      
      for (const sym of popularSymbols) {
        try {
          const stock = await alphaVantageService.getQuote(sym);
          if (stock) stocks.push(stock);
          
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 12000)); // 12 seconds between requests
        } catch (error) {
          console.warn(`Failed to fetch ${sym}:`, error);
          // Continue with next stock
        }
      }
      
      return stocks;
    } catch (error) {
      console.error('Real API failed, falling back to demo data:', error);
      // Fall through to demo data
    }
  }
  
  // Demo data (existing logic)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (symbol) {
    const stock = allStocks.find(s => 
      s.symbol.toLowerCase() === symbol.toLowerCase() ||
      s.symbol.toLowerCase().includes(symbol.toLowerCase())
    );
    return stock ? [simulateRealTimeUpdate(stock)] : [];
  }
  
  // Return a mix of popular Indian and US stocks by default
  const popularStocks = [
    ...indianStocks.slice(0, 15), // Top 15 Indian stocks
    ...usStocks // All US stocks
  ];
  
  return popularStocks.map(simulateRealTimeUpdate);
};

export const getMarketIndices = async (): Promise<MarketIndex[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return allIndices.map(simulateIndexUpdate);
};

export const searchStocks = async (query: string): Promise<StockData[]> => {
  // Check if we should use real API data
  if (API_CONFIG.USE_REAL_DATA && API_CONFIG.ALPHA_VANTAGE_API_KEY !== 'demo') {
    try {
      return await alphaVantageService.searchSymbols(query);
    } catch (error) {
      console.error('Real API search failed, falling back to demo data:', error);
      // Fall through to demo search
    }
  }
  
  // Demo search (existing logic)
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const searchTerm = query.toLowerCase();
  
  // Enhanced search with scoring system
  const searchResults = allStocks
    .map(stock => {
      const symbolLower = stock.symbol.toLowerCase();
      const nameLower = stock.name.toLowerCase();
      let score = 0;
      
      // Exact symbol match gets highest score
      if (symbolLower === searchTerm) {
        score = 100;
      }
      // Symbol starts with search term
      else if (symbolLower.startsWith(searchTerm)) {
        score = 90;
      }
      // Symbol contains search term
      else if (symbolLower.includes(searchTerm)) {
        score = 80;
      }
      // Company name starts with search term
      else if (nameLower.startsWith(searchTerm)) {
        score = 70;
      }
      // Company name contains search term
      else if (nameLower.includes(searchTerm)) {
        score = 60;
      }
      // Fuzzy matching for common abbreviations and variations
      else if (fuzzyMatch(searchTerm, symbolLower, nameLower)) {
        score = 50;
      }
      // Word boundary matching in company name
      else if (wordBoundaryMatch(searchTerm, nameLower)) {
        score = 40;
      }
      
      return { stock, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => simulateRealTimeUpdate(result.stock))
    .slice(0, 20); // Limit results to 20 for better performance
    
  return searchResults;
};

// Helper function for fuzzy matching
const fuzzyMatch = (searchTerm: string, symbol: string, name: string): boolean => {
  // Common abbreviations and variations
  const abbreviations: { [key: string]: string[] } = {
    'tcs': ['tata consultancy services', 'tata consultancy'],
    'infy': ['infosys'],
    'hdfc': ['hdfc bank', 'housing development finance'],
    'icici': ['icici bank'],
    'sbi': ['state bank of india', 'state bank'],
    'ril': ['reliance industries', 'reliance'],
    'bharti': ['bharti airtel', 'airtel'],
    'maruti': ['maruti suzuki'],
    'tata': ['tata motors', 'tata steel', 'tata consultancy'],
    'bajaj': ['bajaj auto', 'bajaj finserv'],
    'adani': ['adani ports', 'adani enterprises'],
    'l&t': ['larsen & toubro', 'larsen and toubro'],
    'lt': ['larsen & toubro', 'larsen and toubro'],
    'm&m': ['mahindra & mahindra', 'mahindra and mahindra'],
    'mahindra': ['mahindra & mahindra'],
    'sun pharma': ['sun pharmaceutical'],
    'dr reddy': ['dr reddys laboratories', 'dr reddy laboratories'],
    'hul': ['hindustan unilever'],
    'asian paint': ['asian paints'],
    'ultratech': ['ultratech cement'],
    'jio': ['reliance jio'],
    'wipro': ['wipro limited'],
    'tech mahindra': ['tech mahindra limited'],
    'hcl': ['hcl technologies'],
    'infosys': ['infosys limited'],
    'microsoft': ['msft'],
    'apple': ['aapl'],
    'google': ['googl', 'alphabet'],
    'tesla': ['tsla'],
    'nvidia': ['nvda']
  };
  
  // Check if search term matches any abbreviation
  if (abbreviations[searchTerm]) {
    return abbreviations[searchTerm].some(abbrev => 
      name.includes(abbrev) || symbol.includes(abbrev.replace(/\s+/g, ''))
    );
  }
  
  // Check reverse mapping (full name to abbreviation)
  for (const [abbrev, fullNames] of Object.entries(abbreviations)) {
    if (fullNames.some(fullName => fullName.includes(searchTerm))) {
      return symbol.includes(abbrev) || name.includes(abbrev);
    }
  }
  
  // Partial word matching
  const searchWords = searchTerm.split(' ');
  const nameWords = name.split(' ');
  
  return searchWords.every(searchWord => 
    nameWords.some(nameWord => 
      nameWord.toLowerCase().includes(searchWord) || 
      searchWord.includes(nameWord.toLowerCase())
    )
  );
};

// Helper function for word boundary matching
const wordBoundaryMatch = (searchTerm: string, name: string): boolean => {
  const words = name.split(/\s+/);
  return words.some(word => word.toLowerCase().startsWith(searchTerm));
};

// Export all stocks for reference
export const getAllIndianStocks = (): StockData[] => indianStocks;
export const getAllUSStocks = (): StockData[] => usStocks;
export const getAllStocks = (): StockData[] => allStocks;