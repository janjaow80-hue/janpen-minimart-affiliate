import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  Bell, 
  User, 
  ShieldCheck, 
  SlidersHorizontal, 
  Smartphone, 
  ExternalLink,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Package
} from 'lucide-react';
import { AdminUser, CustomerUser, OrderNotification } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  admin: AdminUser;
  customer: CustomerUser;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenPlayStoreModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  orderHistory: OrderNotification[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  isAdminView: boolean;
  onToggleAdminView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  admin,
  customer,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenAuth,
  onOpenPlayStoreModal,
  searchQuery,
  onSearchChange,
  orderHistory,
  soundEnabled,
  onToggleSound,
  isAdminView,
  onToggleAdminView,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-gradient-to-r from-[#EE4D2D] via-[#F1582C] to-[#FF6B35] text-white">
      {/* Top micro bar */}
      <div className="border-b border-white/15 text-xs py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium bg-black/15 px-2 py-0.5 rounded text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
              ร้านค้าทางการ: จันทร์เพ็ญ มินิมาร์ท
            </span>
            <span className="hidden md:inline text-white/80">
              Shopee Affiliate Verified: <strong className="text-white">{admin.name}</strong> ({admin.email})
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Realtime sound toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'ปิดเสียงแจ้งเตือนออเดอร์' : 'เปิดเสียงแจ้งเตือนออเดอร์'}
              className="flex items-center gap-1 hover:text-yellow-200 transition text-[11px] bg-white/10 px-2 py-0.5 rounded"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-green-300" />
                  <span className="hidden sm:inline">เสียงแจ้งเตือน: เปิด</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-red-200" />
                  <span className="hidden sm:inline">เสียงแจ้งเตือน: ปิด</span>
                </>
              )}
            </button>

            {/* Google Play / Android packaging info */}
            <button
              onClick={onOpenPlayStoreModal}
              className="flex items-center gap-1 font-semibold text-yellow-200 hover:text-white transition text-[11px] bg-black/20 hover:bg-black/30 px-2.5 py-0.5 rounded-full border border-yellow-300/40"
            >
              <Smartphone className="w-3 h-3 text-green-400" />
              <span>Android & Play Store</span>
            </button>

            {/* Admin Switcher Button */}
            <button
              onClick={onToggleAdminView}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold transition shadow-sm ${
                isAdminView
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{isAdminView ? 'กลับสู่หน้าร้าน' : 'ระบบหลังบ้าน (Kasem . M)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div 
            onClick={() => {
              if (isAdminView) onToggleAdminView();
            }}
            className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 transform group-hover:scale-105 transition">
              <ShoppingBag className="w-full h-full text-[#EE4D2D]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-2xl tracking-tight leading-none text-white drop-shadow-sm">
                  Janpen<span className="text-yellow-300 font-extrabold">Minimart</span>
                </span>
                <span className="bg-white/20 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-yellow-100 hidden sm:inline-block">
                  Affiliate
                </span>
              </div>
              <p className="text-[11px] text-white/90 font-medium tracking-wide">
                จันทร์เพ็ญ มินิมาร์ท &amp; Shopee Affiliate Store
              </p>
            </div>
          </div>

          {/* Shopee-style Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden sm:block">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ค้นหาสินค้าในจันทร์เพ็ญมินิมาร์ท หรือสินค้ายอดฮิต Shopee..."
                className="w-full bg-white text-gray-800 text-sm pl-4 pr-12 py-2.5 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 transition placeholder:text-gray-400"
              />
              <button 
                type="button"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#EE4D2D] hover:bg-[#D43D1F] text-white rounded-md flex items-center justify-center transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/80 mt-1 px-1">
              <span className="text-yellow-200">ฮิตติดเทรนด์:</span>
              <button onClick={() => onSearchChange('ข้าวหอมมะลิ')} className="hover:underline">ข้าวหอมมะลิ</button>
              <button onClick={() => onSearchChange('น้ำมันพืช')} className="hover:underline">น้ำมันพืช</button>
              <button onClick={() => onSearchChange('หม้อทอด')} className="hover:underline">หม้อทอดไร้น้ำมัน</button>
              <button onClick={() => onSearchChange('น้ำพริกหนุ่ม')} className="hover:underline">น้ำพริกหนุ่ม</button>
              <button onClick={() => onSearchChange('กาแฟ')} className="hover:underline">กาแฟคั่วบด</button>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <div className="hidden lg:block">
              <PWAInstallButton />
            </div>

            {/* Notification Bell with Order History Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-white/15 transition text-white"
                title="การแจ้งเตือนคำสั่งซื้อเรียลไทม์"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {orderHistory.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 text-gray-900 font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {orderHistory.length > 9 ? '9+' : orderHistory.length}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 text-gray-800 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                      <h4 className="font-bold text-sm text-gray-900">คำสั่งซื้อเรียลไทม์ (Live Orders)</h4>
                    </div>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                    {orderHistory.slice(0, 7).map((item) => (
                      <div key={item.id} className="p-3 hover:bg-orange-50/60 transition flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#EE4D2D] shrink-0 mt-0.5">
                          {item.type === 'shopee_affiliate' ? (
                            <ExternalLink className="w-4 h-4" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {item.customerName}
                          </p>
                          <p className="text-[11px] text-gray-600 line-clamp-1">
                            สั่งซื้อ: {item.productName}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-[10px]">
                            <span className="font-bold text-[#EE4D2D]">฿{item.price.toLocaleString()}</span>
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                              คอมมิชชัน +฿{item.commission.toFixed(2)}
                            </span>
                            <span className="text-gray-400">{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 pt-2 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400">
                      ระบบบันทึกและคำนวณค่าคอมมิชชันอัตโนมัติใต้บัญชี Kasem . M
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full hover:bg-white/15 transition text-white"
              title="ตะกร้าสินค้า"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-white text-[#EE4D2D] font-extrabold text-[11px] rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Account Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-full transition text-xs font-medium"
            >
              <img 
                src={customer.avatar} 
                alt="user avatar" 
                className="w-5 h-5 rounded-full object-cover border border-white/60"
              />
              <span className="hidden md:inline max-w-[100px] truncate">
                {customer.isLoggedIn ? customer.name.split(' ')[0] : 'เข้าสู่ระบบ'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-2.5 sm:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหาสินค้าหรือ Shopee Affiliate..."
              className="w-full bg-white text-gray-800 text-xs pl-3.5 pr-10 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#EE4D2D] text-white rounded-md flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
