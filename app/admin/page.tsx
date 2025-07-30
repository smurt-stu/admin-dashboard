
'use client';

import StatsCards from './components/StatsCards';
import SalesChart from './components/SalesChart';
import RecentOrders from './components/RecentOrders';
import TopProducts from './components/TopProducts';
import ReviewStats from './components/ReviewStats';
import RecentReviews from './components/RecentReviews';
import Link from 'next/link';

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
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/create"
            className="flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-add-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">إضافة منتج جديد</h4>
              <p className="text-sm text-gray-600">إنشاء منتج جديد في النظام</p>
            </div>
          </Link>
          
          <Link
            href="/admin/categories"
            className="flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-folder-line text-green-600 text-xl"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">إدارة الفئات</h4>
              <p className="text-sm text-gray-600">تنظيم فئات المنتجات</p>
            </div>
          </Link>
          
          <Link
            href="/admin/product-types"
            className="flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-settings-3-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">أنواع المنتجات</h4>
              <p className="text-sm text-gray-600">إدارة أنواع المنتجات</p>
            </div>
          </Link>
          
          <Link
            href="/admin/orders"
            className="flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-bag-line text-orange-600 text-xl"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">إدارة الطلبات</h4>
              <p className="text-sm text-gray-600">متابعة الطلبات الجديدة</p>
            </div>
          </Link>
        </div>
      </div>
      
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
