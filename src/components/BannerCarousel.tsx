import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Tag, Truck, ShieldCheck, Flame, Gift } from 'lucide-react';

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  bgGradient: string;
  image: string;
  ctaText: string;
  ctaAction?: () => void;
}

interface BannerCarouselProps {
  onBannerClick?: (keyword: string) => void;
  onOpenPlayStore: () => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onBannerClick, onOpenPlayStore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: BannerSlide[] = [
    {
      id: 'slide-1',
      tag: '🔥 ดีลเด็ด Shopee x จันทร์เพ็ญ',
      title: 'Shopee Affiliate Bestsellers',
      subtitle: 'รวมสินค้าขายดี ข้าวหอมมะลิ เครื่องปรุงรส และของใช้ในครัวเรือน ลดสูงสุด 50%',
      accent: 'รับส่วนลดพิเศษ + ค่าคอมมิชชันโปร่งใส',
      bgGradient: 'from-[#EE4D2D] via-[#FF5722] to-[#FF8A65]',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      ctaText: 'ดูสินค้าโปรโมชั่น',
    },
    {
      id: 'slide-2',
      tag: '⭐ อัลบั้ม Facebook เกษม . M',
      title: 'ของกินของฝากคัดพิเศษเมืองเหนือ',
      subtitle: 'น้ำพริกหนุ่ม แคบหมู กาแฟอาราบิก้าแท้ คัดสรรโดยคุณเกษม ม. จัดส่งทั่วประเทศ',
      accent: 'สั่งตรงจากมินิมาร์ท หรือกดสั่งใน Shopee',
      bgGradient: 'from-[#1565C0] via-[#1E88E5] to-[#42A5F5]',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      ctaText: 'ดูอัลบั้ม Facebook',
    },
    {
      id: 'slide-3',
      tag: '📲 Google Play & Android Ready',
      title: 'ติดตั้งแอป จันทร์เพ็ญ มินิมาร์ท',
      subtitle: 'สั่งซื้อง่าย แจ้งเตือนออเดอร์เรียลไทม์ รับโปรโมชั่นก่อนใครบนมือถือ Android',
      accent: 'รองรับการส่งขึ้น Google Play Store และ GitHub',
      bgGradient: 'from-[#2E7D32] via-[#388E3C] to-[#4CAF50]',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      ctaText: 'ดูรายละเอียดติดตั้งแอป',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-2">
      {/* Main Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Large Carousel */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-lg h-56 sm:h-72 md:h-80 group">
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-all duration-700`} />
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-35 transform scale-105 group-hover:scale-110 transition duration-1000"
          />

          {/* Banner Content */}
          <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between text-white max-w-lg">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-yellow-200 mb-2 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                {slide.tag}
              </span>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight drop-shadow leading-tight mt-1">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 line-clamp-2 mt-2 leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-yellow-200 mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {slide.accent}
              </p>
              <button
                onClick={() => {
                  if (currentSlide === 2) {
                    onOpenPlayStore();
                  } else if (onBannerClick) {
                    onBannerClick(currentSlide === 1 ? 'Facebook' : '');
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-extrabold text-xs sm:text-sm shadow-md hover:bg-yellow-300 hover:text-black transition transform active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-yellow-400' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right 2 Side Widgets (Shopee Feature Teasers) */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
          {/* Card 1: Affiliate Special */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200/60 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-200/60 px-2 py-0.5 rounded-full">
                  Affiliate Sub-ID
                </span>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 mt-1">
                  ระบบลิงก์สร้างรายได้
                </h4>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  ทุกการสั่งซื้อสร้างคอมมิชชันให้คุณเกษม ม.
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#EE4D2D] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Gift className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-orange-200/50">
              <span className="font-semibold text-orange-700">ค่าคอมมิชชัน 8% - 15%</span>
              <span className="text-gray-500 font-medium">รหัส: KASEM_M</span>
            </div>
          </div>

          {/* Card 2: Play Store & Android APK info */}
          <div 
            onClick={onOpenPlayStore}
            className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/60 rounded-2xl p-4 flex flex-col justify-between shadow-xs cursor-pointer hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                  Google Play Store
                </span>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 mt-1 group-hover:text-emerald-800 transition">
                  พร้อมส่งขึ้น Play Store
                </h4>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  แพ็กเกจ com.janpen.minimart &amp; GitHub
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-emerald-200/50">
              <span className="font-semibold text-emerald-800">TWA &amp; PWA พร้อมแล้ว</span>
              <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                คลิกดูวิธี <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shopee-style Highlight Features Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-3 bg-white p-3 sm:p-4 rounded-xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#EE4D2D] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">Shopee Mall แท้ 100%</h5>
            <p className="text-[11px] text-gray-500">คืนเงิน 2 เท่าหากพบของปลอม</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">ส่งตรงถึงบ้าน ทั่วไทย</h5>
            <p className="text-[11px] text-gray-500">เก็บเงินปลายทาง / โอนจ่าย QR</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">แฟลชเซลล์ลดทุกวัน</h5>
            <p className="text-[11px] text-gray-500">สินค้าราคาพิเศษ อัปเดตตลอด</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">Shopee Affiliate Partner</h5>
            <p className="text-[11px] text-gray-500">โดยคุณเกษม ม. (Kasem . M)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
