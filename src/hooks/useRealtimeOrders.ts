import { useEffect, useState, useCallback, useRef } from 'react';
import { OrderNotification, Product } from '../types';

const THAI_NAMES = [
  'คุณสมชาย (เชียงใหม่)',
  'คุณกานดา (กรุงเทพฯ)',
  'คุณธนกฤต (เชียงราย)',
  'คุณพิมลวรรณ (ขอนแก่น)',
  'คุณวีระชัย (นนทบุรี)',
  'คุณศิริพร (ลำพูน)',
  'คุณณัฐวุฒิ (ชลบุรี)',
  'คุณอารียา (ภูเก็ต)',
  'คุณประเสริฐ (นครราชสีมา)',
  'คุณรุ่งโรจน์ (อุบลราชธานี)',
];

// Play a pleasant chime using Web Audio API
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.35);

    // Note 2 (harmonious higher note)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {
    console.debug('Audio context not allowed or failed', e);
  }
};

export function useRealtimeOrders(products: Product[]) {
  const [latestOrder, setLatestOrder] = useState<OrderNotification | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const createRandomOrder = useCallback((): OrderNotification => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomName = THAI_NAMES[Math.floor(Math.random() * THAI_NAMES.length)];
    const isAffiliate = Math.random() > 0.4;
    const commission = Number(((randomProduct.price * randomProduct.commissionRate) / 100).toFixed(2));

    return {
      id: 'ord-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      customerName: randomName,
      productName: randomProduct.name,
      price: randomProduct.price,
      commission,
      province: randomProduct.location || 'เชียงใหม่',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      type: isAffiliate ? 'shopee_affiliate' : 'minimart_direct',
    };
  }, [products]);

  const triggerOrderManually = useCallback((customOrder?: Partial<OrderNotification>) => {
    if (!products.length) return;
    const base = createRandomOrder();
    const newOrder: OrderNotification = {
      ...base,
      ...customOrder,
      id: 'ord-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    setLatestOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev.slice(0, 49)]);
    if (soundEnabled) {
      playNotificationChime();
    }
  }, [createRandomOrder, products.length, soundEnabled]);

  useEffect(() => {
    if (!products.length) return;

    // Seed initial 3 orders
    const initialOrders: OrderNotification[] = [
      {
        id: 'ord-init-1',
        customerName: 'คุณสมชาย (เชียงใหม่)',
        productName: 'ข้าวหอมมะลิแท้ 100% เกรดส่งออก (5 กก.)',
        price: 199,
        commission: 19.9,
        province: 'เชียงใหม่',
        timestamp: 'เมื่อสักครู่',
        type: 'shopee_affiliate',
      },
      {
        id: 'ord-init-2',
        customerName: 'คุณกานดา (กรุงเทพฯ)',
        productName: 'หม้อทอดไร้น้ำมันระบบดิจิตอล 5.5 ลิตร',
        price: 890,
        commission: 106.8,
        province: 'กรุงเทพฯ',
        timestamp: '5 นาทีที่แล้ว',
        type: 'shopee_affiliate',
      },
      {
        id: 'ord-init-3',
        customerName: 'คุณพิมลวรรณ (ขอนแก่น)',
        productName: 'น้ำพริกหนุ่มสูตรเมืองเหนือ จันทร์เพ็ญมินิมาร์ท',
        price: 69,
        commission: 10.35,
        province: 'เชียงใหม่',
        timestamp: '12 นาทีที่แล้ว',
        type: 'minimart_direct',
      },
    ];
    setOrderHistory(initialOrders);

    // Periodic simulation interval
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 20000) + 18000; // 18 - 38 seconds
      timerRef.current = setTimeout(() => {
        const order = createRandomOrder();
        setLatestOrder(order);
        setOrderHistory((prev) => [order, ...prev.slice(0, 49)]);
        if (soundEnabled) {
          playNotificationChime();
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [createRandomOrder, products.length, soundEnabled]);

  return {
    latestOrder,
    clearLatestOrder: () => setLatestOrder(null),
    orderHistory,
    soundEnabled,
    setSoundEnabled,
    triggerOrderManually,
  };
}
