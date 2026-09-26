import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Flame, 
  CheckCircle2, 
  ShoppingBag, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Product, AdminUser } from '../../types';
import { StorageService } from '../../services/storageService';

interface ProductManagerProps {
  products: Product[];
  admin: AdminUser;
  onProductsUpdated: (products: Product[]) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  admin,
  onProductsUpdated,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ข้าวสารและอาหารแห้ง');
  const [price, setPrice] = useState(199);
  const [originalPrice, setOriginalPrice] = useState(250);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80');
  const [shopeeUrl, setShopeeUrl] = useState('https://shopee.co.th/product/8812304/2301928');
  const [commissionRate, setCommissionRate] = useState(10);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isMinimartDirect, setIsMinimartDirect] = useState(true);
  const [description, setDescription] = useState('');

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const affiliateUrl = StorageService.convertRawUrlToAffiliate(shopeeUrl, admin);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price) * 1.2,
        imageUrl,
        shopeeAffiliateUrl: affiliateUrl,
        rawShopeeUrl: shopeeUrl,
        commissionRate: Number(commissionRate),
        isFlashSale,
        isMinimartDirect,
        description: description || editingProduct.description,
      };
      StorageService.updateProduct(updated);
      onProductsUpdated(StorageService.getProducts());
      setEditingProduct(null);
    } else {
      const newProd: Product = {
        id: 'jp-admin-' + Date.now(),
        name,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice) || Math.round(Number(price) * 1.3),
        imageUrl,
        soldCount: 1,
        rating: 5.0,
        ratingCount: 1,
        location: 'เชียงใหม่',
        shopeeAffiliateUrl: affiliateUrl,
        rawShopeeUrl: shopeeUrl,
        commissionRate: Number(commissionRate),
        isFlashSale,
        isMinimartDirect,
        description: description || 'สินค้าคุณภาพ คัดสรรโดยจันทร์เพ็ญ มินิมาร์ท',
        sourceAlbum: 'ผู้ดูแลระบบเพิ่มเอง',
        createdAt: new Date().toISOString(),
      };
      StorageService.addProduct(newProd);
      onProductsUpdated(StorageService.getProducts());
      setShowAddForm(false);
    }

    // Reset fields
    setName('');
    setDescription('');
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setImageUrl(p.imageUrl);
    setShopeeUrl(p.rawShopeeUrl || p.shopeeAffiliateUrl);
    setCommissionRate(p.commissionRate);
    setIsFlashSale(!!p.isFlashSale);
    setIsMinimartDirect(!!p.isMinimartDirect);
    setDescription(p.description);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากระบบ?')) {
      StorageService.deleteProduct(id);
      onProductsUpdated(StorageService.getProducts());
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#EE4D2D]" />
            จัดการรายการสินค้าหน้าร้าน ({products.length} รายการ)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            เพิ่ม แก้ไข และเปิด/ปิด Flash Sale หรือสิทธิการสั่งซื้อตรงจากมินิมาร์ท
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setName('');
            setDescription('');
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#EE4D2D] hover:bg-[#D43D1F] text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'ปิดแบบฟอร์ม' : 'เพิ่มสินค้าใหม่'}</span>
        </button>
      </div>

      {/* Add / Edit Form Modal / Accordion */}
      {showAddForm && (
        <form onSubmit={handleSaveProduct} className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/60 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-orange-200/50">
            <h4 className="font-bold text-xs text-orange-900">
              {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่เข้าหน้าร้าน'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">ชื่อสินค้า</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ระบุชื่อสินค้า..."
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">ราคาขาย (฿)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">ราคาเดิม (฿)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">คอมมิชชัน (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlashSale}
                  onChange={(e) => setIsFlashSale(e.target.checked)}
                  className="rounded text-[#EE4D2D]"
                />
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500" />
                  Flash Sale
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">ลิงก์รูปภาพ (Image URL)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">ลิงก์สินค้า Shopee</label>
              <input
                type="text"
                value={shopeeUrl}
                onChange={(e) => setShopeeUrl(e.target.value)}
                placeholder="https://shopee.co.th/..."
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">รายละเอียดสินค้า</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="คำอธิบายสินค้า..."
              className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#EE4D2D] hover:bg-[#D43D1F] text-white text-xs font-bold shadow-xs"
            >
              บันทึกสินค้า
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">รูปภาพ</th>
              <th className="py-2.5 px-3">ชื่อสินค้า</th>
              <th className="py-2.5 px-3">หมวดหมู่</th>
              <th className="py-2.5 px-3">ราคา / ส่วนลด</th>
              <th className="py-2.5 px-3">คอมมิชชัน</th>
              <th className="py-2.5 px-3">สถานะ</th>
              <th className="py-2.5 px-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/70 transition">
                <td className="py-2 px-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                  />
                </td>
                <td className="py-2 px-3 max-w-xs">
                  <span className="font-semibold text-gray-900 line-clamp-1">{product.name}</span>
                  <span className="text-[10px] text-gray-400 truncate block">{product.shopeeAffiliateUrl}</span>
                </td>
                <td className="py-2 px-3 text-gray-600 whitespace-nowrap">
                  {product.category}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <span className="font-bold text-[#EE4D2D]">฿{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-gray-400 line-through ml-1">
                      ฿{product.originalPrice}
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-emerald-600 font-bold whitespace-nowrap">
                  {product.commissionRate}% (+฿{((product.price * product.commissionRate) / 100).toFixed(2)})
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  {product.isFlashSale ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                      Flash Sale
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                      ปกติ
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 transition"
                    title="แก้ไข"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition ml-1"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
