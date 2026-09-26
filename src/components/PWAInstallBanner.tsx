import React, { useState } from 'react';
import { Smartphone, Download, X, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenPlayStoreModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenPlayStoreModal }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-xs py-2.5 px-3 sm:px-6 shadow-md border-b border-white/10 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-xs text-white">
              ติดตั้งแอป Janpen Minimart บน Android &amp; Google Play Store
            </p>
            <p className="text-[11px] text-gray-300 hidden sm:block">
              เปิดใช้งานได้เร็วทันใจ แจ้งเตือนสถานะคำสั่งซื้อเรียลไทม์ และรับโค้ดส่วนลด Shopee พิเศษ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isInstallable ? (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-extrabold text-xs shadow-xs hover:from-yellow-300 hover:to-amber-400 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ติดตั้งทันที</span>
            </button>
          ) : (
            <button
              onClick={onOpenPlayStoreModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>วิธีดาวน์โหลด Play Store</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-white p-1 rounded transition"
            title="ซ่อนแถบนี้"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
