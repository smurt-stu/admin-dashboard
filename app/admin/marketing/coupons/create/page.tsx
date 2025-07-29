'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreateCoupon() {
  const [formData, setFormData] = useState({
    code: '',
    title: {
      ar: '',
      en: ''
    },
    description: {
      ar: '',
      en: ''
    },
    discount_type: 'percentage',
    discount_value: '',
    max_discount_amount: '',
    min_order_amount: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
    usage_limit_per_user: '1',
    is_first_order_only: false,
    free_shipping: false,
    is_combinable: true,
    status: 'active',
    applicable_products: [],
    applicable_categories: [],
    excluded_products: [],
    excluded_categories: [],
    allowed_customer_groups: []
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Coupon data:', formData);
    // هنا سيتم إرسال البيانات إلى API
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">إنشاء كوبون جديد</h2>
        <Link href="/admin/marketing/coupons" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
          <i className="ri-arrow-right-line"></i>
          <span>العودة للكوبونات</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كود الكوبون *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: SAVE20"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخصم *</label>
              <select
                value={formData.discount_type}
                onChange={(e) => handleInputChange('discount_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="percentage">نسبة مئوية</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">قيمة الخصم *</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_value}
                onChange={(e) => handleInputChange('discount_value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={formData.discount_type === 'percentage' ? '20' : '10'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للخصم</label>
              <input
                type="number"
                step="0.01"
                value={formData.max_discount_amount}
                onChange={(e) => handleInputChange('max_discount_amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100"
              />
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">العنوان والوصف</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (العربية) *</label>
              <input
                type="text"
                value={formData.title.ar}
                onChange={(e) => handleInputChange('title.ar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="خصم 20% على كل شيء"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (الإنجليزية)</label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) => handleInputChange('title.en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="20% off everything"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (العربية)</label>
              <textarea
                value={formData.description.ar}
                onChange={(e) => handleInputChange('description.ar', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="وصف الكوبون باللغة العربية"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (الإنجليزية)</label>
              <textarea
                value={formData.description.en}
                onChange={(e) => handleInputChange('description.en', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Coupon description in English"
              />
            </div>
          </div>
        </div>

        {/* Conditions and Limits */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الشروط والحدود</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للطلب</label>
              <input
                type="number"
                step="0.01"
                value={formData.min_order_amount}
                onChange={(e) => handleInputChange('min_order_amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للاستخدام</label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => handleInputChange('usage_limit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للاستخدام لكل مستخدم</label>
              <input
                type="number"
                value={formData.usage_limit_per_user}
                onChange={(e) => handleInputChange('usage_limit_per_user', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
              />
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="is_first_order_only"
                checked={formData.is_first_order_only}
                onChange={(e) => handleInputChange('is_first_order_only', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_first_order_only" className="text-sm font-medium text-gray-700">
                للمستخدمين الجدد فقط
              </label>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="free_shipping"
                checked={formData.free_shipping}
                onChange={(e) => handleInputChange('free_shipping', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="free_shipping" className="text-sm font-medium text-gray-700">
                شحن مجاني
              </label>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="is_combinable"
                checked={formData.is_combinable}
                onChange={(e) => handleInputChange('is_combinable', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_combinable" className="text-sm font-medium text-gray-700">
                قابل للدمج مع كوبونات أخرى
              </label>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">فترة الصلاحية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البداية *</label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء *</label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الحالة</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">حالة الكوبون</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="draft">مسودة</option>
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <Link
            href="/admin/marketing/coupons"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إنشاء الكوبون
          </button>
        </div>
      </form>
    </div>
  );
} 