import React from 'react';
import { ShieldCheck, User, ShoppingBag, Headphones, Lock } from 'lucide-react';

interface NavbarProps {
  userName: string;
  orderCount: number;
  hasPendingOrder: boolean;
  onOpenProfile: () => void;
  onOpenOrders: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  orderCount,
  hasPendingOrder,
  onOpenProfile,
  onOpenOrders,
  onOpenSupport,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c16]/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-500/50 flex items-center justify-center font-bold text-xs text-purple-300 shadow-md shadow-purple-950/40">
            BC
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base text-white leading-tight flex items-center gap-1.5">
              <span>BLACK <span className="text-purple-400">CARD</span> MARKET</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider">
              AUTHENTICATED VIRTUAL CREDENTIALS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="nav-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900 text-slate-300 border border-slate-700 hover:text-white hover:border-purple-500/50 transition-all active:scale-95"
          >
            <User className="w-3 h-3 text-purple-400" />
            <span className="max-w-[70px] sm:max-w-none truncate">{userName || 'Raja'}</span>
            <span className="text-slate-500">➔</span>
          </button>

          <button
            id="nav-orders-btn"
            onClick={onOpenOrders}
            className="relative flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-950/70 text-purple-300 border border-purple-800 hover:bg-purple-900/80 transition-all active:scale-95"
          >
            <ShoppingBag className="w-3 h-3 text-purple-300" />
            <span>ORDERS</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200">
              {orderCount}
            </span>
            {hasPendingOrder && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            id="nav-support-btn"
            onClick={onOpenSupport}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900 text-cyan-300 border border-cyan-800 hover:bg-cyan-950/50 transition-all active:scale-95"
          >
            <Headphones className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">SUPPORT</span>
          </button>

          <button
            id="nav-admin-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800 hover:bg-amber-900 hover:text-amber-200 transition-all active:scale-95 shadow-sm"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>ADMIN</span>
          </button>
        </div>
      </div>
    </header>
  );
};
