'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductTypeService } from '../../../../lib/products';
import { ProductType } from '../../../../lib/products/types';

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductTypes();
  }, []);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      const response = await ProductTypeService.getActiveProductTypes();
      setProductTypes(response);
    } catch (err) {
      setError('فشل في تحميل أنواع المنتجات');
      console.error('Error loading product types:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductTypeIcon = (productType: ProductType) => {
    if (productType.is_digital) {
      return 'ri-file-text-line';
    }
    if (productType.has_variants) {
      return 'ri-git-branch-line';
    }
    return 'ri-box-line';
  };

  const getProductTypeColor = (productType: ProductType) => {
    if (productType.is_digital) {
      return 'bg-blue-100 text-blue-800';
    }
    if (productType.has_variants) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جارِ التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProductTypes}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">أنواع المنتجات</h1>
          <p className="text-gray-600 mt-1">إدارة أنواع المنتجات والحقول المخصصة</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href="/admin/products"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            العودة للمنتجات
          </Link>
        </div>
      </div>

      {/* Product Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productTypes.map((productType) => (
          <div
            key={productType.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getProductTypeColor(productType)}`}>
                  <i className={`${getProductTypeIcon(productType)} text-2xl`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {typeof productType.display_name === 'string' 
                      ? productType.display_name 
                      : productType.display_name?.ar || productType.display_name?.en || productType.name
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    {typeof productType.display_name === 'object' 
                      ? productType.display_name?.en 
                      : productType.name
                    }
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                نشط
              </span>
            </div>

            {productType.description && (
              <p className="text-gray-600 text-sm mb-4">{productType.description}</p>
            )}

            {/* Product Type Features */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.is_digital ? 'file-text-line' : 'box-line'} text-blue-600`}></i>
                <span className="text-sm text-gray-700">
                  {productType.is_digital ? 'منتج رقمي' : 'منتج مادي'}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.requires_shipping ? 'truck-line' : 'download-line'} text-green-600`}></i>
                <span className="text-sm text-gray-700">
                  {productType.requires_shipping ? 'يتطلب شحن' : 'لا يتطلب شحن'}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.track_stock ? 'bar-chart-line' : 'eye-off-line'} text-purple-600`}></i>
                <span className="text-sm text-gray-700">
                  {productType.track_stock ? 'تتبع المخزون' : 'لا يتتبع المخزون'}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.has_variants ? 'git-branch-line' : 'git-commit-line'} text-orange-600`}></i>
                <span className="text-sm text-gray-700">
                  {productType.has_variants ? 'يدعم المتغيرات' : 'لا يدعم المتغيرات'}
                </span>
              </div>
            </div>

            {/* Custom Fields Count */}
            {productType.settings?.custom_fields && productType.settings.custom_fields.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <i className="ri-settings-3-line text-gray-600"></i>
                  <span className="text-sm font-medium text-gray-700">
                    {productType.settings.custom_fields.length} حقل مخصص
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {productType.settings.custom_fields.slice(0, 3).map((field) => (
                    <span
                      key={field.name}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                    >
                      {typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
                    </span>
                  ))}
                  {productType.settings.custom_fields.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      +{productType.settings.custom_fields.length - 3} أكثر
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>عدد المنتجات: {productType.products_count}</span>
                <span>ترتيب العرض: {productType.display_order}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-2 rtl:space-x-reverse">
              <Link
                href={`/admin/products/types/${productType.id}`}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm text-center"
              >
                تعديل
              </Link>
              <Link
                href={`/admin/products?product_type=${productType.id}`}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm text-center"
              >
                المنتجات
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {productTypes.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-settings-3-line text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أنواع منتجات</h3>
          <p className="text-gray-600 mb-4">لم يتم إنشاء أي أنواع منتجات بعد</p>
          <Link
            href="/admin/products/types/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إنشاء نوع منتج جديد
          </Link>
        </div>
      )}
    </div>
  );
} 