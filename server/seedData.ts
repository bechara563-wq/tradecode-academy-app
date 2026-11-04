import { Course, Lesson, Quiz } from '../src/types/index.js';

export const initialCourses: Course[] = [
  // TRADING COURSES
  {
    id: 'course_trade_intro',
    slug: 'intro-to-financial-markets',
    title: {
      ar: 'مقدمة شاملة في الأسواق المالية والبورصات العالمية',
      fr: 'Introduction aux Marchés Financiers Mondiaux',
      en: 'Introduction to Global Financial Markets'
    },
    description: {
      ar: 'تعرف على بنية الأسواق المالية، دور البنوك المركزية، الفرق بين الأسهم، السلع، العملات، وأساسيات التداول السليم.',
      fr: 'Comprenez la structure des marchés, les banques centrales et les classes d\'actifs.',
      en: 'Understand market structure, central banks, asset classes, and healthy trading principles.'
    },
    track: 'trading',
    category: 'الأساسيات المالية',
    level: 'beginner',
    iconName: 'Globe',
    durationHours: 12,
    lessonsTarget: 120,
    isPublished: true,
    isFree: true,
    order: 1
  },
  {
    id: 'course_trade_forex',
    slug: 'forex-market-mastery',
    title: {
      ar: 'أساسيات سوق الفوركس وتداول العملات الأجنبية',
      fr: 'Fondamentaux du Marché Forex',
      en: 'Forex Market Mastery & Currency Trading'
    },
    description: {
      ar: 'أزواج العملات الرئيسية والمتقاطعة، السبريد، الرافعة المالية، وحساب النقاط Pips بدقة.',
      fr: 'Paires majeures, spread, effet de levier et calcul précis des pips.',
      en: 'Major and cross currency pairs, spreads, leverage, and pip calculation precision.'
    },
    track: 'trading',
    category: 'الفوركس',
    level: 'beginner',
    iconName: 'TrendingUp',
    durationHours: 18,
    lessonsTarget: 140,
    isPublished: true,
    isFree: false,
    order: 2
  },
  {
    id: 'course_trade_gold',
    slug: 'gold-xauusd-specialist',
    title: {
      ar: 'أسرار تداول الذهب XAUUSD والمعادن الثمينة',
      fr: 'Spécialisation Trading de l\'Or XAUUSD',
      en: 'Gold (XAUUSD) & Metals Specialist'
    },
    description: {
      ar: 'سلوك حركة سعر الذهب، الجلسات الأكثر سيولة، علاقة الذهب بعوائد السندات والدولار الأمريكي.',
      fr: 'Comportement de l\'or, sessions de liquidité et corrélation avec le dollar.',
      en: 'Gold volatility, high-liquidity sessions, and yields/dollar correlation.'
    },
    track: 'trading',
    category: 'السلع والمعادن',
    level: 'intermediate',
    iconName: 'Coins',
    durationHours: 16,
    lessonsTarget: 120,
    isPublished: true,
    isFree: false,
    order: 3
  },
  {
    id: 'course_trade_crypto',
    slug: 'crypto-blockchain-trading',
    title: {
      ar: 'تداول العملات الرقمية وتكنولوجيا البلوكشين',
      fr: 'Trading Crypto et Technologie Blockchain',
      en: 'Crypto & Blockchain Asset Trading'
    },
    description: {
      ar: 'فهم البيتكوين، الإيثيريوم، منصات التداول اللامركزية DEX، وتحليل دورات السوق السنوية.',
      fr: 'Bitcoin, Ethereum, plateformes DEX et cycles de marché crypto.',
      en: 'Bitcoin, Ethereum, DEX architectures, on-chain metrics, and halving cycles.'
    },
    track: 'trading',
    category: 'الكريبتو',
    level: 'intermediate',
    iconName: 'Zap',
    durationHours: 15,
    lessonsTarget: 130,
    isPublished: true,
    isFree: false,
    order: 4
  },
  {
    id: 'course_trade_candles',
    slug: 'candlestick-patterns-price-action',
    title: {
      ar: 'الشموع اليابانية ونماذج حركة السعر Price Action',
      fr: 'Chandeliers Japonais et Price Action',
      en: 'Japanese Candlesticks & Price Action Mastery'
    },
    description: {
      ar: 'قراءة سيكولوجية الشموع (المطرقة، الابتلاع، الشهاب) وتحديد مناطق دخول الصفقات عالية الدقة.',
      fr: 'Psychologie des chandeliers et détection des zones d\'entrée haute probabilité.',
      en: 'Candlestick psychology, engulfing bars, pin bars, and high-probability entry models.'
    },
    track: 'trading',
    category: 'التحليل الفني',
    level: 'beginner',
    iconName: 'BarChart2',
    durationHours: 20,
    lessonsTarget: 160,
    isPublished: true,
    isFree: true,
    order: 5
  },
  {
    id: 'course_trade_support',
    slug: 'support-resistance-liquidity',
    title: {
      ar: 'مستويات الدعم والمقاومة والسيولة المؤسسية Smart Money',
      fr: 'Supports, Résistances et Liquidité Institutionnelle',
      en: 'Support, Resistance & Institutional Liquidity'
    },
    description: {
      ar: 'كشف فخاخ السيولة، كتل الأوامر Order Blocks، وتداول الكسر الحقيقي مقابل الكسر الكاذب.',
      fr: 'Pièges de liquidité, blocs d\'ordres et fausses cassures.',
      en: 'Liquidity pools, institutional order blocks, and fakeout identification.'
    },
    track: 'trading',
    category: 'حركة السعر المتقدمة',
    level: 'advanced',
    iconName: 'Layers',
    durationHours: 24,
    lessonsTarget: 150,
    isPublished: true,
    isFree: false,
    order: 6
  },
  {
    id: 'course_trade_technical',
    slug: 'technical-indicators-systems',
    title: {
      ar: 'التحليل الفني الكلاسيكي والمؤشرات الرياضية',
      fr: 'Analyse Technique et Indicateurs Mathématiques',
      en: 'Technical Analysis & Quantitative Indicators'
    },
    description: {
      ar: 'استخدام المتوسطات المتحركة EMA، ومؤشر القوة النسبية RSI، والماكد MACD، وتفادي الإشارات المضللة.',
      fr: 'Moyennes mobiles, RSI, MACD et filtrage des faux signaux.',
      en: 'Moving averages, RSI divergence, MACD crossovers, and signal filtering.'
    },
    track: 'trading',
    category: 'المؤشرات',
    level: 'intermediate',
    iconName: 'LineChart',
    durationHours: 18,
    lessonsTarget: 130,
    isPublished: true,
    isFree: false,
    order: 7
  },
  {
    id: 'course_trade_fundamental',
    slug: 'fundamental-analysis-macro',
    title: {
      ar: 'التحليل الأساسي والتقويم الاقتصادي الكلي',
      fr: 'Analyse Fondamentale et Calendrier Économique',
      en: 'Fundamental Analysis & Macroeconomics'
    },
    description: {
      ar: 'قراءة بيانات التضخم CPI، ومعدلات الفائدة، وتقرير الوظائف غير الزراعية NFP وكيفية تأثيرها على الأسعار.',
      fr: 'Données d\'inflation, taux d\'intérêt et rapport NFP.',
      en: 'CPI inflation, central bank rate decisions, NFP reports, and market volatility.'
    },
    track: 'trading',
    category: 'التحليل الأساسي',
    level: 'intermediate',
    iconName: 'FileText',
    durationHours: 14,
    lessonsTarget: 110,
    isPublished: true,
    isFree: false,
    order: 8
  },
  {
    id: 'course_trade_strategies',
    slug: 'backtesting-systematic-trading',
    title: {
      ar: 'بناء استراتيجيات التداول والاختبار التاريخي Backtesting',
      fr: 'Stratégies de Trading et Backtesting Rigoureux',
      en: 'Trading Strategy Design & Backtesting'
    },
    description: {
      ar: 'تحويل الأفكار إلى قواعد تداول صارمة، وقياس نسبة الربح Win Rate، ومعدل العائد إلى المخاطرة Risk-to-Reward.',
      fr: 'Création de règles strictes, calcul du Win Rate et ratio risque/rendement.',
      en: 'Rule-based strategy engineering, expectancy calculation, and systematic backtesting.'
    },
    track: 'trading',
    category: 'الاستراتيجيات',
    level: 'advanced',
    iconName: 'Compass',
    durationHours: 20,
    lessonsTarget: 140,
    isPublished: true,
    isFree: false,
    order: 9
  },
  {
    id: 'course_trade_prop',
    slug: 'prop-firms-funded-accounts',
    title: {
      ar: 'الحسابات الممولة وشركات التداول Prop Firms',
      fr: 'Comptes Financés et Sociétés Prop Firms',
      en: 'Prop Firms & Funded Account Challenges'
    },
    description: {
      ar: 'فهم قواعد التراجع اليومي Daily Drawdown، وإدارة رأس مال الشركة، وتجنب الفخاخ القانونية والتقنية.',
      fr: 'Règles de drawdown, gestion du capital alloué et pièges à éviter.',
      en: 'Passing funded challenges, maximum drawdown rules, and prop firm risk criteria.'
    },
    track: 'trading',
    category: 'الحسابات الممولة',
    level: 'advanced',
    iconName: 'Award',
    durationHours: 15,
    lessonsTarget: 100,
    isPublished: true,
    isFree: false,
    order: 10
  },

  // PROGRAMMING COURSES
  {
    id: 'course_prog_intro',
    slug: 'computer-web-fundamentals',
    title: {
      ar: 'أساسيات الكمبيوتر والويب والبرمجة للمبتدئين',
      fr: 'Bases de l\'Informatique et du Web',
      en: 'Computer & Web Development Fundamentals'
    },
    description: {
      ar: 'كيف يعمل الإنترنت، متصفحات الويب، الخوادم، أنظمة الملفات، وكتابة أول سطر برمجي باحتراف.',
      fr: 'Fonctionnement d\'Internet, navigateurs, serveurs et premières lignes de code.',
      en: 'How the web works, client-server models, HTTP protocol, and foundational programming logic.'
    },
    track: 'programming',
    category: 'مبادئ البرمجة',
    level: 'beginner',
    iconName: 'Cpu',
    durationHours: 12,
    lessonsTarget: 100,
    isPublished: true,
    isFree: true,
    order: 11
  },
  {
    id: 'course_prog_htmlcss',
    slug: 'modern-html5-css3-design',
    title: {
      ar: 'تطوير واجهات الويب الحديثة HTML5 & Modern CSS3',
      fr: 'Interfaces Web Modernes HTML5 & CSS3',
      en: 'Modern HTML5, CSS3 & Responsive UI'
    },
    description: {
      ar: 'بناء هياكل صفحات الويب الدلالية، Flexbox، CSS Grid، وتصميم لوحات تداول متجاوبة مع الهواتف.',
      fr: 'Structures sémantiques, Flexbox, Grid et designs mobiles réactifs.',
      en: 'Semantic markup, Flexbox, CSS Grid layouts, and responsive trading interfaces.'
    },
    track: 'programming',
    category: 'الواجهات الأمامية',
    level: 'beginner',
    iconName: 'Layout',
    durationHours: 16,
    lessonsTarget: 110,
    isPublished: true,
    isFree: false,
    order: 12
  },
  {
    id: 'course_prog_js',
    slug: 'javascript-mastery-interactive-apps',
    title: {
      ar: 'لغة JavaScript الحديثة وبناء التطبيقات التفاعلية',
      fr: 'JavaScript Moderne et Applications Interactives',
      en: 'Modern JavaScript & Interactive Web Apps'
    },
    description: {
      ar: 'المتغيرات، الدوال، المصفوفات، الأحداث، Fetch API، ومعالجة البيانات الحية للأسواق المالية.',
      fr: 'Variables, fonctions, tableaux, DOM, Fetch API et traitement des données.',
      en: 'ES6+ features, asynchronous JavaScript, DOM manipulation, and live market data processing.'
    },
    track: 'programming',
    category: 'تطوير الويب',
    level: 'beginner',
    iconName: 'Code',
    durationHours: 24,
    lessonsTarget: 140,
    isPublished: true,
    isFree: false,
    order: 13
  },
  {
    id: 'course_prog_python',
    slug: 'python-finance-data-analysis',
    title: {
      ar: 'بايثون للتحليل المالي وتداول الخوارزميات Python for Finance',
      fr: 'Python pour la Finance et l\'Analyse de Données',
      en: 'Python for Finance & Algorithmic Trading'
    },
    description: {
      ar: 'استخدام مكتبات Pandas وNumPy لتحليل بيانات الأسعار، وحساب المؤشرات الفنية، وبناء الخوارزميات.',
      fr: 'Pandas, NumPy, calculs d\'indicateurs et conception d\'algorithmes.',
      en: 'Pandas, NumPy, financial time series, technical indicator computation, and backtesting engines.'
    },
    track: 'programming',
    category: 'البرمجة المالية',
    level: 'intermediate',
    iconName: 'Terminal',
    durationHours: 28,
    lessonsTarget: 150,
    isPublished: true,
    isFree: false,
    order: 14
  },
  {
    id: 'course_prog_db',
    slug: 'databases-sql-trade-storage',
    title: {
      ar: 'قواعد البيانات SQL وإدارة بيانات الصفقات والمستخدمين',
      fr: 'Bases de Données SQL et Gestion des Transactions',
      en: 'Databases, SQL & Trading Journal Storage'
    },
    description: {
      ar: 'تصميم الجداول، كتابة استعلامات SQL الفعالة، الربط بين الجداول، وحفظ سجل الصفقات بأمان.',
      fr: 'Conception de schémas relationnels, requêtes SQL et stockage sécurisé.',
      en: 'Relational schemas, SQL queries, indexing, and secure trading log data stores.'
    },
    track: 'programming',
    category: 'قواعد البيانات',
    level: 'intermediate',
    iconName: 'Database',
    durationHours: 18,
    lessonsTarget: 100,
    isPublished: true,
    isFree: false,
    order: 15
  },
  {
    id: 'course_prog_api',
    slug: 'apis-live-market-data-integration',
    title: {
      ar: 'واجهات برمجة التطبيقات APIs وربط أسعار البورصات',
      fr: 'APIs et Intégration de Flux Boursiers en Direct',
      en: 'APIs & Live Market Data Streaming'
    },
    description: {
      ar: 'فهم REST APIs وWebSockets، جلب أسعار البيتكوين والذهب الحية، والتعامل مع حدود الاستهلاك Rate Limits.',
      fr: 'Architecture REST, WebSockets, gestion des limites et cotations en direct.',
      en: 'RESTful architecture, WebSockets, rate limiting strategies, and financial telemetry streams.'
    },
    track: 'programming',
    category: 'الربط البرمجي',
    level: 'intermediate',
    iconName: 'Share2',
    durationHours: 16,
    lessonsTarget: 100,
    isPublished: true,
    isFree: false,
    order: 16
  },
  {
    id: 'course_prog_git',
    slug: 'git-github-team-version-control',
    title: {
      ar: 'إدارة النسخ والمشاريع البرمجية عبر Git & GitHub',
      fr: 'Gestion de Versions avec Git et GitHub',
      en: 'Git & GitHub Version Control Mastery'
    },
    description: {
      ar: 'أوامر Git الأساسية، التفرع Branches، الدمج Merges، وحفظ المشاريع البرمجية في مستودعات آمنة.',
      fr: 'Commandes Git, branches, pull requests et dépôts GitHub.',
      en: 'Git commits, branch workflows, conflict resolution, and remote GitHub project repositories.'
    },
    track: 'programming',
    category: 'أدوات المطور',
    level: 'beginner',
    iconName: 'GitBranch',
    durationHours: 12,
    lessonsTarget: 80,
    isPublished: true,
    isFree: true,
    order: 17
  },
  {
    id: 'course_prog_security',
    slug: 'cybersecurity-wallet-safety',
    title: {
      ar: 'مبادئ الأمن السيبراني وحماية المحافظ والبيانات',
      fr: 'Principes de Cybersécurité et Protection des Wallets',
      en: 'Cybersecurity Fundamentals & Wallet Security'
    },
    description: {
      ar: 'حماية مفاتيح API، المصادقة الثنائية 2FA، تجنب هجمات التصيد Phishing، وأمان تطبيقات الويب.',
      fr: 'Sécurité des clés API, 2FA, anti-phishing et protection des données.',
      en: 'API key safety, environment secrets, two-factor authentication, and OWASP web defenses.'
    },
    track: 'programming',
    category: 'الأمن والحماية',
    level: 'intermediate',
    iconName: 'Shield',
    durationHours: 14,
    lessonsTarget: 90,
    isPublished: true,
    isFree: false,
    order: 18
  },
  {
    id: 'course_prog_ai',
    slug: 'ai-tools-for-coding-and-trading',
    title: {
      ar: 'أدوات الذكاء الاصطناعي لبناء البرمجيات وتحليل التداول',
      fr: 'Outils d\'IA pour le Code et l\'Analyse de Marché',
      en: 'AI Engineering for Coding & Market Analytics'
    },
    description: {
      ar: 'استخدام نماذج الذكاء الاصطناعي لكتابة الأكواد، وتصحيح الأخطاء، واستخراج رؤى متقدمة من الأخبار المالية.',
      fr: 'Utilisation des modèles d\'IA pour le code, débogage et analyse d\'actualités.',
      en: 'Leveraging AI LLMs for rapid code scaffolding, debugging, and financial news synthesis.'
    },
    track: 'programming',
    category: 'الذكاء الاصطناعي',
    level: 'advanced',
    iconName: 'Cpu',
    durationHours: 18,
    lessonsTarget: 110,
    isPublished: true,
    isFree: false,
    order: 19
  },
  {
    id: 'course_prog_devops',
    slug: 'deployment-cloud-hosting',
    title: {
      ar: 'النشر والاستضافة السحابية DevOps للمواقع والتطبيقات',
      fr: 'Déploiement et Hébergement Cloud DevOps',
      en: 'Cloud Deployment, DevOps & Web Hosting'
    },
    description: {
      ar: 'نشر المواقع على المنصات السحابية المجانية والسريعة (Cloudflare, Vercel)، وربط النطاقات DNS.',
      fr: 'Déploiement rapide sur Cloudflare et gestion DNS.',
      en: 'Zero-cost production deployment on Cloudflare Pages, edge functions, and DNS setups.'
    },
    track: 'programming',
    category: 'الاستضافة والنشر',
    level: 'intermediate',
    iconName: 'Server',
    durationHours: 12,
    lessonsTarget: 100,
    isPublished: true,
    isFree: false,
    order: 20
  },

  // RISK & PSYCHOLOGY
  {
    id: 'course_risk_position',
    slug: 'capital-management-position-sizing',
    title: {
      ar: 'إدارة رأس المال وحساب حجم العقد والمخاطرة بدقة',
      fr: 'Gestion du Capital et Dimensionnement des Positions',
      en: 'Risk Management & Precision Position Sizing'
    },
    description: {
      ar: 'قاعدة المخاطرة بنسبة 1%، حساب وقف الخسارة المناسب، تفادي نداء الهامش Margin Call، والنمو التراكمي.',
      fr: 'Règle des 1%, calcul précis du Stop Loss et protection du compte.',
      en: 'The 1% risk rule, stop-loss mathematical placement, compounding growth, and margin protection.'
    },
    track: 'risk_psychology',
    category: 'إدارة المخاطر',
    level: 'beginner',
    iconName: 'Percent',
    durationHours: 14,
    lessonsTarget: 90,
    isPublished: true,
    isFree: true,
    order: 21
  },
  {
    id: 'course_risk_psych',
    slug: 'trading-psychology-discipline',
    title: {
      ar: 'سيكولوجية التداول والسيطرة على المشاعر والانضباط',
      fr: 'Psychologie du Trading et Maîtrise Émotionnelle',
      en: 'Trading Psychology & Emotional Mastery'
    },
    description: {
      ar: 'التعامل مع خسائر الصفقات، التغلب على FOMO، تفادي التداول الانتقامي Revenge Trading، وبناء عقلية المتداول الرابح.',
      fr: 'Gestion des pertes, maîtrise du FOMO et discipline comportementale.',
      en: 'Overcoming trading trauma, curbing FOMO, avoiding revenge trading, and fostering disciplined execution.'
    },
    track: 'risk_psychology',
    category: 'علم النفس المالي',
    level: 'intermediate',
    iconName: 'Activity',
    durationHours: 16,
    lessonsTarget: 70,
    isPublished: true,
    isFree: false,
    order: 22
  },
  {
    id: 'course_risk_journal',
    slug: 'trading-journal-performance-analytics',
    title: {
      ar: 'سجل التداول الاحترافي وتحليل الأداء الإحصائي',
      fr: 'Journal de Trading et Analyse Statistique',
      en: 'Trading Journal & Performance Metrics'
    },
    description: {
      ar: 'توثيق أسباب الدخول والخروج، حساب Profit Factor، ومعالجة نقاط الضعف المتكررة.',
      fr: 'Tenue de journal, calcul du profit factor et optimisation continue.',
      en: 'Documenting trade setups, analyzing Profit Factor, Sharpe Ratio, and optimizing execution.'
    },
    track: 'risk_psychology',
    category: 'التحليل الكمي',
    level: 'intermediate',
    iconName: 'BookOpen',
    durationHours: 12,
    lessonsTarget: 40,
    isPublished: true,
    isFree: false,
    order: 23
  },

  // PROJECTS & QUIZZES
  {
    id: 'course_proj_bot',
    slug: 'capstone-trading-bot-dashboard',
    title: {
      ar: 'مشروع تطبيقي: بناء بوت تداول وموقع مؤشرات حية',
      fr: 'Projet Pratique : Bot de Trading et Dashboard en Direct',
      en: 'Capstone Project: Algorithmic Bot & Live Dashboard'
    },
    description: {
      ar: 'تطبيق عملي متكامل يجمع بين استراتيجيات التداول وبرمجة موقع يعرض أسعاراً حية وينفذ إشارات آلية.',
      fr: 'Projet de synthèse combinant stratégies financières et code d\'application.',
      en: 'End-to-end practical project integrating market strategies with a real-time reactive dashboard.'
    },
    track: 'projects_quizzes',
    category: 'مشاريع عملية',
    level: 'advanced',
    iconName: 'CheckCircle',
    durationHours: 30,
    lessonsTarget: 50,
    isPublished: true,
    isFree: false,
    order: 24
  },
  {
    id: 'course_proj_cert',
    slug: 'professional-certification-assessments',
    title: {
      ar: 'الاختبارات الشاملة وشهادة التخرج الاحترافية',
      fr: 'Examens Finaux et Certifications Professionnelles',
      en: 'Comprehensive Exams & Professional Certifications'
    },
    description: {
      ar: 'اختبر مهاراتك الشاملة في التداول والبرمجة واحصل على شهادة إتمام موثقة برمز فريد معتمد من TradeCode Academy.',
      fr: 'Évaluation globale pour l\'obtention du certificat vérifiable TradeCode.',
      en: 'Verify your proficiency across all financial & technical domains with a uniquely tracked certificate.'
    },
    track: 'projects_quizzes',
    category: 'الشهادات والتقييم',
    level: 'advanced',
    iconName: 'Award',
    durationHours: 10,
    lessonsTarget: 50,
    isPublished: true,
    isFree: false,
    order: 25
  }
];

