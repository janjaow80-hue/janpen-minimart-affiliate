export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  soldCount: number;
  rating: number;
  ratingCount: number;
  location: string;
  shopeeAffiliateUrl: string;
  rawShopeeUrl?: string;
  commissionRate: number; // e.g. 10 for 10%
  isFlashSale?: boolean;
  flashSaleStock?: number;
  flashSaleSold?: number;
  isMinimartDirect?: boolean;
  description: string;
  sourceAlbum?: string;
  tags?: string[];
  createdAt: string;
}

export interface ClickLog {
  id: string;
  productId: string;
  productName: string;
  timestamp: string;
  affiliateUrl: string;
  ipMock: string;
  device: 'Android' | 'iOS' | 'Desktop';
  location: string;
  estimatedCommission: number;
  status: 'clicked' | 'converted' | 'pending';
}

export interface OrderNotification {
  id: string;
  customerName: string;
  productName: string;
  price: number;
  commission: number;
  province: string;
  timestamp: string;
  type: 'shopee_affiliate' | 'minimart_direct';
  avatar?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'store_manager';
  shopeeAffiliateId: string;
  subId: string;
  isLoggedIn: boolean;
  avatar: string;
}

export interface FBPostItem {
  id: string;
  albumName: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  shopeeUrl: string;
  imageUrl: string;
  date: string;
  alreadyImported?: boolean;
}
