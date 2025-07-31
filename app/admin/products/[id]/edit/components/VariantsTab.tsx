'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '../../../../../../lib/products';

interface VariantsTabProps {
  product: Product;
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  selectedProductTypeWithSettings: any;
}

export default function VariantsTab({ product, formData, handleInputChange, selectedProductTypeWithSettings }: VariantsTabProps) {
  const [variants, setVariants] = useState<any[]>([]);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [editingField, setEditingField] = useState<{variantId: number, field: string} | null>(null);
  const [newVariant, setNewVariant] = useState({
    name: '',
    sku: '',
    price: '',
    stock_quantity: 0,
    options: {}
  });
  
  // استخدام useRef لتتبع التغييرات السابقة
  const previousVariantsRef = useRef<any[]>([]);
  const isInitializedRef = useRef(false);

  // تحميل المتغيرات الموجودة عند تحميل المكون
  useEffect(() => {
    if (product.variants && product.variants.length > 0 && !isInitializedRef.current) {
      const initialVariants = product.variants.map((variant: any) => ({
        ...variant,
        id: variant.id || Date.now() + Math.random(),
        // تحويل البيانات إلى التنسيق المطلوب
        name: variant.name || '',
        options: variant.options || {},
        price_modifier: variant.price_modifier || variant.price || '0.00',
        stock_quantity: variant.stock_quantity || 0,
        min_stock_alert: variant.min_stock_alert || 5,
        display_order: variant.display_order || 1,
        is_active: variant.is_active !== false,
        settings: variant.settings || {
          is_active: true,
          allow_purchase: true
        }
      }));
      setVariants(initialVariants);
      previousVariantsRef.current = initialVariants;
      isInitializedRef.current = true;
    } else if (!product.variants && !isInitializedRef.current) {
      isInitializedRef.current = true;
    }
  }, [product.variants]);

  // تحديث formData عند تغيير المتغيرات - مع منع الحلقة اللانهائية
  useEffect(() => {
    // التحقق من أن المتغيرات تغيرت فعلاً
    const variantsChanged = JSON.stringify(variants) !== JSON.stringify(previousVariantsRef.current);
    
    if (variantsChanged && isInitializedRef.current) {
      // تحويل المتغيرات إلى التنسيق المطلوب قبل الإرسال
      const formattedVariants = variants.map((variant: any, index: number) => ({
        ...variant,
        price_modifier: (() => {
          if (variant.price_modifier !== undefined) {
            return variant.price_modifier.toString();
          }
          if (variant.price !== undefined) {
            return variant.price.toString();
          }
          return '0.00';
        })(),
        display_order: variant.display_order || index + 1,
        is_active: variant.is_active !== false
      }));
      
      handleInputChange('variants', formattedVariants);
      previousVariantsRef.current = [...variants];
    }
  }, [variants, handleInputChange]);

  const handleAddVariant = () => {
    if (newVariant.name && newVariant.sku) {
      const variantToAdd = {
        ...newVariant,
        id: Date.now() + Math.random(),
        name: newVariant.name,
        options: newVariant.options || {},
        price_modifier: (() => {
          if (newVariant.price) {
            return newVariant.price.toString();
          }
          return '0.00';
        })(),
        stock_quantity: newVariant.stock_quantity || 0,
        min_stock_alert: 5,
        display_order: variants.length + 1,
        is_active: true,
        settings: {
          is_active: true,
          allow_purchase: true
        }
      };
      
      setVariants([...variants, variantToAdd]);
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
    if (confirm('هل أنت متأكد من حذف هذا المتغير؟')) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const handleVariantChange = (id: number, field: string, value: any) => {
    setVariants(variants.map(v => {
      if (v.id === id) {
        const updatedVariant = { ...v, [field]: value };
        
        // تحديث الحقول المرتبطة
        if (field === 'stock_quantity') {
          updatedVariant.is_in_stock = value > 0;
        }
        if (field === 'price_modifier') {
          // تحويل السعر إلى تعديل السعر
          updatedVariant.price_modifier = value.toString();
        }
        
        return updatedVariant;
      }
      return v;
    }));
  };

  const startEditing = (variantId: number, field: string) => {
    setEditingField({ variantId, field });
  };

  const stopEditing = () => {
    setEditingField(null);
  };

  const isEditing = (variantId: number, field: string) => {
    return editingField?.variantId === variantId && editingField?.field === field;
  };

  // تحسين التحقق من دعم المتغيرات
  const supportsVariants = () => {
    // التحقق من نوع المنتج المحدد
    if (selectedProductTypeWithSettings?.has_variants === true) {
      return true;
    }
    
    // التحقق من إعدادات نوع المنتج
    if (selectedProductTypeWithSettings?.settings?.supports_variants === true) {
      return true;
    }
    
    // التحقق من نوع المنتج في formData
    if (formData.product_type) {
      // البحث في قائمة أنواع المنتجات المحملة
      const productType = product.product_type;
      if (productType && typeof productType === 'object' && productType.has_variants === true) {
        return true;
      }
    }
    
    return false;
  };

  const renderOptions = (options: any) => {
    if (!options || Object.keys(options).length === 0) {
      return <span className="text-gray-400 text-xs">لا توجد خيارات</span>;
    }

    return Object.entries(options).map(([key, value]) => (
      <span key={key} className="inline-block text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mr-1 mb-1">
        <span className="font-medium">{key}:</span> {String(value)}
      </span>
    ));
  };

  const getStockStatusColor = (isInStock: boolean, stockQuantity: number) => {
    if (stockQuantity === 0) return 'text-red-600';
    if (stockQuantity <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStockStatusText = (isInStock: boolean, stockQuantity: number) => {
    if (stockQuantity === 0) return 'نفد';
    if (stockQuantity <= 5) return 'منخفض';
    return 'متوفر';
  };

  // معلومات التشخيص
  const debugInfo = {
    selectedProductType: selectedProductTypeWithSettings,
    hasVariants: selectedProductTypeWithSettings?.has_variants,
    settingsSupportsVariants: selectedProductTypeWithSettings?.settings?.supports_variants,
    productTypeFromForm: formData.product_type,
    productTypeFromProduct: product.product_type,
    supportsVariantsResult: supportsVariants()
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">المتغيرات</h3>
            <p className="text-sm text-gray-500 mt-1">
              إدارة متغيرات المنتج مثل الألوان والمقاسات
            </p>
            {/* معلومات التشخيص */}
            <div className="mt-2 text-xs text-gray-400">
              <div>نوع المنتج: {selectedProductTypeWithSettings?.name || 'غير محدد'}</div>
              <div>يدعم المتغيرات: {supportsVariants() ? 'نعم' : 'لا'}</div>
              <div>has_variants: {selectedProductTypeWithSettings?.has_variants?.toString() || 'غير محدد'}</div>
            </div>
          </div>
          {supportsVariants() && (
            <button
              type="button"
              onClick={() => setShowAddVariant(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse transition-colors"
            >
              <i className="ri-add-line"></i>
              <span>إضافة متغير</span>
            </button>
          )}
        </div>

        {supportsVariants() ? (
          <div className="space-y-4">
            {variants.length > 0 ? (
              <div className="grid gap-4">
                {variants.map((variant) => (
                  <div key={variant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      {/* المعلومات الأساسية */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* اسم المتغير */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">المتغير</label>
                          {isEditing(variant.id, 'name') ? (
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                              onBlur={stopEditing}
                              onKeyPress={(e) => e.key === 'Enter' && stopEditing()}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="اسم المتغير"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => startEditing(variant.id, 'name')}
                            >
                              {variant.name || 'بدون اسم'}
                            </div>
                          )}
                        </div>

                        {/* SKU */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                          {isEditing(variant.id, 'sku') ? (
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                              onBlur={stopEditing}
                              onKeyPress={(e) => e.key === 'Enter' && stopEditing()}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent font-mono"
                              placeholder="SKU"
                            />
                          ) : (
                            <div 
                              className="text-sm text-gray-600 font-mono cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => startEditing(variant.id, 'sku')}
                            >
                              {variant.sku || 'بدون SKU'}
                            </div>
                          )}
                        </div>

                        {/* السعر */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">السعر</label>
                          {isEditing(variant.id, 'price_modifier') ? (
                            <input
                              type="number"
                              step="0.01"
                              value={variant.price_modifier || ''}
                              onChange={(e) => handleVariantChange(variant.id, 'price_modifier', e.target.value)}
                              onBlur={stopEditing}
                              onKeyPress={(e) => e.key === 'Enter' && stopEditing()}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="تعديل السعر"
                            />
                          ) : (
                            <div 
                              className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => startEditing(variant.id, 'price_modifier')}
                            >
                              {variant.price_modifier ? `${variant.price_modifier} د.ك` : 'غير محدد'}
                            </div>
                          )}
                        </div>

                        {/* المخزون */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">المخزون</label>
                          {isEditing(variant.id, 'stock_quantity') ? (
                            <input
                              type="number"
                              value={variant.stock_quantity || 0}
                              onChange={(e) => handleVariantChange(variant.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                              onBlur={stopEditing}
                              onKeyPress={(e) => e.key === 'Enter' && stopEditing()}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="الكمية"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span 
                                className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
                                onClick={() => startEditing(variant.id, 'stock_quantity')}
                              >
                                {variant.stock_quantity || 0}
                              </span>
                              <span className={`text-xs font-medium ${getStockStatusColor(variant.is_in_stock, variant.stock_quantity || 0)}`}>
                                ({getStockStatusText(variant.is_in_stock, variant.stock_quantity || 0)})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* الإجراءات */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4">
                        <button
                          type="button"
                          onClick={() => startEditing(variant.id, 'name')}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="تعديل المتغير"
                        >
                          <i className="ri-edit-line text-lg"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="حذف المتغير"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>

                                            {/* الخيارات */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <label className="block text-xs font-medium text-gray-500 mb-1">الخيارات</label>
                          <div className="flex flex-wrap gap-2">
                            {renderOptions(variant.options)}
                          </div>
                          {Object.keys(variant.options || {}).length === 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              يمكنك إضافة خيارات مثل اللون والمقاس
                            </div>
                          )}
                        </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="mb-4">
                  <i className="ri-git-branch-line text-6xl text-gray-300"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد متغيرات</h3>
                <p className="text-sm text-gray-500 mb-4">لم يتم إضافة أي متغيرات لهذا المنتج بعد</p>
                <button
                  type="button"
                  onClick={() => setShowAddVariant(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إضافة أول متغير
                </button>
              </div>
            )}

            {showAddVariant && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">إضافة متغير جديد</h4>
                  <button
                    type="button"
                    onClick={() => setShowAddVariant(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتغير</label>
                    <input
                      type="text"
                      value={newVariant.name}
                      onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: أحمر - XS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <input
                      type="text"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="رمز المنتج"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تعديل السعر</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="تعديل السعر (+10 للزيادة، -5 للخصم)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المخزون</label>
                    <input
                      type="number"
                      value={newVariant.stock_quantity}
                      onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="الكمية"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 rtl:space-x-reverse mt-6">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <i className="ri-add-line"></i>
                    <span>إضافة المتغير</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddVariant(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4">
              <i className="ri-git-commit-line text-6xl text-gray-300"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">نوع المنتج لا يدعم المتغيرات</h3>
            <p className="text-sm text-gray-500 mb-4">
              نوع المنتج الحالي: {selectedProductTypeWithSettings?.name || 'غير محدد'}
            </p>
            <p className="text-sm text-gray-500">
              اختر نوع منتج يدعم المتغيرات لإضافة متغيرات للمنتج
            </p>
            {/* معلومات التشخيص الإضافية */}
            <div className="mt-4 text-xs text-gray-400 bg-gray-100 p-3 rounded">
              <div>معلومات التشخيص:</div>
              <div>has_variants: {selectedProductTypeWithSettings?.has_variants?.toString() || 'غير محدد'}</div>
              <div>settings.supports_variants: {selectedProductTypeWithSettings?.settings?.supports_variants?.toString() || 'غير محدد'}</div>
              <div>نوع المنتج من المنتج: {product.product_type?.name || 'غير محدد'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 