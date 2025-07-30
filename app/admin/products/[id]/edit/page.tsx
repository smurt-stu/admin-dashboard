'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductService, CategoryService, ProductTypeService, Product, Category, ProductType } from '../../../../../lib/products';
import { createProductData, validateMultilingualData } from '../../../../../lib/multilingualUtils';
import DynamicFieldsTab from '../../create/components/DynamicFieldsTab';

interface ProductFormData {
  id?: string;
  title: string;
  title_en?: string;
  subtitle?: string;
  subtitle_en?: string;
  description?: string;
  description_en?: string;
  short_description?: string;
  short_description_en?: string;
  slug: string;
  category: string;
  product_type: string;
  sku?: string;
  barcode?: string;
  author?: string;
  isbn?: string;
  language?: string;
  pages_count?: number;
  publication_date?: string;
  brand?: string;
  model_number?: string;
  price: string;
  compare_price?: string;
  cost_price?: string;
  discount_percentage?: number;
  specifications?: {
    ar: string;
    en: string;
  };
  detailed_specifications?: any[];
  cover_image?: string;
  digital_file?: string;
  sample_file?: string;
  main_image: string;
  stock_quantity?: number;
  min_stock_alert?: number;
  max_order_quantity?: number;
  track_stock?: boolean;
  requires_shipping?: boolean;
  weight?: string;
  dimensions?: any;
  warranty_period?: number;
  warranty_type?: string;
  condition?: string;
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival?: boolean;
  is_on_sale?: boolean;
  launch_date?: string;
  tags?: string;
  meta_title?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_en?: string;
  keywords?: string;
  keywords_en?: string;
  custom_fields?: Record<string, any>;
  custom_fields_data?: Record<string, any>;
  images?: any[];
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    subtitle: '',
    description: '',
    short_description: '',
    slug: '',
    category: '',
    product_type: '',
    sku: '',
    barcode: '',
    author: '',
    isbn: '',
    language: '',
    pages_count: undefined,
    publication_date: '',
    brand: '',
    model_number: '',
    price: '',
    compare_price: '',
    cost_price: '',
    discount_percentage: 0,
    specifications: {
      ar: '',
      en: ''
    },
    detailed_specifications: [],
    cover_image: '',
    digital_file: '',
    sample_file: '',
    main_image: '',
    stock_quantity: 0,
    min_stock_alert: 10,
    max_order_quantity: 10,
    track_stock: true,
    requires_shipping: true,
    weight: '',
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    warranty_period: 12,
    warranty_type: '',
    condition: 'new',
    in_stock: true,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    is_on_sale: false,
    launch_date: '',
    tags: '',
    meta_title: '',
    meta_title_en: '',
    meta_description: '',
    meta_description_en: '',
    keywords: '',
    keywords_en: '',
    custom_fields: {},
    custom_fields_data: {},
    images: []
  });

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await ProductService.getProduct(productId);
      setProduct(productData);
      
      // تحويل بيانات المنتج إلى نموذج التحرير
      setFormData({
        id: productData.id || productId,
        title: typeof productData.title === 'string' ? productData.title : productData.title?.ar || '',
        title_en: typeof productData.title === 'object' ? productData.title?.en : '',
        subtitle: productData.subtitle?.ar || '',
        subtitle_en: productData.subtitle?.en || '',
        description: typeof productData.description === 'string' ? productData.description : productData.description?.ar || '',
        description_en: typeof productData.description === 'object' ? productData.description?.en : '',
        short_description: typeof productData.short_description === 'string' ? productData.short_description : productData.short_description?.ar || '',
        short_description_en: typeof productData.short_description === 'object' ? productData.short_description?.en : '',
        slug: productData.slug || '',
        category: typeof productData.category === 'object' ? (productData.category as any)?.id : (productData.category as string) || '',
        product_type: typeof productData.product_type === 'object' ? (productData.product_type as any)?.id : (productData as any).product_type || '',
        sku: productData.sku || '',
        barcode: productData.barcode || '',
        author: productData.author || '',
        isbn: productData.isbn || '',
        language: productData.language || '',
        pages_count: productData.pages_count,
        publication_date: productData.publication_date || '',
        brand: productData.brand || '',
        model_number: productData.model_number || '',
        price: productData.price || '',
        compare_price: productData.compare_price || '',
        cost_price: productData.cost_price || '',
        discount_percentage: productData.discount_percentage || 0,
        specifications: typeof (productData as any).specifications === 'string' 
          ? { ar: (productData as any).specifications, en: '' }
          : (productData as any).specifications || { ar: '', en: '' },
        detailed_specifications: (productData as any).detailed_specifications || [],
        cover_image: productData.cover_image || '',
        digital_file: productData.digital_file || '',
        sample_file: productData.sample_file || '',
        main_image: productData.main_image || '',
        stock_quantity: productData.stock_quantity || 0,
        min_stock_alert: productData.min_stock_alert || 10,
        max_order_quantity: productData.max_order_quantity || 10,
        track_stock: productData.track_stock !== false,
        requires_shipping: productData.requires_shipping !== false,
        weight: productData.weight || '',
        dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
        warranty_period: productData.warranty_period || 12,
        warranty_type: productData.warranty_type || '',
        condition: productData.condition || 'new',
        in_stock: productData.in_stock || false,
        is_featured: productData.is_featured || false,
        is_bestseller: productData.is_bestseller || false,
        is_new_arrival: productData.is_new_arrival || false,
        is_on_sale: productData.is_on_sale || false,
        launch_date: productData.launch_date || '',
        tags: productData.tags || '',
        meta_title: typeof productData.meta_title === 'string' ? productData.meta_title : productData.meta_title?.ar || '',
        meta_title_en: typeof productData.meta_title === 'object' ? productData.meta_title?.en : '',
        meta_description: typeof productData.meta_description === 'string' ? productData.meta_description : productData.meta_description?.ar || '',
        meta_description_en: typeof productData.meta_description === 'object' ? productData.meta_description?.en : '',
        keywords: typeof productData.keywords === 'string' ? productData.keywords : productData.keywords?.ar || '',
        keywords_en: typeof productData.keywords === 'object' ? productData.keywords?.en : '',
        custom_fields: Array.isArray((productData as any).custom_fields) 
          ? (productData as any).custom_fields.reduce((acc: any, field: any) => {
              // تحويل البيانات بشكل صحيح
              const fieldValue = field.field_value;
              if (typeof fieldValue === 'object' && fieldValue !== null) {
                // إذا كانت القيمة كائن (مثل {ar: "رياضي", en: "رياضi"})
                acc[field.field_name || field.name] = fieldValue;
              } else {
                // إذا كانت القيمة نص عادي
                acc[field.field_name || field.name] = fieldValue || '';
              }
              return acc;
            }, {})
          : (productData as any).custom_fields || {},
        custom_fields_data: Array.isArray((productData as any).custom_fields) 
          ? (productData as any).custom_fields.reduce((acc: any, field: any) => {
              // تحويل البيانات بشكل صحيح
              const fieldValue = field.field_value;
              const fieldName = field.field_name || field.name;
              
              if (typeof fieldValue === 'object' && fieldValue !== null) {
                // إذا كانت القيمة كائن (مثل {ar: "رياضي", en: "رياضi"})
                acc[fieldName] = fieldValue;
              } else {
                // إذا كانت القيمة نص عادي
                acc[fieldName] = fieldValue || '';
              }
              
              console.log(`Processing custom field: ${fieldName} =`, fieldValue);
              return acc;
            }, {})
          : (productData as any).custom_fields_data || {},
        images: (productData as any).images || []
      });
      
      // طباعة البيانات للتصحيح
      console.log('Product Data:', productData);
      console.log('Custom Fields from API:', (productData as any).custom_fields);
      console.log('Form Data:', {
        title: typeof productData.title === 'string' ? productData.title : productData.title?.ar || '',
        category: typeof productData.category === 'object' ? (productData.category as any)?.id : (productData.category as string) || '',
        product_type: typeof productData.product_type === 'object' ? (productData.product_type as any)?.id : (productData as any).product_type || '',
        custom_fields_data: formData.custom_fields_data
      });
      
      // التأكد من تحميل أنواع المنتجات والفئات
      try {
        await Promise.all([
          loadCategories(),
          loadProductTypes()
        ]);
      } catch (err) {
        console.error('Error loading categories or product types:', err);
      }
      
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'فشل في تحميل المنتج';
      setError(errorMessage);
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await CategoryService.getCategories({ is_active: true });
      setCategories(response?.results || []);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      // لا نعرض خطأ للمستخدم هنا لأن البيانات الأساسية محملة
    }
  };

  const loadProductTypes = async () => {
    try {
      const response = await ProductTypeService.getProductTypes({ is_active: true });
      setProductTypes(response?.results || []);
    } catch (err: any) {
      console.error('Error loading product types:', err);
      // لا نعرض خطأ للمستخدم هنا لأن البيانات الأساسية محملة
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // التحقق من صحة الحقول المخصصة إذا كانت موجودة
      if (formData.custom_fields_data && Object.keys(formData.custom_fields_data).length > 0) {
        const customFieldErrors: string[] = [];
        
        Object.entries(formData.custom_fields_data).forEach(([fieldName, fieldValue]) => {
          // التحقق من الحقول المطلوبة
          if (typeof fieldValue === 'object' && fieldValue !== null) {
            const fieldObj = fieldValue as any;
            if (fieldObj.required && (!fieldObj.value || fieldObj.value === '')) {
              customFieldErrors.push(`الحقل "${fieldName}" مطلوب`);
            }
            
            // التحقق من صحة البريد الإلكتروني
            if (fieldObj.type === 'email' && fieldObj.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldObj.value)) {
              customFieldErrors.push(`الحقل "${fieldName}" يجب أن يكون بريد إلكتروني صحيح`);
            }
            
            // التحقق من صحة الرابط
            if (fieldObj.type === 'url' && fieldObj.value && !/^https?:\/\/.+/.test(fieldObj.value)) {
              customFieldErrors.push(`الحقل "${fieldName}" يجب أن يكون رابط صحيح`);
            }
            
            // التحقق من صحة الرقم
            if (fieldObj.type === 'number' && fieldObj.value && isNaN(Number(fieldObj.value))) {
              customFieldErrors.push(`الحقل "${fieldName}" يجب أن يكون رقماً`);
            }
          }
        });
        
        if (customFieldErrors.length > 0) {
          setError(`أخطاء في الحقول المخصصة:\n${customFieldErrors.join('\n')}`);
          return;
        }
      }
      
      // Create product data according to API guide
      const productData = createProductData(formData);
      
      // Validate multilingual data
      const validationErrors = validateMultilingualData(productData);
      if (validationErrors.length > 0) {
        setError(`أخطاء في البيانات:\n${validationErrors.join('\n')}`);
        return;
      }
      
      const response = await ProductService.updateProduct(productId, productData as any);
      if (response?.id) {
        router.push(`/admin/products/${response.id}`);
      } else {
        router.push('/admin/products');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setError(`فشل في تحديث المنتج: ${errorMessage}`);
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

  const handleTitleChange = (value: string) => {
    handleInputChange('title', value);
    if (value) {
      const slug = generateSlug(value);
      handleInputChange('slug', slug);
    }
  };

  const getCategoryDisplayName = (category: Category) => {
    if (typeof category.name === 'string') {
      return category.name;
    }
    return category.name?.ar || category.name?.en || 'بدون اسم';
  };

  const getProductTypeDisplayName = (productType: ProductType) => {
    if (typeof productType.display_name === 'string') {
      return productType.display_name;
    }
    return productType.display_name?.ar || productType.display_name?.en || productType.name || 'بدون اسم';
  };

  const tabs = [
    { id: 'basic', name: 'المعلومات الأساسية', icon: 'ri-information-line' },
    { id: 'pricing', name: 'التسعير والمخزون', icon: 'ri-money-dollar-circle-line' },
    { id: 'specifications', name: 'المواصفات والحقول المخصصة', icon: 'ri-settings-3-line' },
    { id: 'variants', name: 'المتغيرات', icon: 'ri-git-branch-line' },
    { id: 'media', name: 'الصور والملفات', icon: 'ri-image-line' },
    { id: 'marketing', name: 'التسويق وSEO', icon: 'ri-marketing-line' }
  ];

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
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center">
            <i className="ri-error-warning-line text-2xl text-red-600 ml-3"></i>
            <div>
              <h4 className="text-lg font-semibold text-red-800">خطأ في التحديث</h4>
              <p className="text-red-700 whitespace-pre-line">{error}</p>
            </div>
          </div>
        </div>
      )}

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
          <p className="text-gray-600 mt-1">تحديث معلومات المنتج</p>
          {product && (
            <p className="text-sm text-gray-500 mt-1">معرف المنتج: {product.id}</p>
          )}
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
          <div className="lg:col-span-2">
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
                              onChange={(e) => handleTitleChange(e.target.value)}
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
                              value={formData.title_en || ''}
                              onChange={(e) => handleInputChange('title_en', e.target.value)}
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
                            <select
                              value={formData.product_type}
                              onChange={(e) => handleInputChange('product_type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            >
                              <option value="">اختر نوع المنتج</option>
                              {productTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                  {getProductTypeDisplayName(type)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              SKU
                            </label>
                            <input
                              type="text"
                              value={formData.sku || ''}
                              onChange={(e) => handleInputChange('sku', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="رمز المنتج"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              الباركود
                            </label>
                            <input
                              type="text"
                              value={formData.barcode || ''}
                              onChange={(e) => handleInputChange('barcode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="باركود المنتج"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              الماركة
                            </label>
                            <input
                              type="text"
                              value={formData.brand || ''}
                              onChange={(e) => handleInputChange('brand', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="اسم الماركة"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              رقم الموديل
                            </label>
                            <input
                              type="text"
                              value={formData.model_number || ''}
                              onChange={(e) => handleInputChange('model_number', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="رقم الموديل"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              المؤلف
                            </label>
                            <input
                              type="text"
                              value={formData.author || ''}
                              onChange={(e) => handleInputChange('author', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="اسم المؤلف"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              رقم ISBN
                            </label>
                            <input
                              type="text"
                              value={formData.isbn || ''}
                              onChange={(e) => handleInputChange('isbn', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="رقم ISBN"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              اللغة
                            </label>
                            <select
                              value={formData.language || 'ar'}
                              onChange={(e) => handleInputChange('language', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="ar">العربية</option>
                              <option value="en">الإنجليزية</option>
                              <option value="fr">الفرنسية</option>
                              <option value="es">الإسبانية</option>
                              <option value="de">الألمانية</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              عدد الصفحات
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.pages_count || ''}
                              onChange={(e) => handleInputChange('pages_count', parseInt(e.target.value) || undefined)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="عدد الصفحات"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            تاريخ النشر
                          </label>
                          <input
                            type="date"
                            value={formData.publication_date || ''}
                            onChange={(e) => handleInputChange('publication_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الوصف القصير
                          </label>
                          <textarea
                            value={formData.short_description || ''}
                            onChange={(e) => handleInputChange('short_description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="وصف مختصر للمنتج"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الوصف الكامل
                          </label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={5}
                            placeholder="وصف تفصيلي للمنتج"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">التسعير</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            السعر الأساسي *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            سعر المقارنة
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.compare_price || ''}
                              onChange={(e) => handleInputChange('compare_price', e.target.value)}
                              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm">د.ك</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            سعر التكلفة
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.cost_price || ''}
                              onChange={(e) => handleInputChange('cost_price', e.target.value)}
                              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm">د.ك</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            نسبة الخصم (%)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={formData.discount_percentage || 0}
                            onChange={(e) => handleInputChange('discount_percentage', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">المخزون</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الكمية المتوفرة
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.stock_quantity || 0}
                            onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            تنبيه المخزون الأدنى
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.min_stock_alert || 10}
                            onChange={(e) => handleInputChange('min_stock_alert', parseInt(e.target.value) || 10)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الحد الأقصى للطلب
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.max_order_quantity || 10}
                            onChange={(e) => handleInputChange('max_order_quantity', parseInt(e.target.value) || 10)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10"
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.track_stock || false}
                            onChange={(e) => handleInputChange('track_stock', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="mr-2 text-sm font-medium text-gray-700">تتبع المخزون</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.requires_shipping || false}
                            onChange={(e) => handleInputChange('requires_shipping', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="mr-2 text-sm font-medium text-gray-700">يتطلب شحن</label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">الشحن والأبعاد</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الوزن (كجم)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.weight || ''}
                            onChange={(e) => handleInputChange('weight', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الطول (سم)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={formData.dimensions?.length || ''}
                            onChange={(e) => handleInputChange('dimensions', {
                              ...formData.dimensions,
                              length: parseFloat(e.target.value) || 0
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            العرض (سم)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={formData.dimensions?.width || ''}
                            onChange={(e) => handleInputChange('dimensions', {
                              ...formData.dimensions,
                              width: parseFloat(e.target.value) || 0
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الارتفاع (سم)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={formData.dimensions?.height || ''}
                            onChange={(e) => handleInputChange('dimensions', {
                              ...formData.dimensions,
                              height: parseFloat(e.target.value) || 0
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">الضمان والحالة</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            مدة الضمان (شهر)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.warranty_period || 12}
                            onChange={(e) => handleInputChange('warranty_period', parseInt(e.target.value) || 12)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="12"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            نوع الضمان
                          </label>
                          <select
                            value={formData.warranty_type || ''}
                            onChange={(e) => handleInputChange('warranty_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">اختر نوع الضمان</option>
                            <option value="manufacturer">ضمان المصنع</option>
                            <option value="seller">ضمان البائع</option>
                            <option value="extended">ضمان ممتد</option>
                            <option value="none">بدون ضمان</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            حالة المنتج
                          </label>
                          <select
                            value={formData.condition || 'new'}
                            onChange={(e) => handleInputChange('condition', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="new">جديد</option>
                            <option value="used">مستعمل</option>
                            <option value="refurbished">معاد تجديده</option>
                            <option value="open_box">مفتوح العبوة</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">المواصفات الأساسية</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            المواصفات بالعربية
                          </label>
                          <textarea
                            value={formData.specifications?.ar || ''}
                            onChange={(e) => handleInputChange('specifications', {
                              ...(formData.specifications || {}),
                              ar: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            placeholder="المواصفات باللغة العربية"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            المواصفات بالإنجليزية
                          </label>
                          <textarea
                            value={formData.specifications?.en || ''}
                            onChange={(e) => handleInputChange('specifications', {
                              ...(formData.specifications || {}),
                              en: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            placeholder="المواصفات باللغة الإنجليزية"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">الحقول المخصصة</h3>
                      <DynamicFieldsTab
                        formData={formData}
                        setFormData={setFormData}
                        selectedProductType={productTypes.find(pt => pt.id === formData.product_type) || null}
                        isEditMode={true}
                      />
                    </div>
                  </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">المتغيرات</h3>
                      <div className="space-y-4">
                        {product.variants && product.variants.length > 0 ? (
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
                                {product.variants.map((variant: any) => (
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
                                          {key}: {String(value)}
                                        </span>
                                      ))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <span className="font-semibold text-blue-600">
                                        {variant.effective_price ? `${variant.effective_price} د.ك` : 'غير محدد'}
                                      </span>
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
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <i className="ri-git-branch-line text-4xl mb-2"></i>
                            <p>لا توجد متغيرات</p>
                            <p className="text-sm">هذا المنتج لا يحتوي على متغيرات</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">الصورة الرئيسية</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          رابط الصورة الرئيسية
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

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">معرض الصور</h3>
                      {formData.images && Array.isArray(formData.images) && formData.images.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {formData.images.map((image: any, index: number) => (
                            <div key={index} className="relative group">
                              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                                <img
                                  src={image.image_url || image.image}
                                  alt={image.caption || 'صورة المنتج'}
                                  className="w-full h-48 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 rtl:space-x-reverse">
                                    <button
                                      onClick={() => {
                                        const newImages = [...(formData.images || [])];
                                        newImages.splice(index, 1);
                                        handleInputChange('images', newImages);
                                      }}
                                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                      title="حذف الصورة"
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {image.caption || 'بدون وصف'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {image.image_url || image.image}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <i className="ri-image-line text-4xl mb-2"></i>
                          <p>لا توجد صور في المعرض</p>
                          <p className="text-sm">الصور ستظهر هنا إذا كانت متوفرة</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">الملفات الرقمية</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الملف الرقمي الرئيسي
                          </label>
                          <input
                            type="url"
                            value={formData.digital_file || ''}
                            onChange={(e) => handleInputChange('digital_file', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/file.pdf"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            رابط الملف الرقمي الذي سيتم بيعه
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ملف العينة
                          </label>
                          <input
                            type="url"
                            value={formData.sample_file || ''}
                            onChange={(e) => handleInputChange('sample_file', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/sample.pdf"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            ملف عينة مجاني للعملاء (اختياري)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Marketing Tab */}
                {activeTab === 'marketing' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">مميزات المنتج</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="mr-2 text-sm font-medium text-gray-700">منتج مميز</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.is_bestseller}
                            onChange={(e) => handleInputChange('is_bestseller', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="mr-2 text-sm font-medium text-gray-700">الأكثر مبيعاً</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.is_on_sale}
                            onChange={(e) => handleInputChange('is_on_sale', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="mr-2 text-sm font-medium text-gray-700">في العرض</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.in_stock}
                            onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="mr-2 text-sm font-medium text-gray-700">متوفر في المخزون</label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">تحسين محركات البحث</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            عنوان Meta
                          </label>
                          <input
                            type="text"
                            value={formData.meta_title || ''}
                            onChange={(e) => handleInputChange('meta_title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="عنوان Meta للمنتج"
                            maxLength={60}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            وصف Meta
                          </label>
                          <textarea
                            value={formData.meta_description || ''}
                            onChange={(e) => handleInputChange('meta_description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="وصف Meta للمنتج"
                            maxLength={160}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            العلامات
                          </label>
                          <input
                            type="text"
                            value={formData.tags || ''}
                            onChange={(e) => handleInputChange('tags', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="علامات مفصولة بفواصل"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الكلمات المفتاحية
                          </label>
                          <input
                            type="text"
                            value={formData.keywords || ''}
                            onChange={(e) => handleInputChange('keywords', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="كلمات مفتاحية مفصولة بفواصل"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            تاريخ الإطلاق
                          </label>
                          <input
                            type="date"
                            value={formData.launch_date || ''}
                            onChange={(e) => handleInputChange('launch_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.is_new_arrival || false}
                            onChange={(e) => handleInputChange('is_new_arrival', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="mr-2 text-sm font-medium text-gray-700">منتج جديد</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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