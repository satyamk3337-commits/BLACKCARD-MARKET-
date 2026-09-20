import React from 'react';
import { ShieldCheck, Send, Lock } from 'lucide-react';

interface FooterProps {
  telegramHandle: string;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  telegramHandle,
  onOpenSupport,
  onOpenAdmin,
}) => {
  return (
    <footer className="w-full bg-[#050811] border-t border-slate-900 py-6 px-4 text-xs text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span className="font-extrabold text-white">BLACK CARD MARKET</span>
          <span>• © 2026 Virtual Cards Marketplace</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSupport}
            className="text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Support: {telegramHandle}</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
