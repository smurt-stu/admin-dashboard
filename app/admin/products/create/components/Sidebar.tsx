'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  formData: any;
  saving: boolean;
  onSubmit: () => void;
}

export default function Sidebar({ formData, saving, onSubmit }: SidebarProps) {
  const [showPreview, setShowPreview] = useState(false);

  const getProductTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      physical: 'مادي',
      digital: 'رقمي',
      service: 'خدمة',
      subscription: 'اشتراك',
      bundle: 'حزمة'
    };
    return types[type] || type;
  };

  const getConditionLabel = (condition: string) => {
    const conditions: { [key: string]: string } = {
      new: 'جديد',
      used: 'مستعمل',
      refurbished: 'مجدول',
      open_box: 'مفتوح العبوة',
      damaged: 'تالف'
    };
    return conditions[condition] || condition;
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
        <div className="space-y-3">
          <button
            onClick={onSubmit}
            disabled={saving}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-add-line"></i>
            <span>{saving ? 'جاري الإنشاء...' : 'إنشاء المنتج'}</span>
          </button>
          
          <Link
            href="/admin/products"
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-close-line"></i>
            <span>إلغاء</span>
          </Link>
        </div>
      </div>

      {/* Quick Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">معاينة سريعة</h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {showPreview ? 'إخفاء' : 'إظهار'}
          </button>
        </div>
        
        {showPreview && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <p className="text-sm text-gray-900">
                {formData.title || 'غير محدد'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع المنتج</label>
              <p className="text-sm text-gray-900">
                {getProductTypeLabel(formData.product_type)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
              <p className="text-sm font-semibold text-blue-600">
                {formData.price ? `${formData.price} د.ك` : 'غير محدد'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  formData.in_stock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formData.in_stock ? 'متوفر' : 'نفد المخزون'}
                </span>
                {formData.condition && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {getConditionLabel(formData.condition)}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المميزات</label>
              <div className="flex flex-wrap gap-1">
                {formData.is_featured && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    مميز
                  </span>
                )}
                {formData.is_bestseller && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    مبيعات عالية
                  </span>
                )}
                {formData.is_new_arrival && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    وصل حديثاً
                  </span>
                )}
                {formData.is_on_sale && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    في العرض
                  </span>
                )}
              </div>
            </div>

            {formData.main_image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الصورة الرئيسية</label>
                <img
                  src={formData.main_image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تقدم الإكمال</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">المعلومات الأساسية</span>
            <span className={`text-sm ${formData.title && formData.category ? 'text-green-600' : 'text-gray-400'}`}>
              {formData.title && formData.category ? '✓' : '○'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">الوصف</span>
            <span className={`text-sm ${formData.description ? 'text-green-600' : 'text-gray-400'}`}>
              {formData.description ? '✓' : '○'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">السعر</span>
            <span className={`text-sm ${formData.price && parseFloat(formData.price) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              {formData.price && parseFloat(formData.price) > 0 ? '✓' : '○'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">الصورة الرئيسية</span>
            <span className={`text-sm ${formData.main_image ? 'text-green-600' : 'text-gray-400'}`}>
              {formData.main_image ? '✓' : '○'}
            </span>
          </div>
          {formData.product_type === 'digital' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">الملف الرقمي</span>
              <span className={`text-sm ${formData.digital_file ? 'text-green-600' : 'text-gray-400'}`}>
                {formData.digital_file ? '✓' : '○'}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">النسبة المكتملة</span>
            <span className="text-sm font-medium text-blue-600">
              {(() => {
                const checks = [
                  formData.title && formData.category,
                  formData.description,
                  formData.price && parseFloat(formData.price) > 0,
                  formData.main_image,
                  formData.product_type !== 'digital' || formData.digital_file
                ].filter(Boolean).length;
                return `${Math.round((checks / 5) * 100)}%`;
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">نصائح سريعة</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• املأ جميع الحقول المطلوبة (*)</li>
          <li>• استخدم صور عالية الجودة</li>
          <li>• اكتب وصفاً مفصلاً ومفيداً</li>
          <li>• حدد السعر المناسب للمنتج</li>
        </ul>
      </div>
    </div>
  );
} 