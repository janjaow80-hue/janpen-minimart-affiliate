import React from 'react';
import { 
  Layers, 
  Wheat, 
  Soup, 
  Tv, 
  Coffee, 
  Cookie, 
  Sparkles, 
  Facebook,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  activeFilterType: 'all' | 'affiliate_only' | 'minimart_only' | 'flash_sale';
  onSelectFilterType: (type: 'all' | 'affiliate_only' | 'minimart_only' | 'flash_sale') => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onSelectCategory,
  activeFilterType,
  onSelectFilterType,
}) => {
  const categories = [
    { id: 'ทั้งหมด', name: 'ทั้งหมด', icon: Layers, color: 'bg-orange-500 text-white' },
    { id: 'ข้าวสารและอาหารแห้ง', name: 'ข้าวสาร/อาหารแห้ง', icon: Wheat, color: 'bg-amber-100 text-amber-700' },
    { id: 'เครื่องปรุงและน้ำมัน', name: 'เครื่องปรุง & น้ำมัน', icon: Soup, color: 'bg-red-100 text-red-700' },
    { id: 'เครื่องใช้ไฟฟ้าขนาดเล็ก', name: 'เครื่องใช้ไฟฟ้า', icon: Tv, color: 'bg-blue-100 text-blue-700' },
    { id: 'เครื่องดื่มและชาชง', name: 'เครื่องดื่ม/กาแฟ', icon: Coffee, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'ขนมขบเคี้ยวและเบเกอรี่', name: 'ขนม & เบเกอรี่', icon: Cookie, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'ของใช้ในบ้านและซักล้าง', name: 'ของใช้ในบ้าน', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
    { id: 'facebook_album', name: 'อัลบั้ม Facebook', icon: Facebook, color: 'bg-indigo-100 text-indigo-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2">
      {/* Shopee-style Category Pill Buttons */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#EE4D2D] rounded-full" />
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">หมวดหมู่สินค้า (Categories)</h3>
          </div>

          {/* Quick source toggle */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => onSelectFilterType('all')}
              className={`px-3 py-1 rounded-full font-medium transition ${
                activeFilterType === 'all'
                  ? 'bg-[#EE4D2D] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => onSelectFilterType('affiliate_only')}
              className={`px-3 py-1 rounded-full font-medium transition flex items-center gap-1 ${
                activeFilterType === 'affiliate_only'
                  ? 'bg-[#EE4D2D] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Shopee Affiliate</span>
            </button>
            <button
              onClick={() => onSelectFilterType('minimart_only')}
              className={`px-3 py-1 rounded-full font-medium transition hidden sm:inline-flex ${
                activeFilterType === 'minimart_only'
                  ? 'bg-[#EE4D2D] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>ซื้อตรงมินิมาร์ท</span>
            </button>
            <button
              onClick={() => onSelectFilterType('flash_sale')}
              className={`px-3 py-1 rounded-full font-medium transition flex items-center gap-1 ${
                activeFilterType === 'flash_sale'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Flame className="w-3 h-3 text-red-500 fill-current" />
              <span>Flash Sale</span>
            </button>
          </div>
        </div>

        {/* Categories scrollable rail */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-xl min-w-[90px] sm:min-w-[105px] transition group shrink-0 ${
                  isSelected
                    ? 'bg-orange-50 border-2 border-[#EE4D2D]'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition transform group-hover:scale-110 shadow-xs ${
                    isSelected ? 'bg-[#EE4D2D] text-white' : cat.color
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs text-center line-clamp-1 ${
                    isSelected ? 'font-bold text-[#EE4D2D]' : 'font-medium text-gray-700'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
