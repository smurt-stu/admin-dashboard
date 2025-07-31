'use client';

import { Category, ProductType } from '../../../../../../lib/products';

interface BasicInfoTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  handleTitleChange: (value: string) => void;
  categories: Category[];
  productTypes: ProductType[];
  getCategoryDisplayName: (category: Category) => string;
  getProductTypeDisplayName: (productType: ProductType) => string;
}

export default function BasicInfoTab({
  formData,
  handleInputChange,
  handleTitleChange,
  categories,
  productTypes,
  getCategoryDisplayName,
  getProductTypeDisplayName
}: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم بالعربية *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم المنتج بالعربية"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                value={formData.title_en || ''}
                onChange={(e) => handleInputChange('title_en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name in English"
              />
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع المنتج
              </label>
              <select
                value={formData.product_type}
                onChange={(e) => handleInputChange('product_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">اختر نوع المنتج</option>
                {productTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {getProductTypeDisplayName(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                placeholder="باركود المنتج"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الماركة
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اسم الماركة"
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم ISBN
              </label>
              <input
                type="text"
                value={formData.isbn || ''}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="رقم ISBN"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عدد الصفحات
              </label>
              <input
                type="number"
                min="0"
                value={formData.pages_count || ''}
                onChange={(e) => handleInputChange('pages_count', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="عدد الصفحات"
              />
            </div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف القصير
            </label>
            <textarea
              value={formData.short_description || ''}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="وصف مختصر للمنتج"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف الكامل
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="وصف تفصيلي للمنتج"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 