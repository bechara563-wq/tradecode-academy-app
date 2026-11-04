import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDB, saveDB, hashPassword, addAuditLog } from './server/db.js';
import { fetchLiveMarketQuotes, fetchFinancialNews, economicCalendarEvents } from './server/markets.js';
import { calculateCurriculumStats, generateBatch } from './server/curriculumGenerator.js';
import { Certificate, User } from './src/types/index.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper auth token simulation (header: 'authorization': 'Bearer <userId>')
function getAuthenticatedUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const db = getDB();
  const user = db.users.find(u => u.id === token || u.email === token);
  return user || null;
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, preferredLanguage } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' });
  }

  const db = getDB();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    role: 'student' as const,
    preferredLanguage: preferredLanguage || 'ar',
    theme: 'dark' as const,
    createdAt: new Date().toISOString(),
    subscriptionStatus: 'none' as const,
    subscriptionPlanId: 'plan_free'
  };

  db.users.push(newUser);
  db.progress[newUser.id] = {
    userId: newUser.id,
    completedLessonIds: [],
    quizAttempts: [],
    certificates: [],
    lastActiveAt: new Date().toISOString()
  };

  saveDB(db);
  addAuditLog(newUser.email, 'user_register', 'auth', `تسجيل حساب طالب جديد: ${newUser.name}`);

  const { passwordHash, ...safeUser } = newUser;
  return res.json({ user: safeUser, token: newUser.id });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'بيانات الدخول غير صحيحة، يرجى التحقق من البريد أو كلمة المرور' });
  }

  const { passwordHash, ...safeUser } = user;
  return res.json({ user: safeUser, token: user.id });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'غير مصرح أو الجلسة منتهية' });
  }
  const { passwordHash, ...safeUser } = user as any;
  return res.json({ user: safeUser });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'غير مصرح' });

  const { name, preferredLanguage, theme } = req.body;
  const db = getDB();
  const index = db.users.findIndex(u => u.id === user.id);
  if (index === -1) return res.status(404).json({ error: 'المستخدم غير موجود' });

  if (name) db.users[index].name = name.trim();
  if (preferredLanguage) db.users[index].preferredLanguage = preferredLanguage;
  if (theme) db.users[index].theme = theme;

  saveDB(db);
  const { passwordHash, ...safeUser } = db.users[index] as any;
  return res.json({ user: safeUser });
});

// ==================== COURSES & LESSONS ====================
app.get('/api/courses', (req: Request, res: Response) => {
  const db = getDB();
  const track = req.query.track as string;
  let courses = db.courses;
  if (track && track !== 'all') {
    courses = courses.filter(c => c.track === track);
  }
  return res.json(courses);
});

app.get('/api/courses/:id', (req: Request, res: Response) => {
  const db = getDB();
  const course = db.courses.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!course) return res.status(404).json({ error: 'الدورة غير موجودة' });

  const lessons = db.lessons.filter(l => l.courseId === course.id);
  return res.json({ ...course, lessons });
});

app.get('/api/lessons', (req: Request, res: Response) => {
  const db = getDB();
  const { track, level, courseId, query, limit = '100', offset = '0' } = req.query;

  let list = db.lessons;
  if (track && track !== 'all') list = list.filter(l => l.track === track);
  if (level && level !== 'all') list = list.filter(l => l.level === level);
  if (courseId) list = list.filter(l => l.courseId === courseId);
  if (query) {
    const q = (query as string).toLowerCase();
    list = list.filter(l =>
      l.title.ar.toLowerCase().includes(q) ||
      l.title.en.toLowerCase().includes(q) ||
      l.description.ar.toLowerCase().includes(q)
    );
  }

  const start = parseInt(offset as string) || 0;
  const count = parseInt(limit as string) || 100;
  const paged = list.slice(start, start + count);

  return res.json({
    total: list.length,
    lessons: paged,
    hasMore: start + count < list.length
  });
});

app.get('/api/lessons/:id', (req: Request, res: Response) => {
  const db = getDB();
  const lesson = db.lessons.find(l => l.id === req.params.id || l.slug === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'الدرس غير موجود' });

  const quiz = db.quizzes.find(q => q.lessonId === lesson.id || (q.courseId === lesson.courseId && lesson.quizId === q.id));
  return res.json({ ...lesson, quiz });
});

app.post('/api/lessons', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'الصلاحية مقتصرة على مدير النظام فقط' });
  }

  const db = getDB();
  const newLesson = {
    ...req.body,
    id: req.body.id || 'lesson_' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.lessons.push(newLesson);
  saveDB(db);
  addAuditLog(user.email, 'lesson_create', 'lessons', `إضافة درس جديد: ${newLesson.title?.ar || newLesson.id}`);
  return res.json(newLesson);
});

