'use client';

import Link from 'next/link';

export default function MarketingStats() {
  const marketingStats = {
    coupons: {
      total: 25,
      active: 15,
      usage: 1250,
      revenue: "15000.00"
    },
    promotions: {
      total: 10,
      active: 5,
      orders: 450,
      revenue: "30000.00"
    },
    conversion: 12.5,
    total_revenue: "45000.00"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">إحصائيات التسويق</h3>
        <Link href="/admin/marketing" className="text-blue-600 hover:text-blue-900 text-sm font-medium">
          عرض التفاصيل
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <i className="ri-coupon-fill text-blue-600 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">{marketingStats.coupons.total}</p>
          <p className="text-xs text-gray-600">كوبون</p>
          <p className="text-xs text-green-600">+{marketingStats.coupons.active} نشط</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <i className="ri-megaphone-fill text-green-600 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">{marketingStats.promotions.total}</p>
          <p className="text-xs text-gray-600">عرض</p>
          <p className="text-xs text-green-600">+{marketingStats.promotions.active} نشط</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <i className="ri-user-fill text-purple-600 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">{marketingStats.coupons.usage}</p>
          <p className="text-xs text-gray-600">استخدام</p>
          <p className="text-xs text-green-600">+12% من الشهر الماضي</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <i className="ri-money-dollar-circle-fill text-yellow-600 text-xl"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">${marketingStats.total_revenue}</p>
          <p className="text-xs text-gray-600">إيرادات</p>
          <p className="text-xs text-green-600">+8% من الشهر الماضي</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">معدل التحويل</span>
          <span className="text-lg font-bold text-blue-600">{marketingStats.conversion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${marketingStats.conversion}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2 rtl:space-x-reverse">
        <Link 
          href="/admin/marketing/coupons/create"
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm text-center hover:bg-blue-700 transition-colors"
        >
          إضافة كوبون
        </Link>
        <Link 
          href="/admin/marketing/promotions/create"
          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm text-center hover:bg-green-700 transition-colors"
        >
          إضافة عرض
        </Link>
      </div>
    </div>
  );
} 