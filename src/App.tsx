/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BannerCarousel } from './components/BannerCarousel';
import { CategoryList } from './components/CategoryList';
import { FlashSaleSection } from './components/FlashSaleSection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { RealtimeToast } from './components/RealtimeToast';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { PlayStoreExportModal } from './components/Admin/PlayStoreExportModal';

import { Product, CartItem, CustomerUser, AdminUser, ClickLog } from './types';
import { StorageService } from './services/storageService';
import { useRealtimeOrders } from './hooks/useRealtimeOrders';
import confetti from 'canvas-confetti';
import { ShoppingBag, Sparkles, Filter, AlertCircle } from 'lucide-react';

export default function App() {
  // Persistence state
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [clickLogs, setClickLogs] = useState<ClickLog[]>(() => StorageService.getClickLogs());
  const [admin, setAdmin] = useState<AdminUser>(() => StorageService.getAdmin());
  const [customer, setCustomer] = useState<CustomerUser>(() => StorageService.getCustomer());
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation & Modal states
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [activeFilterType, setActiveFilterType] = useState<'all' | 'affiliate_only' | 'minimart_only' | 'flash_sale'>('all');

  // Real-time order simulation hook
  const {
    latestOrder,
    clearLatestOrder,
    orderHistory,
    soundEnabled,
    setSoundEnabled,
    triggerOrderManually,
  } = useRealtimeOrders(products);

  // Affiliate Click Handler
  const handleShopeeAffiliateClick = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Detect device
    const ua = navigator.userAgent.toLowerCase();
    const device: 'Android' | 'iOS' | 'Desktop' = /android/.test(ua)
      ? 'Android'
      : /iphone|ipad|ipod/.test(ua)
      ? 'iOS'
      : 'Desktop';

    // Record click log for Kasem . M's analytics
    const newLog = StorageService.recordClick(product, device);
    setClickLogs(StorageService.getClickLogs());

    // Celebrate conversion
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#EE4D2D', '#FFA726', '#FFD54F'],
    });

    // Also trigger instant live order simulation occasionally
    if (Math.random() > 0.4) {
      triggerOrderManually({
        productName: product.name,
        price: product.price,
        commission: Number(((product.price * product.commissionRate) / 100).toFixed(2)),
        type: 'shopee_affiliate',
      });
    }

    // Direct user to affiliate link safely
    window.open(product.shopeeAffiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Cart operations
  const handleAddToCart = (product: Product, eOrQuantity: React.MouseEvent | number) => {
    let quantity = 1;
    if (typeof eOrQuantity === 'number') {
      quantity = eOrQuantity;
    } else if (eOrQuantity && eOrQuantity.stopPropagation) {
      eOrQuantity.stopPropagation();
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutSuccess = (orderDetail: { total: number; itemCount: number }) => {
    // Trigger real-time order alert for minimart
    triggerOrderManually({
      customerName: customer.name,
      productName: `ออเดอร์มินิมาร์ท (${orderDetail.itemCount} รายการ)`,
      price: orderDetail.total,
      commission: Number((orderDetail.total * 0.1).toFixed(2)),
      type: 'minimart_direct',
    });
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'ทั้งหมด') {
        if (selectedCategory === 'facebook_album') {
          if (!p.sourceAlbum) return false;
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // Filter type
      if (activeFilterType === 'affiliate_only' && p.isMinimartDirect) {
        // still ok if it has shopee link
        return !!p.shopeeAffiliateUrl;
      }
      if (activeFilterType === 'minimart_only' && !p.isMinimartDirect) {
        return false;
      }
      if (activeFilterType === 'flash_sale' && !p.isFlashSale) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, activeFilterType]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-['Kanit',sans-serif] selection:bg-[#EE4D2D] selection:text-white">
      {/* Top Android PWA Installation Banner */}
      <PWAInstallBanner
        onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
      />

      {/* Main Shopee Orange Header */}
      <Navbar
        admin={admin}
        customer={customer}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminView(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        orderHistory={orderHistory}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isAdminView={isAdminView}
        onToggleAdminView={() => setIsAdminView(!isAdminView)}
      />

      {isAdminView ? (
        /* Admin Dashboard (Kasem . M / janjaow80@gmail.com) */
        <AdminDashboard
          admin={admin}
          products={products}
          clickLogs={clickLogs}
          onBackToStore={() => setIsAdminView(false)}
          onProductsUpdated={(updated) => {
            setProducts(updated);
            StorageService.saveProducts(updated);
          }}
          onTriggerTestOrder={() => triggerOrderManually()}
        />
      ) : (
        /* Storefront View (Customer Shopping Experience) */
        <main className="flex-1 pb-12">
          {/* Hero Banner Carousel */}
          <BannerCarousel
            onBannerClick={(keyword) => {
              if (keyword === 'Facebook') {
                setSelectedCategory('facebook_album');
              } else {
                setActiveFilterType('flash_sale');
              }
            }}
            onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
          />

          {/* Shopee-style Category Rails & Quick Filter */}
          <CategoryList
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            activeFilterType={activeFilterType}
            onSelectFilterType={setActiveFilterType}
          />

          {/* Flash Sale Countdown Section (if on All or Flash Sale) */}
          {(selectedCategory === 'ทั้งหมด' || activeFilterType === 'flash_sale') && (
            <FlashSaleSection
              products={products}
              onSelectProduct={setSelectedProduct}
              onDirectAffiliateBuy={handleShopeeAffiliateClick}
            />
          )}

          {/* Main Product Catalog Section */}
          <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#EE4D2D] rounded-full" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  {selectedCategory === 'ทั้งหมด'
                    ? 'สินค้าแนะนำประจำวัน (Daily Discover)'
                    : `หมวดหมู่: ${selectedCategory}`}
                </h2>
                <span className="text-xs text-gray-500 font-medium">
                  ({filteredProducts.length} รายการ)
                </span>
              </div>

              {/* Reset filter button if active */}
              {(selectedCategory !== 'ทั้งหมด' || searchQuery || activeFilterType !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('ทั้งหมด');
                    setSearchQuery('');
                    setActiveFilterType('all');
                  }}
                  className="text-xs text-[#EE4D2D] hover:underline font-semibold"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs border border-gray-100 my-6">
                <div className="w-14 h-14 bg-orange-50 text-[#EE4D2D] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-gray-900">ไม่พบสินค้าที่ตรงกับการค้นหา</h3>
                <p className="text-xs text-gray-500 mt-1">
                  ลองค้นหาด้วยคำค้นอื่น หรือเลือกดูหมวดหมู่อื่นๆ ในจันทร์เพ็ญ มินิมาร์ท
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ทั้งหมด');
                    setSearchQuery('');
                    setActiveFilterType('all');
                  }}
                  className="mt-4 px-4 py-2 bg-[#EE4D2D] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#D43D1F]"
                >
                  ดูสินค้าทั้งหมด
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                    onShopeeAffiliateClick={handleShopeeAffiliateClick}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <Footer
            admin={admin}
            onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
            onOpenAdmin={() => setIsAdminView(true)}
          />
        </main>
      )}

      {/* Modals & Overlays */}
      <ProductModal
        product={selectedProduct}
        admin={admin}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onShopeeAffiliateClick={handleShopeeAffiliateClick}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        customer={customer}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        customer={customer}
        onSaveCustomer={(updated) => {
          setCustomer(updated);
          StorageService.saveCustomer(updated);
        }}
      />

      <PlayStoreExportModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

      {/* Real-time Order Popup Toast */}
      <RealtimeToast
        order={latestOrder}
        onDismiss={clearLatestOrder}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
