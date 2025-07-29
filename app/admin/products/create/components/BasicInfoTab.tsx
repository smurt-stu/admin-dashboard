'use client';

import { useState, useEffect } from 'react';

interface BasicInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: any[];
  productTypes: { value: string; label: string; description: string }[];
}

export default function BasicInfoTab({ formData, setFormData, categories, productTypes }: BasicInfoTabProps) {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    handleInputChange('title', value);
    if (value) {
      const slug = generateSlug(value);
      handleInputChange('slug', slug);
    }
  };

  const getCategoryDisplayName = (category: any) => {
    if (typeof category.name === 'string') {
      return category.name;
    }
    return category.name?.ar || category.name?.en || 'بدون اسم';
  };

  return (
    <div className="space-y-6">
      {/* Product Type Selection */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">نوع المنتج</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.product_type === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleInputChange('product_type', type.value)}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.product_type === type.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}></div>
                <div>
                  <h5 className="font-medium text-gray-900">{type.label}</h5>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المنتج *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم المنتج"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                سيتم استخدام هذا الاسم في البحث وعرض المنتج
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الفرعي
              </label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="الاسم الفرعي للمنتج"
              />
              <p className="text-xs text-gray-500 mt-1">
                اسم إضافي يظهر تحت الاسم الرئيسي
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الرابط المختصر *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="product-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              سيتم استخدام هذا الرابط في عنوان URL للمنتج
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التصنيف *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">اختر التصنيف</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  لا توجد تصنيفات متاحة. يرجى إنشاء تصنيف أولاً.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Fields Toggle */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <button
          type="button"
          onClick={() => setShowAdvancedFields(!showAdvancedFields)}
          className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 hover:text-gray-900"
        >
          <i className={`ri-arrow-down-s-line transition-transform ${showAdvancedFields ? 'rotate-180' : ''}`}></i>
          <span>الحقول المتقدمة</span>
        </button>
      </div>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">الحقول المتقدمة</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="رمز المنتج"
              />
              <p className="text-xs text-gray-500 mt-1">
                رمز المنتج الفريد للمخزون
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الباركود
              </label>
              <input
                type="text"
                value={formData.barcode || ''}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="الباركود"
              />
              <p className="text-xs text-gray-500 mt-1">
                باركود المنتج للمسح الضوئي
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العلامة التجارية
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اسم العلامة التجارية"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الموديل
              </label>
              <input
                type="text"
                value={formData.model_number || ''}
                onChange={(e) => handleInputChange('model_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="رقم الموديل"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 