import React, { useState } from 'react';
import { Order, AdminSettings } from '../types';
import {
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  Download,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface OrdersModalProps {
  orders: Order[];
  settings: AdminSettings;
  onClose: () => void;
  onOpenAdmin: () => void;
  onOpenSupport: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  orders,
  settings,
  onClose,
  onOpenAdmin,
  onOpenSupport,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showCvvMap, setShowCvvMap] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');

  const toggleCvv = (orderId: string) => {
    setShowCvvMap((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadCardDetails = (order: Order) => {
    const content = `===========================================
BLACK CARD MARKET - OFFICIAL CREDENTIALS
Order ID: ${order.id}
Date: ${order.createdAt}
Card Name: ${order.cardTitle}
Bank: ${order.cardDetails.bank}
Network: ${order.cardDetails.type}
Balance: INR ${order.cardDetails.balance}
===========================================
Card Number: ${order.cardDetails.cardNumber}
CVV: ${order.cardDetails.cvv}
Expiry: ${order.cardDetails.expiry}
ATM / Online PIN: ${order.cardDetails.pin}
Cardholder: ${order.cardDetails.cardholder}
Billing Address: ${order.cardDetails.billingAddress}
===========================================
Status: VERIFIED & ACTIVE
Telegram Support: ${settings.telegramHandle}
Support Desk: ${settings.supportEmail}
===========================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BlackCard_${order.id}_${order.cardDetails.cardholder.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'ALL') return true;
    return o.status === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090e1a] border border-slate-700 rounded-3xl p-5 sm:p-7 text-slate-200 max-h-[88vh] overflow-y-auto shadow-2xl">
        <button
          id="close-orders-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>My Purchased Virtual Cards</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-normal">
                {orders.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified cards are stored locally in secure browser vault.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(['ALL', 'PENDING', 'VERIFIED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {filter === 'ALL' ? 'All' : filter === 'PENDING' ? 'Pending' : 'Verified'}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#0c1220] rounded-2xl border border-slate-800 my-4">
            <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 flex items-center justify-center mx-auto mb-2 text-xl">
              🛍️
            </div>
            <h4 className="text-sm font-bold text-white mb-1">No Orders Found</h4>
            <p className="text-xs text-slate-400 mb-4">
              {activeFilter === 'ALL'
                ? "You haven't purchased any virtual cards yet."
                : `No orders in '${activeFilter}' state.`}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isVerified = order.status === 'VERIFIED';
              const isPending = order.status === 'PENDING';
              const isRejected = order.status === 'REJECTED';
              const isCvvVisible = showCvvMap[order.id];

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                    isVerified
                      ? 'bg-[#0a1120] border-emerald-900/60'
                      : isPending
                      ? 'bg-[#14120a] border-amber-900/60'
                      : 'bg-[#180a0a] border-red-900/60'
                  }`}
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300">{order.id}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950/80 text-emerald-300 border border-emerald-700">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED & ACTIVE
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-950/80 text-amber-300 border border-amber-700">
                          <Clock className="w-3 h-3 animate-spin" /> PENDING VERIFICATION
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-950/80 text-red-300 border border-red-700">
                          <AlertOctagon className="w-3 h-3" /> PAYMENT REJECTED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Title & Purchased Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">{order.cardTitle}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Paid: <strong className="text-white">₹{order.amountPaid}</strong></span>
                        <span>•</span>
                        <span>UTR: <strong className="font-mono text-slate-300">{order.utrNumber}</strong></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Preloaded Balance</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        ₹{order.cardBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* If Verified: SHOW FULL UNLOCKED CREDENTIALS */}
                  {isVerified && (
                    <div className="mt-3 p-3.5 bg-[#060a14] rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Authenticated Card Credentials
                        </span>
                        <button
                          onClick={() => downloadCardDetails(order)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-purple-200 flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download .txt</span>
                        </button>
                      </div>

                      {/* Card Number Row */}
                      <div className="p-2.5 bg-[#0b101c] rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase font-semibold">16-Digit Card Number</span>
                          <span className="font-mono font-black text-sm sm:text-base text-emerald-300 tracking-wider">
                            {order.cardDetails.cardNumber}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(order.cardDetails.cardNumber, `num-${order.id}`)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-semibold flex items-center gap-1"
                        >
                          {copiedField === `num-${order.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Expiry, CVV, PIN Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-[#0b101c] rounded-lg border border-slate-800">
                          <span className="text-[9px] text-slate-400 block uppercase font-semibold">Expiry Date</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-white">{order.cardDetails.expiry}</span>
                            <button
                              onClick={() => copyToClipboard(order.cardDetails.expiry, `exp-${order.id}`)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="p-2 bg-[#0b101c] rounded-lg border border-slate-800">
                          <span className="text-[9px] text-slate-400 block uppercase font-semibold">CVV Code</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-amber-300">
                              {isCvvVisible ? order.cardDetails.cvv : '•••'}
                            </span>
                            <button
                              onClick={() => toggleCvv(order.id)}
                              className="text-slate-400 hover:text-white p-0.5"
                            >
                              {isCvvVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        <div className="p-2 bg-[#0b101c] rounded-lg border border-slate-800">
                          <span className="text-[9px] text-slate-400 block uppercase font-semibold">ATM / Web PIN</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-white">{order.cardDetails.pin}</span>
                            <button
                              onClick={() => copyToClipboard(order.cardDetails.pin, `pin-${order.id}`)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cardholder & Billing Address */}
                      <div className="text-[11px] text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-slate-500">Cardholder:</span>{' '}
                          <strong className="text-slate-200">{order.cardDetails.cardholder}</strong>
                        </div>
                        <div className="truncate">
                          <span className="text-slate-500">Billing:</span>{' '}
                          <span className="text-slate-300">{order.cardDetails.billingAddress}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If Pending: Verification Help Box & Locked Card Details */}
                  {isPending && (
                    <div className="mt-3 p-3.5 bg-[#0e1628] border border-amber-600/50 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-amber-300">
                        <span className="font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          🔒 CARD DETAILS LOCKED • PENDING ADMIN VERIFICATION
                        </span>
                        <span className="text-[10px] bg-amber-900/60 border border-amber-700/60 px-2 py-0.5 rounded text-amber-200 font-bold">
                          PENDING
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Payment proof submit ho chuka hai (UTR: <strong className="text-amber-200 font-mono">{order.utrNumber}</strong>). <strong className="text-white">Jab tak Admin payment verify nahi karega, tab tak card details PENDING aur locked rahegi.</strong> Admin ke verify karte hi yahan full 16-digit card number, CVV aur PIN unlock ho jayega.
                      </p>

                      {/* Locked Card Preview */}
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 font-mono text-slate-500 select-none">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px]">Card Number:</span>
                          <span className="text-amber-400/80 font-bold text-xs tracking-wider">•••• •••• •••• •••• [LOCKED]</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px]">CVV / Expiry:</span>
                          <span className="text-slate-400">••• • ••/••</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px]">ATM / Web PIN:</span>
                          <span className="text-slate-400">••••</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={settings.telegramUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                        >
                          <span>Expedite on Telegram</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={onOpenAdmin}
                          className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 border border-amber-700 text-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>Admin Login to Verify Payment ➔</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If Rejected */}
                  {isRejected && (
                    <div className="mt-3 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-red-300">Payment Verification Failed</div>
                      <p className="text-[11px] text-slate-300">
                        {order.rejectionReason || 'UTR transaction ID was not matched in recent bank settlement.'}
                      </p>
                      <button
                        onClick={onOpenSupport}
                        className="text-cyan-400 hover:underline font-bold text-[11px] pt-1 block"
                      >
                        Contact Telegram Support ({settings.telegramHandle})
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
