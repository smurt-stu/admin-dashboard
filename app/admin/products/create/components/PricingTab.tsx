'use client';

import { useState } from 'react';

interface PricingTabProps {
  formData: any;
  setFormData: (data: any) => void;
  productType: string;
}

export default function PricingTab({ formData, setFormData, productType }: PricingTabProps) {
  const [activeTab, setActiveTab] = useState<'pricing' | 'stock' | 'shipping'>('pricing');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateDiscountPercentage = () => {
    if (!formData.price || !formData.compare_price) return 0;
    const price = parseFloat(formData.price);
    const comparePrice = parseFloat(formData.compare_price);
    if (comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const getStockFields = () => {
    if (productType === 'digital' || productType === 'service') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <i className="ri-information-line text-blue-500"></i>
              <span className="text-sm text-blue-700">
                المنتجات الرقمية والخدمات لا تحتاج إلى إدارة مخزون
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكمية المتوفرة
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity || 999999}
                onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 999999)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="999999"
              />
              <p className="text-xs text-gray-500 mt-1">
                كمية غير محدودة للمنتجات الرقمية
              </p>
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
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <p className="text-xs text-gray-500 mt-1">
              عدد الوحدات المتوفرة في المخزون
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تنبيه المخزون الأدنى
            </label>
            <input
              type="number"
              min="0"
              value={formData.min_stock_alert || 5}
              onChange={(e) => handleInputChange('min_stock_alert', parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5"
            />
            <p className="text-xs text-gray-500 mt-1">
              سيتم إرسال تنبيه عند وصول المخزون لهذا الرقم
            </p>
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
            <p className="text-xs text-gray-500 mt-1">
              أقصى كمية يمكن طلبها في مرة واحدة
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.track_stock !== false}
              onChange={(e) => handleInputChange('track_stock', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">
              تتبع المخزون
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.requires_shipping !== false}
              onChange={(e) => handleInputChange('requires_shipping', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">
              يتطلب شحن
            </label>
          </div>
        </div>
      </div>
    );
  };

  const getShippingFields = () => {
    if (productType === 'digital' || productType === 'service') {
      return (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <i className="ri-information-line text-blue-500"></i>
            <span className="text-sm text-blue-700">
              المنتجات الرقمية والخدمات لا تحتاج إلى معلومات الشحن
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              placeholder="0.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              وزن المنتج بالكيلوجرام
            </p>
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
                length: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="20"
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
                width: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15"
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
                height: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10"
            />
          </div>
        </div>

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
            <p className="text-xs text-gray-500 mt-1">
              مدة الضمان بالشهور
            </p>
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
              <option value="none">لا يوجد ضمان</option>
            </select>
          </div>
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
          </select>
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
            onClick={() => setActiveTab('pricing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pricing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            التسعير
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stock'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            المخزون
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shipping'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الشحن والأبعاد
          </button>
        </nav>
      </div>

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">معلومات التسعير</h4>
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
                <p className="text-xs text-gray-500 mt-1">
                  السعر الذي سيتم عرضه للعملاء
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  السعر الأصلي قبل الخصم (اختياري)
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  سعر التكلفة للمنتج (للمراجعة الداخلية)
                </p>
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
                  value={formData.discount_percentage || calculateDiscountPercentage()}
                  onChange={(e) => handleInputChange('discount_percentage', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  نسبة الخصم المطبقة على المنتج
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">ملخص التسعير</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>السعر الأساسي:</span>
                <span className="font-medium">{formData.price || '0.00'} د.ك</span>
              </div>
              {formData.compare_price && (
                <div className="flex justify-between">
                  <span>سعر المقارنة:</span>
                  <span className="line-through text-gray-500">{formData.compare_price} د.ك</span>
                </div>
              )}
              {formData.discount_percentage > 0 && (
                <div className="flex justify-between">
                  <span>نسبة الخصم:</span>
                  <span className="text-green-600 font-medium">{formData.discount_percentage}%</span>
                </div>
              )}
              {formData.cost_price && (
                <div className="flex justify-between">
                  <span>سعر التكلفة:</span>
                  <span className="text-gray-600">{formData.cost_price} د.ك</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stock Tab */}
      {activeTab === 'stock' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">إدارة المخزون</h4>
          {getStockFields()}
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === 'shipping' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">معلومات الشحن والأبعاد</h4>
          {getShippingFields()}
        </div>
      )}
    </div>
  );
} 