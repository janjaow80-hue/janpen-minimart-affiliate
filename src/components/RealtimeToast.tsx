import React, { useEffect } from 'react';
import { ShoppingBag, ExternalLink, X, DollarSign, Sparkles } from 'lucide-react';
import { OrderNotification } from '../types';

interface RealtimeToastProps {
  order: OrderNotification | null;
  onDismiss: () => void;
}

export const RealtimeToast: React.FC<RealtimeToastProps> = ({ order, onDismiss }) => {
  useEffect(() => {
    if (!order) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [order, onDismiss]);

  if (!order) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md border border-orange-200/80 shadow-2xl rounded-2xl p-3.5 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EE4D2D] to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
          {order.type === 'shopee_affiliate' ? (
            <ExternalLink className="w-5 h-5" />
          ) : (
            <ShoppingBag className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              คำสั่งซื้อใหม่ (Live)
            </span>
            <span className="text-[10px] text-gray-400">{order.timestamp}</span>
          </div>

          <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">
            {order.customerName}
          </p>

          <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
            สั่งซื้อ: <strong className="text-gray-800">{order.productName}</strong>
          </p>

          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-[#EE4D2D]">
              ฿{order.price.toLocaleString()}
            </span>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              คอมมิชชัน +฿{order.commission.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
