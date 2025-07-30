'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategoryService } from '../../../../lib/products';
import { Category } from '../../../../lib/products/types';

interface CategoryFormData {
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  parent?: string;
  icon: string;
  image?: File | null;
  display_order: number;
  meta_title: {
    ar: string;
    en: string;
  };
  meta_description: {
    ar: string;
    en: string;
  };
  is_active: boolean;
}

export default function CreateCategoryPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    parent: '',
    icon: 'ri-folder-line',
    image: null,
    display_order: 0,
    meta_title: { ar: '', en: '' },
    meta_description: { ar: '', en: '' },
    is_active: true
  });

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

  const handleInputChange = (field: string, value: any, lang?: string) => {
    setFormData(prev => {
      if (lang) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof CategoryFormData],
            [lang]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.ar && !formData.name.en) {
      errors.push('يجب إدخال اسم الفئة باللغة العربية أو الإنجليزية');
    }

    if (formData.name.ar && formData.name.ar.length < 2) {
      errors.push('اسم الفئة باللغة العربية يجب أن يكون أكثر من حرفين');
    }

    if (formData.name.en && formData.name.en.length < 2) {
      errors.push('اسم الفئة باللغة الإنجليزية يجب أن يكون أكثر من حرفين');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const categoryData = {
        name: {
          ar: formData.name.ar || '',
          en: formData.name.en || ''
        },
        description: {
          ar: formData.description.ar || '',
          en: formData.description.en || ''
        },
        parent: formData.parent || null,
        icon: formData.icon,
        display_order: formData.display_order,
        meta_title: {
          ar: formData.meta_title.ar || '',
          en: formData.meta_title.en || ''
        },
        meta_description: {
          ar: formData.meta_description.ar || '',
          en: formData.meta_description.en || ''
        },
        is_active: formData.is_active
      };

      const response = await CategoryService.createCategory(categoryData);
      
      if (response?.id) {
        router.push(`/admin/categories/${response.id}/edit`);
      } else {
        router.push('/admin/categories');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setError(`فشل في إنشاء الفئة: ${errorMessage}`);
      console.error('Error creating category:', err);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryName = (category: Category) => {
    if (typeof category.name === 'string') return category.name;
    return category.name?.ar || category.name?.en || 'فئة بدون اسم';
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
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Link
              href="/admin/categories"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 rtl:space-x-reverse"
            >
              <i className="ri-arrow-right-line"></i>
              <span>العودة للفئات</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">إضافة فئة جديدة</h1>
          <p className="text-gray-600 mt-1">إنشاء فئة جديدة في النظام</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href="/admin/categories"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            إلغاء
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
              <h3 className="text-sm font-medium text-red-800">خطأ في إنشاء الفئة</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الفئة (العربية) *
                  </label>
                  <input
                    type="text"
                    value={formData.name.ar}
                    onChange={(e) => handleInputChange('name', e.target.value, 'ar')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم الفئة باللغة العربية"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الفئة (الإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={formData.name.en}
                    onChange={(e) => handleInputChange('name', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم الفئة باللغة الإنجليزية"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة الأب
                  </label>
                  <select
                    value={formData.parent}
                    onChange={(e) => handleInputChange('parent', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">بدون فئة أب</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {getCategoryName(category)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأيقونة
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ri-folder-line"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">الوصف</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (العربية)
                  </label>
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) => handleInputChange('description', e.target.value, 'ar')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل وصف الفئة باللغة العربية"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (الإنجليزية)
                  </label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل وصف الفئة باللغة الإنجليزية"
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">صورة الفئة</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة الفئة
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  يفضل أن تكون الصورة بأبعاد 300x200 بكسل
                </p>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">تحسين محركات البحث (SEO)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان SEO (العربية)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title.ar}
                    onChange={(e) => handleInputChange('meta_title', e.target.value, 'ar')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="عنوان مخصص لمحركات البحث"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان SEO (الإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title.en}
                    onChange={(e) => handleInputChange('meta_title', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Custom SEO title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف SEO (العربية)
                  </label>
                  <textarea
                    value={formData.meta_description.ar}
                    onChange={(e) => handleInputChange('meta_description', e.target.value, 'ar')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وصف مخصص لمحركات البحث"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف SEO (الإنجليزية)
                  </label>
                  <textarea
                    value={formData.meta_description.en}
                    onChange={(e) => handleInputChange('meta_description', e.target.value, 'en')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Custom SEO description"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h2>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  تفعيل الفئة
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات</h3>
            
            <div className="space-y-3">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    <span>حفظ الفئة</span>
                  </>
                )}
              </button>
              
              <Link
                href="/admin/categories"
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-close-line"></i>
                <span>إلغاء</span>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">نصائح</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• استخدم أسماء واضحة ووصفية للفئات</li>
                <li>• اختر أيقونة مناسبة تمثل الفئة</li>
                <li>• اكتب وصف مفصل للفئة</li>
                <li>• استخدم كلمات مفتاحية في عنوان ووصف SEO</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 