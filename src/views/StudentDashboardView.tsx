import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Course, Lesson, UserProgress, PaymentRequest, Certificate } from '../types/index.js';
import { CertificateModal } from '../components/CertificateModal.js';
import {
  User,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  FileCheck,
  PlayCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface StudentDashboardViewProps {
  courses: Course[];
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ courses, onNavigate, onOpenAuth }) => {
  const { user, authFetch } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [progRes, payRes] = await Promise.all([
          authFetch(`/api/progress/${user.id}`),
          authFetch('/api/subscriptions/requests')
        ]);

        if (progRes.ok) {
          const progData = await progRes.json();
          setProgress(progData);
        }

        if (payRes.ok) {
          const payData = await payRes.json();
          setPaymentRequests(payData || []);
        }
      } catch (e) {
        console.error('Failed to load student dashboard:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">يرجى تسجيل الدخول للوصول إلى لوحة الطالب</h2>
        <p className="text-xs text-slate-400">
          تابع مسارك التعليمي، إنجازاتك في الدروس، وشهاداتك المعتمدة.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
        >
          تسجيل الدخول الآن
        </button>
      </div>
    );
  }

  const completedLessonIds = progress?.completedLessonIds || [];
  const certificates = progress?.certificates || [];
  const quizAttempts = progress?.quizAttempts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-black text-2xl">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                أهلاً بك، {user.name}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                user.subscriptionStatus === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {user.subscriptionStatus === 'active' ? 'اشتراك نشط VIP' : 'خطة مجانية'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              البريد: {user.email} • عضو منذ {new Date(user.createdAt).toLocaleDateString('ar-EG')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('courses')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            تصفح الدورات والدروس
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            إدارة الاشتراك
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block">الدروس المكتملة</span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
            {completedLessonIds.length}
          </span>
          <span className="text-[10px] text-slate-500">تم حفظها في ملفك</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block">الاختبارات المجتازة</span>
          <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">
            {quizAttempts.filter(q => q.passed).length}
          </span>
          <span className="text-[10px] text-slate-500">من إجمالي {quizAttempts.length} محاولة</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block">الشهادات المكتسبة</span>
          <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
            {certificates.length}
          </span>
          <span className="text-[10px] text-slate-500">موثقة برمز فريد</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block">حالة الاشتراك</span>
          <span className="text-sm font-bold text-slate-200 mt-2 block">
            {user.subscriptionStatus === 'active' ? 'مفعل غير محدود' : 'استكشافي'}
          </span>
          <span className="text-[10px] text-slate-500">MRU / USD</span>
        </div>
      </div>

      {/* Active Courses Progress */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          دوراتك ومتابعة الإنجاز
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 4).map(course => {
            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-400">{course.category}</span>
                    <span className="text-slate-400 font-mono">{course.durationHours} ساعة</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm">{course.title.ar}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{course.description.ar}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('course-detail', course.id)}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>فتح الدورة والدروس</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificates Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          شهادات الإتمام المعتمدة ({certificates.length})
        </h2>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {cert.code}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold font-mono">
                    {cert.gradePercent}%
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{cert.courseTitle}</h4>
                <p className="text-[11px] text-slate-400">تاريخ الإصدار: {cert.issueDate}</p>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  عرض وتحميل الشهادة
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            أكمل دروس أي دورة واجتز اختبارها بنسبة 70% لتحصل على شهادة التخرج الرسمية الموثقة.
          </div>
        )}
      </div>

      {/* Payment Requests History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-cyan-400" />
          سجل طلبات الاشتراكات والدفع اليدوي
        </h2>

        {paymentRequests.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-mono">
                  <tr>
                    <th className="px-4 py-3 text-start">الباقة</th>
                    <th className="px-4 py-3 text-start">المبلغ</th>
                    <th className="px-4 py-3 text-start">الوسيلة</th>
                    <th className="px-4 py-3 text-start">الرقم المرجعي</th>
                    <th className="px-4 py-3 text-start">الحالة</th>
                    <th className="px-4 py-3 text-start">تاريخ الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {paymentRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-bold text-white">{req.planName}</td>
                      <td className="px-4 py-3 font-mono">{req.amount} {req.currency}</td>
                      <td className="px-4 py-3 capitalize">{req.paymentMethod}</td>
                      <td className="px-4 py-3 font-mono text-cyan-300">{req.referenceNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {req.status === 'approved' ? 'مقبول ومفعل' : req.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono">
                        {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            لا توجد طلبات دفع مسجلة حالياً.
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};
