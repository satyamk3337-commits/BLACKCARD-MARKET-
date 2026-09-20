import React from 'react';
import { ShieldAlert, Clock, Lock } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full">
      <div className="rounded-3xl bg-[#090e1a]/95 border border-slate-800 p-5 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
            Fast, Private & Automated <span className="text-purple-400">Virtual Card Pool</span>
          </h3>
          <p className="text-xs text-slate-400">
            Instant credentials delivery with 10-Minute SLA, Escrow protection & Telegram support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#0c1220] border border-slate-800/80 rounded-2xl p-4">
            <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 font-bold text-xs flex items-center justify-center mb-2">
              01
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Choose Package</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick Visa, RuPay, or Mastercard with desired limits from ₹5,000 to ₹3,50,000.
            </p>
          </div>

          <div className="bg-[#0c1220] border border-slate-800/80 rounded-2xl p-4">
            <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 font-bold text-xs flex items-center justify-center mb-2">
              02
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Scan & Pay</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan the Dynamic UPI QR or send payment through PhonePe, Paytm, or GPay.
            </p>
          </div>

          <div className="bg-[#0c1220] border border-slate-800/80 rounded-2xl p-4">
            <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 font-bold text-xs flex items-center justify-center mb-2">
              03
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Instant Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit the 12-digit UTR/Ref ID for automatic escrow release.
            </p>
          </div>

          <div className="bg-[#0c1220] border border-slate-800/80 rounded-2xl p-4">
            <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 font-bold text-xs flex items-center justify-center mb-2">
              04
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Instant Delivery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get 16-digit card number, CVV, expiry & PIN with 1-click download.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
          <div className="p-3 bg-[#060a13] rounded-xl border border-slate-800/60 flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-emerald-400 mb-0.5 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>100% Replacement Warranty</span>
            </div>
            <div className="text-[10px] text-slate-400">Card declined? Instant replacement or refund.</div>
          </div>
          <div className="p-3 bg-[#060a13] rounded-xl border border-slate-800/60 flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-amber-400 mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>10 Mins Automated SLA</span>
            </div>
            <div className="text-[10px] text-slate-400">Automated queue process ensures zero delays.</div>
          </div>
          <div className="p-3 bg-[#060a13] rounded-xl border border-slate-800/60 flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-purple-400 mb-0.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Logging Policy</span>
            </div>
            <div className="text-[10px] text-slate-400">All session credentials encrypted in memory.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
