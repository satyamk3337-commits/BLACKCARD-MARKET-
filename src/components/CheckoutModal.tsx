import React, { useState } from 'react';
import { VirtualCard, AdminSettings, Order } from '../types';
import { QrCodeDisplay } from './QrCodeDisplay';
import { X, Copy, Check, ExternalLink, ShieldCheck, ArrowRight, Zap, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  card: VirtualCard | null;
  settings: AdminSettings;
  userName: string;
  onClose: () => void;
  onSubmitOrder: (order: Order) => void;
  onOpenTelegram: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  card,
  settings,
  userName,
  onClose,
  onSubmitOrder,
  onOpenTelegram,
}) => {
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>(userName || 'Raja');
  const [buyerContact, setBuyerContact] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!card) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(card.price.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleAutoFillDemoUtr = () => {
    const randomUtr = Math.floor(300000000000 + Math.random() * 699999999999).toString();
    setUtrNumber(randomUtr);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr) {
      setErrorMsg('Please enter your 12-digit UPI UTR / Ref Number.');
      return;
    }
    if (cleanUtr.length < 6) {
      setErrorMsg('UTR / Transaction reference number seems too short.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: newOrderId,
      cardId: card.id,
      cardTitle: card.title,
      cardType: card.type,
      cardBalance: card.balance,
      amountPaid: card.price,
      userName: buyerName.trim() || 'Raja',
      userContact: buyerContact.trim() || undefined,
      utrNumber: cleanUtr,
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cardDetails: {
        cardNumber: card.defaultCardNumber || '4532 •••• •••• 9912',
        cvv: card.defaultCvv || '482',
        expiry: card.defaultExpiry || '11/29',
        pin: card.defaultPin || '7821',
        cardholder: buyerName.toUpperCase().trim() || 'RAJA RAJPUT',
        bank: card.bank,
        type: card.type,
        balance: card.balance,
        billingAddress: card.billingAddress,
      },
    };

    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore in case of iframe
      }
      onSubmitOrder(newOrder);
    }, 600);
  };

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.payeeName)}&am=${card.price}&cu=INR&tn=${encodeURIComponent(settings.upiRemark)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#090e1a] border border-slate-700 rounded-3xl p-5 sm:p-7 text-slate-200 my-auto shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="close-checkout-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800 mb-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SECURE ESCROW CHECKOUT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Purchase Virtual Card
          </h2>
          <p className="text-xs text-slate-400">
            Scan & pay via any UPI App (GPay, PhonePe, Paytm, BHIM) then submit UTR to unlock credentials.
          </p>
        </div>

        {/* Card Order Summary Banner */}
        <div className="p-3.5 rounded-2xl bg-[#0c1220] border border-slate-800 flex items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-[10px] text-purple-400 font-bold uppercase">{card.bank}</span>
            <div className="text-sm font-black text-white">{card.title}</div>
            <div className="text-xs text-emerald-400 font-mono font-semibold">
              Preloaded Balance: ₹{card.balance.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase">Payable Total</div>
            <div className="text-lg font-black text-white">₹{card.price.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Payment QR and Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#070b14] p-4 rounded-2xl border border-slate-800/80 mb-5">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center">
            <QrCodeDisplay
              upiId={settings.upiId}
              payeeName={settings.payeeName}
              amount={card.price}
              note={settings.upiRemark}
              qrMode={settings.qrMode}
              customQrImageUrl={settings.customQrImageUrl}
              size={180}
            />
            <span className="text-[10px] text-slate-400 mt-2 text-center">
              Scan with Google Pay, PhonePe, Paytm, or BHIM
            </span>
          </div>

          {/* UPI ID & Amount Info Box */}
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-[#0d1322] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">Official Payment UPI ID:</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-emerald-400 truncate select-all">
                  {settings.upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0"
                >
                  {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-[#0d1322] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">Payee Name:</span>
              <span className="font-semibold text-slate-200">{settings.payeeName}</span>
            </div>

            <div className="p-2.5 bg-[#0d1322] rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Exact Amount:</span>
                <span className="font-bold text-white text-sm">₹{card.price}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyAmount}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold flex items-center gap-1"
              >
                {copiedAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAmount ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Direct UPI App intent */}
            <a
              href={upiDeepLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700 text-purple-200 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Pay via UPI App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* UTR Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex items-center justify-between">
            <label htmlFor="utr-input" className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <span>Step 2: Enter 12-Digit UTR / Transaction Ref:</span>
              <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleAutoFillDemoUtr}
              className="text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold flex items-center gap-1"
            >
              <Zap className="w-3 h-3" /> Auto-fill Demo UTR
            </button>
          </div>

          <input
            id="utr-input"
            type="text"
            required
            maxLength={22}
            value={utrNumber}
            onChange={(e) => {
              setUtrNumber(e.target.value);
              setErrorMsg('');
            }}
            placeholder="e.g. 429188402914 or UPI Ref ID"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1220] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="buyer-name" className="block text-[11px] font-semibold text-slate-400 mb-1">
                Your Display Name:
              </label>
              <input
                id="buyer-name"
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Raja"
                className="w-full px-3 py-2 rounded-xl bg-[#0c1220] border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="buyer-contact" className="block text-[11px] font-semibold text-slate-400 mb-1">
                Telegram or Phone (Optional):
              </label>
              <input
                id="buyer-contact"
                type="text"
                value={buyerContact}
                onChange={(e) => setBuyerContact(e.target.value)}
                placeholder="@username or +91..."
                className="w-full px-3 py-2 rounded-xl bg-[#0c1220] border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-950/70 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 bg-purple-950/30 border border-purple-900/50 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              Once submitted, payment is escrow-verified by admin. You will be able to inspect and download your 16-digit card number, CVV, expiry and PIN instantly!
            </span>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-utr-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting UTR...</span>
              ) : (
                <>
                  <span>Submit UTR & Complete</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Need help or custom BIN?</span>
          <button
            type="button"
            onClick={onOpenTelegram}
            className="text-cyan-400 hover:underline font-bold"
          >
            Telegram: {settings.telegramHandle}
          </button>
        </div>
      </div>
    </div>
  );
};
