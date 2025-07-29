'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductService, Product, Category } from '../../../../lib/productService';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadCategories();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProduct(productId);
      setProduct(response || null);
      setError(null);
    } catch (err) {
      setError('فشل في تحميل تفاصيل المنتج');
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

  const handleDelete = async () => {
    if (!product) return;
    
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        setDeleting(true);
        await ProductService.deleteProduct(product.id);
        router.push('/admin/products');
      } catch (err) {
        alert('فشل في حذف المنتج');
        console.error('Error deleting product:', err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseFloat(price);
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(numericPrice);
  };

  const getProductTitle = (title: string) => {
    return title || 'بدون عنوان';
  };

  const getCategoryName = (categoryName: string) => {
    return categoryName || 'فئة عامة';
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
              href="/admin/products"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 rtl:space-x-reverse"
            >
              <i className="ri-arrow-right-line"></i>
              <span>العودة للمنتجات</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {getProductTitle(product.title)}
          </h1>
          <p className="text-gray-600 mt-1">ID: {product.id}</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-edit-line"></i>
            <span>تعديل المنتج</span>
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-delete-bin-line"></i>
            <span>{deleting ? 'جاري الحذف...' : 'حذف المنتج'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">صورة المنتج</h3>
            {product.main_image ? (
              <div className="relative">
                <img
                  src={product.main_image}
                  alt={getProductTitle(product.title)}
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    الصورة الرئيسية
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <i className="ri-image-line text-6xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">لا توجد صورة</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربية</label>
                <p className="text-gray-900">{product.title || 'غير محدد'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزية</label>
                <p className="text-gray-900">{product.title || 'غير محدد'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرابط المختصر</label>
                <p className="text-gray-900 font-mono text-sm">{product.slug}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                <p className="text-gray-900">{getCategoryName(product.category_name)}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">التسعير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأساسي</label>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر الفعال</label>
                <p className="text-xl font-semibold text-green-600">
                  {new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: 'JOD'
                  }).format(product.effective_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Status & Features */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الحالة والمميزات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">حالة المخزون</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.in_stock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <i className={`ri-${product.in_stock ? 'check' : 'close'}-line ml-1`}></i>
                  {product.in_stock ? 'متوفر' : 'نفد المخزون'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المنتج</label>
                <p className="text-gray-900">{product.product_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مميز</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.is_featured 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <i className="ri-star-fill ml-1"></i>
                  {product.is_featured ? 'نعم' : 'لا'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مبيعات عالية</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.is_bestseller 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <i className="ri-fire-fill ml-1"></i>
                  {product.is_bestseller ? 'نعم' : 'لا'}
                </span>
              </div>
            </div>
          </div>

          {/* Ratings & Reviews */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">التقييمات والمراجعات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التقييم</label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`ri-star-${star <= (product.rating || 0) ? 'fill' : 'line'} text-yellow-400 text-xl`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-900 font-semibold">
                    {product.rating ? product.rating.toFixed(1) : '0.0'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عدد المراجعات</label>
                <p className="text-gray-900">{product.review_count} مراجعة</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الإنشاء</label>
                <p className="text-gray-900">
                  {new Date(product.created_at).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">آخر تحديث</label>
                <p className="text-gray-900">
                  {new Date(product.created_at).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 