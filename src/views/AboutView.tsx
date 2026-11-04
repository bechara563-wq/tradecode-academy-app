import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  TrendingUp,
  Code,
  ShieldCheck,
  Award,
  Globe,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
  Target,
  Zap,
  Users,
  Compass
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { user } = useAuth();
  const whatsappNumber = '48885937';
  const whatsappFull = '+22248885937';
  const whatsappLink = `https://wa.me/22248885937`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. HERO HEADER */}
      <section className="relative text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>من نحن • رسالة ورؤية TradeCode Academy</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          المنصة الأولى التي تدمج <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">احتراف التداول</span> مع قوة البرمجيات
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          تأسست <strong>TradeCode Academy</strong> لكسر النمطية في التعليم المالي والتقني، حيث نؤمن بأن المتداول المعاصر لا يمكنه المنافسة في الأسواق دون فهم الخوارزميات، وأن المبرمج المالي يحتاج إلى معرفة دقيقة بسيكولوجية الأسواق وحركة الأسعار.
        </p>

        {/* Quick WhatsApp Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/20 transition flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5 text-slate-950 fill-current" />
            <span>تواصل معنا مباشرة عبر واتساب: {whatsappNumber}</span>
          </a>

          <button
            onClick={() => onNavigate('courses')}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition"
          >
            استكشف المسارات التعليمية
          </button>
        </div>
      </section>

      {/* 2. OUR STORY & PHILOSOPHY */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">فلسفتنا التعليمية</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            لماذا الجمع بين التداول والبرمجة؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            في العقد الحالي، تحولت أكثر من 80% من تداولات البورصات العالمية وصناديق التحوط Wall Street إلى أنظمة آلية تعتمد على الأكواد والذكاء الاصطناعي وواجهات برمجية سريعة.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            المتداول الذي يمتلك مهارات كتابة سكريبتات Python لتحليل البيانات، وفحص استراتيجيته تاريخياً (Backtesting)، وبناء لوحاته ومؤشراته الخاصة، يتفوق بـ 10 أضعاف على المتداول العاطفي الذي يعتمد على الحدس العشوائي.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-400 block mb-1">تداول علمي صارم</strong>
              <span className="text-slate-400 text-[11px]">قائم على إدارة رأس المال وحركة السعر والسيولة المؤسسية.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-blue-400 block mb-1">برمجة تطبيقية واقعية</strong>
              <span className="text-slate-400 text-[11px]">بناء مشاريع ويب وبوتات تداول حقيقية باستخدام جافاسكريبت وبايثون.</span>
            </div>
          </div>
        </div>

        {/* Visual Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                TC
              </div>
              <span className="font-bold text-white text-sm">أركان TradeCode Academy</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
              2,500 درس مستهدف
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">بيانات حقيقية وشفافة:</strong>
                <span className="text-slate-400">أسعار لحظية مستمدة من Binance وOpen Rates دون تزييف أو ادعاءات مضللة.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">إدارة مخاطر غير قابلة للتفاوض:</strong>
                <span className="text-slate-400">قاعدة الـ 1% لحماية رأس المال من التصفير وتأهيل المتداولين لاجتياز حسابات التمويل.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">شهادات إتمام موثقة برمز فريد:</strong>
                <span className="text-slate-400">إمكانية التحقق من مصداقية كل شهادة برقم كودي معتمد (TCA-XXXX-XXXX).</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">مرونة الدفع المحلية والدولية:</strong>
                <span className="text-slate-400">دعم التطبيقات الموريتانية (Bankily, Masrvi, Sedad) وBinance Pay مع مراجعة يدوية فورية.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">ركائزنا الأساسية</h2>
          <p className="text-xs text-slate-400">معايير جودة نلتزم بها في كل مسار ودرس نقدمه</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">أكاديمية التداول</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1,200 درس مستهدف يغطي الفوركس، الذهب، الكريبتو، الشموع اليابانية، وحركة السعر وتحديات الـ Prop Firms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">أكاديمية البرمجة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1,000 درس مستهدف في تطوير الويب، جافاسكريبت، بايثون المالية، واجهات APIs، والذكاء الاصطناعي.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">إدارة المخاطر وعلم النفس</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              200 درس مخصص لضبط المشاعر، التغلب على الطمع والخوف، وتحديد أحجام الصفقات وسجل التداول.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">المشاريع والشهادات</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              100 مشروع تطبيقي واختبار كفاءة شامل لمنح شهادات تخرج رسمية معتمدة برمز تحقق فريد.
            </p>
          </div>
        </div>
      </section>

      {/* 4. DIRECT CONTACT & WHATSAPP SECTION */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Phone className="w-3.5 h-3.5" />
              <span>تواصل مباشر وسريع</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              هل لديك استفسار أو ترغب في الاشتراك؟
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              فريق الأكاديمية متاح للإجابة على استفسارات الطلاب، وتأكيد اشتراكات بنكيلي ومصرفي وسداد، وتقديم الدعم الفني والتوجيه التعليمي طوال أيام الأسبوع.
            </p>

            <div className="space-y-3 text-xs pt-2">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">واتساب الإدارة المباشر:</span>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-extrabold text-emerald-400 font-mono hover:underline"
                  >
                    {whatsappNumber} ({whatsappFull})
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">البريد الإلكتروني الرسمي:</span>
                  <a href="mailto:contact@tradecode.academy" className="font-mono text-cyan-300 hover:underline">
                    contact@tradecode.academy
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 fill-current" />
            </div>

            <h3 className="font-bold text-white text-base">محادثة واتساب فورية</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              اضغط على الزر أدناه لبدء محادثة مباشرة مع إدارة TradeCode Academy لتسجيل وتفعيل اشتراكك أو طرح أي سؤال:
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/20 transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>مراسلتنا عبر واتساب الآن ({whatsappNumber})</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
