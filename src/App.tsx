import React from 'react';
import { BarChart3, RefreshCw, TrendingUp, User, LogOut } from 'lucide-react';
import { StockCard } from './components/StockCard';
import { MarketOverview } from './components/MarketOverview';
import { SearchBar } from './components/SearchBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AuthModal } from './components/AuthModal';
import { WatchlistPanel } from './components/WatchlistPanel';
import { StockDetailModal } from './components/StockDetailModal';
import { useStockData } from './hooks/useStockData';
import { useAuth } from './hooks/useAuth';

function App() {
  const { stocks, indices, loading, error, isSearching, searchForStocks, refetch } = useStockData();
  const { user, isAuthenticated, login, signup, logout, updateWatchlist } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [selectedStock, setSelectedStock] = React.useState<any>(null);

  const handleStockSelect = (symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
    }
  };

  const handleToggleWatchlist = async (symbol: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const currentWatchlist = user.watchlist || [];
    const newWatchlist = currentWatchlist.includes(symbol)
      ? currentWatchlist.filter(s => s !== symbol)
      : [...currentWatchlist, symbol];

    try {
      await updateWatchlist(newWatchlist);
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const handleLogin = async (credentials: any) => {
    await login(credentials);
  };

  const handleSignup = async (credentials: any) => {
    await signup(credentials);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded-lg p-2">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">StockTracker Pro</h1>
                <p className="text-sm text-gray-600">Real-time market data & analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <User size={16} />
                    <span>{user?.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
              
              <button
                onClick={refetch}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Market Overview */}
        <div className="mb-8">
          <MarketOverview indices={indices} />
        </div>

        {/* Watchlist Panel - Only show for authenticated users */}
        {isAuthenticated && user && (
          <div className="mb-8">
            <WatchlistPanel
              watchlist={user.watchlist || []}
              stocks={stocks}
              onToggleWatchlist={handleToggleWatchlist}
              onStockSelect={handleStockSelect}
            />
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <SearchBar 
              onSearch={searchForStocks} 
              onClear={() => searchForStocks('')} 
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="text-red-600">⚠️</div>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Stock Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="text-blue-600" size={20} />
              <span>{isSearching ? 'Search Results' : 'Popular Indian & Global Stocks'}</span>
            </h2>
            <div className="text-sm text-gray-600">
              {stocks.length} stock{stocks.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {stocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onSelect={handleStockSelect}
                  isInWatchlist={user?.watchlist?.includes(stock.symbol) || false}
                  onToggleWatchlist={handleToggleWatchlist}
                  showWatchlistButton={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BarChart3 size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stocks found</h3>
              <p className="text-gray-600">Try searching for a different stock symbol or name.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm">
          <p>Data updates every 5 seconds • Includes NSE, BSE & Global markets • Market data is simulated for demonstration</p>
        </footer>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
        
        {/* Stock Detail Modal */}
        <StockDetailModal
          isOpen={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          stock={selectedStock}
        />
      </div>
    </div>
  );
}

export default App;