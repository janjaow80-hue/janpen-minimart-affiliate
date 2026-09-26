import React, { useState, useEffect } from 'react';
import { Flame, Clock, ChevronRight, Zap, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface FlashSaleSectionProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onDirectAffiliateBuy: (p: Product, e: React.MouseEvent) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onSelectProduct,
  onDirectAffiliateBuy,
}) => {
  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 48,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 3, minutes: 59, seconds: 59 }; // loop
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = products.filter((p) => p.isFlashSale);

  if (flashSaleItems.length === 0) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-orange-100 overflow-hidden">
        {/* Flash Sale Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#EE4D2D] to-[#FF5722] text-white px-3 py-1 rounded-md shadow-xs">
              <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 animate-bounce" />
              <span className="font-black text-sm sm:text-base tracking-wider uppercase">
                FLASH SALE
              </span>
            </div>

            {/* Countdown Badges */}
            <div className="flex items-center gap-1 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-gray-500 mr-1" />
              <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded shadow-inner">
                {pad(timeLeft.hours)}
              </span>
              <span className="text-gray-900 font-bold">:</span>
              <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded shadow-inner">
                {pad(timeLeft.minutes)}
              </span>
              <span className="text-gray-900 font-bold">:</span>
              <span className="bg-[#EE4D2D] text-white px-1.5 py-0.5 rounded shadow-inner animate-pulse">
                {pad(timeLeft.seconds)}
              </span>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#EE4D2D] flex items-center gap-0.5">
            ราคาพิเศษเฉพาะช่วงเวลานี้เท่านั้น
          </span>
        </div>

        {/* Horizontal Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-4">
          {flashSaleItems.map((product) => {
            const discountPct = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );
            const soldPct = Math.min(
              95,
              Math.round(((product.flashSaleSold || 10) / (product.flashSaleStock || 20)) * 100)
            );

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-white border border-gray-100 hover:border-[#EE4D2D]/60 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container with Discount Badge */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  {/* Shopee-style Yellow Discount Flag */}
                  <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 font-black text-[11px] px-1.5 py-1 rounded-bl-lg shadow-xs flex flex-col items-center leading-none">
                    <span>{discountPct}%</span>
                    <span className="text-[9px] text-gray-800 font-bold">ลด</span>
                  </div>

                  {/* Affiliate Pill */}
                  <div className="absolute bottom-1.5 left-1.5 bg-[#EE4D2D]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <span>Shopee</span>
                    <span className="text-yellow-200">Affiliate</span>
                  </div>
                </div>

                {/* Info & Progress */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#EE4D2D] transition">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-2.5">
                    {/* Price */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-[#EE4D2D]">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-400 line-through">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Fiery Progress Bar */}
                    <div className="mt-2 relative">
                      <div className="w-full bg-red-100 rounded-full h-3.5 overflow-hidden flex items-center">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-[#EE4D2D] h-full rounded-full transition-all duration-500"
                          style={{ width: `${soldPct}%` }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-1 text-[10px] font-black text-white drop-shadow-xs pointer-events-none">
                        <Flame className="w-3 h-3 fill-white" />
                        <span>ขายแล้ว {soldPct}%</span>
                      </div>
                    </div>

                    {/* Quick Affiliate Order Button */}
                    <button
                      onClick={(e) => onDirectAffiliateBuy(product, e)}
                      className="mt-2.5 w-full bg-[#EE4D2D] hover:bg-[#D43D1F] text-white py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>สั่งซื้อบน Shopee</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
