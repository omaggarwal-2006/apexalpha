/**
 * Utility to resolve symbol aliases to canonical Yahoo Finance symbols.
 */
export function getCanonicalSymbol(symbol) {
  if (!symbol) return "BTC-USD";
  const clean = symbol.toUpperCase().trim();
  
  // Nifty 50 mappings
  if (['NIFTY', 'NIFTY50', 'NIFTY 50', 'NIFTY_50', '^NSEI'].includes(clean)) {
    return '^NSEI';
  }
  // Bank Nifty mappings
  if (['BANKNIFTY', 'BANK NIFTY', 'NIFTY BANK', 'NIFTYBANK', '^NSEBANK'].includes(clean)) {
    return '^NSEBANK';
  }
  // Gold mappings
  if (['GOLD', 'XAUUSD', 'XAU-USD', 'GC=F'].includes(clean)) {
    return 'GC=F';
  }
  // Crude Oil mappings
  if (['CRUDE', 'CRUDE OIL', 'WTICOUSD', 'CL=F'].includes(clean)) {
    return 'CL=F';
  }
  // Bitcoin mappings
  if (['BTC', 'BTC-USD', 'BTC/USD', 'BTCUSD', 'BTCUSDT', 'BTCUSD1', 'BITCOIN'].includes(clean)) {
    return 'BTC-USD';
  }
  // Ethereum mappings
  if (['ETH', 'ETH-USD', 'ETH/USD', 'ETHUSD', 'ETHUSDT', 'ETHEREUM'].includes(clean)) {
    return 'ETH-USD';
  }
  // Solana mappings
  if (['SOL', 'SOL-USD', 'SOL/USD', 'SOLUSD', 'SOLUSDT', 'SOLANA'].includes(clean)) {
    return 'SOL-USD';
  }
  // Stock mappings (NSE & US)
  const stockMap = {
    'RELIANCE': 'RELIANCE.NS',
    'RELIANCE INDUSTRIES': 'RELIANCE.NS',
    'RELIANCE.NS': 'RELIANCE.NS',
    'TCS': 'TCS.NS',
    'TCS.NS': 'TCS.NS',
    'HDFCBANK': 'HDFCBANK.NS',
    'HDFCBANK.NS': 'HDFCBANK.NS',
    'INFY': 'INFY.NS',
    'INFOSYS': 'INFY.NS',
    'INFY.NS': 'INFY.NS',
    'ICICIBANK': 'ICICIBANK.NS',
    'ICICIBANK.NS': 'ICICIBANK.NS',
    'AAPL': 'AAPL',
    'APPLE': 'AAPL',
    'TSLA': 'TSLA',
    'TESLA': 'TSLA',
    'NVDA': 'NVDA',
    'NVIDIA': 'NVDA',
    'MSFT': 'MSFT',
    'MICROSOFT': 'MSFT',
    'GOOGL': 'GOOGL',
    'GOOGLE': 'GOOGL',
    'AMZN': 'AMZN',
    'AMAZON': 'AMZN',
    'SPY': '^GSPC',
    'SPX': '^GSPC',
    'S&P 500': '^GSPC',
    'S&P500': '^GSPC',
    '^GSPC': '^GSPC',
    'QQQ': '^IXIC',
    'NASDAQ': '^IXIC',
    'NASDAQ 100': '^IXIC',
    '^IXIC': '^IXIC',
    'DJI': '^DJI',
    'DOW JONES': '^DJI',
    '^DJI': '^DJI',
    'USDINR': 'USDINR=X',
    'USD/INR': 'USDINR=X',
    'USDINR=X': 'USDINR=X'
  };

  if (stockMap[clean]) return stockMap[clean];

  // If it's something like BINANCE:BTCUSDT or NSE:RELIANCE
  if (clean.includes(':')) {
    const parts = clean.split(':');
    const last = parts[parts.length - 1];
    return getCanonicalSymbol(last);
  }

  // If it ends with .NS
  if (clean.endsWith('.NS')) return clean;

  return symbol; // fallback to whatever was entered
}
