import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { TrendingUp, Mail, Phone, ShieldAlert, Award, ExternalLink, MessageCircle, Info } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useAuth();
  const whatsappNumber = '48885937';
  const whatsappLink = `https://wa.me/22248885937`;

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                TradeCode <span className="text-cyan-400">Academy</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              أكاديمية احترافية رائدة تجمع بين تعليم أسرار التداول في الأسواق المالية (الفوركس، الذهب، الكريبتو) وهندسة البرمجيات والذكاء الاصطناعي مع بيانات الأسواق الحية، مستهدفة أكثر من 2500 عنصر تعليمي حقيقي.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs">
                <Award className="w-3.5 h-3.5" />
                شهادات إتمام موثقة برمز فريد
              </span>
              <button
                onClick={() => onNavigate('about')}
                className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition underline underline-offset-4"
              >
                تعرف علينا أكثر (من نحن) ↗
              </button>
            </div>
          </div>

          {/* Quick Links: Trading */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t('trackTrading')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-cyan-400 transition">
                  تداول الذهب XAUUSD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-cyan-400 transition">
                  أساسيات سوق الفوركس
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-cyan-400 transition">
                  الشموع وحركة السعر Price Action
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-cyan-400 transition">
                  الحسابات الممولة Prop Firms
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Programming & About */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t('trackProgramming')} & الأكاديمية
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-cyan-400 transition">
                  تطوير الويب الحديث HTML/CSS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-cyan-400 transition">
                  برمجة JavaScript التفاعلية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-cyan-400 transition">
                  بايثون المالية Python for Finance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  صفحة من نحن (About Us)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              التواصل والدعم المباشر
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition group"
              >
                <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 group-hover:bg-emerald-500/20">
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>واتساب: {whatsappNumber} (تواصل الآن)</span>
              </a>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <a href="mailto:contact@tradecode.academy" className="hover:underline">contact@tradecode.academy</a>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                خدمة الطلاب والمراجعة وتأكيد الاشتراكات متاحة طوال أيام الأسبوع عبر واتساب.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Risk Warning Banner */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 mb-8 text-xs leading-relaxed text-slate-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block mb-1">
              إخلاء مسؤولية المخاطر المالية والتعليمية (Financial Risk Disclaimer):
            </span>
            تداول العملات الأجنبية (Forex)، وعقود الفروقات (CFDs)، والذهب، والعملات الرقمية ينطوي على درجة عالية من المخاطرة برأس المال بسبب الرافعة المالية والتقلبات السعرية. المحتوى المقدم في منصة TradeCode Academy مخصص لأغراض التعليم والتدريب فقط، ولا يشكل استشارة استثمارية أو مالية أو دعوة لشراء أو بيع أي أصل.
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TradeCode Academy. جميع الحقوق محفوظة.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">تصميم متجاوب بالكامل مع أجهزة Android والكمبيوتر</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-400 font-medium">نظام المراجعة اليدوية للمدفوعات فعال</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
