import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, Theme } from '../types/index.js';
import { getTranslation, translations } from '../translations/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  language: Language;
  theme: Theme;
  isLoading: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  t: (key: keyof typeof translations['ar']) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tca_token'));
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('tca_lang') as Language) || 'ar';
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('tca_theme') as Theme) || 'dark';
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync HTML lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('tca_lang', language);
  }, [language]);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tca_theme', theme);
  }, [theme]);

  // Auth fetch wrapper
  const authFetch = async (url: string, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(url, { ...init, headers });
  };

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await authFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.preferredLanguage) {
          setLanguageState(data.user.preferredLanguage);
        }
      } else {
        localStorage.removeItem('tca_token');
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.error('Error refreshing session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (user && token) {
      authFetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredLanguage: lang })
      });
    }
  };

  const setTheme = (thm: Theme) => {
    setThemeState(thm);
    if (user && token) {
      authFetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: thm })
      });
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'فشل تسجيل الدخول' };
      }
      localStorage.setItem('tca_token', data.token);
      setToken(data.token);
      setUser(data.user);
      if (data.user.preferredLanguage) {
        setLanguageState(data.user.preferredLanguage);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'خطأ في الاتصال بالخادم' };
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, preferredLanguage: language })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'فشل إنشاء الحساب' };
      }
      localStorage.setItem('tca_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'خطأ في الاتصال بالخادم' };
    }
  };

  const logout = () => {
    localStorage.removeItem('tca_token');
    setToken(null);
    setUser(null);
  };

  const t = (key: keyof typeof translations['ar']): string => {
    return getTranslation(language, key);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        language,
        theme,
        isLoading,
        setLanguage,
        setTheme,
        login,
        register,
        logout,
        refreshUser,
        authFetch,
        t
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
