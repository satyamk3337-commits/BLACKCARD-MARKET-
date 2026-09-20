export type CardType = 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX';

export type CardCategory =
  | 'All'
  | 'Infinite Black'
  | 'Platinum Credit'
  | 'Business Virtual'
  | 'Forex International'
  | 'High Limit'
  | 'Crypto Loaded';

export interface VirtualCard {
  id: string;
  title: string;
  bank: string;
  type: CardType;
  category: CardCategory;
  balance: number;
  price: number;
  originalPrice: number;
  rating: number;
  stock: number;
  features: string[];
  cardholder: string;
  cardNumberPreview: string; // e.g. "4532 •••• •••• 8821"
  defaultCardNumber?: string;
  defaultCvv?: string;
  defaultExpiry?: string;
  defaultPin?: string;
  billingAddress: string;
  accentColor: string;
  badge?: string;
}

export type OrderStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface IssuedCardDetails {
  cardNumber: string;
  cvv: string;
  expiry: string;
  pin: string;
  cardholder: string;
  bank: string;
  type: CardType;
  balance: number;
  billingAddress: string;
}

export interface Order {
  id: string;
  cardId: string;
  cardTitle: string;
  cardType: CardType;
  cardBalance: number;
  amountPaid: number;
  userName: string;
  userContact?: string;
  utrNumber: string;
  status: OrderStatus;
  createdAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  cardDetails: IssuedCardDetails;
}

export type QrMode = 'auto_upi' | 'custom_image';

export interface AdminSettings {
  upiId: string;
  payeeName: string;
  upiRemark: string;
  qrMode: QrMode;
  customQrImageUrl: string;
  telegramHandle: string;
  telegramUrl: string;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  supportNotice: string;
  adminPassword: string;
  autoApprovalMode: boolean; // if true, simulates auto-verification after 45s
}

export interface UserProfile {
  name: string;
  contact: string;
}
