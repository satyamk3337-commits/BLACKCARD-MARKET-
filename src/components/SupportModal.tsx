import React from 'react';
import { AdminSettings } from '../types';
import { X, Headphones, Send, Clock, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

interface SupportModalProps {
  settings: AdminSettings;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ settings, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#090e1a] border border-slate-700 rounded-3xl p-6 text-slate-200 text-center shadow-2xl">
        <button
          id="close-support-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 flex items-center justify-center text-xl mx-auto mb-3 shadow-lg shadow-cyan-950/50">
          <Headphones className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white mb-1">
          Live Customer Support Desk
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          {settings.supportNotice ||
            'Official Telegram channel for instantaneous delivery support, custom card limits, and replacement warranty.'}
        </p>

        {/* Support Details Box */}
        <div className="p-3.5 rounded-2xl bg-[#0c1220] border border-slate-800 text-left text-xs space-y-2.5 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Official Telegram:</span>
            </span>
            <span className="text-cyan-400 font-bold font-mono">{settings.telegramHandle}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Desk Email:</span>
            </span>
            <span className="text-slate-200 font-mono text-[11px] truncate max-w-[180px]">
              {settings.supportEmail}
            </span>
          </div>

          {settings.supportPhone && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Helpline / WhatsApp:</span>
              </span>
              <span className="text-slate-200 font-mono">{settings.supportPhone}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Response SLA:</span>
            </span>
            <span className="text-emerald-400 font-bold">&lt; 3 Minutes</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Availability:</span>
            </span>
            <span className="text-slate-300">{settings.supportHours}</span>
          </div>
        </div>

        {/* Action Button */}
        <a
          id="open-telegram-btn"
          href={settings.telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Open Telegram: {settings.telegramHandle}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
