import React, { useState } from 'react';
import { 
  Facebook, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { FBPostItem, Product, AdminUser } from '../../types';
import { StorageService } from '../../services/storageService';

interface FacebookAlbumImporterProps {
  admin: AdminUser;
  onProductImported: (product: Product) => void;
}

export const FacebookAlbumImporter: React.FC<FacebookAlbumImporterProps> = ({
  admin,
  onProductImported,
}) => {
  const [posts, setPosts] = useState<FBPostItem[]>(StorageService.getFBPosts());
  const [selectedAlbum, setSelectedAlbum] = useState<string>('ทั้งหมด');
  const [isSyncing, setIsSyncing] = useState(false);

  // Manual Paste / Add from Facebook tool
  const [customAlbumName, setCustomAlbumName] = useState('สินค้าหน้าร้าน จันทร์เพ็ญ มินิมาร์ท');
  const [customTitle, setCustomTitle] = useState('');
  const [customCaption, setCustomCaption] = useState('');
  const [customPrice, setCustomPrice] = useState(150);
  const [customShopeeUrl, setCustomShopeeUrl] = useState('');
  const [customImg, setCustomImg] = useState('https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80');
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handleSyncWithFacebook = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setPosts(StorageService.getFBPosts());
      alert('ซิงค์ข้อมูลจากอัลบั้ม Facebook บัญชี Kasem . M สำเร็จ!');
    }, 1200);
  };

  const handleImportPost = (post: FBPostItem) => {
    const affiliateUrl = StorageService.convertRawUrlToAffiliate(post.shopeeUrl, admin);

    const newProd: Product = {
      id: 'jp-fb-' + post.id + '-' + Date.now(),
      name: post.title,
      category: post.albumName.includes('Shopee') ? 'เครื่องใช้ไฟฟ้าขนาดเล็ก' : 'ของกินและของใช้',
      price: post.price,
      originalPrice: post.originalPrice,
      imageUrl: post.imageUrl,
      soldCount: 45,
      rating: 4.9,
      ratingCount: 12,
      location: 'เชียงใหม่',
      shopeeAffiliateUrl: affiliateUrl,
      rawShopeeUrl: post.shopeeUrl,
      commissionRate: 10,
      isMinimartDirect: true,
      description: `${post.description} (ดึงข้อมูลอัตโนมัติจากอัลบั้ม Facebook คุณเกษม ม.)`,
      sourceAlbum: post.albumName,
      createdAt: new Date().toISOString(),
    };

    StorageService.addProduct(newProd);

    // Update post imported status
    const updatedPosts = posts.map((p) =>
      p.id === post.id ? { ...p, alreadyImported: true } : p
    );
    setPosts(updatedPosts);
    StorageService.saveFBPosts(updatedPosts);

    onProductImported(newProd);
  };

  const handleAddCustomFBPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    const newPost: FBPostItem = {
      id: 'fb-post-' + Date.now(),
      albumName: customAlbumName,
      title: customTitle,
      description: customCaption || 'สินค้าพร้อมส่งจากหน้าร้านจันทร์เพ็ญ มินิมาร์ท',
      price: Number(customPrice) || 100,
      originalPrice: Math.round((Number(customPrice) || 100) * 1.3),
      shopeeUrl: customShopeeUrl || 'https://shopee.co.th/product/8812304/new-item',
      imageUrl: customImg,
      date: new Date().toISOString().split('T')[0],
      alreadyImported: false,
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    StorageService.saveFBPosts(updated);

    // Auto import right away
    handleImportPost(newPost);

    setCustomTitle('');
    setCustomCaption('');
    setPasteSuccess(true);
    setTimeout(() => setPasteSuccess(false), 3000);
  };

  const filteredPosts =
    selectedAlbum === 'ทั้งหมด'
      ? posts
      : posts.filter((p) => p.albumName === selectedAlbum);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <Facebook className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base sm:text-lg text-gray-900">
              เชื่อมต่ออัลบั้มสินค้า Facebook ส่วนตัว (Kasem . M)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ดึงรูปภาพ แคปชัน และราคาสินค้าจากอัลบั้ม Facebook ของคุณเกษม ม. พร้อมแปลงเป็นลิงก์ Shopee Affiliate สร้างรายได้อัตโนมัติ
          </p>
        </div>

        {/* Sync Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FB Account: Kasem . M</span>
          </div>
          <button
            onClick={handleSyncWithFacebook}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'กำลังซิงค์...' : 'รีเฟรชอัลบั้ม'}</span>
          </button>
        </div>
      </div>

      {/* Manual Importer Form */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-blue-950 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          วางโพสต์สินค้าจาก Facebook ใหม่ เพื่อแปลงเข้าหน้าร้านทันที
        </h4>
        <form onSubmit={handleAddCustomFBPost} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                เลือกอัลบั้ม Facebook
              </label>
              <select
                value={customAlbumName}
                onChange={(e) => setCustomAlbumName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="สินค้าหน้าร้าน จันทร์เพ็ญ มินิมาร์ท">สินค้าหน้าร้าน จันทร์เพ็ญ มินิมาร์ท</option>
                <option value="Shopee รีวิวเด็ด จากเฟสบุ๊ค เกษม . M">Shopee รีวิวเด็ด จากเฟสบุ๊ค เกษม . M</option>
                <option value="ของกินของฝากคัดพิเศษจากเฟสบุ๊ค เกษม . M">ของกินของฝากคัดพิเศษจากเฟสบุ๊ค เกษม . M</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                ชื่อสินค้า
              </label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="เช่น ชุดของฝากเมืองเหนือ น้ำพริกหนุ่ม+แคบหมู"
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                ราคา (บาท)
              </label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                ลิงก์ Shopee หรือลิงก์จากโพสต์
              </label>
              <input
                type="text"
                value={customShopeeUrl}
                onChange={(e) => setCustomShopeeUrl(e.target.value)}
                placeholder="https://shopee.co.th/product/..."
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
              แคปชันจากเฟสบุ๊ค
            </label>
            <textarea
              rows={2}
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              placeholder="ข้อความบรรยายสินค้าจากโพสต์เฟสบุ๊ค..."
              className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {pasteSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                นำเข้าและแปลงลิงก์สู่หน้าร้านสำเร็จ!
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">
                ระบบจะคำนวณแทร็กกิ้ง Affiliate อัตโนมัติ
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>แปลงและบันทึกสู่หน้าร้าน</span>
            </button>
          </div>
        </form>
      </div>

      {/* Album Posts Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            รายการสินค้าที่ตรวจพบในอัลบั้ม Facebook ({filteredPosts.length} รายการ)
          </h4>

          {/* Filter Album */}
          <div className="flex items-center gap-1 text-xs">
            {['ทั้งหมด', 'สินค้าหน้าร้าน จันทร์เพ็ญ มินิมาร์ท', 'Shopee รีวิวเด็ด จากเฟสบุ๊ค เกษม . M'].map(
              (album) => (
                <button
                  key={album}
                  onClick={() => setSelectedAlbum(album)}
                  className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                    selectedAlbum === album
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {album}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {post.albumName}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {post.date}
                  </div>
                </div>

                <div className="p-3">
                  <h5 className="font-bold text-xs text-gray-900 line-clamp-1">{post.title}</h5>
                  <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 leading-snug">
                    {post.description}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-extrabold text-sm text-[#EE4D2D]">
                      ฿{post.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      ฿{post.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  onClick={() => handleImportPost(post)}
                  disabled={post.alreadyImported}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    post.alreadyImported
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#EE4D2D] hover:bg-[#D43D1F] text-white shadow-xs'
                  }`}
                >
                  {post.alreadyImported ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>นำเข้าหน้าร้านแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>แปลงเป็นลิงก์ Affiliate &amp; นำเข้า</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
