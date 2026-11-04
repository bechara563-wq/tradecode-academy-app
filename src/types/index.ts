export type Language = 'ar' | 'fr' | 'en';
export type Theme = 'dark' | 'light';
export type UserRole = 'admin' | 'student';
export type Track = 'trading' | 'programming' | 'risk_psychology' | 'projects_quizzes';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface LocalizedString {
  ar: string;
  fr: string;
  en: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage: Language;
  theme?: Theme;
  createdAt: string;
  subscriptionPlanId?: string;
  subscriptionStatus?: 'none' | 'pending' | 'active' | 'expired';
  subscriptionExpiresAt?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  track: Track;
  category: string;
  level: Level;
  iconName: string;
  durationHours: number;
  lessonsTarget: number;
  isPublished: boolean;
  isFree: boolean;
  order: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  track: Track;
  level: Level;
  durationMin: number;
  objectives: LocalizedString[];
  content: LocalizedString;
  keyTakeaways: LocalizedString[];
  practiceExercise?: LocalizedString;
  videoUrl?: string;
  order: number;
  isFree: boolean;
  isPublished: boolean;
  quizId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: LocalizedString;
  type: 'multiple_choice' | 'true_false';
  options: { id: string; text: LocalizedString }[];
  correctOptionId: string;
  explanation: LocalizedString;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: LocalizedString;
  passingScore: number; // percentage (e.g. 70)
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  quizId: string;
  courseId: string;
  score: number;
  passed: boolean;
  timestamp: string;
  answers: Record<string, string>;
}

export interface Certificate {
  id: string;
  code: string; // unique verifiable code TCA-XXXX-XXXX
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  gradePercent: number;
}

export interface UserProgress {
  userId: string;
  completedLessonIds: string[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  lastAccessedLessonId?: string;
  lastActiveAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  priceMRU: number;
  priceUSD: number;
  durationMonths: number; // 1, 3, 12, or 999 for lifetime
  features: LocalizedString[];
  isPopular?: boolean;
  isActive: boolean;
  badge?: LocalizedString;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amount: number;
  currency: 'MRU' | 'USD';
  paymentMethod: 'bankily' | 'masrvi' | 'sedad' | 'binance' | 'bank_transfer';
  referenceNumber: string;
  proofNote?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  category: 'crypto' | 'forex' | 'metals' | 'indices';
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h?: number;
  low24h?: number;
  volume24h?: string;
  lastUpdated: string;
  isStale?: boolean;
  source: string;
  sparkline?: number[];
}

export interface FinancialNews {
  id: string;
  title: string;
  titleAr?: string;
  summary: string;
  summaryAr?: string;
  source: string;
  url: string;
  category: 'gold' | 'forex' | 'crypto' | 'indices' | 'macro';
  publishedAt: string;
  imageUrl?: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  titleAr: string;
  country: string;
  currency: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface SiteSettings {
  siteName: string;
  heroHeadline: LocalizedString;
  heroSubheadline: LocalizedString;
  contactEmail: string;
  contactWhatsapp: string;
  paymentInstructions: {
    bankily: string;
    masrvi: string;
    sedad: string;
    binance: string;
    bankTransfer: string;
  };
  marketauxApiTokenConfigured?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

export interface CurriculumStats {
  targetLessons: 2500;
  totalPlanned: number;
  completedLessons: number;
  draftLessons: number;
  reviewNeeded: number;
  tracksBreakdown: {
    trading: { target: 1200; completed: number; planned: number };
    programming: { target: 1000; completed: number; planned: number };
    risk_psychology: { target: 200; completed: number; planned: number };
    projects_quizzes: { target: 100; completed: number; planned: number };
  };
}
