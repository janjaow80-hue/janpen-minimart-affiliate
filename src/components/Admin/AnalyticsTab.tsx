import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  DollarSign, 
  ShoppingBag, 
  Smartphone, 
  Laptop, 
  Download, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ClickLog, Product } from '../../types';
import { StorageService } from '../../services/storageService';

interface AnalyticsTabProps {
  clickLogs: ClickLog[];
  products: Product[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ clickLogs, products }) => {
  const [filterDevice, setFilterDevice] = useState<string>('all');

  // KPI Calculations
  const totalClicks = clickLogs.length;
  const conversions = clickLogs.filter((c) => c.status === 'converted').length;
  const conversionRate = totalClicks > 0 ? ((conversions / totalClicks) * 100).toFixed(1) : '0';

  const totalCommission = clickLogs.reduce((acc, c) => acc + (c.estimatedCommission || 0), 0);
  const pendingCommission = totalCommission * 0.28;
  const approvedCommission = totalCommission - pendingCommission;

  // Approximate GMV based on commissions
  const estimatedGMV = totalCommission * 10;

  // Device Breakdown
  const androidClicks = clickLogs.filter((c) => c.device === 'Android').length;
  const iosClicks = clickLogs.filter((c) => c.device === 'iOS').length;
  const desktopClicks = clickLogs.filter((c) => c.device === 'Desktop').length;

  const filteredLogs = filterDevice === 'all' 
    ? clickLogs 
    : clickLogs.filter((c) => c.device === filterDevice);

  const handleExportCSV = () => {
    const headers = ['ID', 'Product', 'Timestamp', 'Device', 'Location', 'Commission', 'Status', 'AffiliateUrl'];
    const rows = clickLogs.map((log) => [
      log.id,
      `"${log.productName.replace(/"/g, '""')}"`,
      log.timestamp,
      log.device,
      log.location,
      log.estimatedCommission,
      log.status,
      `"${log.affiliateUrl}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopee_click_tracking_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Clicks */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">ยอดคลิกทั้งหมด (Clicks)</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#EE4D2D] flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-gray-900">{totalClicks.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
              +14.2% จากสัปดาห์ก่อน
            </span>
          </div>
        </div>

        {/* Conversions & Rate */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">อัตราสั่งซื้อสำเร็จ (CR)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-gray-900">{conversionRate}%</span>
            <span className="text-[11px] text-gray-500 block mt-0.5">
              คำสั่งซื้อสำเร็จ {conversions} รายการ
            </span>
          </div>
        </div>

        {/* Estimated GMV */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">ยอดขายรวม (GMV)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-700">
              ฿{estimatedGMV.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5 font-medium">
              Shopee Affiliate Program
            </span>
          </div>
        </div>

        {/* Total Commission for Kasem . M */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-2xl border border-orange-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-900">ค่าคอมมิชชันสะสม</span>
            <div className="w-8 h-8 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#EE4D2D]">
              ฿{totalCommission.toFixed(2)}
            </span>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mt-1">
              <span>อนุมัติแล้ว: ฿{approvedCommission.toFixed(2)}</span>
              <span className="text-amber-700">รอตรวจ: ฿{pendingCommission.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Breakdown Pill cards */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-blue-600" />
          สัดส่วนอุปกรณ์ที่ลูกค้ากดสั่งซื้อ (Device Traffic Distribution)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-800">Android Users</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {androidClicks} คลิก ({totalClicks ? Math.round((androidClicks / totalClicks) * 100) : 0}%)
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-200 text-gray-800 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-800">iOS (iPhone/iPad)</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {iosClicks} คลิก ({totalClicks ? Math.round((iosClicks / totalClicks) * 100) : 0}%)
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Laptop className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-800">Desktop / Web</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {desktopClicks} คลิก ({totalClicks ? Math.round((desktopClicks / totalClicks) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Click Tracking Logs Stream */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              บันทึกการคลิกลิงก์สด (Real-time Click Tracking Stream)
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              ระบบดักจับทุกการคลิกที่ส่งต่อเข้า Shopee พร้อมบันทึก Device และที่อยู่ IP เพื่อความโปร่งใส
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by Device */}
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-gray-200 bg-white"
            >
              <option value="all">ทุกอุปกรณ์</option>
              <option value="Android">เฉพาะ Android</option>
              <option value="iOS">เฉพาะ iOS</option>
              <option value="Desktop">เฉพาะ Desktop</option>
            </select>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด CSV</span>
            </button>
          </div>
        </div>

        {/* Click Table */}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">เวลา</th>
                <th className="py-2.5 px-3">สินค้าที่คลิก</th>
                <th className="py-2.5 px-3">อุปกรณ์ / พิกัด</th>
                <th className="py-2.5 px-3">IP ชั่วคราว</th>
                <th className="py-2.5 px-3">ค่าคอมมิชชันคาดหวัง</th>
                <th className="py-2.5 px-3 rounded-r-lg">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-orange-50/40 transition">
                  <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString('th-TH')}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 max-w-xs truncate">
                    {log.productName}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">{log.device}</span> ({log.location})
                  </td>
                  <td className="py-2.5 px-3 font-mono text-gray-400">
                    {log.ipMock}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">
                    +฿{log.estimatedCommission.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3">
                    {log.status === 'converted' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" /> สั่งซื้อสำเร็จ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700">
                        <Clock className="w-3 h-3" /> กำลังเลือกซื้อ
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
