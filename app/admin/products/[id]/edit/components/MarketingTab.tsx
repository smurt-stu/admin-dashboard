'use client';

interface MarketingTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

export default function MarketingTab({ formData, handleInputChange }: MarketingTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">مميزات المنتج</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => handleInputChange('is_featured', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">منتج مميز</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_bestseller}
              onChange={(e) => handleInputChange('is_bestseller', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">الأكثر مبيعاً</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_on_sale}
              onChange={(e) => handleInputChange('is_on_sale', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">في العرض</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.in_stock}
              onChange={(e) => handleInputChange('in_stock', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">متوفر في المخزون</label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تحسين محركات البحث</h3>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العلامات
            </label>
            <input
              type="text"
              value={formData.tags || ''}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="علامات مفصولة بفواصل"
            />
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
              placeholder="كلمات مفتاحية مفصولة بفواصل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ الإطلاق
            </label>
            <input
              type="date"
              value={formData.launch_date || ''}
              onChange={(e) => handleInputChange('launch_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_new_arrival || false}
              onChange={(e) => handleInputChange('is_new_arrival', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">منتج جديد</label>
          </div>
        </div>
      </div>
    </div>
  );
} 