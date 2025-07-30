'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductTypeService } from '../../../lib/products';
import { ProductType } from '../../../lib/products/types';

interface ProductTypeWithStats extends Omit<ProductType, 'products_count'> {
  products_count?: number;
  is_active?: boolean;
}

export default function ProductTypesManagementPage() {
  const [productTypes, setProductTypes] = useState<ProductTypeWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<ProductTypeWithStats | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<string>('display_order');

  useEffect(() => {
    loadProductTypes();
  }, []);

  const loadProductTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // تحميل جميع أنواع المنتجات مع الإحصائيات
      const response = await ProductTypeService.getProductTypesWithStatistics();
      setProductTypes(response.results || response);
    } catch (err) {
      setError('فشل في تحميل أنواع المنتجات');
      console.error('Error loading product types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productType: ProductTypeWithStats) => {
    setSelectedProductType(productType);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProductType) return;
    
    try {
      await ProductTypeService.deleteProductType(selectedProductType.id);
      await loadProductTypes();
      setShowDeleteModal(false);
      setSelectedProductType(null);
    } catch (err) {
      setError('فشل في حذف نوع المنتج');
      console.error('Error deleting product type:', err);
    }
  };

  const filteredProductTypes = productTypes
    .filter(productType => {
      const matchesSearch = 
        productType.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productType.display_name?.ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productType.display_name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productType.slug?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterActive === null || productType.is_active === filterActive;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'display_order':
          return (a.display_order || 0) - (b.display_order || 0);
        case 'products_count':
          return (b.products_count || 0) - (a.products_count || 0);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

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

  const getDisplayName = (productType: ProductTypeWithStats) => {
    if (typeof productType.display_name === 'string') return productType.display_name;
    return productType.display_name?.ar || productType.display_name?.en || productType.name;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إدارة أنواع المنتجات</h1>
          <p className="text-gray-600 mt-1">إدارة أنواع المنتجات والحقول المخصصة</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href="/admin/product-types/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-add-line"></i>
            <span>إضافة نوع منتج جديد</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 rtl:md:space-x-reverse">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="البحث في أنواع المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <select
              value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterActive(value === 'all' ? null : value === 'active');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الأنواع</option>
              <option value="active">النشطة فقط</option>
              <option value="inactive">غير النشطة فقط</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="display_order">ترتيب العرض</option>
              <option value="name">الاسم</option>
              <option value="products_count">عدد المنتجات</option>
              <option value="created_at">تاريخ الإنشاء</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-600">
              {filteredProductTypes.length} نوع منتج
            </span>
          </div>
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

      {/* Product Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductTypes.map((productType) => (
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
                    {getDisplayName(productType)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {productType.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {productType.is_active ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    نشط
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    غير نشط
                  </span>
                )}
              </div>
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
                  {productType.settings.custom_fields.slice(0, 3).map((field: any) => (
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
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-semibold text-lg text-blue-600">{productType.products_count || 0}</div>
                  <div className="text-xs">المنتجات</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-green-600">{productType.display_order || 0}</div>
                  <div className="text-xs">ترتيب العرض</div>
                </div>
              </div>
              
              {productType.created_at && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  أنشئ في: {new Date(productType.created_at).toLocaleDateString('ar-SA')}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-2 rtl:space-x-reverse">
              <Link
                href={`/admin/product-types/${productType.id}`}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm text-center"
                title="عرض التفاصيل"
              >
                <i className="ri-eye-line ml-1"></i>
                تفاصيل
              </Link>
              <Link
                href={`/admin/product-types/${productType.id}/edit`}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm text-center"
                title="تعديل نوع المنتج"
              >
                <i className="ri-edit-line ml-1"></i>
                تعديل
              </Link>
              <Link
                href={`/admin/products?product_type=${productType.id}`}
                className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 text-sm text-center"
                title="عرض المنتجات"
              >
                <i className="ri-list-check ml-1"></i>
                المنتجات
              </Link>
              <button
                onClick={() => handleDelete(productType)}
                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-sm text-center"
                title="حذف نوع المنتج"
              >
                <i className="ri-delete-bin-line ml-1"></i>
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProductTypes.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-settings-3-line text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'لا توجد نتائج' : 'لا توجد أنواع منتجات'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'جرب البحث بكلمات مختلفة' 
              : 'لم يتم إنشاء أي أنواع منتجات بعد'
            }
          </p>
          {!searchTerm && (
            <Link
              href="/admin/product-types/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              إنشاء نوع منتج جديد
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProductType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <i className="ri-error-warning-line text-red-500 text-2xl"></i>
              <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
            </div>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف نوع المنتج "{getDisplayName(selectedProductType)}"؟ 
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
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