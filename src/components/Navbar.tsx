import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useMarket } from '../context/MarketContext.js';
import {
  TrendingUp,
  Code,
  Globe,
  Sun,
  Moon,
  User,
  Shield,
  BookOpen,
  DollarSign,
  Menu,
  X,
  CreditCard,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Language } from '../types/index.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user, language, theme, setLanguage, setTheme, logout, t } = useAuth();
  const { quotes, isStale, source, refreshQuotes, isQuotesLoading } = useMarket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Ticker assets list for auto-scrolling marquee
  const displayQuotes = quotes.length > 0 ? quotes : [
    { symbol: 'BTC/USD', name: 'Bitcoin', category: 'crypto', price: 92450.00, change24h: 1250, changePercent24h: 1.37 },
    { symbol: 'XAU/USD', name: 'Gold', category: 'metals', price: 2745.80, change24h: 14.50, changePercent24h: 0.53 },
    { symbol: 'ETH/USD', name: 'Ethereum', category: 'crypto', price: 3420.50, change24h: 42.10, changePercent24h: 1.25 },
    { symbol: 'EUR/USD', name: 'Euro', category: 'forex', price: 1.0845, change24h: 0.0012, changePercent24h: 0.11 },
    { symbol: 'SOL/USD', name: 'Solana', category: 'crypto', price: 198.40, change24h: 5.60, changePercent24h: 2.90 },
    { symbol: 'S&P 500', name: 'S&P 500', category: 'indices', price: 5860.20, change24h: 22.40, changePercent24h: 0.38 }
  ];

  const navLinks = [
    { id: 'home', label: t('navHome'), icon: TrendingUp },
    { id: 'courses', label: t('navCourses'), icon: BookOpen },
    { id: 'markets', label: t('navMarkets'), icon: TrendingUp },
    { id: 'news', label: t('navNews'), icon: Globe },
    { id: 'resources', label: t('navResources'), icon: Code },
    { id: 'pricing', label: t('navPricing'), icon: CreditCard },
    { id: 'about', label: t('navAbout'), icon: Info }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* 1. TOP LIVE MARKET TICKER STRIP (AUTO-MOVING MARQUEE) */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800/80 px-2 py-1.5 text-xs text-slate-300 overflow-hidden">
        <div className="w-full flex items-center justify-between gap-2">
          {/* Status badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0 z-10 bg-slate-900/95 px-2 py-0.5 rounded-lg border border-slate-800/80 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isStale ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isStale ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="font-semibold text-slate-400 text-[11px] hidden sm:inline">{source}:</span>
            {isStale && (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] px-1 py-0.2 rounded flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" />
                {t('staleData')}
              </span>
            )}
          </div>

          {/* Auto-moving Infinite Animated Ticker Stream */}
          <div className="flex-1 overflow-hidden relative select-none mx-2">
            <div className="animate-ticker flex items-center gap-6 py-0.5">
              {[...displayQuotes, ...displayQuotes].map((asset, idx) => {
                const isPositive = asset.changePercent24h >= 0;
                return (
                  <div
                    key={`${asset.symbol}-${idx}`}
                    onClick={() => handleNavClick('markets')}
                    className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800/80 px-2.5 py-0.5 rounded-lg transition font-mono whitespace-nowrap text-xs flex-shrink-0"
                    title="اضغط لعرض الرسم البياني والتحليل"
                  >
                    <span className="font-extrabold text-slate-100">{asset.symbol}</span>
                    <span className="text-slate-300 font-medium">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price < 10 ? 4 : 2, maximumFractionDigits: 4 })}
                    </span>
                    <span className={`text-[11px] font-bold flex items-center ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '+' : ''}{asset.changePercent24h.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={() => refreshQuotes()}
            disabled={isQuotesLoading}
            title="تحديث الأسعار الآن"
            className="flex-shrink-0 z-10 bg-slate-900/95 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition p-1.5 rounded-lg border border-slate-800/80 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isQuotesLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  TradeCode
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  ACADEMY
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                منصة تعليم التداول والبرمجة المالية
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <link.icon className="w-4 h-4 opacity-75" />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute top-full mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50"
                  style={{ [language === 'ar' ? 'left' : 'right']: 0 }}
                >
                  <button
                    onClick={() => { setLanguage('ar'); setLangDropdownOpen(false); }}
                    className={`w-full text-right px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      language === 'ar' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>العربية</span>
                    <span className="text-[10px] text-slate-500">AR</span>
                  </button>
                  <button
                    onClick={() => { setLanguage('fr'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      language === 'fr' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>Français</span>
                    <span className="text-[10px] text-slate-500">FR</span>
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      language === 'en' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-slate-500">EN</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    user.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  }`}>
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      {user.role === 'admin' ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> مدير
                        </span>
                      ) : (
                        <span className="text-cyan-400 font-medium">طالب</span>
                      )}
                    </div>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs"
                    style={{ [language === 'ar' ? 'left' : 'right']: 0 }}
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="font-semibold text-slate-200">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {user.subscriptionStatus === 'active' ? 'اشتراك نشط VIP' : 'خطة مجانية'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavClick('student')}
                      className="w-full text-start px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      {t('navStudentPortal')}
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-start px-3 py-2 text-amber-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        {t('navAdminPortal')}
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-start px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('navLogout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 transition"
                >
                  {t('heroCtaStart')}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <link.icon className="w-4 h-4 text-cyan-400" />
                {link.label}
              </button>
            );
          })}

          {user && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => handleNavClick('student')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-cyan-300 bg-cyan-950/30 border border-cyan-800/40"
              >
                <User className="w-4 h-4" />
                {t('navStudentPortal')}
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-amber-300 bg-amber-950/30 border border-amber-800/40"
                >
                  <Shield className="w-4 h-4" />
                  {t('navAdminPortal')}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
