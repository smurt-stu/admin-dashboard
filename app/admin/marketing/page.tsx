'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const marketingStats = {
    coupons: {
      total: 25,
      active: 15,
      expired: 5,
      used_up: 5,
      total_usage: 1250,
      total_discount: "15000.00"
    },
    promotions: {
      total: 10,
      active: 5,
      current: 3,
      featured: 2
    }
  };

  const topCoupons = [
    {
      id: 1,
      code: "SAVE20",
      title: "خصم 20% على كل شيء",
      usage_count: 150,
      total_discount: "1500.00"
    },
    {
      id: 2,
      code: "NEWUSER50",
      title: "خصم 50% للمستخدمين الجدد",
      usage_count: 100,
      total_discount: "2500.00"
    }
  ];

  const activePromotions = [
    {
      id: 1,
      name: "تخفيضات الصيف",
      type: "sale",
      discount: "30%",
      time_remaining: "15 يوم"
    },
    {
      id: 2,
      name: "عرض خاطف - 50% خصم",
      type: "flash_sale",
      discount: "50%",
      time_remaining: "2 ساعة"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">إدارة التسويق</h2>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse">
            <i className="ri-download-line"></i>
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 rtl:space-x-reverse">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: 'ri-dashboard-fill' },
            { id: 'coupons', label: 'الكوبونات', icon: 'ri-coupon-fill' },
            { id: 'promotions', label: 'العروض الترويجية', icon: 'ri-megaphone-fill' },
            { id: 'analytics', label: 'التحليلات', icon: 'ri-bar-chart-fill' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 rtl:space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الكوبونات</p>
                  <p className="text-2xl font-bold text-gray-900">{marketingStats.coupons.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-coupon-fill text-blue-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+{marketingStats.coupons.active} نشط</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-600">{marketingStats.coupons.expired} منتهي</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي العروض</p>
                  <p className="text-2xl font-bold text-gray-900">{marketingStats.promotions.total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-megaphone-fill text-green-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+{marketingStats.promotions.active} نشط</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-600">{marketingStats.promotions.featured} مميز</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الاستخدامات</p>
                  <p className="text-2xl font-bold text-gray-900">{marketingStats.coupons.total_usage}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-fill text-purple-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-400 mx-2">من الشهر الماضي</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الخصومات</p>
                  <p className="text-2xl font-bold text-gray-900">${marketingStats.coupons.total_discount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-money-dollar-circle-fill text-yellow-600 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-400 mx-2">من الشهر الماضي</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Link href="/admin/marketing/coupons/create" className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                  <i className="ri-add-line text-xl"></i>
                  <span>إنشاء كوبون جديد</span>
                </Link>
                <Link href="/admin/marketing/promotions/create" className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                  <i className="ri-add-line text-xl"></i>
                  <span>إنشاء عرض ترويجي جديد</span>
                </Link>
                <Link href="/admin/marketing/analytics" className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                  <i className="ri-bar-chart-line text-xl"></i>
                  <span>عرض التحليلات التفصيلية</span>
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">أفضل الكوبونات</h3>
              <div className="space-y-3">
                {topCoupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{coupon.title}</p>
                      <p className="text-sm text-gray-600">كود: {coupon.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{coupon.usage_count} استخدام</p>
                      <p className="text-sm text-gray-600">${coupon.total_discount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Promotions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">العروض النشطة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePromotions.map((promotion) => (
                <div key={promotion.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{promotion.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      promotion.type === 'flash_sale' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {promotion.type === 'flash_sale' ? 'عرض خاطف' : 'تخفيض'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-2">{promotion.discount}</p>
                  <p className="text-sm text-gray-600">متبقي: {promotion.time_remaining}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">إدارة الكوبونات</h3>
            <Link href="/admin/marketing/coupons/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse">
              <i className="ri-add-line"></i>
              <span>إضافة كوبون جديد</span>
            </Link>
          </div>
          
          {/* Coupons Table Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-center py-8">سيتم إضافة جدول الكوبونات هنا</p>
          </div>
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">إدارة العروض الترويجية</h3>
            <Link href="/admin/marketing/promotions/create" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 rtl:space-x-reverse">
              <i className="ri-add-line"></i>
              <span>إضافة عرض جديد</span>
            </Link>
          </div>
          
          {/* Promotions Table Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-center py-8">سيتم إضافة جدول العروض الترويجية هنا</p>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">التحليلات والإحصائيات</h3>
          
          {/* Analytics Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-center py-8">سيتم إضافة الرسوم البيانية والتحليلات هنا</p>
          </div>
        </div>
      )}
    </div>
  );
} 