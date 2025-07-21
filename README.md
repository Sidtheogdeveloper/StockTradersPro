# Real-Time Stock Market Dashboard

A comprehensive stock market dashboard built with React, TypeScript, and Tailwind CSS, featuring real-time data, AI predictions, and interactive charts.
Website Published at `https://stocktraderspro.netlify.app`

## Features

- 📈 **Real-time Stock Data**: Live price updates every 5 seconds
- 🔍 **Advanced Search**: Search stocks by symbol or company name
- 📊 **Interactive Charts**: Historical price charts with multiple timeframes
- 🤖 **AI Price Predictions**: Machine learning models for price forecasting
- ⭐ **Watchlist**: Personal stock watchlist with authentication
- 🌍 **Global Markets**: Support for Indian (NSE/BSE) and US markets
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔐 **User Authentication**: Secure login and signup system

## API Integration

This application supports both demo data and real market data via Alpha Vantage API.

### Setting up Real Data

1. **Get your free API key** from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

2. **Configure the API key** in `src/config/api.ts`:
   ```typescript
   export const API_CONFIG = {
     // Replace 'demo' with your actual API key
     ALPHA_VANTAGE_API_KEY: 'YOUR_API_KEY_HERE',
     
     // Set to true to use real data
     USE_REAL_DATA: true,
   };
   ```

3. **That's it!** The application will automatically switch to real market data.

### API Features

- **Free Tier**: 25 requests per day, 5 per minute
- **Global Coverage**: US, Indian, and international stocks
- **Real-time Quotes**: Current prices, changes, volume
- **Historical Data**: Daily price history up to 20+ years
- **Symbol Search**: Find stocks by name or symbol

### Rate Limiting

The application includes built-in rate limiting to respect API limits:
- Automatic request throttling
- Graceful fallback to demo data if limits exceeded
- Clear error messages for rate limit issues

## Demo Credentials

For testing the authentication system:
- **Email**: demo@example.com
- **Password**: password

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: Alpha Vantage (configurable)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-market-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── StockCard.tsx   # Individual stock display
│   ├── StockDetailModal.tsx # Detailed stock view with charts
│   ├── PredictionModal.tsx  # AI prediction interface
│   ├── AuthModal.tsx   # Authentication forms
│   └── ...
├── services/           # API and business logic
│   ├── stockApi.ts     # Main stock data service
│   ├── alphaVantageApi.ts # Alpha Vantage integration
│   ├── authService.ts  # Authentication service
│   └── mlPredictionService.ts # ML prediction engine
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── config/             # Configuration files
│   └── api.ts         # API configuration
└── ...
```

## Configuration Options

### API Configuration (`src/config/api.ts`)

```typescript
export const API_CONFIG = {
  // Your Alpha Vantage API key
  ALPHA_VANTAGE_API_KEY: 'demo',
  
  // Enable/disable real data
  USE_REAL_DATA: false,
  
  // Rate limiting settings
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 5,
    REQUESTS_PER_DAY: 25
  }
};
```

### Symbol Mappings

The application includes mappings for popular stocks to ensure compatibility with Alpha Vantage's symbol format:

```typescript
export const SYMBOL_MAPPINGS = {
  'TCS': 'TCS.BSE',
  'INFY': 'INFY.BSE',
  'AAPL': 'AAPL',
  // ... more mappings
};
```

## Features in Detail

### Real-time Updates
- Automatic price updates every 5 seconds
- Live market status indicator
- Real-time change calculations

### AI Predictions
- Multiple ML models (Linear Regression, SMA, EMA, LSTM-like)
- Configurable prediction timeframes (1 day to 6 months)
- Confidence intervals and accuracy metrics
- Visual trend analysis

### Interactive Charts
- Historical price data visualization
- Multiple timeframe options (1M, 3M, 6M, 1Y, 2Y)
- Detailed tooltips with OHLCV data
- Responsive design for all screen sizes

### User Authentication
- Secure login/signup system
- Personal watchlist management
- User session persistence
- Demo account for testing

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Configure your API key** in the production environment

3. **Deploy** the `dist` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## Disclaimer

This application is for demonstration purposes. Stock market data and predictions should not be used as the sole basis for investment decisions. Always consult with financial advisors and conduct your own research before making investment decisions.
