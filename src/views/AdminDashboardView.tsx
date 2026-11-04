import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Course,
  Lesson,
  PaymentRequest,
  SubscriptionPlan,
  SiteSettings,
  AuditLog,
  CurriculumStats,
  Track,
  Level
} from '../types/index.js';
import {
  Shield,
  BookOpen,
  CreditCard,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Save,
  Check,
  X
} from 'lucide-react';

interface AdminDashboardViewProps {
  courses: Course[];
  onRefreshCourses: () => void;
  onNavigate: (view: string, param?: any) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ courses, onRefreshCourses, onNavigate }) => {
  const { user, authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<'curriculum' | 'payments' | 'users' | 'settings'>('curriculum');

  // Curriculum & Lessons State
  const [curriculumStats, setCurriculumStats] = useState<CurriculumStats | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsTotal, setLessonsTotal] = useState(0);
  const [lessonFilterTrack, setLessonFilterTrack] = useState<string>('all');
  const [lessonSearch, setLessonSearch] = useState('');
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);

  // Lesson Edit / Create Modal State
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Payment Requests State
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [reviewingReq, setReviewingReq] = useState<PaymentRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // Users State
  const [usersList, setUsersList] = useState<any[]>([]);

  // Settings & Audit Logs State
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Loading indicator
  const [loading, setLoading] = useState(true);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, lessonsRes, payRes, plansRes, usersRes, settingsRes, auditRes] = await Promise.all([
        authFetch('/api/curriculum/stats'),
        authFetch('/api/lessons?limit=150'),
        authFetch('/api/subscriptions/requests'),
        authFetch('/api/subscriptions/plans'),
        authFetch('/api/admin/users'),
        authFetch('/api/admin/settings'),
        authFetch('/api/admin/audit-logs')
      ]);

      if (statsRes.ok) setCurriculumStats(await statsRes.json());
      if (lessonsRes.ok) {
        const data = await lessonsRes.json();
        setLessons(data.lessons || []);
        setLessonsTotal(data.total || 0);
      }
      if (payRes.ok) setPaymentRequests(await payRes.json());
      if (plansRes.ok) setPlans(await plansRes.json());
      if (usersRes.ok) setUsersList(await usersRes.json());
      if (settingsRes.ok) setSiteSettings(await settingsRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (e) {
      console.error('Failed to load admin portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAllAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">منطقة إدارية محمية بصلاحيات الخادم</h2>
        <p className="text-xs text-slate-400">
          هذه الصفحة مخصصة لمدير المنصة فقط.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  // Handle Generate Next Batch of Lessons (20 to 50 items)
  const handleGenerateBatch = async (track: Track, batchSize: number) => {
    setIsGeneratingBatch(true);
    setBatchSuccessMessage(null);
    try {
      const res = await authFetch('/api/curriculum/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track, batchSize, publishImmediately: true })
      });

      const data = await res.json();
      if (res.ok) {
        setBatchSuccessMessage(data.message);
        loadAllAdminData();
        onRefreshCourses();
      }
    } catch (e) {
      console.error('Error generating batch:', e);
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  // Handle Save Lesson (Create or Update)
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    try {
      const isNew = !editingLesson.id;
      const url = isNew ? '/api/lessons' : `/api/lessons/${editingLesson.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLesson)
      });

      if (res.ok) {
        setIsLessonModalOpen(false);
        setEditingLesson(null);
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed saving lesson:', e);
    }
  };

  // Handle Delete Lesson
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس نهائياً؟')) return;
    try {
      const res = await authFetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to delete lesson:', e);
    }
  };

  // Handle Review Payment (Approve or Reject)
  const handleReviewPayment = async (action: 'approve' | 'reject') => {
    if (!reviewingReq) return;
    setIsReviewing(true);
    try {
      const res = await authFetch('/api/subscriptions/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: reviewingReq.id,
          action,
          reviewNotes
        })
      });

      if (res.ok) {
        setReviewingReq(null);
        setReviewNotes('');
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to review payment request:', e);
    } finally {
      setIsReviewing(false);
    }
  };

  // Handle Change User Role
  const handleChangeRole = async (targetUserId: string, newRole: 'admin' | 'student') => {
    try {
      const res = await authFetch(`/api/admin/users/${targetUserId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to change user role:', e);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      }
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  // Filter lessons in admin table
  const filteredLessons = lessons.filter(l => {
    if (lessonFilterTrack !== 'all' && l.track !== lessonFilterTrack) return false;
    if (lessonSearch.trim()) {
      const q = lessonSearch.toLowerCase();
      if (!l.title.ar.toLowerCase().includes(q) && !l.description.ar.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                لوحة الإدارة المركزية (Admin Console)
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                صلاحيات كاملة
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة الـ 2500 درس، مراجعة اشتراكات الطلاب، ضبط الأسعار، وسجلات الأمان
            </p>
          </div>
        </div>

        <button
          onClick={loadAllAdminData}
          disabled={loading}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          تحديث البيانات
        </button>
      </div>

      {/* Main Admin Tabs (Touch-friendly buttons for Android) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        {[
          { id: 'curriculum', label: 'المكتبة التعليمية (2500 درس)', icon: BookOpen },
          { id: 'payments', label: `طلبات الدفع والاشتراك (${paymentRequests.filter(r => r.status === 'pending').length} معلق)`, icon: CreditCard },
          { id: 'users', label: `المستخدمين والطلاب (${usersList.length})`, icon: Users },
          { id: 'settings', label: 'إعدادات المنصة والسجلات', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: CURRICULUM & 2500 LESSONS ================= */}
      {activeTab === 'curriculum' && (
        <div className="space-y-8">
          {/* 2500 Catalog Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">الهدف المنهجي الإجمالي</span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {curriculumStats?.targetLessons || 2500}
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">عنصر تعليمي مخطط</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">الدروس المكتملة والمنشورة</span>
              <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">
                {curriculumStats?.completedLessons || lessons.length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">في قاعدة البيانات الفعلية</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">أكاديمية التداول (هدف 1200)</span>
              <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">
                {curriculumStats?.tracksBreakdown.trading.completed || 0}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">درس مكتمل حالياً</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">أكاديمية البرمجة (هدف 1000)</span>
              <span className="text-2xl font-black text-blue-400 font-mono mt-1 block">
                {curriculumStats?.tracksBreakdown.programming.completed || 0}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">درس مكتمل حالياً</span>
            </div>
          </div>

          {/* Batch Generator Panel */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  أداة توليد ونشر دفعات الدروس المنهجية (Batch Generator)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  توليد دفعة تضم 20 إلى 50 درساً حقيقياً ومتفرداً وحفظها فورياً في قاعدة البيانات لمتابعة إنجاز الـ 2500 درس
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/api/curriculum/export"
                  download="tradecode_curriculum_catalog.json"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  تصدير الفهرس JSON
                </a>
              </div>
            </div>

            {batchSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{batchSuccessMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isGeneratingBatch}
                onClick={() => handleGenerateBatch('trading', 20)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                توليد دفعة تداول (20 درساً في الفوركس والذهب)
              </button>

              <button
                type="button"
                disabled={isGeneratingBatch}
                onClick={() => handleGenerateBatch('programming', 20)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 transition flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                توليد دفعة برمجة (20 درساً في الويب وبايثون)
              </button>
            </div>
          </div>

          {/* Lessons Management Table with Search & Filter */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute top-3 right-3 pointer-events-none" />
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={e => setLessonSearch(e.target.value)}
                    placeholder="ابحث في عناوين الدروس والمحتوى..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={lessonFilterTrack}
                  onChange={e => setLessonFilterTrack(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">كافة الأقسام</option>
                  <option value="trading">التداول</option>
                  <option value="programming">البرمجة</option>
                  <option value="risk_psychology">المخاطر</option>
                  <option value="projects_quizzes">المشاريع</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingLesson({
                    title: { ar: '', fr: '', en: '' },
                    description: { ar: '', fr: '', en: '' },
                    content: { ar: '', fr: '', en: '' },
                    track: 'trading',
                    level: 'beginner',
                    durationMin: 30,
                    courseId: courses[0]?.id || 'course_trade_intro',
                    isFree: true,
                    isPublished: true,
                    objectives: [{ ar: '', fr: '', en: '' }],
                    keyTakeaways: [{ ar: '', fr: '', en: '' }]
                  });
                  setIsLessonModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> إضافة درس يدوياً
              </button>
            </div>

            {/* Lessons Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-start">عنوان الدرس</th>
                      <th className="px-4 py-3 text-start">المسار</th>
                      <th className="px-4 py-3 text-start">المستوى</th>
                      <th className="px-4 py-3 text-start">المدة</th>
                      <th className="px-4 py-3 text-start">الوصول</th>
                      <th className="px-4 py-3 text-start">الحالة</th>
                      <th className="px-4 py-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredLessons.map(lesson => (
                      <tr key={lesson.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-semibold text-slate-200 max-w-xs truncate">
                          {lesson.title.ar}
                        </td>
                        <td className="px-4 py-3 uppercase text-[10px] font-bold text-cyan-400">
                          {lesson.track}
                        </td>
                        <td className="px-4 py-3 uppercase text-slate-400">
                          {lesson.level}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {lesson.durationMin} دقيقة
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lesson.isFree ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {lesson.isFree ? 'مجاني' : 'PRO'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lesson.isPublished ? 'text-emerald-400' : 'text-slate-500'
                          }`}>
                            {lesson.isPublished ? 'منشور' : 'مسودة'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingLesson(lesson);
                                setIsLessonModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                              title="تعديل الدرس"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="حذف الدرس"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PAYMENTS & SUBSCRIPTIONS ================= */}
      {activeTab === 'payments' && (
        <div className="space-y-8">
          {/* Pending Payment Requests */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              طلبات الدفع والاشتراك الواردة من الطلاب
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-start">الطالب</th>
                      <th className="px-4 py-3 text-start">الباقة</th>
                      <th className="px-4 py-3 text-start">المبلغ</th>
                      <th className="px-4 py-3 text-start">الوسيلة</th>
                      <th className="px-4 py-3 text-start">الرقم المرجعي</th>
                      <th className="px-4 py-3 text-start">الحالة</th>
                      <th className="px-4 py-3 text-center">مراجعة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {paymentRequests.map(req => (
                      <tr key={req.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <strong className="text-white block">{req.userName}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">{req.userEmail}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-200 font-semibold">{req.planName}</td>
                        <td className="px-4 py-3 font-mono font-bold text-cyan-400">
                          {req.amount} {req.currency}
                        </td>
                        <td className="px-4 py-3 uppercase text-slate-300">{req.paymentMethod}</td>
                        <td className="px-4 py-3 font-mono text-amber-300">{req.referenceNumber}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : req.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {req.status === 'approved' ? 'مقبول' : req.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {req.status === 'pending' ? (
                            <button
                              onClick={() => {
                                setReviewingReq(req);
                                setReviewNotes('');
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
                            >
                              مراجعة واتخاذ قرار
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500">تمت المراجعة</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Subscription Plans & Pricing Configuration */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              تعديل أسعار باقات الاشتراك بالـ MRU والـ USD
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm">{p.name.ar}</h4>
                  <p className="text-xs text-slate-400">{p.description.ar}</p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">السعر (MRU):</label>
                      <input
                        type="number"
                        value={p.priceMRU}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setPlans(plans.map(item => item.id === p.id ? { ...item, priceMRU: val } : item));
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">السعر (USD $):</label>
                      <input
                        type="number"
                        value={p.priceUSD}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setPlans(plans.map(item => item.id === p.id ? { ...item, priceUSD: val } : item));
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      const res = await authFetch(`/api/subscriptions/plans/${p.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(p)
                      });
                      if (res.ok) alert('تم حفظ تعديل السعر بنجاح!');
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition"
                  >
                    حفظ السعر الجديد
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: USERS & ROLES ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            حسابات الطلاب والمديرين ({usersList.length})
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-start">الاسم</th>
                    <th className="px-4 py-3 text-start">البريد الإلكتروني</th>
                    <th className="px-4 py-3 text-start">الدور الحالي</th>
                    <th className="px-4 py-3 text-start">الاشتراك</th>
                    <th className="px-4 py-3 text-start">تاريخ الانضمام</th>
                    <th className="px-4 py-3 text-center">تعديل الدور</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-semibold text-white">{u.name}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {u.role === 'admin' ? 'مدير (Admin)' : 'طالب (Student)'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.subscriptionStatus === 'active' ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          {u.subscriptionStatus === 'active' ? 'نشط VIP' : 'خطة مجانية'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.id !== user.id && (
                          <button
                            onClick={() => handleChangeRole(u.id, u.role === 'admin' ? 'student' : 'admin')}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition"
                          >
                            {u.role === 'admin' ? 'تخفيض لطالب' : 'ترقية لمدير'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SETTINGS & AUDIT LOGS ================= */}
      {activeTab === 'settings' && siteSettings && (
        <div className="space-y-8">
          {/* Payment Instructions Form */}
          <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  بيانات حسابات الاستقبال وتعليمات الدفع للطلاب
                </h3>
                <p className="text-xs text-slate-400">
                  تظهر هذه التعليمات للطلاب في نافذة الاشتراك عند اختيار وسيلة الدفع
                </p>
              </div>
              {settingsSaved && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> تم الحفظ بنجاح!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تعليمات بنكيلي (Bankily)
                </label>
                <input
                  type="text"
                  value={siteSettings.paymentInstructions.bankily}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    paymentInstructions: { ...siteSettings.paymentInstructions, bankily: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تعليمات مصرفي (Masrvi)
                </label>
                <input
                  type="text"
                  value={siteSettings.paymentInstructions.masrvi}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    paymentInstructions: { ...siteSettings.paymentInstructions, masrvi: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تعليمات سداد (Sedad)
                </label>
                <input
                  type="text"
                  value={siteSettings.paymentInstructions.sedad}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    paymentInstructions: { ...siteSettings.paymentInstructions, sedad: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تعليمات Binance Pay ID (USDT)
                </label>
                <input
                  type="text"
                  value={siteSettings.paymentInstructions.binance}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    paymentInstructions: { ...siteSettings.paymentInstructions, binance: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تعليمات التحويل البنكي المباشر (Bank Transfer / IBAN)
                </label>
                <input
                  type="text"
                  value={siteSettings.paymentInstructions.bankTransfer}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    paymentInstructions: { ...siteSettings.paymentInstructions, bankTransfer: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> حفظ الإعدادات
              </button>
            </div>
          </form>

          {/* Audit Logs Table */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              سجل تدقيق العمليات الإدارية الحساسة (Audit Trail)
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-h-96 overflow-y-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5 text-start">التوقيت</th>
                    <th className="px-4 py-2.5 text-start">المسؤول</th>
                    <th className="px-4 py-2.5 text-start">الإجراء</th>
                    <th className="px-4 py-2.5 text-start">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                      </td>
                      <td className="px-4 py-2.5 text-cyan-300 font-semibold">{log.actor}</td>
                      <td className="px-4 py-2.5 text-amber-400">{log.action}</td>
                      <td className="px-4 py-2.5 text-slate-300 font-sans">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review Payment Modal */}
      {reviewingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">مراجعة طلب دفع الطالب</h3>
              <button onClick={() => setReviewingReq(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p>الطالب: <strong className="text-white">{reviewingReq.userName}</strong> ({reviewingReq.userEmail})</p>
              <p>الباقة المطلوبة: <strong className="text-cyan-400">{reviewingReq.planName}</strong></p>
              <p>المبلغ المطلوب: <strong className="text-white font-mono">{reviewingReq.amount} {reviewingReq.currency}</strong></p>
              <p>طريقة التحويل: <strong className="text-white uppercase">{reviewingReq.paymentMethod}</strong></p>
              <p>الرقم المرجعي المدخل: <strong className="text-amber-400 font-mono">{reviewingReq.referenceNumber}</strong></p>
              {reviewingReq.proofNote && (
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  ملاحظات الطالب: "{reviewingReq.proofNote}"
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ملاحظات المراجعة (اختياري)
              </label>
              <input
                type="text"
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder="مثال: تم التأكد من الإيداع في بنكيلي"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={isReviewing}
                onClick={() => handleReviewPayment('approve')}
                className="py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> تأكيد وتفعيل الاشتراك
              </button>
              <button
                disabled={isReviewing}
                onClick={() => handleReviewPayment('reject')}
                className="py-2.5 rounded-xl font-bold text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> رفض الطلب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Edit / Create Modal */}
      {isLessonModalOpen && editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">
                {editingLesson.id ? 'تعديل بيانات الدرس' : 'إضافة درس تعليمي جديد'}
              </h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">عنوان الدرس (بالعربية) *</label>
                  <input
                    type="text"
                    required
                    value={editingLesson.title?.ar || ''}
                    onChange={e => setEditingLesson({
                      ...editingLesson,
                      title: { ...editingLesson.title!, ar: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">العنوان بالإنجليزية (English)</label>
                  <input
                    type="text"
                    value={editingLesson.title?.en || ''}
                    onChange={e => setEditingLesson({
                      ...editingLesson,
                      title: { ...editingLesson.title!, en: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">وصف موجز للدرس</label>
                <textarea
                  rows={2}
                  value={editingLesson.description?.ar || ''}
                  onChange={e => setEditingLesson({
                    ...editingLesson,
                    description: { ...editingLesson.description!, ar: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المسار (Track)</label>
                  <select
                    value={editingLesson.track || 'trading'}
                    onChange={e => setEditingLesson({ ...editingLesson, track: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="trading">أكاديمية التداول</option>
                    <option value="programming">أكاديمية البرمجة</option>
                    <option value="risk_psychology">إدارة المخاطر</option>
                    <option value="projects_quizzes">المشاريع</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المستوى</label>
                  <select
                    value={editingLesson.level || 'beginner'}
                    onChange={e => setEditingLesson({ ...editingLesson, level: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المدة (بالدقائق)</label>
                  <input
                    type="number"
                    value={editingLesson.durationMin || 30}
                    onChange={e => setEditingLesson({ ...editingLesson, durationMin: parseInt(e.target.value) || 15 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">محتوى الشرح الكامل (Markdown / Text)</label>
                <textarea
                  rows={6}
                  value={editingLesson.content?.ar || ''}
                  onChange={e => setEditingLesson({
                    ...editingLesson,
                    content: { ...editingLesson.content!, ar: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingLesson.isFree ?? true}
                    onChange={e => setEditingLesson({ ...editingLesson, isFree: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800"
                  />
                  <span>درس مجاني استكشافي</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold">
                  <input
                    type="checkbox"
                    checked={editingLesson.isPublished ?? true}
                    onChange={e => setEditingLesson({ ...editingLesson, isPublished: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800"
                  />
                  <span>نشر الدرس فورياً</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950"
                >
                  حفظ ونشر الدرس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
