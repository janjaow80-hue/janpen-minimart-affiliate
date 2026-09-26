import React from 'react';
import { Star, MapPin, ExternalLink, ShoppingCart, ShieldCheck, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product, e: React.MouseEvent) => void;
  onShopeeAffiliateClick: (p: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onShopeeAffiliateClick,
}) => {
  const discountPct = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-xl border border-gray-100 hover:border-[#EE4D2D]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        {/* Mall / Storefront Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          <span className="bg-[#EE4D2D] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Shopee Affiliate
          </span>
          {product.isMinimartDirect && (
            <span className="bg-emerald-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
              หน้าร้านมินิมาร์ท
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPct > 0 && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 font-extrabold text-xs px-2 py-1 rounded-bl-lg shadow-sm flex flex-col items-center">
            <span>-{discountPct}%</span>
          </div>
        )}

        {/* Commission hint for Kasem . M */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="bg-black/70 backdrop-blur-xs text-yellow-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
            คอมมิชชัน {product.commissionRate}%
          </span>
          {product.sourceAlbum && (
            <span className="bg-blue-600/80 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full truncate max-w-[120px]">
              Facebook Album
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#EE4D2D] transition">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-[#EE4D2D]">
              ฿{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ฿{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Ratings & Location */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
              <span className="text-gray-400">({product.ratingCount})</span>
            </div>
            <span className="text-gray-500">
              ขายแล้ว {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount} ชิ้น
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{product.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center gap-2">
          {/* Direct Shopee Buy (Affiliate Click Tracked) */}
          <button
            onClick={(e) => onShopeeAffiliateClick(product, e)}
            className="flex-1 bg-[#EE4D2D] hover:bg-[#D43D1F] text-white py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs active:scale-95"
            title="เปิด Shopee App พร้อมสิทธิ์ส่วนลดและลิงก์ Affiliate"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="truncate">สั่งบน Shopee</span>
          </button>

          {/* Add to Minimart Cart */}
          <button
            onClick={(e) => onAddToCart(product, e)}
            className="p-1.5 rounded-lg border border-orange-200 text-[#EE4D2D] hover:bg-orange-50 transition active:scale-95 shrink-0"
            title="ใส่ตะกร้าซื้อตรงจากมินิมาร์ท"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
