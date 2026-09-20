import React from 'react';
import { Send } from 'lucide-react';

interface FloatingTelegramProps {
  telegramHandle: string;
  onClick: () => void;
}

export const FloatingTelegram: React.FC<FloatingTelegramProps> = ({
  telegramHandle,
  onClick,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        id="floating-telegram-btn"
        onClick={onClick}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-950/50 hover:shadow-sky-800/60 active:scale-95 transition-all cursor-pointer border border-sky-300/30"
      >
        <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
          <Send className="w-4 h-4 text-white" />
        </span>
        <div className="text-left">
          <div className="text-[11px] font-black leading-tight tracking-wide">
            Telegram Support
          </div>
          <div className="text-[10px] text-sky-100 font-mono leading-tight">
            {telegramHandle}
          </div>
        </div>
      </button>
    </div>
  );
};
