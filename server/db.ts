import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Course,
  Lesson,
  Quiz,
  UserProgress,
  SubscriptionPlan,
  PaymentRequest,
  MarketQuote,
  FinancialNews,
  EconomicEvent,
  SiteSettings,
  AuditLog,
  CurriculumStats
} from '../src/types/index.js';
import { initialCourses, initialLessons, initialQuizzes, curriculumBlueprint } from './seedData.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'academy_db.json');

export interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  courses: Course[];
  lessons: Lesson[];
  quizzes: Quiz[];
  progress: Record<string, UserProgress>;
  subscriptionPlans: SubscriptionPlan[];
  paymentRequests: PaymentRequest[];
  siteSettings: SiteSettings;
  auditLogs: AuditLog[];
  curriculumBlueprint: typeof curriculumBlueprint;
}

// Simple deterministic hash for demo/secure password verification
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'TradeCodeSecretSalt2025!').digest('hex');
}

let dbMemory: DatabaseSchema | null = null;

export function getDB(): DatabaseSchema {
  if (dbMemory) return dbMemory;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbMemory = JSON.parse(content);
      return dbMemory!;
    } catch (e) {
      console.error('Error reading db.json, reinitializing default data:', e);
    }
  }

  // Initialize fresh DB with rich seeded data
  const initialDB: DatabaseSchema = {
    users: [
      {
        id: 'user_admin_01',
        name: 'المدير العام (TradeCode Admin)',
        email: 'admin@tradecode.academy',
        passwordHash: hashPassword('Admin@123456'),
        role: 'admin',
        preferredLanguage: 'ar',
        theme: 'dark',
        createdAt: new Date().toISOString(),
        subscriptionStatus: 'active',
        subscriptionPlanId: 'plan_vip_master'
      },
      {
        id: 'user_student_01',
        name: 'محمد طالب (Student)',
        email: 'student@tradecode.academy',
        passwordHash: hashPassword('Student@123456'),
        role: 'student',
        preferredLanguage: 'ar',
        theme: 'dark',
        createdAt: new Date().toISOString(),
        subscriptionStatus: 'active',
        subscriptionPlanId: 'plan_pro_combo'
      }
    ],
    courses: initialCourses,
    lessons: initialLessons,
    quizzes: initialQuizzes,
    progress: {
      user_student_01: {
        userId: 'user_student_01',
        completedLessonIds: [
          'trade_intro_01',
          'trade_intro_02',
          'prog_web_01'
        ],
        quizAttempts: [
          {
            quizId: 'quiz_trade_intro',
            courseId: 'course_trade_intro',
            score: 100,
            passed: true,
            timestamp: new Date().toISOString(),
            answers: { q1: 'opt_1', q2: 'opt_2' }
          }
        ],
        certificates: [
          {
            id: 'cert_sample_01',
            code: 'TCA-TRD-2025-9841',
            userId: 'user_student_01',
            userName: 'محمد طالب',
            courseId: 'course_trade_intro',
            courseTitle: 'مقدمة في الأسواق المالية والبورصات العالمية',
            issueDate: new Date().toLocaleDateString('ar-EG'),
            gradePercent: 100
          }
        ],
        lastAccessedLessonId: 'trade_intro_02',
        lastActiveAt: new Date().toISOString()
      }
    },
    subscriptionPlans: [
      {
        id: 'plan_free',
        name: {
          ar: 'الباقة المجانية الاستكشافية',
          fr: 'Plan Découverte Gratuit',
          en: 'Free Starter Plan'
        },
        description: {
          ar: 'وصول لجميع الدروس التأسيسية المجانية، ملخصات الموارد، وتتبع التقدم الأولي.',
          fr: 'Accès aux leçons gratuites fondamentales et résumés.',
          en: 'Access to foundational free lessons and market summaries.'
        },
        priceMRU: 0,
        priceUSD: 0,
        durationMonths: 999,
        features: [
          { ar: 'أكثر من 25 درساً تأسيسياً مجانياً', fr: 'Plus de 25 leçons fondamentales gratuites', en: 'Over 25 foundational free lessons' },
          { ar: 'بيانات الأسواق الحية والأخبار المالية', fr: 'Cotations de marché et actualités en direct', en: 'Live market quotes & news feed' },
          { ar: 'حاسبة إدارة المخاطر وأحجام العقود', fr: 'Calculateur de gestion des risques', en: 'Risk & position size calculator' },
          { ar: 'اختبارات تقييم المستوى الأولية', fr: 'Quiz d\'évaluation initiale', en: 'Entry-level assessment quizzes' }
        ],
        isActive: true
      },
      {
        id: 'plan_pro_trader',
        name: {
          ar: 'اشتراك أكاديمية التداول الاحترافي',
          fr: 'Abonnement Pro Trader',
          en: 'Pro Trader Membership'
        },
        description: {
          ar: 'وصول غير محدود لكافة مسارات التداول: الفوركس، الذهب، الكريبتو، حركة السعر وحسابات التمويل.',
          fr: 'Accès illimité à tous les cours de trading avancés et gestion du risque.',
          en: 'Full access to Forex, Gold, Crypto, Price Action & Prop Firm training.'
        },
        priceMRU: 2500,
        priceUSD: 65,
        durationMonths: 3,
        isPopular: true,
        badge: { ar: 'الأكثر طلباً', fr: 'Populaire', en: 'Most Popular' },
        features: [
          { ar: 'جميع دورات التداول المتقدمة (1200+ درس مبرمج ومكتمل)', fr: 'Toutes les formations de trading (1200+)', en: 'All advanced trading modules (1200+ lessons)' },
          { ar: 'استراتيجيات الذهب XAUUSD وحركة السعر المتقدمة', fr: 'Stratégies avancées Or XAUUSD & Price Action', en: 'Advanced Gold XAUUSD & Price Action strategies' },
          { ar: 'كتيبات التحليل الفني والشموع اليابانية PDF', fr: 'Fiches et PDF de chandeliers japonais', en: 'Japanese candlesticks & cheat sheets PDF' },
          { ar: 'شهادات إتمام معتمدة برمز تحقق فريد', fr: 'Certificats vérifiables avec code unique', en: 'Verifiable course completion certificates' },
          { ar: 'دعم مباشر وإجابة استفسارات الصفقات', fr: 'Support prioritaire pour questions de trading', en: 'Priority trading mentorship support' }
        ],
        isActive: true
      },
      {
        id: 'plan_pro_combo',
        name: {
          ar: 'العضوية الشاملة: تداول + برمجة VIP',
          fr: 'Pass Intégral VIP : Trading & Code',
          en: 'VIP All-Access: Trading + Coding'
        },
        description: {
          ar: 'المنظومة الكاملة: التداول الاحترافي + تعلم برمجة وتطوير البوتات والمواقع والمؤشرات المخصصة.',
          fr: 'Formations complètes trading, développement web, Python et bots.',
          en: 'Complete suite: Professional trading, full-stack web dev, Python & trading bots.'
        },
        priceMRU: 4500,
        priceUSD: 120,
        durationMonths: 6,
        badge: { ar: 'القيمة القصوى', fr: 'Meilleure Valeur', en: 'Best Value' },
        features: [
          { ar: 'وصول شامل لـ 2500 درس ومسار تعليمي كامل', fr: 'Accès intégral aux 2500 leçons et projets', en: 'Full access to entire 2500-lesson curriculum' },
          { ar: 'بناء بوتات تداول ومؤشرات مخصصة بلغة Python', fr: 'Création de bots de trading et scripts Python', en: 'Building automated trading bots & Python indicators' },
          { ar: 'تطوير مواقع وتطبيقات ومشاريع حقيقية عملية', fr: 'Développement de projets d\'applications web', en: 'Building full-stack web applications & APIs' },
          { ar: 'كود سورس المشاريع وقوالب جاهزة للاستخدام', fr: 'Codes sources complets et templates téléchargeables', en: 'Full source code & downloadable starter templates' },
          { ar: 'إصدار شهادات الاحتراف التقني والمالي', fr: 'Certificats de spécialisation professionnelle', en: 'Professional Financial & Technical Certifications' },
          { ar: 'أولوية المراجعة والتواصل المباشر مع المدربين', fr: 'Support prioritaire VIP continu', en: 'Continuous VIP mentor guidance' }
        ],
        isActive: true
      }
    ],
    paymentRequests: [
      {
        id: 'pay_req_demo_01',
        userId: 'user_student_01',
        userName: 'محمد طالب',
        userEmail: 'student@tradecode.academy',
        planId: 'plan_pro_combo',
        planName: 'العضوية الشاملة: تداول + برمجة VIP',
        amount: 4500,
        currency: 'MRU',
        paymentMethod: 'bankily',
        referenceNumber: 'BNK-78492019',
        proofNote: 'تم التحويل عبر تطبيق بنكيلي لحساب الأكاديمية بنجاح.',
        status: 'approved',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        reviewedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
        reviewedBy: 'admin@tradecode.academy',
        reviewNotes: 'تم التأكد من استلام المبلغ بحساب بنكيلي وتفعيل الاشتراك لمدة 6 أشهر.'
      }
    ],
    siteSettings: {
      siteName: 'TradeCode Academy',
      heroHeadline: {
        ar: 'أتقن أسرار الأسواق المالية وبرمجة المستقبل في منصة واحدة',
        fr: 'Maîtrisez le Trading et le Code sur une Plateforme Professionnelle',
        en: 'Master Financial Trading & Future-Proof Programming in One Platform'
      },
      heroSubheadline: {
        ar: 'منهج عملي منظم يجمع بين التداول الاحترافي، إدارة المخاطر، وتطوير الأنظمة البرمجية مع بيانات الأسواق اللحظية ومكتبة تضم 2500 عنصر تعليمي.',
        fr: 'Un cursus pratique combinant analyse technique, gestion du risque et développement d\'applications avec données réelles.',
        en: 'A structured practical curriculum combining professional trading, risk mastery, and software engineering with real-time market data.'
      },
      contactEmail: 'contact@tradecode.academy',
      contactWhatsapp: '+222 48885937',
      paymentInstructions: {
        bankily: 'رقم حساب بنكيلي المعتمد: 45000000 (اسم الحساب: TradeCode Academy)',
        masrvi: 'رقم حساب مصرفي ماسروي: 36000000 (اسم الحساب: TradeCode)',
        sedad: 'رقم سداد السريع: 22000000',
        binance: 'Binance Pay ID: 84920184 (USDT Network BEP20 / TRC20)',
        bankTransfer: 'البنك الوطني لموريتانيا BNM - IBAN: MR130000000000000000000'
      },
      marketauxApiTokenConfigured: Boolean(process.env.MARKETAUX_API_TOKEN)
    },
    auditLogs: [
      {
        id: 'log_01',
        timestamp: new Date().toISOString(),
        actor: 'system',
        action: 'system_initialize',
        target: 'database',
        details: 'تهيئة قاعدة بيانات TradeCode Academy الأولية بنجاح مع 2500 عنصر منهجي.'
      }
    ],
    curriculumBlueprint
  };

  saveDB(initialDB);
  return initialDB;
}

export function saveDB(data: DatabaseSchema): void {
  dbMemory = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write database file:', e);
  }
}

export function addAuditLog(actor: string, action: string, target: string, details: string) {
  const db = getDB();
  const log: AuditLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    actor,
    action,
    target,
    details
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDB(db);
}
