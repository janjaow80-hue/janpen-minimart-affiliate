import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem, CustomerUser } from '../types';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  customer: CustomerUser;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (orderDetail: { total: number; itemCount: number }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  customer,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'cod'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 300 || items.length === 0 ? 0 : 35;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderDone(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCheckoutSuccess({ total, itemCount: items.length });
    }, 1200);
  };

  const resetAndClose = () => {
    setOrderDone(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#EE4D2D] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-bold text-base">ตะกร้าสินค้ามินิมาร์ท (Janpen Direct)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderDone ? (
          /* Order Complete Success View */
          <div className="p-6 text-center my-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">สั่งซื้อสำเร็จเรียบร้อย!</h3>
            <p className="text-xs text-gray-600 mt-2 max-w-xs leading-relaxed">
              ทางร้านจันทร์เพ็ญมินิมาร์ทได้รับคำสั่งซื้อยอด <strong>฿{total.toLocaleString()}</strong> แล้ว เจ้าหน้าที่จะรีบจัดส่งไปที่:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-700 mt-3 text-left w-full">
              <p className="font-semibold text-gray-900">{customer.name} ({customer.phone})</p>
              <p className="text-gray-500 mt-0.5">{customer.address}</p>
              <p className="text-emerald-700 font-medium mt-1">
                การชำระเงิน: {paymentMethod === 'cod' ? 'เก็บเงินปลายทาง (COD)' : 'โอนผ่าน พร้อมเพย์ QR'}
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="mt-6 w-full py-3 bg-[#EE4D2D] text-white font-bold rounded-xl shadow-md hover:bg-[#D43D1F] transition"
            >
              กลับสู่หน้าร้าน
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="p-4 flex-1 overflow-y-auto divide-y divide-gray-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-sm font-medium text-gray-600">ยังไม่มีสินค้าในตะกร้า</p>
                  <p className="text-xs text-gray-400 mt-1">
                    เลือกสินค้าจากหน้าร้าน หรือกดสั่งผ่าน Shopee ได้ทันที
                  </p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-bold text-sm text-[#EE4D2D]">
                          ฿{(product.price * quantity).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-600 shadow-xs hover:bg-gray-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">{quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-600 shadow-xs hover:bg-gray-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Section */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                {/* Shipping & Address preview */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-gray-900 pb-1 mb-1 border-b border-gray-100">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      ที่อยู่จัดส่ง
                    </span>
                    <span className="text-gray-500">{customer.phone}</span>
                  </div>
                  <p className="text-gray-600 truncate">{customer.address}</p>
                </div>

                {/* Payment selection */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'cod'
                        ? 'border-[#EE4D2D] bg-orange-50 text-[#EE4D2D]'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <span>เก็บเงินปลายทาง</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'promptpay'
                        ? 'border-[#EE4D2D] bg-orange-50 text-[#EE4D2D]'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>พร้อมเพย์ QR</span>
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1 text-xs text-gray-600 pt-1">
                  <div className="flex justify-between">
                    <span>ยอดรวมสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าจัดส่ง</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">ฟรี</strong> : `฿${shippingFee}`}</span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[10px] text-orange-600 text-right">
                      ซื้อครบ ฿300 ส่งฟรี (ขาดอีก ฿{300 - subtotal})
                    </p>
                  )}
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                    <span>ยอดชำระทั้งสิ้น</span>
                    <span className="text-[#EE4D2D] text-lg font-black">฿{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Submit Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-[#EE4D2D] hover:bg-[#D43D1F] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>ยืนยันคำสั่งซื้อมินิมาร์ท</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
