import React, { useState } from 'react';
import { 
  Link, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  PlusCircle, 
  Calculator, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminUser, Product } from '../../types';
import { StorageService } from '../../services/storageService';

interface AffiliateLinkConverterProps {
  admin: AdminUser;
  onProductAdded: (newProduct: Product) => void;
}

export const AffiliateLinkConverter: React.FC<AffiliateLinkConverterProps> = ({
  admin,
  onProductAdded,
}) => {
  const [rawUrl, setRawUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number>(350);
  const [category, setCategory] = useState('สินค้า Shopee ขายดี');
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [customSubId, setCustomSubId] = useState(admin.subId || 'janpen_minimart');
  const [customImageUrl, setCustomImageUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');

  const [convertedUrl, setConvertedUrl] = useState('');
  const [deepLink, setDeepLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleConvert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rawUrl) return;

    const finalAffiliateUrl = StorageService.convertRawUrlToAffiliate(rawUrl, admin, customSubId);
    setConvertedUrl(finalAffiliateUrl);
    setDeepLink(StorageService.generateDeepLink(finalAffiliateUrl));
  };

  const handleCopy = () => {
    if (!convertedUrl) return;
    navigator.clipboard.writeText(convertedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddDirectToStore = () => {
    if (!productName || !convertedUrl) {
      alert('กรุณากรอกชื่อสินค้าและแปลงลิงก์ก่อนเพิ่มลงหน้าร้าน');
      return;
    }

    const newProd: Product = {
      id: 'jp-custom-' + Date.now(),
      name: productName,
      category,
      price: Number(price) || 100,
      originalPrice: Math.round((Number(price) || 100) * 1.3),
      imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      soldCount: 1,
      rating: 5.0,
      ratingCount: 1,
      location: 'เชียงใหม่',
      shopeeAffiliateUrl: convertedUrl,
      rawShopeeUrl: rawUrl,
      commissionRate: Number(commissionRate) || 10,
      isMinimartDirect: false,
      isFlashSale: false,
      description: `สินค้าคัดสรรพิเศษโดยคุณเกษม ม. (Kasem . M) สั่งซื้อผ่าน Shopee Affiliate เพื่อรับสิทธิพิเศษและส่วนลด`,
      sourceAlbum: 'เพิ่มผ่านเครื่องมือแปลงลิงก์อัตโนมัติ',
      createdAt: new Date().toISOString(),
    };

    StorageService.addProduct(newProd);
    onProductAdded(newProd);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const estimatedCommission = Number(((price * commissionRate) / 100).toFixed(2));
  const qrUrl = convertedUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(convertedUrl)}`
    : '';

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-start justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-[#EE4D2D]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base sm:text-lg text-gray-900">
              ระบบแปลงลิงก์ Shopee Affiliate อัตโนมัติ (Link Converter)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ผูกบัญชีผู้ดูแลระบบ: <strong className="text-gray-800">{admin.name}</strong> ({admin.email}) | Affiliate ID: <strong className="text-[#EE4D2D]">{admin.shopeeAffiliateId}</strong>
          </p>
        </div>
      </div>

      {/* Main Converter Form */}
      <form onSubmit={handleConvert} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            วางลิงก์สินค้า Shopee ดั้งเดิม (Raw Shopee URL)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={rawUrl}
              onChange={(e) => setRawUrl(e.target.value)}
              placeholder="เช่น https://shopee.co.th/product/12345/67890 หรือ https://s.shopee.co.th/xyz..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] font-mono text-gray-800"
            />
            <button
              type="button"
              onClick={() => {
                setRawUrl('https://shopee.co.th/product/9920192/8821902-เครื่องชงกาแฟอัตโนมัติ');
                setProductName('เครื่องชงกาแฟเอสเปรสโซ่แรงดัน 20 บาร์ รุ่นมินิมอล');
                setPrice(1290);
                setCategory('เครื่องใช้ไฟฟ้าขนาดเล็ก');
              }}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium shrink-0"
            >
              ตัวอย่าง
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#EE4D2D] hover:bg-[#D43D1F] text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition active:scale-95"
            >
              แปลงลิงก์ทันที
            </button>
          </div>
        </div>

        {/* Quick parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Sub-ID สำหรับติดตาม (Sub_ID)
            </label>
            <input
              type="text"
              value={customSubId}
              onChange={(e) => setCustomSubId(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#EE4D2D]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              ราคาสินค้า (บาท)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#EE4D2D]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              อัตราคอมมิชชัน (%)
            </label>
            <select
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#EE4D2D]"
            >
              <option value={8}>8% (หมวดอาหารและของใช้)</option>
              <option value={10}>10% (หมวดทั่วไป)</option>
              <option value={12}>12% (หมวดเครื่องใช้ไฟฟ้า)</option>
              <option value={15}>15% (แคมเปญพิเศษ Shopee)</option>
              <option value={20}>20% (โบนัสคอมมิชชันสูงสุด)</option>
            </select>
          </div>
        </div>
      </form>

      {/* Output Result Card */}
      {convertedUrl && (
        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-orange-200/60">
            <span className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              แปลงลิงก์สำเร็จ! ผูกแทร็กกิ้งคุณเกษม ม. เรียบร้อยแล้ว
            </span>

            {/* Estimated Commission Badge */}
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-orange-200 text-xs shadow-xs">
              <Calculator className="w-3.5 h-3.5 text-[#EE4D2D]" />
              <span className="text-gray-600">คอมมิชชันโดยประมาณต่อคำสั่งซื้อ:</span>
              <strong className="text-emerald-600 text-sm font-black">฿{estimatedCommission}</strong>
            </div>
          </div>

          {/* Links View */}
          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block mb-0.5">
                ลิงก์สร้างรายได้ (Affiliate Web Link):
              </span>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={convertedUrl}
                  className="flex-1 text-xs p-2 bg-white rounded-lg border border-orange-200 font-mono text-gray-700"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-white hover:bg-orange-100 text-[#EE4D2D] border border-orange-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-gray-500 block mb-0.5">
                Universal App Deep-Link (เปิดแอป Shopee ทันที):
              </span>
              <input
                readOnly
                value={deepLink}
                className="w-full text-xs p-2 bg-white/70 rounded-lg border border-orange-100 font-mono text-gray-600"
              />
            </div>
          </div>

          {/* Add to storefront directly section */}
          <div className="pt-3 border-t border-orange-200/60 bg-white p-4 rounded-xl shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#EE4D2D]" />
              นำเข้าเป็นสินค้าหน้าร้าน จันทร์เพ็ญ มินิมาร์ท ทันที
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-600 mb-0.5">ชื่อสินค้าที่ต้องการแสดง</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="เช่น กาต้มน้ำไฟฟ้าสแตนเลส"
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EE4D2D]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-600 mb-0.5">หมวดหมู่</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EE4D2D]"
                >
                  <option value="ข้าวสารและอาหารแห้ง">ข้าวสารและอาหารแห้ง</option>
                  <option value="เครื่องปรุงและน้ำมัน">เครื่องปรุงและน้ำมัน</option>
                  <option value="เครื่องใช้ไฟฟ้าขนาดเล็ก">เครื่องใช้ไฟฟ้าขนาดเล็ก</option>
                  <option value="เครื่องดื่มและชาชง">เครื่องดื่มและชาชง</option>
                  <option value="ขนมขบเคี้ยวและเบเกอรี่">ขนมขบเคี้ยวและเบเกอรี่</option>
                  <option value="ของใช้ในบ้านและซักล้าง">ของใช้ในบ้านและซักล้าง</option>
                  <option value="สินค้า Shopee ขายดี">สินค้า Shopee ขายดี</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              {addedSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  เพิ่มสินค้าเข้าหน้าร้านเรียบร้อยแล้ว!
                </span>
              ) : (
                <span className="text-[11px] text-gray-400">
                  ระบบจะบันทึกพร้อมแท็กและสถิติการคลิกอัตโนมัติ
                </span>
              )}
              <button
                type="button"
                onClick={handleAddDirectToStore}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>บันทึกและแสดงที่หน้าร้าน</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
