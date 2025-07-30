'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductService, CategoryService, Product, Category } from '../../../../lib/productService';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

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
      const response = await CategoryService.getCategories({ is_active: true });
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

  const getProductTitle = (title: any) => {
    if (typeof title === 'string') {
      return title || 'بدون عنوان';
    }
    return title?.ar || title?.en || 'بدون عنوان';
  };

  const getCategoryDisplayName = (category: Category) => {
    if (typeof category.name === 'string') {
      return category.name;
    }
    return category.name?.ar || category.name?.en || 'بدون اسم';
  };

  const getCustomFieldValue = (field: any) => {
    if (field.field_value) {
      if (typeof field.field_value === 'string') {
        return field.field_value;
      }
      return field.field_value.ar || field.field_value.en || '';
    }
    return '';
  };

  // Fix multilingual field display
  const displayMultilingual = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val.ar || val.en || '';
    return '';
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

  const tabs = [
    { id: 'basic', name: 'المعلومات الأساسية', icon: 'ri-information-line' },
    { id: 'pricing', name: 'التسعير والمخزون', icon: 'ri-money-dollar-circle-line' },
    { id: 'variants', name: 'المتغيرات', icon: 'ri-git-branch-line' },
    { id: 'images', name: 'الصور', icon: 'ri-image-line' },
    { id: 'custom-fields', name: 'الحقول المخصصة', icon: 'ri-settings-3-line' },
    { id: 'marketing', name: 'التسويق وSEO', icon: 'ri-marketing-line' }
  ];

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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 rtl:space-x-reverse px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 rtl:space-x-reverse ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
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
                        <p className="text-gray-900">{displayMultilingual(product.title)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزية</label>
                        <p className="text-gray-900">{displayMultilingual(product.title)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الرابط المختصر</label>
                        <p className="text-gray-900 font-mono text-sm">{product.slug}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                        <p className="text-gray-900">{displayMultilingual(product.category?.name)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نوع المنتج</label>
                        <p className="text-gray-900">{displayMultilingual(product.product_type?.display_name)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <p className="text-gray-900 font-mono text-sm">{product.sku || 'غير محدد'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الماركة</label>
                        <p className="text-gray-900">{product.brand || 'غير محدد'}</p>
                      </div>
                                              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف القصير</label>
                          <p className="text-gray-900">{displayMultilingual(product.short_description)}</p>
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">في العرض</label>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            (product as any).is_on_sale 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <i className="ri-fire-fill ml-1"></i>
                            {(product as any).is_on_sale ? 'نعم' : 'لا'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">نشط</label>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            (product as any).is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <i className={`ri-${(product as any).is_active ? 'check' : 'close'}-line ml-1`}></i>
                            {(product as any).is_active ? 'نعم' : 'لا'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {(product as any).tags_list && (product as any).tags_list.length > 0 && (
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">العلامات</h3>
                        <div className="flex flex-wrap gap-2">
                          {(product as any).tags_list.map((tag: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pricing Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">التسعير</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأساسي</label>
                      <p className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">السعر الفعال</label>
                      <p className="text-xl font-semibold text-green-600">
                        {formatPrice(product.effective_price?.toString() || product.price)}
                      </p>
                    </div>
                    {product.compare_price && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">سعر المقارنة</label>
                        <p className="text-lg text-gray-500 line-through">{formatPrice(product.compare_price)}</p>
                      </div>
                    )}
                                         {(product as any).savings_amount && (product as any).savings_amount > 0 && (
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">التوفير</label>
                         <p className="text-lg font-semibold text-green-600">{formatPrice((product as any).savings_amount.toString())}</p>
                       </div>
                     )}
                    {product.discount_percentage && product.discount_percentage > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم</label>
                        <p className="text-lg font-semibold text-red-600">{product.discount_percentage}%</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">المخزون</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المتوفرة</label>
                      <p className="text-2xl font-bold text-gray-900">{product.stock_quantity || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تنبيه المخزون الأدنى</label>
                      <p className="text-lg text-gray-900">{product.min_stock_alert || 5}</p>
                    </div>
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
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الشحن</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">نوع المنتج</label>
                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                       (product as any).is_digital 
                         ? 'bg-purple-100 text-purple-800' 
                         : 'bg-blue-100 text-blue-800'
                     }`}>
                       <i className={`ri-${(product as any).is_digital ? 'file-text' : 'box'}-line ml-1`}></i>
                       {(product as any).is_digital ? 'رقمي' : 'مادي'}
                     </span>
                   </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">يتطلب شحن</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      product.requires_shipping 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <i className={`ri-${product.requires_shipping ? 'truck' : 'download'}-line ml-1`}></i>
                      {product.requires_shipping ? 'نعم' : 'لا'}
                    </span>
                  </div>
                  {product.weight && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الوزن</label>
                      <p className="text-gray-900">{product.weight} كجم</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              {product.variants && product.variants.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">المتغيرات ({product.variants.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المتغير</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الخيارات</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخزون</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {product.variants.map((variant) => (
                          <tr key={variant.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {variant.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                              {variant.sku}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {variant.options && Object.entries(variant.options).map(([key, value]) => (
                                <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-1">
                                  {key}: {value}
                                </span>
                              ))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="font-semibold text-blue-600">{formatPrice(variant.effective_price?.toString() || '0')}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {variant.stock_quantity || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                variant.is_in_stock 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {variant.is_in_stock ? 'متوفر' : 'غير متوفر'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <i className="ri-git-branch-line text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد متغيرات</h3>
                  <p className="text-gray-600">هذا المنتج لا يحتوي على متغيرات</p>
                </div>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {product.images && product.images.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">معرض الصور ({product.images.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={(image as any).image_url ? (image as any).image_url : image.image}
                          alt={displayMultilingual((image as any).alt_text) || 'صورة المنتج'}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                            <p className="text-sm font-medium">{image.caption}</p>
                            <p className="text-xs">{image.image_type}</p>
                          </div>
                        </div>
                        {image.is_primary && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                              رئيسية
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <i className="ri-image-line text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد صور</h3>
                  <p className="text-gray-600">لم يتم إضافة صور لهذا المنتج</p>
                </div>
              )}
            </div>
          )}

          {/* Custom Fields Tab */}
          {activeTab === 'custom-fields' && (
            <div className="space-y-6">
              {((product as any).custom_fields && (product as any).custom_fields.length > 0) ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">الحقول المخصصة {((product as any).custom_fields.length)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(product as any).custom_fields.map((field: any, idx: number) => {
                      // تحسين عرض القيمة
                      let fieldValue = String(displayMultilingual(field.field_value) || '');
                      let fieldLabel = String(displayMultilingual(field.label) || '');
                      
                      // إذا كانت القيمة كائن JSON، نحاول استخراج القيمة العربية
                      if (typeof field.field_value === 'object' && field.field_value !== null) {
                        if (field.field_value.ar) {
                          fieldValue = field.field_value.ar;
                        } else if (field.field_value.en) {
                          fieldValue = field.field_value.en;
                        } else {
                          fieldValue = JSON.stringify(field.field_value);
                        }
                      }
                      
                      return (
                        <div key={field.id || idx} className="bg-gray-50 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">{fieldLabel}</label>
                          <p className="text-gray-900">{fieldValue}</p>
                          {typeof field.field_value === 'object' && field.field_value !== null && 
                           field.field_value.ar && field.field_value.en && 
                           field.field_value.ar !== field.field_value.en && (
                            <p className="text-xs text-gray-500 mt-1">
                              الإنجليزية: {String(field.field_value.en || '')}
                            </p>
                          )}
                          <div className="mt-2 flex items-center space-x-2 rtl:space-x-reverse text-xs text-gray-500">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${field.is_searchable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{field.is_searchable ? 'قابل للبحث' : 'غير قابل للبحث'}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${field.is_filterable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{field.is_filterable ? 'قابل للتصفية' : 'غير قابل للتصفية'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <i className="ri-settings-3-line text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد حقول مخصصة</h3>
                  <p className="text-gray-600">لم يتم إضافة حقول مخصصة لهذا المنتج</p>
                </div>
              )}
            </div>
          )}

          {/* Marketing Tab */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SEO Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">تحسين محركات البحث</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الصفحة</label>
                      <p className="text-gray-900">{String(displayMultilingual(product.meta_title) || '')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">وصف الصفحة</label>
                      <p className="text-gray-900">{String(displayMultilingual(product.meta_description) || '')}</p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
                  <div className="space-y-4">
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
                        {new Date(product.updated_at).toLocaleDateString('ar-SA', {
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
          )}
        </div>
      </div>
    </div>
  );
} 