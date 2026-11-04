import React from 'react';
import { Certificate } from '../types/index.js';
import { X, Award, CheckCircle, Printer, Download, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  React.useEffect(() => {
    triggerConfetti();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Controls */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>شهادة إتمام معتمدة • TradeCode Academy</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> طباعة
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Card */}
        <div className="p-8 sm:p-10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative border-8 border-double border-amber-500/20 m-4 rounded-2xl text-center">
          {/* Watermark / Badge */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-400 font-extrabold block mb-1">
            TradeCode Academy • Certificate of Completion
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
            شهادة إتمام وتفوق معتمدة
          </h2>

          <p className="text-xs text-slate-400 mb-2">تشهد الأكاديمية بأن الطالب المتدرب:</p>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 border-b-2 border-dashed border-slate-700 pb-2 max-w-sm mx-auto mb-4 font-mono">
            {certificate.userName}
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
            قد أتم بنجاح كافة متطلبات واختبارات الدورة التعليمية التخصصية:
          </p>

          <div className="text-base sm:text-lg font-bold text-slate-100 bg-slate-900/90 py-2.5 px-4 rounded-xl border border-slate-800 max-w-md mx-auto mb-6">
            {certificate.courseTitle}
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-3 border-t border-b border-slate-800/80 mb-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">تاريخ الإصدار:</span>
              <strong className="text-slate-200">{certificate.issueDate}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">درجة التقييم:</span>
              <strong className="text-emerald-400">{certificate.gradePercent}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">الحالة:</span>
              <span className="text-emerald-400 font-bold inline-flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> موثق
              </span>
            </div>
          </div>

          {/* Verification Code Box */}
          <div className="flex items-center justify-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-amber-500/30 max-w-xs mx-auto">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div className="text-start">
              <span className="text-[9px] text-slate-500 block">رمز التحقق الرقمي المعتمد:</span>
              <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                {certificate.code}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
