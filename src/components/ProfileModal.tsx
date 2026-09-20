import React, { useState } from 'react';
import { X, User, Check } from 'lucide-react';

interface ProfileModalProps {
  currentName: string;
  onSaveName: (name: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentName,
  onSaveName,
  onClose,
}) => {
  const [name, setName] = useState<string>(currentName || 'Raja');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (clean) {
      onSaveName(clean);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#090e1a] border border-slate-700 rounded-3xl p-6 text-slate-200 shadow-2xl">
        <button
          id="close-profile-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800 text-purple-300 flex items-center justify-center text-xl mx-auto mb-3 shadow-lg">
          <User className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white text-center mb-1">
          User Account Profile
        </h3>
        <p className="text-xs text-slate-400 text-center mb-5">
          Update your display name for virtual cardholder credentials and orders.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Account Display Name:
            </label>
            <input
              id="profile-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Raja Rajput"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <span>Save Display Name</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
