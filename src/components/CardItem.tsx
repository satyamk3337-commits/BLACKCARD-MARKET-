import React from 'react';
import { VirtualCard } from '../types';
import { Wifi, Check, Sparkles, Star, ArrowUpRight } from 'lucide-react';

interface CardItemProps {
  card: VirtualCard;
  onBuy: (card: VirtualCard) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onBuy }) => {
  const getBrandLogo = (type: string) => {
    switch (type) {
      case 'VISA':
        return <span className="font-black italic tracking-wider text-base text-blue-300">VISA</span>;
      case 'MASTERCARD':
        return (
          <div className="flex -space-x-2 items-center">
            <span className="w-5 h-5 rounded-full bg-red-500/90 inline-block shadow-sm" />
            <span className="w-5 h-5 rounded-full bg-amber-400/90 inline-block shadow-sm" />
          </div>
        );
      case 'RUPAY':
        return (
          <div className="flex items-center gap-0.5 text-xs font-black">
            <span className="text-cyan-400">Ru</span>
            <span className="text-orange-400">Pay</span>
          </div>
        );
      case 'AMEX':
        return (
          <span className="font-extrabold tracking-tighter text-xs px-1.5 py-0.5 bg-blue-900/80 text-blue-200 rounded border border-blue-600">
            AMEX
          </span>
        );
      default:
        return <span className="font-bold text-xs">{type}</span>;
    }
  };

  return (
    <div className="group relative bg-[#090e1a]/90 backdrop-blur-sm border border-slate-800 hover:border-purple-500/60 rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/40 flex flex-col justify-between">
      {/* Top Bar with Badge and Stock */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          {card.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-purple-900/60 border border-purple-600/60 text-purple-200 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-purple-300" />
              {card.badge}
            </span>
          )}
          <span className="text-[11px] font-medium text-slate-400">
            {card.bank}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">{card.stock} in pool</span>
        </div>
      </div>

      {/* Realistic Visual Virtual Card */}
      <div className={`relative w-full aspect-[1.58/1] rounded-2xl p-4 sm:p-5 text-white overflow-hidden shadow-xl border border-white/10 bg-gradient-to-br ${card.accentColor} mb-4 flex flex-col justify-between select-none`}>
        {/* Card Sheen & Holographic Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black tracking-wide text-white uppercase drop-shadow-sm">
              {card.bank}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-slate-300 rotate-90 opacity-80" />
            {getBrandLogo(card.type)}
          </div>
        </div>

        {/* EMV Chip & Contactless */}
        <div className="relative z-10 flex items-center justify-between my-auto pt-2">
          <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300/40 shadow-inner flex flex-col justify-between">
            <div className="h-0.5 w-full bg-amber-700/50 rounded-full" />
            <div className="h-0.5 w-3/4 bg-amber-700/50 rounded-full" />
            <div className="h-0.5 w-full bg-amber-700/50 rounded-full" />
          </div>

          <div className="text-right">
            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
              PRELOADED BALANCE
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-400 font-mono tracking-tight drop-shadow-sm">
              ₹{card.balance.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Card Number & Footer */}
        <div className="relative z-10">
          <div className="font-card text-xs sm:text-sm md:text-base font-bold tracking-widest text-slate-200 mb-2 drop-shadow-md">
            {card.cardNumberPreview}
          </div>

          <div className="flex items-end justify-between text-[9px] sm:text-[10px] text-slate-300">
            <div>
              <div className="text-[7px] sm:text-[8px] text-slate-400 uppercase tracking-wider">CARDHOLDER</div>
              <div className="font-bold tracking-wider uppercase text-white truncate max-w-[130px] sm:max-w-[170px]">
                {card.cardholder}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <div className="text-[7px] sm:text-[8px] text-slate-400 uppercase tracking-wider">EXPIRES</div>
                <div className="font-mono font-bold text-white">{card.defaultExpiry || '12/29'}</div>
              </div>
              <div>
                <div className="text-[7px] sm:text-[8px] text-slate-400 uppercase tracking-wider">CVV</div>
                <div className="font-mono font-bold text-slate-300">•••</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info & Features */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
              {card.title}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Category: <span className="text-purple-400 font-semibold">{card.category}</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-800/50">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{card.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
          {card.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price & Buy Action */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-white">
              ₹{card.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 line-through">
              ₹{card.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[9px] text-emerald-400 font-semibold">
            Save {Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}% Today
          </div>
        </div>

        <button
          id={`buy-btn-${card.id}`}
          onClick={() => onBuy(card)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/30 active:scale-95 transition-all cursor-pointer"
        >
          <span>BUY NOW</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