export const initialLessons: Lesson[] = [
  {
    id: 'trade_intro_01',
    courseId: 'course_trade_intro',
    slug: 'understanding-financial-markets-ecosystem',
    title: {
      ar: 'الدرس 1: كيف تعمل الأسواق المالية؟ الدليل التأسيسي الشامل',
      fr: 'Leçon 1 : Comment Fonctionnent les Marchés Financiers ?',
      en: 'Lesson 1: How Financial Markets Really Work: The Master Guide'
    },
    description: {
      ar: 'تعرف على الآلية الحقيقية لتدفق السيولة، صانعي السوق، الفرق بين أسواق الأسهم والسلع والعملات، ولماذا يتحرك السعر.',
      fr: 'Comprendre la liquidité, les teneurs de marché et les causes des mouvements de prix.',
      en: 'Understand liquidity flows, market makers, asset classes, and the root mechanics of price discovery.'
    },
    track: 'trading',
    level: 'beginner',
    durationMin: 35,
    order: 1,
    isFree: true,
    isPublished: true,
    quizId: 'quiz_trade_intro',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objectives: [
      { ar: 'فهم مفهوم العرض والطلب (Supply & Demand) وتأثيره المباشر على السعر', fr: 'Comprendre l\'offre et la demande', en: 'Understand supply & demand dynamics in price formation' },
      { ar: 'التمييز بين الأسواق الفورية (Spot)، والعقود الآجلة (Futures)، وعقود الفروقات (CFDs)', fr: 'Différencier Spot, Futures et CFD', en: 'Differentiate between Spot, Futures, and CFDs' },
      { ar: 'إدراك دور البنوك المركزية وصناديق التحوط في ضخ السيولة', fr: 'Identifier le rôle des banques centrales', en: 'Recognize the role of central banks and institutional liquidity providers' }
    ],
    content: {
      ar: `### ما هو السوق المالي في جوهره؟

السوق المالي هو البيئة المنظمة التي يلتقي فيها المشترون والبائعون لتبادل الأصول المالية (كالعملات، الذهب، الأسهم، وعقود المؤشرات). 

على عكس الأسواق التقليدية، فإن أسواق اليوم تعمل بنسبة تتجاوز 98% عبر شبكات إلكترونية فورية فائقة السرعة تُعرف باسم **شبكات الاتصال الإلكتروني (ECN)** أو من خلال **صناع السوق (Market Makers)**.

---

### المحركات الأساسية لحركة الأسعار:
1. **قانون العرض والطلب:**
   - عندما يتفوق حجم طلبات الشراء (Aggressive Buyers) على عروض البيع المتاحة، يصعد السعر للبحث عن بائعين جدد.
   - عندما ترغب المؤسسات في التخلص من أصل مالي، فإن ضغط البيع يجبر السعر على الهبوط للعثور على مشترين.

2. **السيولة (Liquidity):**
   - السيولة تعني سهولة تحويل الأصل إلى نقد فوري دون إحداث فجوة سعرية غير مقبولة (Slippage).
   - الأسواق الأكثر سيولة في العالم هي: **سوق الفوركس** (بحجم تداول يومي يتجاوز 7.5 تريليون دولار)، يليه **الذهب الأمريكي XAUUSD**، ثم مؤشرات الأسهم العالمية الكبرى مثل **S&P 500**.

---

### مقارنة أنواع الأسواق الرئيسية:
- **سوق العملات الأجنبية (Forex):** تداول أزواج العملات العالمية (مثل EUR/USD). يعمل 24 ساعة يومياً على مدار 5 أيام في الأسبوع.
- **سوق السلع والمعادن:** يضم الذهب، الفضة، والنفط الخام. يتأثر بشدة بالأزمات الجيوسياسية والتضخم.
- **سوق العملات الرقمية (Crypto):** يعمل 24/7 طوال العام، يتسم بتقلبات عالية (Volatility) وفرص استثمارية وتداولية مميزة.

---

### نصيحة الأكاديمية الذهبية:
> التداول ليس مقامرة ولا تكهناً بالحظ. المتداول المحترف يعامل حسابه كشركة استثمارية ذات ميزانية صارمة وقواعد مدروسة سلفاً قبل الدخول في أي صفقة.`,
      fr: `### Qu'est-ce qu'un marché financier ?

Le marché financier est un mécanisme permettant aux acheteurs et vendeurs d'échanger des actifs financiers comme les devises, l'or et les actions.

Plus de 98% des transactions s'effectuent aujourd'hui par voies électroniques rapides (réseaux ECN). Le prix évolue selon l'équilibre permanent entre l'offre et la demande institutionnelle.`,
      en: `### What is a Financial Market at its Core?

A financial market is an organized network where buyers and sellers exchange financial instruments including currencies, commodities, equities, and index contracts.

Over 98% of today's market operates through ultra-fast electronic communication networks (ECN) and institutional market makers.`
    },
    keyTakeaways: [
      { ar: 'السعر يتحرك دائماً نحو مناطق توفر السيولة وأوامر السوق العالقة.', fr: 'Le prix cherche toujours la liquidité.', en: 'Price constantly gravitates toward liquidity pockets.' },
      { ar: 'الفوركس والذهب هما أكثر الأصول سيولة وأقلها انزلاقاً في الأوقات الطبيعية.', fr: 'Le Forex et l\'or offrent la plus forte liquidité.', en: 'Forex and Gold provide the highest liquidity in standard market hours.' },
      { ar: 'إدارة المخاطر هي الركيزة الوحيدة التي تضمن بقاء المتداول في السوق.', fr: 'La gestion du risque est la clé de la longévité.', en: 'Risk management is the only guarantee of trading longevity.' }
    ],
    practiceExercise: {
      ar: 'افتح حساب تداول تجريبي (Demo Account) في إحدى المنصات المعتمدة، ثم قارن بين السبريد (الفارق بين سعر البيع والشراء) على زوج EUR/USD مقابل زوج غير مشهور مثل USD/TRY، ولاحظ الفارق في تكلفة الدخول.',
      fr: 'Ouvrez un compte démo et comparez le spread sur EUR/USD par rapport à USD/TRY.',
      en: 'Open a paper/demo account and compare the bid-ask spread on EUR/USD versus an exotic pair like USD/TRY.'
    }
  },
  {
    id: 'trade_intro_02',
    courseId: 'course_trade_intro',
    slug: 'market-participants-and-sessions',
    title: {
      ar: 'الدرس 2: جلسات التداول العالمية وصناع السوق (Market Makers)',
      fr: 'Leçon 2 : Sessions Mondiales et Teneurs de Marché',
      en: 'Lesson 2: Global Trading Sessions & Market Makers Architecture'
    },
    description: {
      ar: 'توزيع جلسات لندن، نيويورك، وطوكيو، وأوقات تداخل السيولة الذهبية التي تحقق أعلى عائد بأقل انزلاق سعري.',
      fr: 'Sessions de Londres, New York et Tokyo, et chevauchements de liquidité.',
      en: 'London, New York, and Tokyo sessions, with prime liquidity overlap windows.'
    },
    track: 'trading',
    level: 'beginner',
    durationMin: 30,
    order: 2,
    isFree: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objectives: [
      { ar: 'معرفة التوقيت الدقيق لجلسات التداول الكبرى الأربع (سيدني، طوكيو، لندن، نيويورك)', fr: 'Connaître les 4 sessions majeures', en: 'Master the four primary market sessions schedule' },
      { ar: 'استغلال تداخل جلسة لندن ونيويورك (London-NY Overlap) لصيد الحركات القوية', fr: 'Exploiter le chevauchement Londres-NY', en: 'Capitalize on the London-NY overlap window' },
      { ar: 'تجنب فترات السيولة المنخفضة وتوسع السبريد في إغلاق اليوم', fr: 'Éviter les spreads élargis lors du rollover', en: 'Avoid wide spreads during rollover and low liquidity' }
    ],
    content: {
      ar: `### جلسات التداول العالمية الأربع:

1. **جلسة طوكيو (الجلسة الآسيوية):**
   - التوقيت: من 00:00 إلى 09:00 بتوقيت غرينتش (GMT).
   - الخصائص: حركة أهدأ عادة، تركز على أزواج الين الياباني (JPY) والدولار الأسترالي (AUD).

2. **جلسة لندن (الجلسة الأوروبية):**
   - التوقيت: من 07:00 إلى 16:00 بتوقيت غرينتش (GMT).
   - الخصائص: بداية السيولة الضخمة الحقيقية، تمثل أكثر من 35% من مجمل تداولات الفوركس اليومية في العالم.

3. **جلسة نيويورك (الجلسة الأمريكية):**
   - التوقيت: من 12:00 إلى 21:00 بتوقيت غرينتش (GMT).
   - الخصائص: صدور أهم البيانات الاقتصادية الأمريكية وتداولات وول ستريت وأسعار الفائدة.

4. **الفترة الذهبية (The Golden Overlap):**
   - تمتد بين **12:00 إلى 16:00 بتوقيت غرينتش**، حين تلتقي بورصة لندن مع بورصة نيويورك في آنٍ واحد.
   - هذا التداخل يشهد أعلى حجم تداول يومي وأقل سبريد ممكن على الإطلاق، وهو الوقت المثالي لصفقات السكالبينغ والتداول اليومي.`,
      fr: `### Les 4 Sessions Mondiales :
Londres représente à elle seule plus de 35% du volume mondial. Le créneau 12:00 - 16:00 GMT constitue le chevauchement Londres-New York, offrant le volume maximal et les spreads les plus bas.`,
      en: `### The Four Major Sessions:
London accounts for over 35% of daily FX volume. The 12:00 - 16:00 GMT window represents the London-New York overlap, delivering peak institutional liquidity and lowest bid-ask spreads.`
    },
    keyTakeaways: [
      { ar: 'أفضل توقيت لصفقات الذهب والعملات هو فترة التداخل بين لندن ونيويورك.', fr: 'Privilégier le chevauchement Londres-NY.', en: 'Trade during London-NY overlap for minimal slippage.' },
      { ar: 'تجنب فتح صفقات عند ساعة الرول أوفر (21:00 إلى 22:00 GMT) بسبب اتساع السبريد.', fr: 'Éviter le rollover de 21h à 22h GMT.', en: 'Avoid entering positions during rollover (21:00-22:00 GMT).' }
    ]
  },
  {
    id: 'prog_web_01',
    courseId: 'course_prog_intro',
    slug: 'how-the-web-works-and-code-setup',
    title: {
      ar: 'الدرس 1: كيف يعمل الويب وتجهيز بيئة المطور المتكاملة',
      fr: 'Leçon 1 : Comment Fonctionne le Web et Configuration',
      en: 'Lesson 1: How the Modern Web Works & Setting Up Your Dev Environment'
    },
    description: {
      ar: 'التعرف على بنية الإنترنت والويب، ونموذج العميل والخادم، ودور لغات HTML وCSS وJavaScript.',
      fr: 'Structure du web, modèle client-serveur et rôles de HTML, CSS et JavaScript.',
      en: 'Understanding web mechanics, client-server architectures, and foundational web languages.'
    },
    track: 'programming',
    level: 'beginner',
    durationMin: 40,
    order: 1,
    isFree: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objectives: [
      { ar: 'فهم بروتوكول HTTP/HTTPS والعلاقة بين العميل (Client) والخادم (Server)', fr: 'Comprendre HTTP et le modèle Client-Serveur', en: 'Understand HTTP protocol and Client-Server architecture' },
      { ar: 'التعرف على دور لغات الويب الثلاث: HTML للهيكل، CSS للتنسيق، وJavaScript للوظائف', fr: 'Identifier le rôle de HTML, CSS et JavaScript', en: 'Understand HTML for structure, CSS for presentation, JavaScript for logic' },
      { ar: 'فهم كيفية استقبال شاشات التداول للبيانات عبر الويب', fr: 'Comprendre la réception des flux de marché', en: 'Understand how web clients consume financial data streams' }
    ],
    content: {
      ar: `### نموذج العميل والخادم (Client - Server Architecture):

عندما تفتح متصفحك وتطلب موقعاً مثل منصتنا، تحدث الخطوات التالية في أجزاء من الألف من الثانية:

1. **الطلب (HTTP Request):**
   يرسل المتصفح طلب GET إلى خادم المنصة طالباً الصفحة المحددة.
2. **المعالجة في الخادم:**
   يستقبل الخادم الطلب، ويتحقق من صلاحية المستخدم وقاعدة البيانات.
3. **الاستجابة (HTTP Response):**
   يرجع الخادم كود HTML مدعوماً بملفات CSS وJavaScript وملفات JSON التي تحتوي أسعار التداول.

---

### الثلاثي المقدس لتطوير الويب:
- **HTML (HyperText Markup Language):** تشبه الهيكل العظمي للمبنى (العناوين، النصوص، الجداول، الأزرار).
- **CSS (Cascading Style Sheets):** تمثل الدهان، والديكور، والخطوط، والمسافات والتجاوب مع شاشات الهواتف.
- **JavaScript:** تمثل النظام العصبي والكهرباء التفاعلية (تحديث أسعار الذهب لحظياً دون إعادة تحميل الصفحة، تشغيل الحاسبة، وتنفيذ أوامر التداول).`,
      fr: `### L'Architecture Client-Serveur :
HTML définit la structure, CSS gère le style et la mise en page responsive, et JavaScript apporte l'interactivité dynamique et la réception des cotations en temps réel.`,
      en: `### Client-Server Architecture:
HTML provides the semantic skeleton, CSS handles visual layout and responsive styling, and JavaScript powers interactive logic and real-time market data streaming.`
    },
    keyTakeaways: [
      { ar: 'الويب يعمل ببروتوكولات قياسية مفتوحة أهمها HTTPS.', fr: 'Le Web repose sur le standard HTTPS sécurisé.', en: 'The web operates on standardized protocols, mainly HTTPS.' },
      { ar: 'جافاسكريبت هي اللغة الوحيدة التي تعمل في جميع متصفحات العالم بدون تثبيت برامج إضافية.', fr: 'JavaScript est le langage universel des navigateurs.', en: 'JavaScript is the universal runtime of all modern web browsers.' }
    ]
  },
  {
    id: 'risk_pos_01',
    courseId: 'course_risk_position',
    slug: 'the-one-percent-risk-rule-and-lot-sizing',
    title: {
      ar: 'الدرس 1: قاعدة الـ 1% الذهبية والمعادلة الرياضية لحساب حجم اللوت',
      fr: 'Leçon 1 : La Règle des 1% et le Calcul Mathématique du Lot',
      en: 'Lesson 1: The 1% Golden Rule & Mathematical Position Size Formula'
    },
    description: {
      ar: 'فهم وتطبيق قاعدة المخاطرة بنسبة 1%، وحساب حجم اللوت بدقة متناهية لحماية الحساب من التراجع.',
      fr: 'Application de la règle des 1% et calcul rigoureux de la taille de position.',
      en: 'Mastering the 1% risk rule and calculating exact lot sizes to protect trading equity.'
    },
    track: 'risk_psychology',
    level: 'beginner',
    durationMin: 35,
    order: 1,
    isFree: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objectives: [
      { ar: 'تطبيق قاعدة المخاطرة بنسبة 1% إلى 2% كحد أقصى من إجمالي رأس المال في أي صفقة واحدة', fr: 'Appliquer la règle des 1% à 2% par trade', en: 'Apply the 1% to 2% maximum equity risk rule per position' },
      { ar: 'حساب حجم العقد (Lot Size) بدقة استناداً إلى عدد نقاط وقف الخسارة', fr: 'Calculer la taille de lot exacte selon le Stop Loss', en: 'Calculate exact lot size from stop-loss pips' },
      { ar: 'الوقاية الرياضية التامة من تصفير الحساب مهما توالت الصفقات الخاسرة', fr: 'Éviter mathématiquement la ruine du compte', en: 'Mathematically prevent account liquidation during drawdown streaks' }
    ],
    content: {
      ar: `### لماذا يفشل 90% من المتداولين المبتدئين؟

السبب لا يكمن في ضعف التحليل الفني، بل في **المخاطرة بحجم غير مدروس (Over-leveraging)**. 

إذا كان رصيد حسابك 10,000 دولار، وخسرت 5 صفقات متتالية بمخاطرة 15% للصفقة، ستفقد أكثر من 55% من حسابك، وستحتاج حينها إلى تحقيق ربح 122% لمجرد استعادة رأس مالك الأصلي!

---

### قانون المخاطرة بنسبة 1%:
> لا تخاطر أبداً بأكثر من 1% من رصيدك في صفقة واحدة.
> حساب 5,000 دولار = أقصى خسارة مسموح بها في الصفقة هي 50 دولار فقط.

---

### المعادلة الرياضية لحساب حجم اللوت:
\`\`\`
قيمة المخاطرة بالدولار = رصيد الحساب × نسبة المخاطرة (مثال: 5000 × 0.01 = 50$)
حجم العقد (Lot Size) = قيمة المخاطرة بالدولار ÷ (عدد نقاط الوقف × قيمة النقطة للوت الكامل)
\`\`\`

**مثال تطبيقي عملي:**
- رصيدك: 5,000$
- المخاطرة المرغوبة: 1% أي 50$
- تريد شراء الذهب، ووقف الخسارة يبعد 25 نقطة (2.5$).
- قيمة النقطة للوت الكامل في الذهب = 10$.
- حجم اللوت المطلوب بدقة = 50 ÷ (25 × 10) = 50 ÷ 250 = **0.20 لوت**.`,
      fr: `### La Règle des 1% :
Ne risquez jamais plus de 1% de votre capital total sur une seule transaction. Cela vous protège mathématiquement contre toute série de pertes.`,
      en: `### The 1% Capital Preservation Rule:
Never risk more than 1% of total account equity on any individual trade. This mathematically guarantees survivability across inevitable drawdown sequences.`
    },
    keyTakeaways: [
      { ar: 'حجم اللوت يتحدد بناءً على مسافة الوقف وليس بناءً على الرغبة في مضاعفة الربح.', fr: 'La taille du lot découle du Stop Loss.', en: 'Lot size is dictated by stop-loss distance, never by arbitrary profit greed.' },
      { ar: 'قاعدة الـ 1% تجعل المتداول قادراً على تحمل 20 خسارة متتالية دون أن يفقد أكثر من 18% من حسابه.', fr: 'Permet de surmonter 20 pertes d\'affilée.', en: 'With 1% risk, 20 consecutive losses only represent an 18% drawdown.' }
    ]
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz_trade_intro',
    courseId: 'course_trade_intro',
    lessonId: 'trade_intro_01',
    title: {
      ar: 'اختبار تقييم فهم الأسواق المالية والسيولة',
      fr: 'Quiz d\'évaluation : Fondamentaux des Marchés',
      en: 'Assessment Quiz: Financial Markets & Liquidity'
    },
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: {
          ar: 'ما الذي يحرك أسعار العملات والسلع في الأسواق المالية بصورة أساسية؟',
          fr: 'Qu\'est-ce qui fait bouger les prix sur les marchés financiers ?',
          en: 'What fundamentally drives asset prices in financial markets?'
        },
        type: 'multiple_choice',
        options: [
          { id: 'opt_1', text: { ar: 'توازن قوى العرض والطلب وحجم السيولة المتدفقة', fr: 'L\'équilibre de l\'offre et de la demande', en: 'Supply & demand dynamics and liquidity flow' } },
          { id: 'opt_2', text: { ar: 'الحظ والتخمين العشوائي فقط', fr: 'Le hasard uniquement', en: 'Pure random luck' } },
          { id: 'opt_3', text: { ar: 'عدد زوار مواقع الأخبار', fr: 'Le nombre de visites web', en: 'Website traffic volume' } }
        ],
        correctOptionId: 'opt_1',
        explanation: {
          ar: 'السعر يتحرك دائماً نتيجة تغلب قوى الشراء أو قوى البيع وبحث السيولة عن أفضل الأسعار المتاحة.',
          fr: 'Le prix résulte de la confrontation directe entre acheteurs et vendeurs.',
          en: 'Price moves as the natural result of aggressive buyers or sellers absorbing liquidity.'
        }
      },
      {
        id: 'q2',
        question: {
          ar: 'في أي وقت تشهد أسواق العملات والذهب أعلى سيولة يومية وأقل سبريد؟',
          fr: 'À quel moment la liquidité est-elle à son maximum ?',
          en: 'When do FX and Gold markets experience maximum daily liquidity?'
        },
        type: 'multiple_choice',
        options: [
          { id: 'opt_1', text: { ar: 'أثناء عطلة نهاية الأسبوع', fr: 'Le week-end', en: 'During weekends' } },
          { id: 'opt_2', text: { ar: 'أثناء فترة تداخل جلستي لندن ونيويورك', fr: 'Pendant le chevauchement Londres - New York', en: 'During London and New York session overlap' } },
          { id: 'opt_3', text: { ar: 'في الدقائق الأولى من افتتاح طوكيو فقط', fr: 'Seulement à l\'ouverture asiatique', en: 'Only at Asian market open' } }
        ],
        correctOptionId: 'opt_2',
        explanation: {
          ar: 'تداخل جلستي لندن ونيويورك (12:00 إلى 16:00 GMT) يمثل ذروة السيولة العالمية اليومية.',
          fr: 'Le chevauchement Londres-NY cumule les deux plus grands centres financiers mondiaux.',
          en: 'The London-New York overlap combines the two largest financial centers on Earth.'
        }
      },
      {
        id: 'q3',
        question: {
          ar: 'صح أم خطأ: إذا خسرت 50% من حسابك، تحتاج إلى ربح 100% لاستعادة رأس مالك الأصلي.',
          fr: 'Vrai ou Faux : Si vous perdez 50%, vous devez faire +100% pour récupérer.',
          en: 'True or False: A 50% account loss requires a 100% gain just to break even.'
        },
        type: 'true_false',
        options: [
          { id: 'opt_true', text: { ar: 'صح (True)', fr: 'Vrai', en: 'True' } },
          { id: 'opt_false', text: { ar: 'خطأ (False)', fr: 'Faux', en: 'False' } }
        ],
        correctOptionId: 'opt_true',
        explanation: {
          ar: 'إذا كان حسابك 10,000$ وهبط إلى 5,000$ (خسارة 50%)، فأنت بحاجة لربح 5,000$ إضافية على رصيدك الجديد، أي 100%!',
          fr: 'Passer de 5000$ à 10000$ demande un gain de 100%.',
          en: 'Recovering from $5,000 back to $10,000 requires a full 100% return on remaining capital.'
        }
      }
    ]
  }
];

