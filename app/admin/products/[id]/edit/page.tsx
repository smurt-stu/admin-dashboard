'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductService, Product, Category } from '../../../../../lib/productService';

interface ProductFormData {
  title: string; // Changed from { ar: string; en: string } to string
  slug: string;
  category: string;
  price: string;
  product_type: string;
  main_image: string;
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    slug: '',
    category: '',
    price: '',
    product_type: '',
    main_image: '',
    in_stock: true,
    is_featured: false,
    is_bestseller: false
  });

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadCategories();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await ProductService.getProduct(productId);
      setProduct(productData);
      setFormData({
        title: productData.title || '', // Updated to use string directly
        slug: productData.slug || '',
        category: productData.category || '',
        price: productData.price || '',
        product_type: productData.product_type || '',
        main_image: productData.main_image || '',
        in_stock: productData.in_stock || false,
        is_featured: productData.is_featured || false,
        is_bestseller: productData.is_bestseller || false,
      });
      setError(null);
    } catch (err) {
      setError('فشل في تحميل المنتج');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await ProductService.getCategories({ is_active: true });
      setCategories(response?.results || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await ProductService.updateProduct(productId, formData);
      router.push(`/admin/products/${productId}`);
    } catch (err) {
      alert('فشل في حفظ التغييرات');
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (lang: 'ar' | 'en', value: string) => {
    // Since title is now a single string, we'll use the Arabic value as the main title
    if (lang === 'ar') {
      handleInputChange('title', value);
    }
    // For English, we could store it separately if needed, but for now we'll use Arabic as primary
    
    // Generate slug from Arabic title if it exists
    if (lang === 'ar' && value) {
      const slug = generateSlug(value);
      handleInputChange('slug', slug);
    }
  };

  const getCategoryDisplayName = (category: Category) => {
    return category.name || 'بدون اسم';
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

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-4">{error || 'المنتج غير موجود'}</p>
          <div className="flex space-x-3 rtl:space-x-reverse justify-center">
            <button
              onClick={loadProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
            <Link
              href="/admin/products"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              العودة للمنتجات
            </Link>
          </div>
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
              href={`/admin/products/${productId}`}
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 rtl:space-x-reverse"
            >
              <i className="ri-arrow-right-line"></i>
              <span>العودة لتفاصيل المنتج</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">تعديل المنتج</h1>
          <p className="text-gray-600 mt-1">ID: {product.id}</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href={`/admin/products/${productId}`}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            إلغاء
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم بالعربية *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange('ar', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل اسم المنتج بالعربية"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم بالإنجليزية
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange('en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product name in English"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الرابط المختصر *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="product-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    سيتم استخدام هذا الرابط في عنوان URL للمنتج
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التصنيف *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">اختر التصنيف</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {getCategoryDisplayName(category)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع المنتج
                    </label>
                    <input
                      type="text"
                      value={formData.product_type}
                      onChange={(e) => handleInputChange('product_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: إلكترونيات، ملابس، إكسسوارات"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">التسعير</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
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
            </div>

            {/* Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">صورة المنتج</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رابط الصورة
                </label>
                <input
                  type="url"
                  value={formData.main_image}
                  onChange={(e) => handleInputChange('main_image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.main_image && (
                  <div className="mt-3">
                    <img
                      src={formData.main_image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Features */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الحالة والمميزات</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.in_stock}
                      onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm font-medium text-gray-700">متوفر في المخزون</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm font-medium text-gray-700">منتج مميز</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_bestseller}
                      onChange={(e) => handleInputChange('is_bestseller', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm font-medium text-gray-700">منتج مبيعات عالية</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <i className="ri-save-line"></i>
                  <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
                
                <Link
                  href={`/admin/products/${productId}`}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <i className="ri-close-line"></i>
                  <span>إلغاء</span>
                </Link>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة سريعة</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <p className="text-sm text-gray-900">
                    {formData.title || 'غير محدد'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                  <p className="text-sm font-semibold text-blue-600">
                    {formData.price ? `${formData.price} د.ك` : 'غير محدد'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      formData.in_stock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {formData.in_stock ? 'متوفر' : 'نفد المخزون'}
                    </span>
                    {formData.is_featured && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        مميز
                      </span>
                    )}
                    {formData.is_bestseller && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        مبيعات عالية
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 