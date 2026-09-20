import { useState, useEffect } from 'react';
import { VirtualCard, AdminSettings, Order } from './types';
import { INITIAL_CARDS, INITIAL_SETTINGS, INITIAL_ORDERS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CardGrid } from './components/CardGrid';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { FloatingTelegram } from './components/FloatingTelegram';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { SupportModal } from './components/SupportModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminModal } from './components/AdminModal';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  SETTINGS: 'bcm_settings_v1',
  CARDS: 'bcm_cards_v1',
  ORDERS: 'bcm_orders_v1',
  USERNAME: 'bcm_username_v1',
};

export default function App() {
  // Settings State
  const [settings, setSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Cards Catalog State
  const [cards, setCards] = useState<VirtualCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
      return saved ? JSON.parse(saved) : INITIAL_CARDS;
    } catch {
      return INITIAL_CARDS;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User Profile
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USERNAME) || 'Raja';
    } catch {
      return 'Raja';
    }
  });

  // Modals visibility
  const [checkoutCard, setCheckoutCard] = useState<VirtualCard | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Global Notification
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    } catch (e) {
      console.error(e);
    }
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERNAME, userName);
    } catch (e) {
      console.error(e);
    }
  }, [userName]);

  // Order Handlers
  const handleBuyCard = (card: VirtualCard) => {
    setCheckoutCard(card);
  };

  const handleSubmitOrder = (newOrder: Order) => {
    // Orders are strictly created with status PENDING until Admin manually verifies
    setOrders((prev) => [newOrder, ...prev]);
    setCheckoutCard(null);
    triggerToast(`⏳ Payment proof submitted (UTR: ${newOrder.utrNumber})! Awaiting Admin verification.`);
    setIsOrdersOpen(true);
  };

  const handleUpdateOrder = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const handleVerifyAllPending = () => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setOrders((prev) =>
      prev.map((o) =>
        o.status === 'PENDING'
          ? {
              ...o,
              status: 'VERIFIED',
              verifiedAt: now,
            }
          : o,
      ),
    );
    try {
      confetti({ particleCount: 80, spread: 80 });
    } catch {
      // ignore
    }
    triggerToast('✅ All pending orders have been verified & cards issued!');
  };

  const handleUpdateSettings = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    triggerToast('⚙️ Admin settings updated and live across platform!');
  };

  const handleUpdateCards = (newCards: VirtualCard[]) => {
    setCards(newCards);
  };

  const handleSaveName = (newName: string) => {
    setUserName(newName);
    triggerToast(`👤 Account display name updated to ${newName}!`);
  };

  const hasPendingOrder = orders.some((o) => o.status === 'PENDING');

  return (
    <div className="min-h-screen bg-[#070a12] cyber-grid-bg text-slate-100 flex flex-col font-sans relative selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-900/95 to-indigo-900/95 text-white font-bold text-xs shadow-2xl border border-purple-400/60 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 backdrop-blur-md">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        userName={userName}
        orderCount={orders.length}
        hasPendingOrder={hasPendingOrder}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
        telegramHandle={settings.telegramHandle}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Main Marketplace Catalog */}
      <main className="flex-1 w-full">
        <CardGrid cards={cards} onBuyCard={handleBuyCard} />
        <HowItWorks />
      </main>

      {/* Footer */}
      <Footer
        telegramHandle={settings.telegramHandle}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Telegram Support Widget */}
      <FloatingTelegram
        telegramHandle={settings.telegramHandle}
        onClick={() => setIsSupportOpen(true)}
      />

      {/* CHECKOUT MODAL */}
      {checkoutCard && (
        <CheckoutModal
          card={checkoutCard}
          settings={settings}
          userName={userName}
          onClose={() => setCheckoutCard(null)}
          onSubmitOrder={handleSubmitOrder}
          onOpenTelegram={() => {
            window.open(settings.telegramUrl, '_blank');
          }}
        />
      )}

      {/* ORDERS MODAL */}
      {isOrdersOpen && (
        <OrdersModal
          orders={orders}
          settings={settings}
          onClose={() => setIsOrdersOpen(false)}
          onOpenAdmin={() => {
            setIsOrdersOpen(false);
            setIsAdminOpen(true);
          }}
          onOpenSupport={() => {
            setIsOrdersOpen(false);
            setIsSupportOpen(true);
          }}
        />
      )}

      {/* SUPPORT MODAL */}
      {isSupportOpen && (
        <SupportModal
          settings={settings}
          onClose={() => setIsSupportOpen(false)}
        />
      )}

      {/* PROFILE MODAL */}
      {isProfileOpen && (
        <ProfileModal
          currentName={userName}
          onSaveName={handleSaveName}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* ADMIN PANEL MODAL */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          orders={orders}
          onUpdateOrder={handleUpdateOrder}
          onVerifyAllPending={handleVerifyAllPending}
          cards={cards}
          onUpdateCards={handleUpdateCards}
        />
      )}
    </div>
  );
}