app.put('/api/lessons/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'الصلاحية مقتصرة على مدير النظام فقط' });
  }

  const db = getDB();
  const idx = db.lessons.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'الدرس غير موجود' });

  db.lessons[idx] = {
    ...db.lessons[idx],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  saveDB(db);
  addAuditLog(user.email, 'lesson_update', 'lessons', `تعديل الدرس: ${db.lessons[idx].title?.ar}`);
  return res.json(db.lessons[idx]);
});

app.delete('/api/lessons/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'الصلاحية مقتصرة على مدير النظام فقط' });
  }

  const db = getDB();
  const idx = db.lessons.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'الدرس غير موجود' });

  const removed = db.lessons.splice(idx, 1)[0];
  saveDB(db);
  addAuditLog(user.email, 'lesson_delete', 'lessons', `حذف الدرس: ${removed.title?.ar}`);
  return res.json({ success: true });
});

// ==================== CURRICULUM & 2500 BATCH ENGINE ====================
app.get('/api/curriculum/stats', (_req: Request, res: Response) => {
  const db = getDB();
  const stats = calculateCurriculumStats(db);
  return res.json(stats);
});

app.post('/api/curriculum/generate-batch', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'الصلاحية مقتصرة على مدير المنصة' });
  }

  const { track, batchSize, publishImmediately } = req.body;
  const result = generateBatch({
    track,
    batchSize: batchSize || 20,
    publishImmediately: publishImmediately ?? true
  });

  return res.json({
    message: `تم توليد وحفظ دفعة جديدة بنجاح تضم ${result.createdLessons.length} درساً مخصصاً.`,
    ...result
  });
});

app.get('/api/curriculum/export', (req: Request, res: Response) => {
  const db = getDB();
  const data = {
    exportDate: new Date().toISOString(),
    blueprint: db.curriculumBlueprint,
    coursesCount: db.courses.length,
    lessonsCount: db.lessons.length,
    lessons: db.lessons
  };
  res.setHeader('Content-Disposition', 'attachment; filename="tradecode_curriculum_catalog.json"');
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(data, null, 2));
});

// ==================== STUDENT PROGRESS & CERTIFICATES ====================
app.get('/api/progress/:userId', (req: Request, res: Response) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ error: 'غير مصرح' });

  const requestedUserId = req.params.userId;
  if (authUser.role !== 'admin' && authUser.id !== requestedUserId) {
    return res.status(403).json({ error: 'لا يمكنك الوصول لبيانات طالب آخر' });
  }

  const db = getDB();
  const progress = db.progress[requestedUserId] || {
    userId: requestedUserId,
    completedLessonIds: [],
    quizAttempts: [],
    certificates: [],
    lastActiveAt: new Date().toISOString()
  };

  return res.json(progress);
});

app.post('/api/progress/complete-lesson', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'غير مصرح' });

  const { lessonId } = req.body;
  if (!lessonId) return res.status(400).json({ error: 'معرف الدرس مطلوب' });

  const db = getDB();
  if (!db.progress[user.id]) {
    db.progress[user.id] = {
      userId: user.id,
      completedLessonIds: [],
      quizAttempts: [],
      certificates: [],
      lastActiveAt: new Date().toISOString()
    };
  }

  const userProg = db.progress[user.id];
  if (!userProg.completedLessonIds.includes(lessonId)) {
    userProg.completedLessonIds.push(lessonId);
  }
  userProg.lastAccessedLessonId = lessonId;
  userProg.lastActiveAt = new Date().toISOString();

  saveDB(db);
  return res.json(userProg);
});

