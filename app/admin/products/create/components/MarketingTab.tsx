'use client';

import { useState } from 'react';

interface MarketingTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function MarketingTab({ formData, setFormData }: MarketingTabProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'seo' | 'tags'>('features');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab('features')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'features'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            المميزات
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'seo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            تحسين محركات البحث
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tags'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            العلامات والكلمات المفتاحية
          </button>
        </nav>
      </div>

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">مميزات المنتج</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured || false}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    منتج مميز
                  </label>
                  <i className="ri-information-line text-gray-400 mr-1" title="سيظهر في قسم المنتجات المميزة"></i>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_bestseller || false}
                    onChange={(e) => handleInputChange('is_bestseller', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    الأكثر مبيعاً
                  </label>
                  <i className="ri-information-line text-gray-400 mr-1" title="سيظهر في قسم الأكثر مبيعاً"></i>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_new_arrival || false}
                    onChange={(e) => handleInputChange('is_new_arrival', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    وصل حديثاً
                  </label>
                  <i className="ri-information-line text-gray-400 mr-1" title="سيظهر في قسم الوصول الجديد"></i>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_on_sale || false}
                    onChange={(e) => handleInputChange('is_on_sale', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    في العرض
                  </label>
                  <i className="ri-information-line text-gray-400 mr-1" title="سيظهر في قسم العروض"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">تاريخ الإطلاق</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الإطلاق
              </label>
              <input
                type="datetime-local"
                value={formData.launch_date || ''}
                onChange={(e) => handleInputChange('launch_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                تاريخ إطلاق المنتج (اختياري)
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">حالة المنتج</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="mr-2 text-sm font-medium text-gray-700">
                  متوفر في المخزون
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  حالة المنتج
                </label>
                <select
                  value={formData.condition || 'new'}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">جديد</option>
                  <option value="used">مستعمل</option>
                  <option value="refurbished">مجدول</option>
                  <option value="open_box">مفتوح العبوة</option>
                  <option value="damaged">تالف</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">تحسين محركات البحث</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان Meta
                </label>
                <input
                  type="text"
                  value={formData.meta_title || ''}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان Meta للمنتج"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  عنوان يظهر في نتائج البحث (أقل من 60 حرف)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وصف Meta
                </label>
                <textarea
                  value={formData.meta_description || ''}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="وصف Meta للمنتج"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  وصف يظهر في نتائج البحث (أقل من 160 حرف)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">نصائح SEO</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• استخدم كلمات مفتاحية وصفية في العنوان</li>
              <li>• اكتب وصفاً جذاباً ومفيداً</li>
              <li>• تأكد من أن العنوان والوصف فريدان</li>
              <li>• استخدم كلمات مفتاحية طبيعية</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">العلامات والكلمات المفتاحية</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العلامات
                </label>
                <input
                  type="text"
                  value={formData.tags || ''}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="علامة1, علامة2, علامة3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  أدخل العلامات مفصولة بفواصل (مثال: إلكترونيات، ملابس، إكسسوارات)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الكلمات المفتاحية
                </label>
                <input
                  type="text"
                  value={formData.keywords || ''}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="كلمة1, كلمة2, كلمة3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  الكلمات المفتاحية للمنتج (مفصولة بفواصل)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">نصائح للعلامات</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• استخدم علامات وصفية ومفيدة</li>
              <li>• تجنب العلامات العامة جداً</li>
              <li>• استخدم 3-5 علامات لكل منتج</li>
              <li>• فكر في الكلمات التي سيبحث عنها العملاء</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 