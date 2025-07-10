import { StockData, MarketIndex, HistoricalPrice } from '../types/stock';
import { API_CONFIG, API_ENDPOINTS, SYMBOL_MAPPINGS } from '../config/api';

// Rate limiting helper
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequestsPerMinute: number;
  private readonly maxRequestsPerDay: number;

  constructor(maxPerMinute: number, maxPerDay: number) {
    this.maxRequestsPerMinute = maxPerMinute;
    this.maxRequestsPerDay = maxPerDay;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Clean old requests
    this.requests = this.requests.filter(time => time > oneDayAgo);

    const recentRequests = this.requests.filter(time => time > oneMinuteAgo);
    
    return recentRequests.length < this.maxRequestsPerMinute && 
           this.requests.length < this.maxRequestsPerDay;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }
}

const rateLimiter = new RateLimiter(
  API_CONFIG.RATE_LIMIT.REQUESTS_PER_MINUTE,
  API_CONFIG.RATE_LIMIT.REQUESTS_PER_DAY
);

// Alpha Vantage API service
export class AlphaVantageService {
  private baseUrl = API_CONFIG.ALPHA_VANTAGE_BASE_URL;
  private apiKey = API_CONFIG.ALPHA_VANTAGE_API_KEY;

  private async makeRequest(params: Record<string, string>): Promise<any> {
    if (!rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }

    const url = new URL(this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    url.searchParams.append('apikey', this.apiKey);

    try {
      rateLimiter.recordRequest();
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for API errors
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      return data;
    } catch (error) {
      console.error('Alpha Vantage API Error:', error);
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<StockData | null> {
    try {
      const mappedSymbol = SYMBOL_MAPPINGS[symbol] || symbol;
      const data = await this.makeRequest({
        function: API_ENDPOINTS.QUOTE,
        symbol: mappedSymbol
      });

      const quote = data['Global Quote'];
      if (!quote) return null;

      const price = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
      const volume = parseInt(quote['06. volume']);
      const high = parseFloat(quote['03. high']);
      const low = parseFloat(quote['04. low']);
      const open = parseFloat(quote['02. open']);
      const previousClose = parseFloat(quote['08. previous close']);

      return {
        symbol: quote['01. symbol'],
        name: this.getCompanyName(symbol),
        price,
        change,
        changePercent,
        volume,
        marketCap: this.estimateMarketCap(price, volume),
        high,
        low,
        open,
        previousClose
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  async getHistoricalData(symbol: string, interval: string = 'daily'): Promise<HistoricalPrice[]> {
    try {
      const mappedSymbol = SYMBOL_MAPPINGS[symbol] || symbol;
      const data = await this.makeRequest({
        function: API_ENDPOINTS.DAILY,
        symbol: mappedSymbol,
        outputsize: 'full'
      });

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) return [];

      const historical: HistoricalPrice[] = [];
      
      Object.entries(timeSeries)
        .slice(0, 365) // Last year of data
        .forEach(([date, values]: [string, any]) => {
          historical.push({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume']),
            formattedDate: new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })
          });
        });

      return historical.reverse(); // Chronological order
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  async searchSymbols(query: string): Promise<StockData[]> {
    try {
      const data = await this.makeRequest({
        function: API_ENDPOINTS.SEARCH,
        keywords: query
      });

      const matches = data['bestMatches'];
      if (!matches) return [];

      const results: StockData[] = [];
      
      for (const match of matches.slice(0, 10)) {
        const quote = await this.getQuote(match['1. symbol']);
        if (quote) {
          results.push({
            ...quote,
            name: match['2. name']
          });
        }
      }

      return results;
    } catch (error) {
      console.error(`Error searching for ${query}:`, error);
      return [];
    }
  }

  private getCompanyName(symbol: string): string {
    const companyNames: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'TCS': 'Tata Consultancy Services',
      'INFY': 'Infosys Limited',
      'RELIANCE': 'Reliance Industries',
      'HDFCBANK': 'HDFC Bank Limited',
      'ICICIBANK': 'ICICI Bank Limited',
      'SBIN': 'State Bank of India',
      'ITC': 'ITC Limited',
      'HINDUNILVR': 'Hindustan Unilever',
      'BHARTIARTL': 'Bharti Airtel Limited',
      'KOTAKBANK': 'Kotak Mahindra Bank'
    };
    
    return companyNames[symbol] || symbol;
  }

  private estimateMarketCap(price: number, volume: number): number {
    // Rough estimation - in production, you'd get this from the API or another source
    const estimatedShares = volume * 100; // Very rough estimate
    return price * estimatedShares;
  }
}

export const alphaVantageService = new AlphaVantageService();