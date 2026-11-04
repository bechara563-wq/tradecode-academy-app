import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketQuote, FinancialNews, EconomicEvent } from '../types/index.js';

interface MarketContextType {
  quotes: MarketQuote[];
  news: FinancialNews[];
  calendar: EconomicEvent[];
  isQuotesLoading: boolean;
  isNewsLoading: boolean;
  isStale: boolean;
  source: string;
  lastUpdated: string;
  refreshQuotes: () => Promise<void>;
  refreshNews: () => Promise<void>;
  selectedSymbolQuote: (symbol: string) => MarketQuote | undefined;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [news, setNews] = useState<FinancialNews[]>([]);
  const [calendar, setCalendar] = useState<EconomicEvent[]>([]);
  const [isQuotesLoading, setIsQuotesLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [source, setSource] = useState('Connecting...');
  const [lastUpdated, setLastUpdated] = useState('');

  const refreshQuotes = async () => {
    try {
      setIsQuotesLoading(true);
      const res = await fetch('/api/markets/quotes');
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
        setIsStale(Boolean(data.isStale));
        setSource(data.source || 'Market Stream');
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Error fetching market quotes:', e);
      setIsStale(true);
    } finally {
      setIsQuotesLoading(false);
    }
  };

  const refreshNews = async () => {
    try {
      setIsNewsLoading(true);
      const res = await fetch('/api/markets/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data.news || []);
      }
    } catch (e) {
      console.error('Error fetching market news:', e);
    } finally {
      setIsNewsLoading(false);
    }
  };

  const fetchCalendar = async () => {
    try {
      const res = await fetch('/api/markets/calendar');
      if (res.ok) {
        const data = await res.json();
        setCalendar(data || []);
      }
    } catch (e) {
      console.error('Error fetching economic calendar:', e);
    }
  };

  useEffect(() => {
    refreshQuotes();
    refreshNews();
    fetchCalendar();

    // Auto-refresh quotes every 60 seconds (well within safe limits)
    const interval = setInterval(() => {
      refreshQuotes();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const selectedSymbolQuote = (symbol: string) => {
    return quotes.find(q => q.symbol.toLowerCase() === symbol.toLowerCase());
  };

  return (
    <MarketContext.Provider
      value={{
        quotes,
        news,
        calendar,
        isQuotesLoading,
        isNewsLoading,
        isStale,
        source,
        lastUpdated,
        refreshQuotes,
        refreshNews,
        selectedSymbolQuote
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};
