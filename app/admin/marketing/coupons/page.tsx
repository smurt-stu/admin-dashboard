'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CouponsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('all');

  const coupons = [
    {
      id: 1,
      code: "SAVE20",
      title: "خصم 20% على كل شيء",
      description: "خصم 20% على جميع المنتجات",
      discount_type: "percentage",
      discount_value: "20.00",
      discount_text: "20%",
      is_valid: true,
      min_order_amount: "50.00",
      start_date: "2024-01-01T00:00:00Z",
      end_date: "2024-12-31T23:59:59Z",
      usage_limit: 1000,
      usage_count: 150,
      usage_limit_per_user: 1,
      is_first_order_only: false,
      is_combinable: true,
      max_discount_amount: "100.00",
      status: "active",
      is_active: true,
      is_expired: false,
      is_used_up: false,
      usage_percentage: 15.0,
      time_remaining: {
        days: 45,
        hours: 12,
        minutes: 30
      }
    },
    {
      id: 2,
      code: "NEWUSER50",
      title: "خصم 50% للمستخدمين الجدد",
      description: "خصم خاص للمستخدمين الجدد",
      discount_type: "percentage",
      discount_value: "50.00",
      discount_text: "50%",
      is_valid: true,
      min_order_amount: "20.00",
      start_date: "2024-01-01T00:00:00Z",
      end_date: "2024-06-30T23:59:59Z",
      usage_limit: 500,
      usage_count: 100,
      usage_limit_per_user: 1,
      is_first_order_only: true,
      is_combinable: false,
      max_discount_amount: "200.00",
      status: "active",
      is_active: true,
      is_expired: false,
      is_used_up: false,
      usage_percentage: 20.0,
      time_remaining: {
        days: 180,
        hours: 12,
        minutes: 30
      }
    },
    {
      id: 3,
      code: "FREESHIP",
      title: "شحن مجاني",
      description: "شحن مجاني على جميع الطلبات",
      discount_type: "fixed",
      discount_value: "10.00",
      discount_text: "$10",
      is_valid: true,
      min_order_amount: "100.00",
      start_date: "2024-01-01T00:00:00Z",
      end_date: "2024-03-31T23:59:59Z",
      usage_limit: 200,
      usage_count: 75,
      usage_limit_per_user: 1,
      is_first_order_only: false,
      is_combinable: true,
      max_discount_amount: "10.00",
      status: "active",
      is_active: true,
      is_expired: false,
      is_used_up: false,
      usage_percentage: 37.5,
      time_remaining: {
        days: 90,
        hours: 12,
        minutes: 30
      }
    }
  ];

  const getStatusBadge = (coupon: any) => {
    if (coupon.is_expired) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">منتهي الصلاحية</span>;
    }
    if (coupon.is_used_up) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">مستنفد</span>;
    }
    if (coupon.is_active) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">نشط</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">غير نشط</span>;
  };

  const getDiscountTypeBadge = (type: string) => {
    return type === 'percentage' ? 
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">نسبة مئوية</span> :
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">مبلغ ثابت</span>;
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && coupon.is_active && !coupon.is_expired && !coupon.is_used_up) ||
                         (statusFilter === 'expired' && coupon.is_expired) ||
                         (statusFilter === 'used_up' && coupon.is_used_up);
    const matchesType = discountTypeFilter === 'all' || coupon.discount_type === discountTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">إدارة الكوبونات</h2>
        <Link href="/admin/marketing/coupons/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse">
          <i className="ri-add-line"></i>
          <span>إضافة كوبون جديد</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <input
              type="text"
              placeholder="ابحث بالكود أو العنوان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="expired">منتهي الصلاحية</option>
              <option value="used_up">مستنفد</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخصم</label>
            <select
              value={discountTypeFilter}
              onChange={(e) => setDiscountTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="percentage">نسبة مئوية</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDiscountTypeFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكوبون
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخصم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاستخدام
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الصلاحية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{coupon.title}</div>
                      <div className="text-sm text-gray-500">كود: {coupon.code}</div>
                      <div className="text-xs text-gray-400">{coupon.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-lg font-bold text-green-600">{coupon.discount_text}</span>
                      {getDiscountTypeBadge(coupon.discount_type)}
                    </div>
                    <div className="text-xs text-gray-500">
                      الحد الأدنى: ${coupon.min_order_amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.usage_count} / {coupon.usage_limit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${coupon.usage_percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {coupon.usage_percentage.toFixed(1)}% مستخدم
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(coupon.start_date).toLocaleDateString('ar-SA')}
                    </div>
                    <div className="text-sm text-gray-500">
                      إلى {new Date(coupon.end_date).toLocaleDateString('ar-SA')}
                    </div>
                    <div className="text-xs text-gray-400">
                      متبقي: {coupon.time_remaining.days} يوم
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(coupon)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Link 
                        href={`/admin/marketing/coupons/${coupon.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        عرض
                      </Link>
                      <Link 
                        href={`/admin/marketing/coupons/${coupon.id}/edit`}
                        className="text-green-600 hover:text-green-900"
                      >
                        تعديل
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            السابق
          </button>
          <button className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            التالي
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              عرض <span className="font-medium">1</span> إلى <span className="font-medium">10</span> من <span className="font-medium">97</span> نتيجة
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">السابق</span>
                <i className="ri-arrow-right-s-line"></i>
              </button>
              <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                2
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">التالي</span>
                <i className="ri-arrow-left-s-line"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 