app.post('/api/progress/submit-quiz', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'غير مصرح' });

  const { quizId, answers } = req.body; // answers: { [questionId]: optionId }
  const db = getDB();
  const quiz = db.quizzes.find(q => q.id === quizId);
  if (!quiz) return res.status(404).json({ error: 'الاختبار غير موجود' });

  let correctCount = 0;
  quiz.questions.forEach(q => {
    if (answers && answers[q.id] === q.correctOptionId) {
      correctCount++;
    }
  });

  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = scorePercent >= quiz.passingScore;

  if (!db.progress[user.id]) {
    db.progress[user.id] = {
      userId: user.id,
      completedLessonIds: [],
      quizAttempts: [],
      certificates: [],
      lastActiveAt: new Date().toISOString()
    };
  }

  const userProg = db.progress[user.id];
  userProg.quizAttempts.push({
    quizId,
    courseId: quiz.courseId,
    score: scorePercent,
    passed,
    timestamp: new Date().toISOString(),
    answers: answers || {}
  });

  // If passed and certificate not yet issued for this course, issue verified certificate!
  let newCert: Certificate | null = null;
  const existingCert = userProg.certificates.find(c => c.courseId === quiz.courseId);
  if (passed && !existingCert) {
    const course = db.courses.find(c => c.id === quiz.courseId);
    newCert = {
      id: 'cert_' + Date.now(),
      code: `TCA-${quiz.courseId.slice(7, 10).toUpperCase()}-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      userName: user.name,
      courseId: quiz.courseId,
      courseTitle: course ? course.title.ar : 'دورة متخصصة في TradeCode Academy',
      issueDate: new Date().toLocaleDateString('ar-EG'),
      gradePercent: scorePercent
    };
    userProg.certificates.push(newCert);
    addAuditLog(user.email, 'certificate_issued', 'certificates', `إصدار شهادة برمز ${newCert.code} للطالب ${user.name}`);
  }

  saveDB(db);
  return res.json({
    score: scorePercent,
    passed,
    correctCount,
    totalQuestions: quiz.questions.length,
    certificate: newCert,
    progress: userProg
  });
});

app.get('/api/certificates/:code', (req: Request, res: Response) => {
  const code = req.params.code;
  const db = getDB();
  for (const prog of Object.values(db.progress)) {
    const found = prog.certificates.find(c => c.code === code);
    if (found) {
      return res.json({ verified: true, certificate: found });
    }
  }
  return res.status(404).json({ verified: false, error: 'الشهادة غير مطابقة لأي سجل في الأكاديمية' });
});

// ==================== SUBSCRIPTIONS & PAYMENTS ====================
app.get('/api/subscriptions/plans', (_req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.subscriptionPlans);
});

app.post('/api/subscriptions/plans', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'الصلاحية مقتصرة على المدير' });
  }
  const db = getDB();
  const plan = {
    ...req.body,
    id: req.body.id || 'plan_' + Date.now()
  };
  db.subscriptionPlans.push(plan);
  saveDB(db);
  addAuditLog(user.email, 'plan_create', 'subscriptions', `إضافة خطة اشتراك: ${plan.name?.ar}`);
  return res.json(plan);
});

app.put('/api/subscriptions/plans/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'الصلاحية مقتصرة على المدير' });
  }
  const db = getDB();
  const idx = db.subscriptionPlans.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'الخطة غير موجودة' });

  db.subscriptionPlans[idx] = { ...db.subscriptionPlans[idx], ...req.body };
  saveDB(db);
  addAuditLog(user.email, 'plan_update', 'subscriptions', `تحديث أسعار ومزايا الخطة: ${db.subscriptionPlans[idx].name?.ar}`);
  return res.json(db.subscriptionPlans[idx]);
});

app.get('/api/subscriptions/requests', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'غير مصرح' });

  const db = getDB();
  if (user.role === 'admin') {
    return res.json(db.paymentRequests);
  } else {
    const userReqs = db.paymentRequests.filter(r => r.userId === user.id);
    return res.json(userReqs);
  }
});

app.post('/api/subscriptions/request', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'يرجى تسجيل الدخول أولاً' });

  const { planId, paymentMethod, referenceNumber, proofNote, currency } = req.body;
  if (!planId || !referenceNumber) {
    return res.status(400).json({ error: 'يرجى اختيار الخطة ورقم الإشعار أو المرجع البنكي' });
  }

  const db = getDB();
  const plan = db.subscriptionPlans.find(p => p.id === planId);
  if (!plan) return res.status(404).json({ error: 'الخطة المختارة غير متاحة' });

  // Prevent duplicate pending requests for same user & plan
  const existingPending = db.paymentRequests.find(
    r => r.userId === user.id && r.planId === planId && r.status === 'pending'
  );
  if (existingPending) {
    return res.status(400).json({ error: 'لديك طلب قيد المراجعة بالفعل لهذه الباقة' });
  }

  const amount = currency === 'USD' ? plan.priceUSD : plan.priceMRU;

  const newRequest = {
    id: 'pay_req_' + Date.now(),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    planId: plan.id,
    planName: plan.name.ar,
    amount,
    currency: (currency as 'MRU' | 'USD') || 'MRU',
    paymentMethod: paymentMethod || 'bankily',
    referenceNumber: referenceNumber.trim(),
    proofNote: proofNote ? proofNote.trim() : '',
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  db.paymentRequests.unshift(newRequest);
  saveDB(db);
  addAuditLog(user.email, 'payment_request_submit', 'payments', `إرسال طلب اشتراك بقيمة ${amount} ${newRequest.currency} برقم مرجعي: ${newRequest.referenceNumber}`);

  return res.json({ message: 'تم إرسال طلب الاشتراك بنجاح وهو الآن قيد المراجعة من الإدارة.', request: newRequest });
});

app.post('/api/subscriptions/review', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'مراجعة المدفوعات مقتصرة على المدير' });
  }

  const { requestId, action, reviewNotes } = req.body; // action: 'approve' | 'reject'
  const db = getDB();
  const reqItem = db.paymentRequests.find(r => r.id === requestId);
  if (!reqItem) return res.status(404).json({ error: 'طلب الدفع غير موجود' });

  if (reqItem.status !== 'pending') {
    return res.status(400).json({ error: 'تمت مراجعة هذا الطلب مسبقاً' });
  }

  reqItem.status = action === 'approve' ? 'approved' : 'rejected';
  reqItem.reviewedAt = new Date().toISOString();
  reqItem.reviewedBy = user.email;
  reqItem.reviewNotes = reviewNotes || '';

  // If approved, update student subscription status and expiry
  if (action === 'approve') {
    const student = db.users.find(u => u.id === reqItem.userId);
    const plan = db.subscriptionPlans.find(p => p.id === reqItem.planId);
    if (student) {
      student.subscriptionStatus = 'active';
      student.subscriptionPlanId = reqItem.planId;
      const durationMonths = plan?.durationMonths || 3;
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + durationMonths);
      student.subscriptionExpiresAt = expiry.toISOString();
    }
  }

  saveDB(db);
  addAuditLog(
    user.email,
    action === 'approve' ? 'payment_approved' : 'payment_rejected',
    'payments',
    `تم ${action === 'approve' ? 'الموافقة على' : 'رفض'} طلب دفع الطالب ${reqItem.userName} بقيمة ${reqItem.amount} ${reqItem.currency}`
  );

  return res.json({ message: `تم تحديث حالة الطلب إلى ${reqItem.status}`, request: reqItem });
});

// ==================== MARKETS & NEWS ====================
app.get('/api/markets/quotes', async (_req: Request, res: Response) => {
  try {
    const data = await fetchLiveMarketQuotes();
    return res.json(data);
  } catch (e: any) {
    return res.status(500).json({ error: 'فشل جلب بيانات الأسعار', details: e?.message });
  }
});

app.get('/api/markets/news', async (_req: Request, res: Response) => {
  try {
    const data = await fetchFinancialNews();
    return res.json(data);
  } catch (e: any) {
    return res.status(500).json({ error: 'فشل جلب الأخبار', details: e?.message });
  }
});

app.get('/api/markets/calendar', (_req: Request, res: Response) => {
  return res.json(economicCalendarEvents);
});

// ==================== ADMIN SYSTEM & SETTINGS ====================
app.get('/api/admin/users', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'ممنوع لغير المديرين' });
  }
  const db = getDB();
  const safeUsers = db.users.map(({ passwordHash, ...u }) => u);
  return res.json(safeUsers);
});

app.put('/api/admin/users/:id/role', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'ممنوع لغير المديرين' });
  }
  const { role } = req.body;
  if (!['admin', 'student'].includes(role)) {
    return res.status(400).json({ error: 'دور غير صالح' });
  }
  const db = getDB();
  const target = db.users.find(u => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'المستخدم غير موجود' });

  // Prevent admin from revoking themselves
  if (target.id === user.id && role !== 'admin') {
    return res.status(400).json({ error: 'لا يمكنك سحب صلاحية المدير من نفسك' });
  }

  target.role = role;
  saveDB(db);
  addAuditLog(user.email, 'user_role_change', 'users', `تغيير دور المستخدم ${target.email} إلى ${role}`);
  return res.json({ success: true, user: target });
});

app.get('/api/admin/settings', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.siteSettings);
});

app.post('/api/admin/settings', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'ممنوع لغير المديرين' });
  }
  const db = getDB();
  db.siteSettings = { ...db.siteSettings, ...req.body };
  saveDB(db);
  addAuditLog(user.email, 'settings_update', 'settings', 'تحديث إعدادات وتعليمات الدفع للمنصة');
  return res.json(db.siteSettings);
});

app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'ممنوع لغير المديرين' });
  }
  const db = getDB();
  return res.json(db.auditLogs);
});

// ==================== VITE & STATIC SERVING ====================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TradeCode Academy full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
