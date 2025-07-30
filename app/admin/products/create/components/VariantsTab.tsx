'use client';

import { useState } from 'react';

interface VariantsTabProps {
  formData: any;
  setFormData: (data: any) => void;
  selectedProductType: any;
}

export default function VariantsTab({ formData, setFormData, selectedProductType }: VariantsTabProps) {
  const [variants, setVariants] = useState<any[]>([]);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    name: '',
    sku: '',
    price: '',
    stock_quantity: 0,
    options: {}
  });

  const handleAddVariant = () => {
    if (newVariant.name && newVariant.sku) {
      setVariants([...variants, { ...newVariant, id: Date.now() }]);
      setNewVariant({
        name: '',
        sku: '',
        price: '',
        stock_quantity: 0,
        options: {}
      });
      setShowAddVariant(false);
    }
  };

  const handleRemoveVariant = (id: number) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleVariantChange = (id: number, field: string, value: any) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">المتغيرات</h3>
          {selectedProductType?.has_variants && (
            <button
              type="button"
              onClick={() => setShowAddVariant(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <i className="ri-add-line"></i>
              <span>إضافة متغير</span>
            </button>
          )}
        </div>

        {selectedProductType?.has_variants ? (
          <div className="space-y-4">
            {variants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المتغير</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخزون</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="اسم المتغير"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="SKU"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="السعر"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            value={variant.stock_quantity}
                            onChange={(e) => handleVariantChange(variant.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="المخزون"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(variant.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="ri-git-branch-line text-4xl mb-2"></i>
                <p>لا توجد متغيرات</p>
                <p className="text-sm">اضغط على "إضافة متغير" لإنشاء متغيرات للمنتج</p>
              </div>
            )}

            {showAddVariant && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">إضافة متغير جديد</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتغير</label>
                    <input
                      type="text"
                      value={newVariant.name}
                      onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: أحمر - XS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="رمز المنتج"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="السعر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المخزون</label>
                    <input
                      type="number"
                      value={newVariant.stock_quantity}
                      onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="الكمية"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 rtl:space-x-reverse mt-4">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    إضافة المتغير
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddVariant(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-git-commit-line text-4xl mb-2"></i>
            <p>نوع المنتج المحدد لا يدعم المتغيرات</p>
            <p className="text-sm">اختر نوع منتج يدعم المتغيرات لإضافة متغيرات للمنتج</p>
          </div>
        )}
      </div>
    </div>
  );
} 