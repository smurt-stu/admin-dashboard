'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PromotionsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const promotions = [
    {
      id: 1,
      name: {
        ar: "تخفيضات الصيف",
        en: "Summer Sale"
      },
      description: {
        ar: "خصومات كبيرة على جميع المنتجات",
        en: "Big discounts on all products"
      },
      promotion_type: "sale",
      start_date: "2024-06-01T00:00:00Z",
      end_date: "2024-08-31T23:59:59Z",
      discount_percentage: "30.00",
      is_active: true,
      is_featured: true,
      is_active_now: true,
      time_remaining: {
        days: 15,
        hours: 8,
        minutes: 30
      },
      progress_percentage: 75,
      products_count: 25,
      categories_count: 2,
      min_purchase_amount: "100.00",
      buy_quantity: 1,
      get_quantity: 0,
      banner_image: "/media/store/promotions/summer_sale.jpg",
      banner_url: "/promotions/summer-sale"
    },
    {
      id: 2,
      name: {
        ar: "عرض خاطف - 50% خصم",
        en: "Flash Sale - 50% Off"
      },
      description: {
        ar: "خصم كبير لفترة محدودة",
        en: "Big discount for limited time"
      },
      promotion_type: "flash_sale",
      start_date: "2024-01-15T00:00:00Z",
      end_date: "2024-01-15T23:59:59Z",
      discount_percentage: "50.00",
      is_active: true,
      is_featured: false,
      is_active_now: true,
      time_remaining: {
        days: 0,
        hours: 2,
        minutes: 30
      },
      progress_percentage: 95,
      products_count: 10,
      categories_count: 1,
      min_purchase_amount: "50.00",
      buy_quantity: 1,
      get_quantity: 0,
      banner_image: "/media/store/promotions/flash_sale.jpg",
      banner_url: "/promotions/flash-sale"
    },
    {
      id: 3,
      name: {
        ar: "اشتر 2 واحصل على 1 مجاناً",
        en: "Buy 2 Get 1 Free"
      },
      description: {
        ar: "عرض خاص على المنتجات المحددة",
        en: "Special offer on selected products"
      },
      promotion_type: "buy_x_get_y",
      start_date: "2024-01-10T00:00:00Z",
      end_date: "2024-01-20T23:59:59Z",
      discount_percentage: "33.33",
      is_active: true,
      is_featured: true,
      is_active_now: true,
      time_remaining: {
        days: 7,
        hours: 12,
        minutes: 0
      },
      progress_percentage: 50,
      products_count: 15,
      categories_count: 3,
      min_purchase_amount: "75.00",
      buy_quantity: 2,
      get_quantity: 1,
      banner_image: "/media/store/promotions/buy_get.jpg",
      banner_url: "/promotions/buy-get"
    }
  ];

  const getStatusBadge = (promotion: any) => {
    if (!promotion.is_active) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">غير نشط</span>;
    }
    if (promotion.is_active_now) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">نشط الآن</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">مجدول</span>;
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      sale: { label: 'تخفيض', color: 'bg-green-100 text-green-700' },
      flash_sale: { label: 'عرض خاطف', color: 'bg-red-100 text-red-700' },
      buy_x_get_y: { label: 'اشتر واحصل على', color: 'bg-purple-100 text-purple-700' },
      bundle: { label: 'حزمة', color: 'bg-orange-100 text-orange-700' }
    };
    
    const typeInfo = typeLabels[type as keyof typeof typeLabels] || { label: type, color: 'bg-gray-100 text-gray-700' };
    
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
      {typeInfo.label}
    </span>;
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.name.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && promotion.is_active) ||
                         (statusFilter === 'active_now' && promotion.is_active_now);
    const matchesType = typeFilter === 'all' || promotion.promotion_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">إدارة العروض الترويجية</h2>
        <Link href="/admin/marketing/promotions/create" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 rtl:space-x-reverse">
          <i className="ri-add-line"></i>
          <span>إضافة عرض جديد</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <input
              type="text"
              placeholder="ابحث بالاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="active_now">نشط الآن</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع العرض</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="sale">تخفيض</option>
              <option value="flash_sale">عرض خاطف</option>
              <option value="buy_x_get_y">اشتر واحصل على</option>
              <option value="bundle">حزمة</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promotion) => (
          <div key={promotion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Banner Image */}
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <div className="text-white text-center">
                <i className="ri-megaphone-fill text-4xl mb-2"></i>
                <p className="text-lg font-semibold">{promotion.name.ar}</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{promotion.name.ar}</h3>
                <div className="flex space-x-1 rtl:space-x-reverse">
                  {getStatusBadge(promotion)}
                  {getTypeBadge(promotion.promotion_type)}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{promotion.description.ar}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الخصم:</span>
                  <span className="text-lg font-bold text-green-600">{promotion.discount_percentage}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">المنتجات:</span>
                  <span className="text-sm font-medium text-gray-900">{promotion.products_count} منتج</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الوقت المتبقي:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {promotion.time_remaining.days > 0 ? `${promotion.time_remaining.days} يوم` : 
                     promotion.time_remaining.hours > 0 ? `${promotion.time_remaining.hours} ساعة` : 
                     `${promotion.time_remaining.minutes} دقيقة`}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${promotion.progress_percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {promotion.progress_percentage}% مكتمل
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Link 
                      href={`/admin/marketing/promotions/${promotion.id}`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      عرض
                    </Link>
                    <Link 
                      href={`/admin/marketing/promotions/${promotion.id}/edit`}
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      تعديل
                    </Link>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {promotion.is_featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        مميز
                      </span>
                    )}
                    <button className="text-red-600 hover:text-red-900 text-sm">
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPromotions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <i className="ri-megaphone-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عروض ترويجية</h3>
          <p className="text-gray-500 mb-4">لم يتم العثور على عروض ترويجية تطابق معايير البحث</p>
          <Link href="/admin/marketing/promotions/create" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            إنشاء عرض جديد
          </Link>
        </div>
      )}

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
              عرض <span className="font-medium">1</span> إلى <span className="font-medium">3</span> من <span className="font-medium">3</span> نتيجة
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">السابق</span>
                <i className="ri-arrow-right-s-line"></i>
              </button>
              <button className="bg-green-50 border-green-500 text-green-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
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