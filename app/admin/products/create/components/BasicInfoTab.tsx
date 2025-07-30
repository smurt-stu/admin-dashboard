'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { ProductType } from '../../../../../lib/products/types';

interface BasicInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: any[];
  productTypes: ProductType[];
  onProductTypeChange?: (productTypeId: string) => void;
}

export default function BasicInfoTab({ formData, setFormData, categories, productTypes, onProductTypeChange }: BasicInfoTabProps) {
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
        <div className="text-sm text-gray-600 mb-4">
          عدد أنواع المنتجات: {productTypes.length}
          {formData.product_type && (
            <span className="mr-4 text-green-600">
              ✓ تم اختيار نوع المنتج
            </span>
          )}
        </div>
        
        {productTypes.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <i className="ri-error-warning-line text-2xl text-yellow-600 ml-3"></i>
              <div>
                <h5 className="text-lg font-semibold text-yellow-800">لا توجد أنواع منتجات متاحة</h5>
                <p className="text-yellow-700">يرجى إنشاء أنواع منتجات أولاً من صفحة إدارة أنواع المنتجات</p>
                <Link
                  href="/admin/product-types/create"
                  className="inline-block mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  إنشاء نوع منتج جديد
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  formData.product_type === type.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => {
                  handleInputChange('product_type', type.id);
                  onProductTypeChange?.(type.id);
                }}
              >
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.product_type === type.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.product_type === type.id && (
                      <i className="ri-check-line text-white text-sm"></i>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <h5 className="font-medium text-gray-900">
                        {typeof type.display_name === 'string' 
                          ? type.display_name 
                          : type.display_name?.ar || type.display_name?.en || type.name
                        }
                      </h5>
                      {type.is_digital && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          رقمي
                        </span>
                      )}
                      {type.has_variants && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          متغيرات
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {type.description || 
                       (typeof type.display_name === 'object' ? type.display_name?.en : '') ||
                       type.name
                      }
                    </p>
                    
                    {/* Product Type Features */}
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <i className={`ri-${type.is_digital ? 'file-text-line' : 'box-line'}`}></i>
                        <span>{type.is_digital ? 'منتج رقمي' : 'منتج مادي'}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <i className={`ri-${type.requires_shipping ? 'truck-line' : 'download-line'}`}></i>
                        <span>{type.requires_shipping ? 'يتطلب شحن' : 'لا يتطلب شحن'}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <i className={`ri-${type.track_stock ? 'bar-chart-line' : 'eye-off-line'}`}></i>
                        <span>{type.track_stock ? 'تتبع المخزون' : 'لا يتتبع المخزون'}</span>
                      </div>
                    </div>
                    
                    {/* Custom Fields Count */}
                    {type.settings?.custom_fields && type.settings.custom_fields.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <i className="ri-settings-3-line text-xs"></i>
                          <span className="text-xs font-medium">
                            {type.settings.custom_fields.length} حقل مخصص
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Selected Product Type Info */}
        {formData.product_type && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <i className="ri-check-line text-green-600"></i>
              <span className="text-sm font-medium text-green-800">
                تم اختيار نوع المنتج: {
                  productTypes.find(t => t.id === formData.product_type)?.display_name?.ar ||
                  productTypes.find(t => t.id === formData.product_type)?.display_name?.en ||
                  productTypes.find(t => t.id === formData.product_type)?.name
                }
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              ستظهر الحقول المخصصة لهذا النوع في التبويب التالي
            </p>
          </div>
        )}
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