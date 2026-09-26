import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/70 border border-emerald-400/40 rounded-full text-xs font-semibold text-white">
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        <span>ติดตั้งแล้ว (App Mode)</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-gray-900 shadow-md hover:from-yellow-300 hover:to-amber-400 transition transform hover:scale-105 active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span>ติดตั้งแอป Janpen</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
          <span>ติดตั้งบน iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-gray-900">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#EE4D2D]" />
                  <h3 className="text-base font-bold text-gray-900">ติดตั้งบน iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-[#EE4D2D] font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <p>กดปุ่ม <strong>แชร์ (Share)</strong> ที่แถบเมนู Safari ด้านล่าง</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-[#EE4D2D] font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <p>เลื่อนลงมาแล้วกด <strong>เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)</strong></p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-[#EE4D2D] font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </span>
                  <p>กด <strong>เพิ่ม (Add)</strong> เพื่อเปิดใช้งานแบบเต็มจอเหมือนแอปจริงได้ทันที</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-[#EE4D2D] py-2.5 text-sm font-bold text-white hover:bg-[#D43D1F] transition shadow-md"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers before prompt or generic desktop
  return (
    <button
      onClick={() => {
        alert('สำหรับการติดตั้งบน Android หรือ คอมพิวเตอร์: ให้กดที่จุด 3 จุดบนเบราว์เซอร์ แล้วเลือก "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก"');
      }}
      className="flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-semibold text-white transition"
    >
      <Download className="w-3.5 h-3.5 text-yellow-300" />
      <span>แอป Android (PWA)</span>
    </button>
  );
};
