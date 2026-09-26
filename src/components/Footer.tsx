import React from 'react';
import { ShoppingBag, ShieldCheck, Mail, Phone, MapPin, Smartphone, ExternalLink, Heart } from 'lucide-react';
import { AdminUser } from '../types';

interface FooterProps {
  admin: AdminUser;
  onOpenPlayStore: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ admin, onOpenPlayStore, onOpenAdmin }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 text-gray-600 text-xs">
      {/* Top Footer Banner */}
      <div className="border-b border-gray-100 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Col 1: Store Bio */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-black text-base text-gray-900">
                จันทร์เพ็ญ มินิมาร์ท
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              ร้านค้าของชำและมินิมาร์ทออนไลน์ บริการสินค้าอุปโภคบริโภคคุณภาพ และเชื่อมโยงสินค้าขายดี Shopee Affiliate คัดสรรโดยคุณเกษม ม.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={onOpenPlayStore}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[11px] font-semibold hover:bg-gray-800 transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Play Package</span>
              </button>
            </div>
          </div>

          {/* Col 2: Shopee Affiliate details */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
              Shopee Affiliate Program
            </h4>
            <ul className="space-y-1 text-gray-500 text-[11px]">
              <li>ผู้ดูแลระบบ: <strong className="text-gray-800">{admin.name}</strong></li>
              <li>อีเมลติดต่อ: <strong className="text-gray-800">{admin.email}</strong></li>
              <li>รหัสพันธมิตร: <span className="font-mono text-[#EE4D2D] font-bold">{admin.shopeeAffiliateId}</span></li>
              <li>ติดตาม Sub-ID: <span className="font-mono text-gray-700">{admin.subId}</span></li>
              <li>ระบบแปลงลิงก์อัตโนมัติจากอัลบั้ม Facebook</li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
              บริการลูกค้า &amp; การจัดส่ง
            </h4>
            <ul className="space-y-1 text-gray-500 text-[11px]">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>รับประกันสินค้าแท้ 100%</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>จัดส่งด่วนทั่วเชียงใหม่ &amp; ทั่วประเทศ</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>โทรสอบถาม: 089-123-4567</span>
              </li>
              <li>รองรับการชำระเงินปลายทาง (COD) และ พร้อมเพย์ QR</li>
            </ul>
          </div>

          {/* Col 4: Safe shopping & Admin */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
              การบริหารจัดการ
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              สำหรับผู้ดูแลระบบร้านค้า Kasem . M เข้าจัดการสต็อกสินค้า ดูสถิติยอดคลิก และวิเคราะห์ค่าคอมมิชชัน
            </p>
            <button
              onClick={onOpenAdmin}
              className="mt-2 w-full py-2 px-3 border border-[#EE4D2D] text-[#EE4D2D] hover:bg-orange-50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>เข้าสู่หลังบ้าน (Admin Dashboard)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-gray-400 text-[11px]">
        <p>
          © 2026 Janpen Minimart-Shopee Affiliate. พัฒนาระบบโดยความร่วมมือของ จันทร์เพ็ญ มินิมาร์ท และ Kasem . M
        </p>
        <p className="flex items-center gap-1">
          สร้างด้วย <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> สำหรับการค้าขายออนไลน์ยุคใหม่
        </p>
      </div>
    </footer>
  );
};
