import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { SubscriptionPlan, PaymentRequest, SiteSettings } from '../types/index.js';
import {
  CreditCard,
  Check,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Clock,
  Send,
  X,
  FileCheck,
  QrCode,
  DollarSign
} from 'lucide-react';

interface PricingViewProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onNavigate: (view: string, param?: any) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onOpenAuth, onNavigate }) => {
  const { user, authFetch, language } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currency, setCurrency] = useState<'MRU' | 'USD'>('MRU');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Selected plan for checkout modal
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bankily' | 'masrvi' | 'sedad' | 'binance' | 'bank_transfer'>('bankily');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/subscriptions/plans')
      .then(r => r.json())
      .then(data => setPlans(data || []))
      .catch(console.error);

    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const handleOpenCheckout = (plan: SubscriptionPlan) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    setCheckoutPlan(plan);
    setSubmitSuccess(null);
    setSubmitError(null);
    setReferenceNumber('');
    setProofNote('');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan || !user) return;

    if (!referenceNumber.trim()) {
      setSubmitError('يرجى إدخال رقم العملية أو الإشعار البنكي المرجعي');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await authFetch('/api/subscriptions/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: checkoutPlan.id,
          paymentMethod,
          referenceNumber: referenceNumber.trim(),
          proofNote: proofNote.trim(),
          currency
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(data.message || 'تم إرسال طلب الاشتراك بنجاح وهو الآن قيد المراجعة!');
      } else {
        setSubmitError(data.error || 'فشل إرسال طلب الدفع');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMethodInstruction = () => {
    if (!settings?.paymentInstructions) return '';
    const key = paymentMethod === 'bank_transfer' ? 'bankTransfer' : paymentMethod;
    return settings.paymentInstructions[key as keyof typeof settings.paymentInstructions] || '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5" />
          خطط الاشتراكات التعليمية الشفافة
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          استثمر في مهاراتك بأسعار مرنة وعادلة
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          اختر الباقة المناسبة لأهدافك. ندعم الدفع بالعملة الوطنية الموريتانية (MRU) والدولار الأمريكي (USD) مع مراجعة واعتماد يدوي آمن من الإدارة.
        </p>

        {/* Currency Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setCurrency('MRU')}
            className={`px-4 py-1.5 rounded-lg font-bold transition ${
              currency === 'MRU' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            الأوقية الموريتانية (MRU)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-1.5 rounded-lg font-bold transition ${
              currency === 'USD' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            الدولار الأمريكي (USD $)
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const price = currency === 'USD' ? plan.priceUSD : plan.priceMRU;
          const currencyLabel = currency === 'USD' ? '$' : 'MRU';
          const isFree = price === 0;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition shadow-2xl relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/30 border-2 border-cyan-500/50 shadow-cyan-500/10'
                  : 'bg-slate-900 border border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] uppercase shadow-lg">
                  {plan.badge[language] || plan.badge.ar}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {plan.name[language] || plan.name.ar}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {plan.description[language] || plan.description.ar}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {isFree ? 'مجاناً' : price.toLocaleString()}
                    </span>
                    {!isFree && <span className="text-sm font-semibold text-cyan-400">{currencyLabel}</span>}
                  </div>
                  <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                    {isFree ? 'وصول دائم ومستمر' : `لمدة ${plan.durationMonths} أشهر تدريبية`}
                  </span>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">
                    المزايا المشمولة:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{feat[language] || feat.ar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                {isFree ? (
                  <button
                    onClick={() => user ? onNavigate('courses') : onOpenAuth('register')}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-300 bg-slate-950 border border-slate-800 hover:text-white hover:border-slate-700 transition"
                  >
                    استكشف الدروس المجانية
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? 'text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-cyan-500/25'
                        : 'text-white bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <span>طلب الاشتراك وتأكيد الدفع</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Checkout Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  إتمام الاشتراك في: {checkoutPlan.name[language] || checkoutPlan.name.ar}
                </h3>
                <span className="text-xs text-cyan-400 font-mono">
                  المبلغ المطلوب: {currency === 'USD' ? checkoutPlan.priceUSD : checkoutPlan.priceMRU} {currency}
                </span>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <FileCheck className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">تم إرسال طلب الاشتراك بنجاح!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {submitSuccess}
                </p>
                <p className="text-[11px] text-slate-500">
                  سيقوم المدير بمراجعة إشعار التحويل البنكي وتفعيل حسابك خلال دقائق. يمكنك متابعة حالة الطلب من لوحة الطالب.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setCheckoutPlan(null);
                      onNavigate('student');
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition"
                  >
                    الانتقال للوحة الطالب
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitPayment} className="p-6 space-y-5">
                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Select Payment Method */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    اختر وسيلة الدفع المتاحة لديك:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'bankily', label: 'بنكيلي (Bankily)' },
                      { id: 'masrvi', label: 'مصرفي (Masrvi)' },
                      { id: 'sedad', label: 'سداد (Sedad)' },
                      { id: 'binance', label: 'Binance Pay (USDT)' },
                      { id: 'bank_transfer', label: 'تحويل بنكي مباشر' }
                    ].map(meth => (
                      <button
                        key={meth.id}
                        type="button"
                        onClick={() => setPaymentMethod(meth.id as any)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center border transition ${
                          paymentMethod === meth.id
                            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {meth.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions Box Written By Admin */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs space-y-1">
                  <span className="text-cyan-400 font-bold block">تعليمات الدفع المعتمدة:</span>
                  <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                    {getMethodInstruction() || 'قم بتحويل المبلغ لحساب الأكاديمية الرسمي واحتفظ برقم الإشعار المرجعي.'}
                  </p>
                </div>

                {/* Reference Number Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    رقم العملية أو الإشعار المرجعي (Reference Number) *
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    placeholder="مثال: BNK-874920 أو كود التحويل"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    يستخدم هذا الرقم للتحقق اليدوي من الإيداع ومطابقته فورياً.
                  </span>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ملاحظات أو اسم صاحب الحساب المحول منه (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={proofNote}
                    onChange={e => setProofNote(e.target.value)}
                    placeholder="أي توضيحات مساعدة للمدير..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'جاري الإرسال...' : 'تأكيد وإرسال طلب الاشتراك للمراجعة'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
