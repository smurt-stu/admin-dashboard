'use client';

interface PricingTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

export default function PricingTab({ formData, handleInputChange }: PricingTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">التسعير</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السعر الأساسي *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">د.ك</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              سعر المقارنة
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.compare_price || ''}
                onChange={(e) => handleInputChange('compare_price', e.target.value)}
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">د.ك</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              سعر التكلفة
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price || ''}
                onChange={(e) => handleInputChange('cost_price', e.target.value)}
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">د.ك</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نسبة الخصم (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.discount_percentage || 0}
              onChange={(e) => handleInputChange('discount_percentage', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المخزون</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الكمية المتوفرة
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock_quantity || 0}
              onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تنبيه المخزون الأدنى
            </label>
            <input
              type="number"
              min="0"
              value={formData.min_stock_alert || 10}
              onChange={(e) => handleInputChange('min_stock_alert', parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحد الأقصى للطلب
            </label>
            <input
              type="number"
              min="0"
              value={formData.max_order_quantity || 10}
              onChange={(e) => handleInputChange('max_order_quantity', parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.track_stock || false}
              onChange={(e) => handleInputChange('track_stock', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">تتبع المخزون</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.requires_shipping || false}
              onChange={(e) => handleInputChange('requires_shipping', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">يتطلب شحن</label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الشحن والأبعاد</h3>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الطول (سم)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.dimensions?.length || ''}
              onChange={(e) => handleInputChange('dimensions', {
                ...formData.dimensions,
                length: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العرض (سم)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.dimensions?.width || ''}
              onChange={(e) => handleInputChange('dimensions', {
                ...formData.dimensions,
                width: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الارتفاع (سم)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.dimensions?.height || ''}
              onChange={(e) => handleInputChange('dimensions', {
                ...formData.dimensions,
                height: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الضمان والحالة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مدة الضمان (شهر)
            </label>
            <input
              type="number"
              min="0"
              value={formData.warranty_period || 12}
              onChange={(e) => handleInputChange('warranty_period', parseInt(e.target.value) || 12)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع الضمان
            </label>
            <select
              value={formData.warranty_type || ''}
              onChange={(e) => handleInputChange('warranty_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر نوع الضمان</option>
              <option value="manufacturer">ضمان المصنع</option>
              <option value="seller">ضمان البائع</option>
              <option value="extended">ضمان ممتد</option>
              <option value="none">بدون ضمان</option>
            </select>
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
              <option value="refurbished">معاد تجديده</option>
              <option value="open_box">مفتوح العبوة</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 