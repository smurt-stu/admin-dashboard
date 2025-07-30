'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CategoryService } from '../../../lib/products';
import { Category } from '../../../lib/products/types';

interface CategoryWithStats extends Omit<Category, 'name' | 'description'> {
  name: string | {
    ar: string;
    en: string;
  };
  description?: string | {
    ar: string;
    en: string;
  };
  products_count?: number;
  children_count?: number;
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithStats | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getCategories({ is_active: true });
      setCategories(response?.results || []);
    } catch (err) {
      setError('فشل في تحميل الفئات');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: CategoryWithStats) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await CategoryService.deleteCategory(selectedCategory.id);
      await loadCategories();
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      setError('فشل في حذف الفئة');
      console.error('Error deleting category:', err);
    }
  };

  const handleToggleActive = async (category: CategoryWithStats) => {
    try {
      await CategoryService.updateCategory(category.id, {
        is_active: !category.is_active
      });
      await loadCategories();
    } catch (err) {
      setError('فشل في تحديث حالة الفئة');
      console.error('Error updating category status:', err);
    }
  };

  const handleViewCategory = (category: CategoryWithStats) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const filteredCategories = categories.filter(category => 
    category.name?.ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: CategoryWithStats) => {
    return category.icon || 'ri-folder-line';
  };

  const getCategoryName = (category: CategoryWithStats) => {
    if (typeof category.name === 'string') return category.name;
    return category.name?.ar || category.name?.en || 'فئة بدون اسم';
  };

  const getCategoryDescription = (category: CategoryWithStats) => {
    if (typeof category.description === 'string') return category.description;
    return category.description?.ar || category.description?.en || '';
  };

  const getCategoryNameAr = (category: CategoryWithStats) => {
    if (typeof category.name === 'string') return category.name;
    return category.name?.ar || 'غير محدد';
  };

  const getCategoryNameEn = (category: CategoryWithStats) => {
    if (typeof category.name === 'string') return category.name;
    return category.name?.en || 'غير محدد';
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
          <h1 className="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
          <p className="text-gray-600 mt-1">إدارة فئات المنتجات والتصنيفات</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href="/admin/categories/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-add-line"></i>
            <span>إضافة فئة جديدة</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex space-x-4 rtl:space-x-reverse">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="البحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-600">
              {filteredCategories.length} فئة
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i className={`${getCategoryIcon(category)} text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getCategoryName(category)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {category.is_active ? (
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

            {getCategoryDescription(category) && (
              <p className="text-gray-600 text-sm mb-4">{getCategoryDescription(category)}</p>
            )}

            {/* Category Stats */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">عدد المنتجات:</span>
                <span className="font-medium">{category.products_count || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">الفئات الفرعية:</span>
                <span className="font-medium">{category.children_count || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">ترتيب العرض:</span>
                <span className="font-medium">{category.display_order || 0}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleViewCategory(category)}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 text-sm text-center"
                title="عرض التفاصيل"
              >
                <i className="ri-eye-line ml-1"></i>
                عرض
              </button>
              
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm text-center"
                title="تعديل الفئة"
              >
                <i className="ri-edit-line ml-1"></i>
                تعديل
              </Link>
              
              <Link
                href={`/admin/products?category=${category.id}`}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm text-center"
                title="عرض منتجات الفئة"
              >
                <i className="ri-box-line ml-1"></i>
                المنتجات
              </Link>
              
              <button
                onClick={() => handleToggleActive(category)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm text-center ${
                  category.is_active 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
                title={category.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
              >
                <i className={`ri-${category.is_active ? 'eye-off' : 'eye'}-line ml-1`}></i>
                {category.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
              </button>
              
              <button
                onClick={() => handleDelete(category)}
                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-sm text-center"
                title="حذف الفئة"
              >
                <i className="ri-delete-bin-line ml-1"></i>
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-folder-line text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'لا توجد نتائج' : 'لا توجد فئات'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'جرب البحث بكلمات مختلفة' 
              : 'لم يتم إنشاء أي فئات بعد'
            }
          </p>
          {!searchTerm && (
            <Link
              href="/admin/categories/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              إنشاء فئة جديدة
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <i className="ri-error-warning-line text-red-500 text-2xl"></i>
              <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
            </div>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف الفئة "{getCategoryName(selectedCategory)}"؟ 
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

      {/* View Category Details Modal */}
      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i className={`${getCategoryIcon(selectedCategory)} text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    تفاصيل الفئة
                  </h3>
                  <p className="text-gray-600">{getCategoryName(selectedCategory)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">المعلومات الأساسية</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم (العربية)</label>
                  <p className="text-gray-900">{getCategoryNameAr(selectedCategory)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم (الإنجليزية)</label>
                  <p className="text-gray-900">{getCategoryNameEn(selectedCategory)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الرابط</label>
                  <p className="text-gray-900">{selectedCategory.slug}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الأيقونة</label>
                  <p className="text-gray-900">{selectedCategory.icon || 'غير محدد'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب العرض</label>
                  <p className="text-gray-900">{selectedCategory.display_order || 0}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    selectedCategory.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCategory.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">الإحصائيات</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <i className="ri-box-line text-blue-600 text-xl ml-2"></i>
                      <div>
                        <p className="text-sm text-blue-600">عدد المنتجات</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedCategory.products_count || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <i className="ri-folder-line text-green-600 text-xl ml-2"></i>
                      <div>
                        <p className="text-sm text-green-600">الفئات الفرعية</p>
                        <p className="text-2xl font-bold text-green-900">{selectedCategory.children_count || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCategory.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <p className="text-gray-900 text-sm">{getCategoryDescription(selectedCategory)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 rtl:space-x-reverse mt-6 pt-6 border-t border-gray-200">
              <Link
                href={`/admin/categories/${selectedCategory.id}/edit`}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
              >
                <i className="ri-edit-line ml-1"></i>
                تعديل الفئة
              </Link>
              
              <Link
                href={`/admin/products?category=${selectedCategory.id}`}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-center"
              >
                <i className="ri-box-line ml-1"></i>
                عرض المنتجات
              </Link>
              
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-center"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 