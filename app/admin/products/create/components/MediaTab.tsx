'use client';

import { useState } from 'react';

interface MediaTabProps {
  formData: any;
  setFormData: (data: any) => void;
  productType: string;
}

export default function MediaTab({ formData, setFormData, productType }: MediaTabProps) {
  const [activeTab, setActiveTab] = useState<'images' | 'files'>('images');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const getDigitalFilesSection = () => {
    if (productType !== 'digital') return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">الملفات الرقمية</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الملف الرقمي الرئيسي *
            </label>
            <input
              type="url"
              value={formData.digital_file || ''}
              onChange={(e) => handleInputChange('digital_file', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/file.pdf"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              رابط الملف الرقمي الذي سيتم بيعه (PDF, EPUB, MP4, etc.)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملف العينة
            </label>
            <input
              type="url"
              value={formData.sample_file || ''}
              onChange={(e) => handleInputChange('sample_file', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/sample.pdf"
            />
            <p className="text-xs text-gray-500 mt-1">
              ملف عينة مجاني للعملاء (اختياري)
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab('images')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'images'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الصور
          </button>
          {productType === 'digital' && (
            <button
              onClick={() => setActiveTab('files')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الملفات الرقمية
            </button>
          )}
        </nav>
      </div>

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">صور المنتج</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الصورة الرئيسية *
                </label>
                <input
                  type="url"
                  value={formData.main_image}
                  onChange={(e) => handleInputChange('main_image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  الصورة الرئيسية التي ستظهر في قوائم المنتجات
                </p>
                {formData.main_image && (
                  <div className="mt-3">
                    <img
                      src={formData.main_image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صورة الغلاف
                </label>
                <input
                  type="url"
                  value={formData.cover_image || ''}
                  onChange={(e) => handleInputChange('cover_image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/cover.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  صورة الغلاف للمنتج (اختيارية)
                </p>
                {formData.cover_image && (
                  <div className="mt-3">
                    <img
                      src={formData.cover_image}
                      alt="Cover Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Guidelines */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">إرشادات الصور</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• استخدم صور عالية الجودة (أقل من 2MB)</li>
              <li>• الأبعاد المفضلة: 800×600 بكسل</li>
              <li>• الصيغ المدعومة: JPG, PNG, WebP</li>
              <li>• تأكد من أن الصورة واضحة ومضيئة</li>
            </ul>
          </div>
        </div>
      )}

      {/* Digital Files Tab */}
      {activeTab === 'files' && getDigitalFilesSection()}
    </div>
  );
} 