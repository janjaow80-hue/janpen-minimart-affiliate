import React, { useState } from 'react';
import { 
  BarChart3, 
  Link2, 
  Facebook, 
  ShoppingBag, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  Bell, 
  ArrowLeft,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { AdminUser, Product, ClickLog } from '../../types';
import { AnalyticsTab } from './AnalyticsTab';
import { AffiliateLinkConverter } from './AffiliateLinkConverter';
import { FacebookAlbumImporter } from './FacebookAlbumImporter';
import { ProductManager } from './ProductManager';
import { PlayStoreExportModal } from './PlayStoreExportModal';

interface AdminDashboardProps {
  admin: AdminUser;
  products: Product[];
  clickLogs: ClickLog[];
  onBackToStore: () => void;
  onProductsUpdated: (products: Product[]) => void;
  onTriggerTestOrder: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  products,
  clickLogs,
  onBackToStore,
  onProductsUpdated,
  onTriggerTestOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'converter' | 'facebook' | 'products'>('analytics');
  const [showPlayStoreModal, setShowPlayStoreModal] = useState(false);

  const handleProductAdded = (newProduct: Product) => {
    onProductsUpdated([newProduct, ...products]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับสู่หน้าร้าน</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="font-black text-lg sm:text-xl text-white tracking-tight">
                  ระบบหลังบ้าน จันทร์เพ็ญ มินิมาร์ท
                </h1>
                <span className="bg-[#EE4D2D] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  Admin Suite
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                ผู้ดูแลระบบ: <strong className="text-gray-200">{admin.name}</strong> ({admin.email}) | Shopee Affiliate ID: <strong className="text-yellow-400">{admin.shopeeAffiliateId}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Test realtime order simulator */}
            <button
              onClick={onTriggerTestOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 text-xs font-semibold transition border border-orange-400/30"
              title="ทดสอบแจ้งเตือนคำสั่งซื้อใหม่"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>จำลองออเดอร์ใหม่</span>
            </button>

            {/* Play store modal */}
            <button
              onClick={() => setShowPlayStoreModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ส่งขึ้น Play Store / GitHub</span>
            </button>
          </div>
        </div>

        {/* Tab navigation pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 pb-3">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>สถิติยอดคลิก &amp; ค่าคอมมิชชัน</span>
          </button>

          <button
            onClick={() => setActiveTab('converter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'converter'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>แปลงลิงก์ Shopee Affiliate อัตโนมัติ</span>
          </button>

          <button
            onClick={() => setActiveTab('facebook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'facebook'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Facebook className="w-4 h-4" />
            <span>อัลบั้ม Facebook เกษม . M</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>จัดการสินค้าหน้าร้าน ({products.length})</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-6">
        {activeTab === 'analytics' && (
          <AnalyticsTab clickLogs={clickLogs} products={products} />
        )}

        {activeTab === 'converter' && (
          <AffiliateLinkConverter admin={admin} onProductAdded={handleProductAdded} />
        )}

        {activeTab === 'facebook' && (
          <FacebookAlbumImporter admin={admin} onProductImported={handleProductAdded} />
        )}

        {activeTab === 'products' && (
          <ProductManager
            products={products}
            admin={admin}
            onProductsUpdated={onProductsUpdated}
          />
        )}
      </main>

      {/* Export Play Store / GitHub Modal */}
      <PlayStoreExportModal
        isOpen={showPlayStoreModal}
        onClose={() => setShowPlayStoreModal(false)}
      />
    </div>
  );
};
