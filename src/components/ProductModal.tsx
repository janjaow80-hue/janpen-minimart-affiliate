import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ExternalLink, 
  ShoppingCart, 
  ShieldCheck, 
  QrCode, 
  Share2, 
  Check, 
  Copy, 
  Truck, 
  Tag, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Product, AdminUser } from '../types';
import confetti from 'canvas-confetti';

interface ProductModalProps {
  product: Product | null;
  admin: AdminUser;
  onClose: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
  onShopeeAffiliateClick: (p: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  admin,
  onClose,
  onAddToCart,
  onShopeeAffiliateClick,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!product) return null;

  const discountPct = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const estimatedCommission = Number(
    ((product.price * product.commissionRate) / 100).toFixed(2)
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.shopeeAffiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffiliateBuyWithCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#EE4D2D', '#FF5722', '#FFC107'],
    });
    onShopeeAffiliateClick(product);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    product.shopeeAffiliateUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Badges */}
          <div className="relative bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full aspect-square relative rounded-xl overflow-hidden shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPct > 0 && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-red-600 font-black text-sm px-2.5 py-1 rounded-lg shadow-md">
                  ลด {discountPct}%
                </div>
              )}
            </div>

            {/* Source Album badge */}
            {product.sourceAlbum && (
              <div className="absolute bottom-3 left-4 right-4 bg-white/90 backdrop-blur-xs p-2 rounded-lg text-xs text-gray-700 shadow-xs flex items-center gap-1.5 border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="truncate">อัลบั้ม: {product.sourceAlbum}</span>
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-5 sm:p-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-[#EE4D2D] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Shopee Affiliate Verified
                </span>
                <span className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating & Sold count */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">{product.rating}</span>
                  <span>({product.ratingCount} รีวิว)</span>
                </div>
                <span>|</span>
                <span>ขายแล้ว {product.soldCount.toLocaleString()} ชิ้น</span>
                <span>|</span>
                <span className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {product.location}
                </span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">ราคาโปรโมชั่น</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#EE4D2D]">
                      ฿{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Affiliate info pill */}
                <div className="text-right">
                  <span className="text-[10px] text-orange-600 font-bold block uppercase tracking-wider">
                    Affiliate Partner
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    Kasem . M
                  </span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">
                    (ค่าคอมมิชชัน ฿{estimatedCommission})
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-900 mb-1">รายละเอียดสินค้า</h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  {product.description}
                </p>
              </div>

              {/* QR Code expansion */}
              {showQR && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-center animate-in fade-in">
                  <p className="text-xs font-bold text-gray-800 mb-2">
                    สแกน QR Code เพื่อเปิดสั่งซื้อในแอป Shopee ทันที
                  </p>
                  <img
                    src={qrImageUrl}
                    alt="Shopee Affiliate QR"
                    className="w-36 h-36 mx-auto rounded-lg shadow-sm border border-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    รหัสติดตาม: KASEM_M | SubID: janpen_minimart
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2.5">
              {/* Shopee Affiliate Button (Primary Action) */}
              <button
                onClick={handleAffiliateBuyWithCelebration}
                className="w-full bg-[#EE4D2D] hover:bg-[#D43D1F] text-white py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-98"
              >
                <ExternalLink className="w-5 h-5" />
                <span>สั่งซื้อผ่าน Shopee (รับส่วนลด + สิทธิพิเศษ)</span>
              </button>

              {/* Secondary Actions (Minimart Direct & Links) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="bg-orange-50 hover:bg-orange-100 text-[#EE4D2D] border border-orange-200 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ซื้อตรงจากมินิมาร์ท</span>
                </button>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-2 rounded-xl font-medium text-xs transition flex items-center justify-center gap-1"
                    title="แสดง QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{showQR ? 'ซ่อน QR' : 'QR สแกน'}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl text-xs transition flex items-center justify-center"
                    title="คัดลอกลิงก์ Affiliate"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 pt-1">
                <span>✓ ลิงก์ผูกกับบัญชี Shopee Affiliate: Kasem . M</span>
                <span>janjaow80@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