// The Master Curriculum Blueprint outlining the 2,500 target items
export const curriculumBlueprint = {
  targetLessons: 2500,
  tracksDistribution: {
    trading: {
      target: 1200,
      description: 'أكاديمية التداول: الفوركس، الذهب، الكريبتو، الشموع اليابانية، نماذج السعر، التحليل الفني والأساسي والحسابات الممولة.',
      modules: [
        { code: 'TRD-MOD-01', name: 'أساسيات وهندسة الأسواق المالية', target: 120 },
        { code: 'TRD-MOD-02', name: 'سوق الفوركس وأزواج العملات الدولية', target: 140 },
        { code: 'TRD-MOD-03', name: 'تداول الذهب XAUUSD والمعادن والسلع', target: 120 },
        { code: 'TRD-MOD-04', name: 'العملات الرقمية والبلوكشين والتحليل على السلسلة', target: 130 },
        { code: 'TRD-MOD-05', name: 'سيكولوجية الشموع اليابانية ونماذج حركة السعر', target: 160 },
        { code: 'TRD-MOD-06', name: 'مناطق الدعم والمقاومة وتدفق السيولة المؤسسية', target: 150 },
        { code: 'TRD-MOD-07', name: 'المؤشرات الفنية والأنظمة الكمية', target: 130 },
        { code: 'TRD-MOD-08', name: 'التحليل الأساسي والتقارير الاقتصادية الكبرى', target: 110 },
        { code: 'TRD-MOD-09', name: 'هندسة الاستراتيجيات والاختبار التاريخي الصارم', target: 140 }
      ]
    },
    programming: {
      target: 1000,
      description: 'أكاديمية البرمجة: تطوير الويب الشامل، JavaScript، بايثون المالية، قواعد البيانات، واجهات APIs، وأدوات الذكاء الاصطناعي.',
      modules: [
        { code: 'PRG-MOD-01', name: 'أساسيات الكمبيوتر ومعمارية الويب', target: 100 },
        { code: 'PRG-MOD-02', name: 'تصميم الواجهات الحديثة HTML5 & Modern CSS3', target: 110 },
        { code: 'PRG-MOD-03', name: 'برمجة JavaScript المتقدمة والتطبيقات التفاعلية', target: 140 },
        { code: 'PRG-MOD-04', name: 'لغة Python للمتداولين والمحللين الماليين', target: 150 },
        { code: 'PRG-MOD-05', name: 'قواعد البيانات SQL وNoSQL لحفظ سجلات التداول', target: 100 },
        { code: 'PRG-MOD-06', name: 'واجهات APIs وبروتوكولات بث الأسعار اللحظية', target: 100 },
        { code: 'PRG-MOD-07', name: 'التحكم بالنسخ والعمل الجماعي عبر Git & GitHub', target: 80 },
        { code: 'PRG-MOD-08', name: 'الأمن السيبراني وحماية المفاتيح والمحافظ', target: 90 },
        { code: 'PRG-MOD-09', name: 'الذكاء الاصطناعي وبناء أنظمة التداول الحديثة', target: 110 },
        { code: 'PRG-MOD-10', name: 'النشر السحابي وDevOps للمواقع والتطبيقات', target: 100 }
      ]
    },
    risk_psychology: {
      target: 200,
      description: 'إدارة رأس المال وحساب أحجام الصفقات، الانضباط النفسي، والتطبيق العملي وسجلات التداول.',
      modules: [
        { code: 'RSK-MOD-01', name: 'حساب حجم اللوت وقواعد المخاطرة الرياضية', target: 90 },
        { code: 'RSK-MOD-02', name: 'علم نفس التداول وضبط المشاعر والانضباط اليومي', target: 70 },
        { code: 'RSK-MOD-03', name: 'إدارة سجل التداول وتحليل المقاييس الكمية', target: 40 }
      ]
    },
    projects_quizzes: {
      target: 100,
      description: 'المشاريع التطبيقية المتكاملة، اختبارات الكفاءة والشهادات المعتمدة.',
      modules: [
        { code: 'CAP-MOD-01', name: 'مشاريع بناء منصات وبوتات تداول حقيقية', target: 50 },
        { code: 'CAP-MOD-02', name: 'الاختبارات الشاملة المعتمدة وشهادات التخرج', target: 50 }
      ]
    }
  }
};
