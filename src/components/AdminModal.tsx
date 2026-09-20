import React, { useState } from 'react';
import { Order, AdminSettings, VirtualCard, QrMode } from '../types';
import {
  X,
  CheckCircle2,
  XCircle,
  QrCode,
  Headphones,
  Send,
  CreditCard,
  ShieldCheck,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  DollarSign,
  Lock,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdminSettings;
  onUpdateSettings: (newSettings: AdminSettings) => void;
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onVerifyAllPending: () => void;
  cards: VirtualCard[];
  onUpdateCards: (cards: VirtualCard[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  orders,
  onUpdateOrder,
  onVerifyAllPending,
  cards,
  onUpdateCards,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showCurrentMasterPassword, setShowCurrentMasterPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'QR_UPI' | 'PAYMENTS' | 'SUPPORT_TG' | 'CARDS' | 'SECURITY'>('QR_UPI');

  // Local Form States for Settings
  const [upiId, setUpiId] = useState<string>(settings.upiId);
  const [payeeName, setPayeeName] = useState<string>(settings.payeeName);
  const [upiRemark, setUpiRemark] = useState<string>(settings.upiRemark);
  const [qrMode, setQrMode] = useState<QrMode>(settings.qrMode);
  const [customQrImageUrl, setCustomQrImageUrl] = useState<string>(settings.customQrImageUrl);

  // Support & Telegram
  const [telegramHandle, setTelegramHandle] = useState<string>(settings.telegramHandle);
  const [telegramUrl, setTelegramUrl] = useState<string>(settings.telegramUrl);
  const [supportEmail, setSupportEmail] = useState<string>(settings.supportEmail);
  const [supportPhone, setSupportPhone] = useState<string>(settings.supportPhone);
  const [supportHours, setSupportHours] = useState<string>(settings.supportHours);
  const [supportNotice, setSupportNotice] = useState<string>(settings.supportNotice);

  // Security
  const [newAdminPassword, setNewAdminPassword] = useState<string>('');
  const [autoApprovalMode, setAutoApprovalMode] = useState<boolean>(settings.autoApprovalMode);

  // Order Action Status
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [saveToast, setSaveToast] = useState<string>('');

  // New Card Form Modal State
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
  const [newCardTitle, setNewCardTitle] = useState<string>('');
  const [newCardBank, setNewCardBank] = useState<string>('HDFC Priority Bank');
  const [newCardPrice, setNewCardPrice] = useState<number>(1499);
  const [newCardBalance, setNewCardBalance] = useState<number>(50000);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    const master = (settings.adminPassword || 'RAJAJI').trim();
    if (
      clean.toUpperCase() === 'RAJAJI' ||
      clean.toLowerCase() === master.toLowerCase() ||
      clean === master
    ) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('❌ Incorrect password. (Master password is RAJAJI)');
    }
  };

  // 1. SAVE QR & UPI SETTINGS
  const handleSaveUpiAndQr = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminSettings = {
      ...settings,
      upiId: upiId.trim(),
      payeeName: payeeName.trim(),
      upiRemark: upiRemark.trim(),
      qrMode,
      customQrImageUrl: customQrImageUrl.trim(),
    };
    onUpdateSettings(updated);
    showToast('✅ UPI ID & QR Code Settings Saved Successfully!');
  };

  // QR Image File Upload Handler (Converts file to Base64 data URI)
  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCustomQrImageUrl(reader.result.toString());
          setQrMode('custom_image');
          showToast('✅ Custom QR Image uploaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. SAVE SUPPORT & TELEGRAM SETTINGS
  const handleSaveSupportAndTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTgHandle = telegramHandle.startsWith('@') ? telegramHandle.trim() : `@${telegramHandle.trim()}`;
    let formattedTgUrl = telegramUrl.trim();
    if (!formattedTgUrl.startsWith('http')) {
      formattedTgUrl = `https://t.me/${formattedTgHandle.replace('@', '')}`;
    }

    const updated: AdminSettings = {
      ...settings,
      telegramHandle: formattedTgHandle,
      telegramUrl: formattedTgUrl,
      supportEmail: supportEmail.trim(),
      supportPhone: supportPhone.trim(),
      supportHours: supportHours.trim(),
      supportNotice: supportNotice.trim(),
    };
    onUpdateSettings(updated);
    setTelegramHandle(formattedTgHandle);
    setTelegramUrl(formattedTgUrl);
    showToast('✅ Customer Support & Telegram Settings Updated!');
  };

  // 3. PAYMENT VERIFICATION ACTIONS
  const handleVerifyOrder = (order: Order) => {
    const updated: Order = {
      ...order,
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      rejectionReason: undefined,
    };
    onUpdateOrder(updated);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      // ignore
    }
    showToast(`✅ Order ${order.id} Verified & Card Credentials Issued!`);
  };

  const handleRejectOrder = (order: Order) => {
    const reason = prompt('Enter rejection reason for customer (e.g. Invalid UTR, Unsettled funds):', 'Invalid or unconfirmed UTR reference number');
    if (reason === null) return;

    const updated: Order = {
      ...order,
      status: 'REJECTED',
      rejectionReason: reason || 'UTR verification failed.',
    };
    onUpdateOrder(updated);
    showToast(`❌ Order ${order.id} marked as Rejected.`);
  };

  // Save manual customized credentials for order
  const handleSaveCustomCardCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    onUpdateOrder(editingOrder);
    setEditingOrder(null);
    showToast(`✅ Custom credentials saved for Order ${editingOrder.id}!`);
  };

  // 4. SECURITY & PASSWORD
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    let newPass = settings.adminPassword;
    if (newAdminPassword.trim().length >= 4) {
      newPass = newAdminPassword.trim();
    }
    const updated: AdminSettings = {
      ...settings,
      adminPassword: newPass,
      autoApprovalMode,
    };
    onUpdateSettings(updated);
    setNewAdminPassword('');
    showToast('✅ Security & Admin Password Settings Saved!');
  };

  // 5. ADD NEW CARD
  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: VirtualCard = {
      id: `bc-${Date.now().toString().slice(-4)}`,
      title: newCardTitle.trim() || 'Custom Virtual Black Card',
      bank: newCardBank.trim() || 'HDFC Bank',
      type: 'VISA',
      category: 'Infinite Black',
      balance: newCardBalance || 50000,
      price: newCardPrice || 1499,
      originalPrice: Math.round((newCardPrice || 1499) * 1.8),
      rating: 5.0,
      stock: 10,
      features: ['Instant Auto-OTP Relay', 'Zero Forex Markup', 'Global 3DS Supported'],
      cardholder: 'RAJA RAJPUT',
      cardNumberPreview: '4532 •••• •••• ' + Math.floor(1000 + Math.random() * 9000),
      defaultCardNumber: `4532 88${Math.floor(10 + Math.random() * 90)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      defaultCvv: Math.floor(100 + Math.random() * 900).toString(),
      defaultExpiry: '12/30',
      defaultPin: Math.floor(1000 + Math.random() * 9000).toString(),
      billingAddress: '402 Cyber City, Gurugram, India',
      accentColor: 'from-purple-950 via-slate-900 to-black',
      badge: 'NEW ADDITION',
    };
    onUpdateCards([newCard, ...cards]);
    setIsAddingCard(false);
    setNewCardTitle('');
    showToast('✅ New Virtual Card added to catalog!');
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card from the store catalog?')) {
      onUpdateCards(cards.filter((c) => c.id !== cardId));
      showToast('Card removed from catalog.');
    }
  };

  // Filtered orders for table
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* LOGIN VIEW (IF NOT AUTHENTICATED) */}
      {!isAuthenticated ? (
        <div className="relative w-full max-w-sm bg-[#090e1a] border border-amber-600/60 rounded-3xl p-6 text-slate-200 shadow-2xl">
          <button
            id="close-admin-login-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-base font-black text-white text-center mb-4 tracking-wider uppercase">
            ENTER PASSWORD
          </h3>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter password..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-red-400 text-[11px] mt-1.5 font-semibold text-center">{authError}</p>
              )}
            </div>

            <button
              id="unlock-admin-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-950/40 cursor-pointer"
            >
              LOGIN
            </button>
          </form>
        </div>
      ) : (
        /* AUTHENTICATED ADMIN DASHBOARD */
        <div className="relative w-full max-w-4xl bg-[#090e1a] border border-amber-600/70 rounded-3xl p-5 sm:p-7 text-slate-200 my-auto shadow-2xl max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600/70 text-amber-300 flex items-center justify-center font-black text-lg">
                👑
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  BLACK CARD MARKET • ADMIN CONTROL
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-amber-400 font-bold">Authorized Admin Session</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Database Synced
                  </span>
                </div>
              </div>
            </div>

            <button
              id="close-admin-panel"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-center">
            <div className="p-3 bg-[#0c1220] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Cards</span>
              <div className="text-lg font-black text-white">{cards.length}</div>
            </div>
            <div className="p-3 bg-[#0c1220] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Orders Logged</span>
              <div className="text-lg font-black text-purple-400">{orders.length}</div>
            </div>
            <div className="p-3 bg-[#0c1220] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending Approvals</span>
              <div className="text-lg font-black text-amber-400">{pendingCount}</div>
            </div>
            <div className="p-3 bg-[#0c1220] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active UPI ID</span>
              <div className="text-xs font-mono font-bold text-emerald-400 truncate mt-1">
                {settings.upiId}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 mb-5 scrollbar-none">
            <button
              onClick={() => setActiveTab('QR_UPI')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'QR_UPI'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>⚡ QR & UPI Change</span>
            </button>

            <button
              onClick={() => setActiveTab('PAYMENTS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'PAYMENTS'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Payments ({pendingCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('SUPPORT_TG')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'SUPPORT_TG'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Customer Support & Telegram</span>
            </button>

            <button
              onClick={() => setActiveTab('CARDS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'CARDS'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card Inventory ({cards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('SECURITY')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'SECURITY'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Security</span>
            </button>
          </div>

          {/* TAB 1: PAYMENT VERIFICATION & ORDERS */}
          {activeTab === 'PAYMENTS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>Payment Verification & Order Approvals</span>
                    {pendingCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950 text-amber-300 border border-amber-700 animate-pulse">
                        {pendingCount} Needs Verification
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Verify submitted UTR numbers to immediately unlock 16-digit card number, CVV & PIN for customer.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {pendingCount > 0 && (
                    <button
                      onClick={onVerifyAllPending}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify All Pending</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 bg-[#0c1220] p-1 rounded-xl border border-slate-800 text-[11px]">
                    {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-2 py-0.5 rounded-lg font-semibold ${
                          orderFilter === f ? 'bg-amber-600 text-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#070c16]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b101c] text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Order ID & Date</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Card & Amount</th>
                      <th className="p-3">Submitted UTR</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                          No orders matching current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isPending = order.status === 'PENDING';
                        const isVerified = order.status === 'VERIFIED';
                        const isRejected = order.status === 'REJECTED';

                        return (
                          <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3">
                              <span className="font-mono font-bold text-white block">{order.id}</span>
                              <span className="text-[10px] text-slate-400">{order.createdAt}</span>
                            </td>

                            <td className="p-3">
                              <span className="font-semibold text-slate-200 block">{order.userName}</span>
                              <span className="text-[10px] text-slate-400">{order.userContact || 'No contact'}</span>
                            </td>

                            <td className="p-3">
                              <span className="font-bold text-purple-300 block truncate max-w-[150px]">
                                {order.cardTitle}
                              </span>
                              <span className="text-white font-mono font-bold">
                                ₹{order.amountPaid.toLocaleString('en-IN')}
                              </span>
                            </td>

                            <td className="p-3">
                              <div className="flex items-center gap-1.5 font-mono text-emerald-300 font-bold bg-[#0c1220] px-2 py-1 rounded border border-slate-800 select-all">
                                <span>{order.utrNumber}</span>
                              </div>
                            </td>

                            <td className="p-3">
                              {isPending && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                                  ⏳ PENDING
                                </span>
                              )}
                              {isVerified && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                                  ✅ VERIFIED
                                </span>
                              )}
                              {isRejected && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">
                                  ❌ REJECTED
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending ? (
                                  <>
                                    <button
                                      onClick={() => handleVerifyOrder(order)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                                      title="Approve and issue card"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Verify</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectOrder(order)}
                                      className="px-2 py-1 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] transition-colors"
                                      title="Reject payment"
                                    >
                                      <XCircle className="w-3 h-3" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleVerifyOrder(order)}
                                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium"
                                  >
                                    Re-Approve
                                  </button>
                                )}

                                <button
                                  onClick={() => setEditingOrder(order)}
                                  className="px-2 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-[11px] flex items-center gap-1"
                                  title="Edit card credentials issued to user"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Credentials</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: UPI ID & QR CODE SETTINGS (Requested: QR change option & UPI ID change option) */}
          {activeTab === 'QR_UPI' && (
            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>UPI ID & QR Code Management</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Configure the primary payment receiver UPI ID and select whether to generate dynamic QR or upload your own custom QR code image.
                </p>
              </div>

              <form onSubmit={handleSaveUpiAndQr} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left Column: Form Fields */}
                <div className="md:col-span-2 space-y-4">
                  {/* UPI ID Change */}
                  <div className="p-4 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Active Payment UPI ID:</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Live On Checkout
                      </span>
                    </div>

                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. pay@okaxis or yourname@upi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-sm focus:outline-none focus:border-amber-500"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Payee Display Name:
                        </label>
                        <input
                          type="text"
                          required
                          value={payeeName}
                          onChange={(e) => setPayeeName(e.target.value)}
                          placeholder="e.g. BLACK CARD ENTERPRISE"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Payment Remark / Note:
                        </label>
                        <input
                          type="text"
                          value={upiRemark}
                          onChange={(e) => setUpiRemark(e.target.value)}
                          placeholder="e.g. BCM-VIRTUAL-CARD"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QR Code Mode Selection */}
                  <div className="p-4 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-purple-400" />
                      <span>Select QR Code Generation Mode:</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setQrMode('auto_upi')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          qrMode === 'auto_upi'
                            ? 'bg-purple-950/80 border-purple-500 text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">⚡ Dynamic Auto UPI QR</span>
                          {qrMode === 'auto_upi' && <span className="text-emerald-400 text-xs">● Active</span>}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Generates instant dynamic QR with exact card price for any UPI app.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQrMode('custom_image')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          qrMode === 'custom_image'
                            ? 'bg-amber-950/80 border-amber-500 text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">🖼️ Custom QR Image / Upload</span>
                          {qrMode === 'custom_image' && <span className="text-amber-400 text-xs">● Active</span>}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Upload your PhonePe/Paytm merchant QR code image or enter an image link.
                        </p>
                      </button>
                    </div>

                    {/* If Custom QR Image Mode is active */}
                    {qrMode === 'custom_image' && (
                      <div className="p-3.5 bg-slate-900/90 rounded-xl border border-amber-800/60 space-y-3 mt-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Option 1: Upload QR Code Image from Computer / Phone:
                          </label>
                          <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-dashed border-amber-700/80 hover:border-amber-500 bg-amber-950/20 text-amber-300 font-bold text-xs cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>Choose QR Code File (PNG, JPG, WebP)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleQrFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Option 2: Or Paste Direct Image URL:
                          </label>
                          <input
                            type="url"
                            value={customQrImageUrl}
                            onChange={(e) => setCustomQrImageUrl(e.target.value)}
                            placeholder="https://example.com/my-merchant-qr.png"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
                  >
                    Save UPI ID & QR Settings
                  </button>
                </div>

                {/* Right Column: Live QR Preview */}
                <div className="flex flex-col items-center justify-between p-4 bg-[#0c1220] rounded-2xl border border-slate-800 text-center">
                  <div className="w-full">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                      Active Customer QR Preview
                    </span>

                    <div className="p-3 bg-white rounded-2xl shadow-xl mx-auto w-48 h-48 flex items-center justify-center border border-slate-300">
                      {qrMode === 'custom_image' && customQrImageUrl ? (
                        <img
                          src={customQrImageUrl}
                          alt="Custom QR Preview"
                          className="w-full h-full object-contain rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-800 text-xs font-mono">
                          <QrCode className="w-28 h-28 text-slate-900 mb-1" />
                          <span className="text-[9px] font-bold text-purple-800">DYNAMIC UPI ACTIVE</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full mt-3 p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-left text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mode:</span>
                      <span className="font-bold text-amber-400">
                        {qrMode === 'custom_image' ? 'Custom QR' : 'Auto UPI'}
                      </span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span className="text-slate-400">UPI:</span>
                      <span className="font-mono text-emerald-400 font-bold truncate max-w-[120px]">
                        {upiId}
                      </span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span className="text-slate-400">Payee:</span>
                      <span className="text-slate-200 truncate max-w-[120px]">{payeeName}</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: CUSTOMER SUPPORT & TELEGRAM SETTINGS (Requested: customer support change & teregram change) */}
          {activeTab === 'SUPPORT_TG' && (
            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Customer Support & Telegram Management</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Update official Telegram links, support email, phone numbers, and customer desk notices shown to all users.
                </p>
              </div>

              <form onSubmit={handleSaveSupportAndTelegram} className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram Configuration:</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Telegram Username / Handle:
                      </label>
                      <input
                        type="text"
                        required
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="e.g. @lottaygent"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sky-300 font-bold text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Telegram Direct Link:
                      </label>
                      <input
                        type="url"
                        required
                        value={telegramUrl}
                        onChange={(e) => setTelegramUrl(e.target.value)}
                        placeholder="https://t.me/lottaygent"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Customer Support Desk Channels:</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Support Email Address:
                      </label>
                      <input
                        type="email"
                        required
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="support@blackcardmarket.io"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Helpline Phone / WhatsApp:
                      </label>
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Operating Hours / Response SLA:
                      </label>
                      <input
                        type="text"
                        value={supportHours}
                        onChange={(e) => setSupportHours(e.target.value)}
                        placeholder="24/7 Priority Response Desk (< 3 Mins)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Support Notice / Announcement:
                      </label>
                      <input
                        type="text"
                        value={supportNotice}
                        onChange={(e) => setSupportNotice(e.target.value)}
                        placeholder="Message displayed inside support popup..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0c1220] rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">Live Test Telegram Link:</span>
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>{telegramHandle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
                >
                  Save Customer Support & Telegram Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CARDS INVENTORY */}
          {activeTab === 'CARDS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>Manage Virtual Cards Marketplace</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Add new cards, change prices, update balances, or edit stock counts.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingCard(!isAddingCard)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Card</span>
                </button>
              </div>

              {/* Add Card Form */}
              {isAddingCard && (
                <form onSubmit={handleAddNewCard} className="p-4 bg-[#0c1220] rounded-2xl border border-purple-500/50 space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-purple-300">Create New Card Item:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase">Card Title</label>
                      <input
                        type="text"
                        required
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="e.g. RuPay Titanium Virtual"
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase">Bank Name</label>
                      <input
                        type="text"
                        required
                        value={newCardBank}
                        onChange={(e) => setNewCardBank(e.target.value)}
                        placeholder="e.g. Axis Bank"
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={newCardPrice}
                        onChange={(e) => setNewCardPrice(Number(e.target.value))}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase">Preloaded Balance (₹)</label>
                      <input
                        type="number"
                        required
                        value={newCardBalance}
                        onChange={(e) => setNewCardBalance(Number(e.target.value))}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingCard(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Save Card to Store
                    </button>
                  </div>
                </form>
              )}

              {/* Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {cards.map((card) => (
                  <div key={card.id} className="p-3 bg-[#0c1220] rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <div className="font-bold text-white text-xs truncate">{card.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{card.bank}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">Limit: ₹{card.balance.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[11px] font-bold text-amber-400 mt-0.5">
                        Price: ₹{card.price}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-300"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & ADMIN PASSWORD */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Admin Security & Automation</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Update the master password used to unlock this admin dashboard.
                </p>
              </div>

              <form onSubmit={handleSaveSecurity} className="p-4 bg-[#0c1220] rounded-2xl border border-slate-800 space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Change Master Admin Password:
                  </label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new admin password (minimum 4 characters)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                    <span>
                      Current Master Password:{' '}
                      <strong className="text-amber-400 font-mono">
                        {showCurrentMasterPassword ? settings.adminPassword : '••••••••'}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCurrentMasterPassword((prev) => !prev)}
                      className="text-slate-400 hover:text-amber-400 text-[10px] flex items-center gap-1 underline cursor-pointer"
                    >
                      {showCurrentMasterPassword ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Auto-Approval Mode (Demo)</span>
                    <span className="text-[10px] text-slate-400">Automatically verifies payments after customer submission</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoApprovalMode}
                    onChange={(e) => setAutoApprovalMode(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all"
                >
                  Save Security Settings
                </button>
              </form>
            </div>
          )}

          {/* EDIT CARD CREDENTIALS MODAL FOR AN ORDER */}
          {editingOrder && (
            <div className="fixed inset-0 z-[65] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
              <div className="relative w-full max-w-md bg-[#0a101f] border border-purple-500/70 rounded-2xl p-5 text-slate-200 shadow-2xl">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
                <h4 className="text-sm font-black text-white mb-1">
                  Edit Issued Card Credentials (Order: {editingOrder.id})
                </h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  Customize the exact virtual card details visible to {editingOrder.userName}.
                </p>

                <form onSubmit={handleSaveCustomCardCredentials} className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold">16-Digit Card Number:</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.cardDetails.cardNumber}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          cardDetails: { ...editingOrder.cardDetails, cardNumber: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 font-mono text-emerald-300"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold">Expiry:</label>
                      <input
                        type="text"
                        required
                        value={editingOrder.cardDetails.expiry}
                        onChange={(e) =>
                          setEditingOrder({
                            ...editingOrder,
                            cardDetails: { ...editingOrder.cardDetails, expiry: e.target.value },
                          })
                        }
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold">CVV:</label>
                      <input
                        type="text"
                        required
                        value={editingOrder.cardDetails.cvv}
                        onChange={(e) =>
                          setEditingOrder({
                            ...editingOrder,
                            cardDetails: { ...editingOrder.cardDetails, cvv: e.target.value },
                          })
                        }
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 font-mono text-amber-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold">PIN:</label>
                      <input
                        type="text"
                        required
                        value={editingOrder.cardDetails.pin}
                        onChange={(e) =>
                          setEditingOrder({
                            ...editingOrder,
                            cardDetails: { ...editingOrder.cardDetails, pin: e.target.value },
                          })
                        }
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold">Cardholder Name:</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.cardDetails.cardholder}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          cardDetails: { ...editingOrder.cardDetails, cardholder: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold">Billing Address:</label>
                    <input
                      type="text"
                      value={editingOrder.cardDetails.billingAddress}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          cardDetails: { ...editingOrder.cardDetails, billingAddress: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingOrder(null)}
                      className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold"
                    >
                      Update Credentials
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
