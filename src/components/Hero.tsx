import React from 'react';
import { ArrowRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  telegramHandle: string;
  onOpenSupport: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  telegramHandle,
  onOpenSupport,
}) => {
  return (
    <section className="text-center pt-8 pb-6 px-4 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold text-purple-300 bg-purple-950/50 border border-purple-800/60 mb-3 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>INSTANT SECURE CREDENTIALS • 24/7 ESCROW POOL</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">
        BLACK <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400">CARD</span> MARKET
      </h1>

      <div className="inline-flex items-center gap-2 text-xs text-slate-300 bg-slate-900/90 px-3.5 py-1 rounded-lg border border-slate-800 mb-4 shadow-sm">
        <span className="text-purple-400 font-bold">ब्लैक कार्ड मार्केट</span>
        <span className="text-slate-600">•</span>
        <span>Digital Virtual Debit & Credit Cards</span>
      </div>

      <h2 className="text-lg sm:text-2xl font-extrabold text-slate-100 max-w-xl mx-auto mb-2 leading-snug">
        The Most Trusted Premium Virtual Card Platform
      </h2>

      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        Instant, global, verified digital virtual debit & credit cards for international transactions, subscriptions, cloud hosting & seamless online payments.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          id="hero-explore-btn"
          onClick={onExploreClick}
          className="px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/40 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>EXPLORE MARKETPLACE</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          id="hero-support-btn"
          onClick={onOpenSupport}
          className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>TELEGRAM: {telegramHandle}</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-2xl mx-auto mt-8 p-4 rounded-2xl bg-[#0c1220]/90 backdrop-blur-sm border border-slate-800/80 grid grid-cols-3 gap-2 divide-x divide-slate-800 text-center shadow-xl">
        <div className="flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1">
            <span>2000+</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400 hidden sm:inline" />
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
            CARDS SOLD
          </div>
        </div>
        <div className="pl-2 flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl font-black text-purple-400 flex items-center gap-1">
            <span>INSTANT</span>
            <Zap className="w-4 h-4 text-purple-300 hidden sm:inline" />
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
            VERIFICATION SLA
          </div>
        </div>
        <div className="pl-2 flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-1">
            <span>99.99%</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 hidden sm:inline" />
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
            SUCCESS RATE
          </div>
        </div>
      </div>
    </section>
  );
};
