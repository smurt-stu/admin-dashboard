'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductTypeService } from '../../../../lib/products';
import { ProductType, ProductTypeStatistics } from '../../../../lib/products/types';

interface ProductTypeWithStats extends ProductType {
  statistics?: ProductTypeStatistics;
}

export default function ProductTypeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productTypeId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState<ProductTypeWithStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (productTypeId) {
      loadProductTypeDetails();
    }
  }, [productTypeId]);

  const loadProductTypeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // تحميل بيانات نوع المنتج
      const productTypeData = await ProductTypeService.getProductType(productTypeId);
      
      // تحميل الإحصائيات
      let statistics = null;
      try {
        statistics = await ProductTypeService.getProductTypeStatistics(productTypeId);
      } catch (statError) {
        console.warn('Could not load statistics:', statError);
      }
      
      setProductType({
        ...productTypeData,
        statistics: statistics || undefined
      });
    } catch (err: any) {
      setError(`فشل في تحميل تفاصيل نوع المنتج: ${err.message}`);
      console.error('Error loading product type details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productType) return;
    
    try {
      await ProductTypeService.deleteProductType(productTypeId);
      router.push('/admin/product-types');
    } catch (err: any) {
      setError(`فشل في حذف نوع المنتج: ${err.message}`);
      console.error('Error deleting product type:', err);
    }
  };

  const getDisplayName = (productType: ProductTypeWithStats) => {
    if (typeof productType.display_name === 'string') return productType.display_name;
    return productType.display_name?.ar || productType.display_name?.en || productType.name;
  };

  const getProductTypeIcon = (productType: ProductTypeWithStats) => {
    if (productType.is_digital) {
      return 'ri-file-text-line';
    }
    if (productType.has_variants) {
      return 'ri-git-branch-line';
    }
    return 'ri-box-line';
  };

  const getProductTypeColor = (productType: ProductTypeWithStats) => {
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

  if (!productType) {
    return (
      <div className="text-center py-12">
        <i className="ri-error-warning-line text-6xl text-red-400 mb-4"></i>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">نوع المنتج غير موجود</h3>
        <p className="text-gray-600 mb-4">نوع المنتج المطلوب غير موجود أو تم حذفه</p>
        <Link
          href="/admin/product-types"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          العودة لأنواع المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Link
              href="/admin/product-types"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 rtl:space-x-reverse"
            >
              <i className="ri-arrow-right-line"></i>
              <span>العودة لأنواع المنتجات</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">تفاصيل نوع المنتج</h1>
          <p className="text-gray-600 mt-1">عرض تفاصيل وإحصائيات نوع المنتج</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href={`/admin/product-types/${productTypeId}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            تعديل
          </Link>
          <Link
            href={`/admin/products?product_type=${productTypeId}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            عرض المنتجات
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-line text-red-400"></i>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-red-800">خطأ</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getProductTypeColor(productType)}`}>
                  <i className={`${getProductTypeIcon(productType)} text-3xl`}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getDisplayName(productType)}
                  </h2>
                  <p className="text-gray-600">{productType.slug}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {productType.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    نشط
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                    غير نشط
                  </span>
                )}
              </div>
            </div>

            {productType.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
                <p className="text-gray-700">{productType.description}</p>
              </div>
            )}

            {/* Product Type Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">خصائص النوع</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <i className={`ri-${productType.is_digital ? 'file-text-line' : 'box-line'} text-blue-600`}></i>
                    <span className="text-sm text-gray-700">
                      {productType.is_digital ? 'منتج رقمي' : 'منتج مادي'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <i className={`ri-${productType.requires_shipping ? 'truck-line' : 'download-line'} text-green-600`}></i>
                    <span className="text-sm text-gray-700">
                      {productType.requires_shipping ? 'يتطلب شحن' : 'لا يتطلب شحن'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <i className={`ri-${productType.track_stock ? 'bar-chart-line' : 'eye-off-line'} text-purple-600`}></i>
                    <span className="text-sm text-gray-700">
                      {productType.track_stock ? 'تتبع المخزون' : 'لا يتتبع المخزون'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <i className={`ri-${productType.has_variants ? 'git-branch-line' : 'git-commit-line'} text-orange-600`}></i>
                    <span className="text-sm text-gray-700">
                      {productType.has_variants ? 'يدعم المتغيرات' : 'لا يدعم المتغيرات'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">الإعدادات</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">الأيقونة:</span>
                    <span className="text-sm font-medium">{productType.icon || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">اللون:</span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: productType.color }}
                      ></div>
                      <span className="text-sm font-medium">{productType.color}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">قالب العرض:</span>
                    <span className="text-sm font-medium">{productType.template_name || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ترتيب العرض:</span>
                    <span className="text-sm font-medium">{productType.display_order || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          {productType.settings?.custom_fields && productType.settings.custom_fields.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الحقول المخصصة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productType.settings.custom_fields.map((field: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {field.type}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>اسم الحقل:</span>
                        <span className="font-medium">{field.name}</span>
                      </div>
                      
                      {field.required && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <i className="ri-check-line text-green-600"></i>
                          <span>مطلوب</span>
                        </div>
                      )}
                      
                      {field.searchable && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <i className="ri-search-line text-blue-600"></i>
                          <span>قابل للبحث</span>
                        </div>
                      )}
                      
                      {field.filterable && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <i className="ri-filter-line text-purple-600"></i>
                          <span>قابل للفلترة</span>
                        </div>
                      )}
                      
                      {field.type === 'select' && field.options && field.options.length > 0 && (
                        <div>
                          <span className="block mb-1">الخيارات:</span>
                          <div className="flex flex-wrap gap-1">
                            {field.options.map((option: string, optionIndex: number) => (
                              <span
                                key={optionIndex}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          {productType.statistics && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {productType.statistics.total_products || 0}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المنتجات</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {productType.statistics.active_products || 0}
                  </div>
                  <div className="text-sm text-gray-600">المنتجات النشطة</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {productType.statistics.total_revenue || 0}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي الإيرادات</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
            
            <div className="space-y-3">
              <Link
                href={`/admin/product-types/${productTypeId}/edit`}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-edit-line"></i>
                <span>تعديل نوع المنتج</span>
              </Link>
              
              <Link
                href={`/admin/products/create?product_type=${productTypeId}`}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-add-line"></i>
                <span>إضافة منتج جديد</span>
              </Link>
              
              <Link
                href={`/admin/products?product_type=${productTypeId}`}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-list-check"></i>
                <span>عرض جميع المنتجات</span>
              </Link>
            </div>
          </div>

          {/* Product Type Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات نوع المنتج</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الاسم:</span>
                <span className="font-medium">{productType.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">الحالة:</span>
                <span className={`font-medium ${productType.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {productType.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">عدد المنتجات:</span>
                <span className="font-medium">{productType.products_count || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الإنشاء:</span>
                <span className="font-medium">
                  {productType.created_at ? new Date(productType.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">آخر تحديث:</span>
                <span className="font-medium">
                  {productType.updated_at ? new Date(productType.updated_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                </span>
              </div>
            </div>
          </div>

          {/* Settings Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الإعدادات</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.is_digital ? 'file-text-line' : 'box-line'} text-blue-600`}></i>
                <span>{productType.is_digital ? 'منتج رقمي' : 'منتج مادي'}</span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.requires_shipping ? 'truck-line' : 'download-line'} text-green-600`}></i>
                <span>{productType.requires_shipping ? 'يتطلب شحن' : 'لا يتطلب شحن'}</span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.track_stock ? 'bar-chart-line' : 'eye-off-line'} text-purple-600`}></i>
                <span>{productType.track_stock ? 'تتبع المخزون' : 'لا يتتبع المخزون'}</span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${productType.has_variants ? 'git-branch-line' : 'git-commit-line'} text-orange-600`}></i>
                <span>{productType.has_variants ? 'يدعم المتغيرات' : 'لا يدعم المتغيرات'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <i className="ri-error-warning-line text-red-500 text-2xl"></i>
              <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
            </div>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف نوع المنتج "{getDisplayName(productType)}"؟ 
              هذا الإجراء لا يمكن التراجع عنه وستتم إزالة جميع المنتجات المرتبطة.
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 