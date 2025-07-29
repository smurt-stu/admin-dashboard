
'use client';

import StatsCards from './components/StatsCards';
import SalesChart from './components/SalesChart';
import RecentOrders from './components/RecentOrders';
import TopProducts from './components/TopProducts';
import ReviewStats from './components/ReviewStats';
import RecentReviews from './components/RecentReviews';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">لوحة القيادة</h2>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse whitespace-nowrap cursor-pointer">
            <i className="ri-download-line"></i>
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopProducts />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrders />
        <ReviewStats />
        <RecentReviews />
      </div>
    </div>
  );
}
