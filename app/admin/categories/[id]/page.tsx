'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategoryService } from '../../../../lib/products';
import { Category } from '../../../../lib/products/types';

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoryData = await CategoryService.getCategory(categoryId);
      setCategory(categoryData);
    } catch (err) {
      setError('فشل في تحميل بيانات الفئة');
      console.error('Error loading category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    
    try {
      await CategoryService.deleteCategory(category.id);
      router.push('/admin/categories');
    } catch (err) {
      setError('فشل في حذف الفئة');
      console.error('Error deleting category:', err);
    }
  };

  const handleToggleActive = async () => {
    if (!category) return;
    
    try {
      await CategoryService.updateCategory(category.id, {
        is_active: !category.is_active
      });
      await loadCategory();
    } catch (err) {
      setError('فشل في تحديث حالة الفئة');
      console.error('Error updating category status:', err);
    }
  };

  const getCategoryName = (category: Category) => {
    if (typeof category.name === 'string') return category.name;
    return category.name?.ar || category.name?.en || 'فئة بدون اسم';
  };

  const getCategoryDescription = (category: Category) => {
    if (typeof category.description === 'string') return category.description;
    return category.description?.ar || category.description?.en || '';
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

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">فئة غير موجودة</h2>
          <p className="text-gray-600 mb-4">الفئة المطلوبة غير موجودة أو تم حذفها</p>
          <Link
            href="/admin/categories"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة للفئات
          </Link>
        </div>
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
              href="/admin/categories"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 rtl:space-x-reverse"
            >
              <i className="ri-arrow-right-line"></i>
              <span>العودة للفئات</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">تفاصيل الفئة</h1>
          <p className="text-gray-600 mt-1">{getCategoryName(category)}</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-edit-line"></i>
            <span>تعديل</span>
          </Link>
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
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i className={`${category.icon || 'ri-folder-line'} text-blue-600 text-2xl`}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{getCategoryName(category)}</h2>
                  <p className="text-gray-600">{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {category.is_active ? (
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

            {getCategoryDescription(category) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
                <p className="text-gray-700">{getCategoryDescription(category)}</p>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{category.products_count || 0}</div>
                <div className="text-sm text-blue-600">المنتجات</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{category.display_order || 0}</div>
                <div className="text-sm text-green-600">ترتيب العرض</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {category.children?.length || 0}
                </div>
                <div className="text-sm text-purple-600">الفئات الفرعية</div>
              </div>
                             <div className="bg-orange-50 p-4 rounded-lg text-center">
                 <div className="text-2xl font-bold text-orange-600">
                   {category.children?.length || 0}
                 </div>
                 <div className="text-sm text-orange-600">الفئات الفرعية</div>
               </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات SEO</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان SEO (العربية)</label>
                <p className="text-gray-900">{category.meta_title?.ar || 'غير محدد'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان SEO (الإنجليزية)</label>
                <p className="text-gray-900">{category.meta_title?.en || 'غير محدد'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف SEO (العربية)</label>
                <p className="text-gray-900">{category.meta_description?.ar || 'غير محدد'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف SEO (الإنجليزية)</label>
                <p className="text-gray-900">{category.meta_description?.en || 'غير محدد'}</p>
              </div>
            </div>
          </div>

          {/* Parent Category */}
          {category.parent && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الفئة الأب</h3>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <i className={`${category.parent.icon || 'ri-folder-line'} text-gray-600`}></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{getCategoryName(category.parent)}</p>
                  <p className="text-sm text-gray-600">{category.parent.slug}</p>
                </div>
              </div>
            </div>
          )}

          {/* Subcategories */}
          {category.children && category.children.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الفئات الفرعية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.children.map((child) => (
                  <div key={child.id} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <i className={`${child.icon || 'ri-folder-line'} text-blue-600 text-sm`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{getCategoryName(child)}</p>
                      <p className="text-sm text-gray-600">{child.products_count || 0} منتج</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات</h3>
            
            <div className="space-y-3">
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-edit-line"></i>
                <span>تعديل الفئة</span>
              </Link>
              
              <Link
                href={`/admin/products?category=${category.id}`}
                className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-box-line"></i>
                <span>عرض المنتجات</span>
              </Link>
              
              <button
                onClick={handleToggleActive}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 rtl:space-x-reverse ${
                  category.is_active 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <i className={`ri-${category.is_active ? 'eye-off' : 'eye'}-line`}></i>
                <span>{category.is_active ? 'إلغاء التفعيل' : 'تفعيل'}</span>
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-delete-bin-line"></i>
                <span>حذف الفئة</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">معلومات إضافية</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>تاريخ الإنشاء:</span>
                  <span>{category.created_at ? new Date(category.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span>آخر تحديث:</span>
                  <span>{category.updated_at ? new Date(category.updated_at).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span>الأيقونة:</span>
                  <span className="text-blue-600">{category.icon || 'ri-folder-line'}</span>
                </div>
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
              هل أنت متأكد من حذف الفئة "{getCategoryName(category)}"؟ 
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