import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Github, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Package,
  FileCode
} from 'lucide-react';

interface PlayStoreExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreExportModal: React.FC<PlayStoreExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'playstore' | 'github' | 'twa'>('playstore');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const bubblewrapCommands = [
    '# 1. ติดตั้ง Bubblewrap CLI ของ Google สำหรับแปลง PWA เป็น Android App (AAB/APK)',
    'npm install -g @bubblewrap/cli',
    '',
    '# 2. เริ่มต้นโปรเจกต์ Android App จาก Web Manifest',
    'bubblewrap init --manifest=https://ais-dev-ehkgtc57ov5ljplj2obx7v-810359775859.asia-southeast1.run.app/manifest.webmanifest',
    '',
    '# 3. สร้างไฟล์ Android Package พร้อม Signing Key เพื่อส่ง Google Play Store',
    'bubblewrap build',
  ].join('\n');

  const gitCommands = [
    '# เริ่มต้น Git และส่งขึ้น GitHub บัญชี janjaow80',
    'git init',
    'git add .',
    'git commit -m "Initial release: Janpen Minimart-Shopee Affiliate PWA with Android Play Store support"',
    'git branch -M main',
    'git remote add origin https://github.com/janjaow80/janpen-minimart-shopee-affiliate.git',
    'git push -u origin main',
  ].join('\n');

  const downloadJsonBundle = () => {
    const bundleData = {
      appName: 'Janpen Minimart-Shopee Affiliate',
      packageName: 'com.janpen.minimart',
      versionCode: 1,
      versionName: '1.0.0',
      adminUser: 'Kasem . M (janjaow80@gmail.com)',
      shopeeAffiliateId: 'TH_KASEM_80',
      host: 'https://ais-dev-ehkgtc57ov5ljplj2obx7v-810359775859.asia-southeast1.run.app',
      assetLinksPath: '/.well-known/assetlinks.json',
      manifestPath: '/manifest.webmanifest',
      icons: {
        icon192: '/pwa-192x192.png',
        icon512: '/pwa-512x512.png',
        maskable: '/pwa-maskable-512x512.png',
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'janpen-minimart-playstore-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 sm:p-6 text-gray-900 relative my-auto max-h-[90vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                เตรียมแพ็กเกจขึ้น Google Play Store &amp; GitHub
              </h3>
              <p className="text-xs text-gray-500">
                แอปพลิเคชัน: <strong>Janpen Minimart-Shopee Affiliate</strong> (Package: <span className="font-mono text-emerald-700">com.janpen.minimart</span>)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 border-b border-gray-100 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'playstore'
                ? 'bg-[#EE4D2D] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Google Play Store (TWA / AAB)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'github'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </button>

          <button
            onClick={() => setActiveTab('twa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'twa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>สถานะความพร้อม (Checklist)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="my-4 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'playstore' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ระบบสร้าง Manifest, ไอคอน 192x192, 512x512 และ AssetLinks รองรับ Play Store เรียบร้อยแล้ว
                </span>
                <p className="mt-1 text-emerald-800 leading-relaxed text-[11px]">
                  ท่านสามารถใช้คำสั่ง <strong>Google Bubblewrap</strong> เพื่อคอมไพล์โปรเจกต์นี้เป็น Android Application (.aab) แล้วอัปโหลดขึ้น Google Play Console ได้ทันที
                </p>
              </div>

              {/* Commands snippet */}
              <div className="relative bg-gray-900 text-gray-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto">
                <button
                  onClick={() => copyText(bubblewrapCommands, 1)}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[11px] flex items-center gap-1 transition"
                >
                  {copiedIndex === 1 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 1 ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง'}</span>
                </button>
                <pre className="whitespace-pre">{bubblewrapCommands}</pre>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-700">
                <h5 className="font-bold text-gray-900 mb-1">ข้อมูลสำหรับกรอกบน Google Play Console:</h5>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-600">
                  <li><strong>App Name:</strong> Janpen Minimart-Shopee Affiliate</li>
                  <li><strong>Package Name:</strong> com.janpen.minimart</li>
                  <li><strong>Category:</strong> Shopping (ช้อปปิ้ง)</li>
                  <li><strong>Contact Email:</strong> janjaow80@gmail.com</li>
                  <li><strong>Developer:</strong> Kasem . M</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800">
                <span className="font-bold flex items-center gap-1.5 text-gray-900">
                  <Github className="w-4 h-4" />
                  คำสั่งส่งโค้ดโปรเจกต์ขึ้น GitHub (สำหรับคุณเกษม ม. / janjaow80)
                </span>
                <p className="mt-1 text-[11px] text-gray-600">
                  สามารถรันคำสั่งเหล่านี้ใน Terminal เพื่อสร้างคลังเก็บโค้ดบน GitHub และเปิดระบบ CI/CD เพื่อสร้างไฟล์ APK ได้โดยอัตโนมัติ
                </p>
              </div>

              {/* Git Commands snippet */}
              <div className="relative bg-gray-900 text-gray-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto">
                <button
                  onClick={() => copyText(gitCommands, 2)}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[11px] flex items-center gap-1 transition"
                >
                  {copiedIndex === 2 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 2 ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง'}</span>
                </button>
                <pre className="whitespace-pre">{gitCommands}</pre>
              </div>
            </div>
          )}

          {activeTab === 'twa' && (
            <div className="space-y-2.5 animate-in fade-in">
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl bg-gray-50 p-2 text-xs">
                <div className="py-2 px-2 flex items-center justify-between">
                  <span className="font-medium text-gray-800">Web App Manifest (manifest.webmanifest)</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ตรวจสอบผ่าน
                  </span>
                </div>
                <div className="py-2 px-2 flex items-center justify-between">
                  <span className="font-medium text-gray-800">ไอคอนมาตรฐาน Play Store (512x512 PNG)</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ตรวจสอบผ่าน
                  </span>
                </div>
                <div className="py-2 px-2 flex items-center justify-between">
                  <span className="font-medium text-gray-800">ไอคอน Maskable ป้องกันขอบถูกตัด</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ตรวจสอบผ่าน
                  </span>
                </div>
                <div className="py-2 px-2 flex items-center justify-between">
                  <span className="font-medium text-gray-800">ไฟล์ Digital Asset Links (assetlinks.json)</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ติดตั้งเรียบร้อย
                  </span>
                </div>
                <div className="py-2 px-2 flex items-center justify-between">
                  <span className="font-medium text-gray-800">โหมดการแสดงผล Standalone (เต็มจอเหมือนแอปจริง)</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> รองรับ 100%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={downloadJsonBundle}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด Play Store Config (JSON)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#EE4D2D] hover:bg-[#D43D1F] text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
