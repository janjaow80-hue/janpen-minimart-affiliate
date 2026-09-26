import React, { useState } from 'react';
import { X, User, Phone, MapPin, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { CustomerUser } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerUser;
  onSaveCustomer: (updated: CustomerUser) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSaveCustomer,
}) => {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomer({
      ...customer,
      name,
      phone,
      address,
      isLoggedIn: true,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleQuickLogin = (type: 'Google' | 'Facebook' | 'Line') => {
    const defaultAddresses = [
      '99/1 ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200',
      '45/12 ซอยอารีย์ พญาไท กรุงเทพฯ 10400',
      '188 หมู่ 5 ต.รอบเวียง อ.เมือง จ.เชียงราย 57000',
    ];
    const dummyNames = {
      Google: 'คุณกนกวรรณ (เข้าสู่ระบบด้วย Google)',
      Facebook: 'คุณธีรพงศ์ (เข้าสู่ระบบด้วย Facebook)',
      Line: 'คุณลลิตา (เข้าสู่ระบบด้วย LINE)',
    };
    const randAddr = defaultAddresses[Math.floor(Math.random() * defaultAddresses.length)];
    const chosenName = dummyNames[type];

    setName(chosenName);
    setAddress(randAddr);
    onSaveCustomer({
      ...customer,
      name: chosenName,
      address: randAddr,
      phone: '08' + Math.floor(10000000 + Math.random() * 90000000),
      isLoggedIn: true,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-gray-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-orange-100 text-[#EE4D2D] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">บัญชีลูกค้า จันทร์เพ็ญ มินิมาร์ท</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            เข้าใช้งานได้ทันทีอย่างไร้รอยต่อ สั่งซื้อง่าย บันทึกที่อยู่จัดส่ง
          </p>
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center text-emerald-600 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 animate-bounce" />
            <p className="font-bold text-base">บันทึกข้อมูลและเข้าสู่ระบบสำเร็จ!</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Quick 1-click social logins */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider text-center">
                เข้าสู่ระบบด่วน 1 คลิก
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickLogin('Google')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition"
                >
                  <span className="text-red-500 font-bold">G</span>
                  <span>Google</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('Facebook')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-blue-200 bg-blue-50/50 rounded-xl hover:bg-blue-50 text-xs font-semibold text-blue-700 transition"
                >
                  <span className="text-blue-600 font-bold">f</span>
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('Line')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-green-200 bg-green-50/50 rounded-xl hover:bg-green-50 text-xs font-semibold text-green-700 transition"
                >
                  <span className="text-green-600 font-bold">L</span>
                  <span>LINE</span>
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-gray-400 text-xs font-medium">หรือระบุข้อมูลจัดส่ง</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ชื่อ-นามสกุล / ชื่อผู้รับ
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น คุณกานดา สุวรรณมาลัย"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ที่อยู่สำหรับจัดส่งสินค้า
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="บ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#EE4D2D] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#D43D1F] transition"
              >
                บันทึกและใช้งานบัญชีนี้
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
