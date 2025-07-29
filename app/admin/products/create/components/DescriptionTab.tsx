'use client';

import { useState } from 'react';

interface DescriptionTabProps {
  formData: any;
  setFormData: (data: any) => void;
  productType: string;
}

export default function DescriptionTab({ formData, setFormData, productType }: DescriptionTabProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificationsChange = (lang: 'ar' | 'en', value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      specifications: {
        ar: lang === 'ar' ? value : (prev.specifications?.ar || ''),
        en: lang === 'en' ? value : (prev.specifications?.en || '')
      }
    }));
  };

  const getProductTypeFields = () => {
    switch (productType) {
      case 'digital':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المؤلف
                </label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اسم المؤلف"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اسم مؤلف الكتاب أو المحتوى الرقمي
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="978-0-123456-47-2"
                  pattern="^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9X]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$"
                />
                <p className="text-xs text-gray-500 mt-1">
                  رقم ISBN للكتاب (اختياري)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اللغة
                </label>
                <select
                  value={formData.language || 'ar'}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ar">العربية</option>
                  <option value="en">الإنجليزية</option>
                  <option value="fr">الفرنسية</option>
                  <option value="es">الإسبانية</option>
                  <option value="de">الألمانية</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الصفحات
                </label>
                <input
                  type="number"
                  value={formData.pages_count || ''}
                  onChange={(e) => handleInputChange('pages_count', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عدد الصفحات"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ النشر
                </label>
                <input
                  type="date"
                  value={formData.publication_date || ''}
                  onChange={(e) => handleInputChange('publication_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
      case 'physical':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوزن (كجم)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  وزن المنتج بالكيلوجرام
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الأبعاد
                </label>
                <input
                  type="text"
                  value={formData.dimensions || ''}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30x20x10 سم"
                />
                <p className="text-xs text-gray-500 mt-1">
                  أبعاد المنتج (الطول × العرض × الارتفاع)
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'description'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الوصف
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'specifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            المواصفات
          </button>
        </nav>
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">وصف المنتج</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف المختصر
                </label>
                <textarea
                  value={formData.short_description || ''}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="وصف مختصر للمنتج"
                />
                <p className="text-xs text-gray-500 mt-1">
                  وصف مختصر يظهر في قوائم المنتجات
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف التفصيلي
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="وصف تفصيلي للمنتج"
                />
                <p className="text-xs text-gray-500 mt-1">
                  وصف مفصل يظهر في صفحة المنتج
                </p>
              </div>
            </div>
          </div>

          {/* Product Type Specific Fields */}
          {getProductTypeFields() && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                معلومات خاصة بنوع المنتج
              </h4>
              {getProductTypeFields()}
            </div>
          )}
        </div>
      )}

      {/* Specifications Tab */}
      {activeTab === 'specifications' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">المواصفات</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المواصفات بالعربية
              </label>
              <textarea
                value={formData.specifications?.ar || ''}
                onChange={(e) => handleSpecificationsChange('ar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="المواصفات باللغة العربية"
              />
              <p className="text-xs text-gray-500 mt-1">
                قم بإدراج المواصفات الفنية للمنتج
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المواصفات بالإنجليزية
              </label>
              <textarea
                value={formData.specifications?.en || ''}
                onChange={(e) => handleSpecificationsChange('en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Product specifications in English"
              />
              <p className="text-xs text-gray-500 mt-1">
                قم بإدراج المواصفات الفنية باللغة الإنجليزية
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 