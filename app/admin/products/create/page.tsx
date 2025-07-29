'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductService, CategoryService, Category } from '../../../../lib/products';
import { createProductData, validateMultilingualData, convertFormDataToAPI } from '../../../../lib/multilingualUtils';
import ProductTabs from './components/ProductTabs';
import BasicInfoTab from './components/BasicInfoTab';
import DescriptionTab from './components/DescriptionTab';
import PricingTab from './components/PricingTab';
import MediaTab from './components/MediaTab';
import MarketingTab from './components/MarketingTab';
import Sidebar from './components/Sidebar';

interface ProductFormData {
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
}

export default function CreateProductPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productTypes = [
    {
      value: 'physical',
      label: 'مادي (Physical)',
      description: 'المنتجات الملموسة مثل الإلكترونيات والملابس'
    },
    {
      value: 'digital',
      label: 'رقمي (Digital)',
      description: 'الملفات الرقمية مثل الكتب الإلكترونية والفيديوهات'
    },
    {
      value: 'service',
      label: 'خدمة (Service)',
      description: 'الخدمات مثل الاستشارات والدورات التدريبية'
    },
    {
      value: 'subscription',
      label: 'اشتراك (Subscription)',
      description: 'الاشتراكات الدورية مثل العضويات'
    },
    {
      value: 'bundle',
      label: 'حزمة (Bundle)',
      description: 'مجموعات من المنتجات المباعة معاً'
    }
  ];
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    subtitle: '',
    description: '',
    short_description: '',
    slug: '',
    category: '',
    product_type: 'physical',
    sku: '',
    barcode: '',
    author: '',
    isbn: '',
    language: '',
    pages_count: undefined,
    publication_date: '',
    brand: '',
    model_number: '',
    price: '0.00',
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
    min_stock_alert: 5,
    max_order_quantity: 10,
    track_stock: true,
    requires_shipping: true,
    weight: '',
    dimensions: {},
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
    meta_description: '',
    keywords: ''
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
      setError('فشل في تحميل التصنيفات');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Create product data according to API guide
      const productData = createProductData(formData);
      
      // Validate multilingual data
      const validationErrors = validateMultilingualData(productData);
      if (validationErrors.length > 0) {
        setError(`أخطاء في البيانات:\n${validationErrors.join('\n')}`);
        return;
      }
      
      const response = await ProductService.createProduct(productData as any);
      if (response?.id) {
        router.push(`/admin/products/${response.id}`);
      } else {
        router.push('/admin/products');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setError(`فشل في إنشاء المنتج: ${errorMessage}`);
      console.error('Error creating product:', err);
    } finally {
      setSaving(false);
    }
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

  if (error && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-3 rtl:space-x-reverse justify-center">
            <button
              onClick={loadCategories}
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
          <h1 className="text-3xl font-bold text-gray-800 mt-2">إضافة منتج جديد</h1>
          <p className="text-gray-600 mt-1">إنشاء منتج جديد في النظام</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href="/admin/products"
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
              <h3 className="text-sm font-medium text-red-800">خطأ في إنشاء المنتج</h3>
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
          <ProductTabs tabs={['المعلومات الأساسية', 'الوصف والمواصفات', 'التسعير والمخزون', 'الصور والملفات', 'التسويق وSEO']}>
            <BasicInfoTab 
              formData={formData} 
              setFormData={setFormData} 
              categories={categories}
              productTypes={productTypes}
            />
            <DescriptionTab 
              formData={formData} 
              setFormData={setFormData}
              productType={formData.product_type}
            />
            <PricingTab 
              formData={formData} 
              setFormData={setFormData}
              productType={formData.product_type}
            />
            <MediaTab 
              formData={formData} 
              setFormData={setFormData}
              productType={formData.product_type}
            />
            <MarketingTab 
              formData={formData} 
              setFormData={setFormData}
            />
          </ProductTabs>
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar 
            formData={formData}
            saving={saving}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
} 