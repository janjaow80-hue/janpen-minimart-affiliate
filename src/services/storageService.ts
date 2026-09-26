import { Product, ClickLog, AdminUser, CustomerUser, OrderNotification, FBPostItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_FACEBOOK_POSTS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'janpen_products',
  CLICKS: 'janpen_click_logs',
  ORDERS: 'janpen_orders',
  ADMIN: 'janpen_admin_user',
  CUSTOMER: 'janpen_customer_user',
  FB_POSTS: 'janpen_fb_posts',
  NOTIFICATIONS: 'janpen_notifications',
};

export const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-kasem',
  name: 'Kasem . M (คุณเกษม)',
  email: 'janjaow80@gmail.com',
  role: 'super_admin',
  shopeeAffiliateId: 'TH_KASEM_80',
  subId: 'janpen_minimart',
  isLoggedIn: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const DEFAULT_CUSTOMER: CustomerUser = {
  id: 'cust-guest-101',
  name: 'ลูกค้าทั่วไป (สมาชิกจันทร์เพ็ญ)',
  phone: '089-123-4567',
  address: '123/45 หมู่ 2 ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  isLoggedIn: true,
};

// Seed initial click logs for Kasem . M's analytics dashboard
const INITIAL_CLICK_LOGS: ClickLog[] = [
  {
    id: 'clk-01',
    productId: 'jp-001',
    productName: 'ข้าวหอมมะลิแท้ 100% เกรดส่งออก (5 กก.)',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    affiliateUrl: 'https://shopee.co.th/product/8812304/2301928?aff_code=KASEM_M&sub_id=janpen_minimart',
    ipMock: '171.96.12.*',
    device: 'Android',
    location: 'เชียงใหม่',
    estimatedCommission: 19.9,
    status: 'converted',
  },
  {
    id: 'clk-02',
    productId: 'jp-003',
    productName: 'หม้อทอดไร้น้ำมันระบบดิจิตอล 5.5 ลิตร',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    affiliateUrl: 'https://shopee.co.th/product/1908234/1102938?aff_code=KASEM_M&sub_id=janpen_minimart',
    ipMock: '124.120.44.*',
    device: 'iOS',
    location: 'กรุงเทพฯ',
    estimatedCommission: 106.8,
    status: 'converted',
  },
  {
    id: 'clk-03',
    productId: 'jp-002',
    productName: 'น้ำมันพืชขวดทอง ยกลัง 12 ขวด',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    affiliateUrl: 'https://shopee.co.th/product/5512001/8891230?aff_code=KASEM_M&sub_id=janpen_minimart',
    ipMock: '182.232.10.*',
    device: 'Android',
    location: 'เชียงราย',
    estimatedCommission: 43.2,
    status: 'clicked',
  },
  {
    id: 'clk-04',
    productId: 'jp-005',
    productName: 'เซ็ตขนมปังกรอบเนยสด & ขนมขบเคี้ยว',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    affiliateUrl: 'https://shopee.co.th/product/3389102/5519283?aff_code=KASEM_M&sub_id=janpen_minimart',
    ipMock: '49.228.192.*',
    device: 'Desktop',
    location: 'นนทบุรี',
    estimatedCommission: 8.5,
    status: 'converted',
  },
  {
    id: 'clk-05',
    productId: 'jp-008',
    productName: 'น้ำพริกหนุ่มสูตรเมืองเหนือ จันทร์เพ็ญมินิมาร์ท',
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    affiliateUrl: 'https://shopee.co.th/product/8812304/9912831?aff_code=KASEM_M&sub_id=janpen_minimart',
    ipMock: '110.168.32.*',
    device: 'Android',
    location: 'ลำพูน',
    estimatedCommission: 10.35,
    status: 'converted',
  },
];

export const StorageService = {
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading products from storage', e);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct(product: Product): void {
    const products = this.getProducts();
    const updated = [product, ...products];
    this.saveProducts(updated);
  },

  updateProduct(product: Product): void {
    const products = this.getProducts().map((p) => (p.id === product.id ? product : p));
    this.saveProducts(products);
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },

  getClickLogs(): ClickLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLICKS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading clicks', e);
    }
    localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(INITIAL_CLICK_LOGS));
    return INITIAL_CLICK_LOGS;
  },

  recordClick(product: Product, device: 'Android' | 'iOS' | 'Desktop' = 'Android'): ClickLog {
    const logs = this.getClickLogs();
    const newLog: ClickLog = {
      id: 'clk-' + Date.now(),
      productId: product.id,
      productName: product.name,
      timestamp: new Date().toISOString(),
      affiliateUrl: product.shopeeAffiliateUrl,
      ipMock: `171.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.*`,
      device,
      location: product.location || 'ไทย',
      estimatedCommission: Number(((product.price * product.commissionRate) / 100).toFixed(2)),
      status: Math.random() > 0.35 ? 'converted' : 'clicked',
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(updated.slice(0, 200)));
    return newLog;
  },

  getAdmin(): AdminUser {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading admin', e);
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(DEFAULT_ADMIN));
    return DEFAULT_ADMIN;
  },

  saveAdmin(admin: AdminUser): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  },

  getCustomer(): CustomerUser {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading customer', e);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(DEFAULT_CUSTOMER));
    return DEFAULT_CUSTOMER;
  },

  saveCustomer(customer: CustomerUser): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
  },

  getFBPosts(): FBPostItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FB_POSTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading fb posts', e);
    }
    localStorage.setItem(STORAGE_KEYS.FB_POSTS, JSON.stringify(INITIAL_FACEBOOK_POSTS));
    return INITIAL_FACEBOOK_POSTS;
  },

  saveFBPosts(posts: FBPostItem[]): void {
    localStorage.setItem(STORAGE_KEYS.FB_POSTS, JSON.stringify(posts));
  },

  convertRawUrlToAffiliate(rawUrl: string, admin: AdminUser = DEFAULT_ADMIN, customSubId?: string): string {
    if (!rawUrl) return '';
    try {
      const url = new URL(rawUrl.trim());
      url.searchParams.set('aff_code', 'KASEM_M');
      url.searchParams.set('sub_id', customSubId || admin.subId || 'janpen_minimart');
      url.searchParams.set('utm_source', 'affiliate');
      url.searchParams.set('utm_medium', 'janpen_app');
      url.searchParams.set('partner_id', admin.shopeeAffiliateId);
      return url.toString();
    } catch {
      // If not standard URL string, safely append
      const separator = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl.trim()}${separator}aff_code=KASEM_M&sub_id=${customSubId || admin.subId || 'janpen_minimart'}&utm_source=affiliate`;
    }
  },

  generateDeepLink(affiliateUrl: string): string {
    // Generate Shopee Mobile App universal deep link
    return `shopeeth://open?url=${encodeURIComponent(affiliateUrl)}`;
  },
};
