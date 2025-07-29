'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreatePromotion() {
  const [formData, setFormData] = useState({
    name: {
      ar: '',
      en: ''
    },
    description: {
      ar: '',
      en: ''
    },
    promotion_type: 'sale',
    start_date: '',
    end_date: '',
    discount_percentage: '',
    min_purchase_amount: '',
    buy_quantity: 1,
    get_quantity: 0,
    is_featured: false,
    banner_image: null,
    banner_url: '',
    products: [],
    categories: []
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
    console.log('Promotion data:', formData);
    // هنا سيتم إرسال البيانات إلى API
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">إنشاء عرض ترويجي جديد</h2>
        <Link href="/admin/marketing/promotions" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
          <i className="ri-arrow-right-line"></i>
          <span>العودة للعروض</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع العرض *</label>
              <select
                value={formData.promotion_type}
                onChange={(e) => handleInputChange('promotion_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="sale">تخفيض</option>
                <option value="flash_sale">عرض خاطف</option>
                <option value="buy_x_get_y">اشتر واحصل على</option>
                <option value="bundle">حزمة</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نسبة الخصم (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_percentage}
                onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للشراء</label>
              <input
                type="number"
                step="0.01"
                value={formData.min_purchase_amount}
                onChange={(e) => handleInputChange('min_purchase_amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="100"
              />
            </div>

            {formData.promotion_type === 'buy_x_get_y' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اشتر (الكمية)</label>
                  <input
                    type="number"
                    value={formData.buy_quantity}
                    onChange={(e) => handleInputChange('buy_quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">احصل على (الكمية)</label>
                  <input
                    type="number"
                    value={formData.get_quantity}
                    onChange={(e) => handleInputChange('get_quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="1"
                  />
                </div>
              </>
            )}
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
                value={formData.name.ar}
                onChange={(e) => handleInputChange('name.ar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="تخفيضات الصيف"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (الإنجليزية)</label>
              <input
                type="text"
                value={formData.name.en}
                onChange={(e) => handleInputChange('name.en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Summer Sale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (العربية)</label>
              <textarea
                value={formData.description.ar}
                onChange={(e) => handleInputChange('description.ar', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="وصف العرض الترويجي باللغة العربية"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (الإنجليزية)</label>
              <textarea
                value={formData.description.en}
                onChange={(e) => handleInputChange('description.en', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Promotion description in English"
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">فترة العرض</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البداية *</label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء *</label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Banner Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات البانر</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رابط البانر</label>
              <input
                type="text"
                value={formData.banner_url}
                onChange={(e) => handleInputChange('banner_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="/promotions/summer-sale"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">صورة البانر</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('banner_image', e.target.files?.[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Products and Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات والفئات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المنتجات المحددة</label>
              <select
                multiple
                value={formData.products}
                onChange={(e) => handleInputChange('products', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                size={5}
              >
                <option value="1">منتج 1</option>
                <option value="2">منتج 2</option>
                <option value="3">منتج 3</option>
                <option value="4">منتج 4</option>
                <option value="5">منتج 5</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">اضغط Ctrl (أو Cmd) لاختيار عدة منتجات</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الفئات المحددة</label>
              <select
                multiple
                value={formData.categories}
                onChange={(e) => handleInputChange('categories', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                size={5}
              >
                <option value="1">إلكترونيات</option>
                <option value="2">ملابس</option>
                <option value="3">أحذية</option>
                <option value="4">أثاث</option>
                <option value="5">كتب</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">اضغط Ctrl (أو Cmd) لاختيار عدة فئات</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                عرض مميز (سيظهر في الصفحة الرئيسية)
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <Link
            href="/admin/marketing/promotions"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            إنشاء العرض الترويجي
          </button>
        </div>
      </form>
    </div>
  );
} 