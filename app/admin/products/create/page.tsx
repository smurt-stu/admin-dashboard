'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductService, CategoryService, ProductTypeService, ImageService } from '../../../../lib/products';
import { Category, ProductType } from '../../../../lib/products/types';
import { createProductData, validateMultilingualData, convertFormDataToAPI } from '../../../../lib/multilingualUtils';
import { useToast, ProductToast } from '../../../../components/ui/toast';
import ProductTabs from './components/ProductTabs';
import BasicInfoTab from './components/BasicInfoTab';
import DescriptionTab from './components/DescriptionTab';
import PricingTab from './components/PricingTab';
import MediaTab from './components/MediaTab';
import MarketingTab from './components/MarketingTab';
import DynamicFieldsTab from './components/DynamicFieldsTab';
import VariantsTab from './components/VariantsTab';
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
  custom_fields?: Record<string, any>;
  custom_fields_data?: Record<string, any>;
  // إضافة حقل للصورة المرفوعة
  main_image_file?: File;
}

export default function CreateProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // سيتم تحميل أنواع المنتجات من API
  
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
    keywords: '',
    custom_fields: {},
    custom_fields_data: {}
  });

  useEffect(() => {
    loadCategories();
    loadProductTypes();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      showToast(ProductToast.loadingData());
      const response = await CategoryService.getCategories({ is_active: true });
      setCategories(response?.results || []);
    } catch (err) {
      const errorMessage = 'فشل في تحميل التصنيفات';
      setError(errorMessage);
      showToast(ProductToast.productCreationFailed(errorMessage));
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductTypes = async () => {
    try {
      const response = await ProductTypeService.getActiveProductTypes();
      setProductTypes(response);
    } catch (err) {
      console.error('Error loading product types:', err);
    }
  };

  const handleProductTypeChange = async (productTypeId: string) => {
    setFormData(prev => ({
      ...prev,
      product_type: productTypeId
    }));
    
    // تحديث نوع المنتج المحدد
    const selectedType = productTypes.find(type => type.id === productTypeId);
    setSelectedProductType(selectedType || null);
    
    // جلب تفاصيل نوع المنتج الكاملة من الـ API
    if (productTypeId) {
      try {
        console.log('Loading detailed product type info for:', productTypeId);
        const detailedProductType = await ProductTypeService.getProductType(productTypeId);
        console.log('Detailed product type:', detailedProductType);
        setSelectedProductType(detailedProductType);
        
        // إظهار رسالة تأكيد للمستخدم
        const displayName = typeof detailedProductType.display_name === 'string' 
          ? detailedProductType.display_name 
          : detailedProductType.display_name?.ar || detailedProductType.display_name?.en || detailedProductType.name;
        
        console.log(`تم اختيار نوع المنتج: ${displayName}`);
        
        // إذا كان نوع المنتج يحتوي على حقول مخصصة، إظهار تلميح للمستخدم
        if (detailedProductType.settings?.custom_fields && detailedProductType.settings.custom_fields.length > 0) {
          console.log(`هذا النوع يحتوي على ${detailedProductType.settings.custom_fields.length} حقل مخصص`);
        }
      } catch (error) {
        console.error('Error loading detailed product type:', error);
        // في حالة فشل الطلب، استخدم البيانات المحلية
        if (selectedType) {
          setSelectedProductType(selectedType);
        }
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // إظهار رسالة الحفظ
      showToast(ProductToast.savingChanges());
      
      // معالجة البيانات
      
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
          const errorMessage = `أخطاء في الحقول المخصصة:\n${customFieldErrors.join('\n')}`;
          setError(errorMessage);
          showToast(ProductToast.validationFailed(customFieldErrors));
          return;
        }
      }
      
      // Create product data according to API guide
      const productData = createProductData(formData);
      
      // طباعة البيانات للتصحيح
      console.log('Form data before processing:', formData);
      console.log('Product data after processing:', productData);
      
      // Validate multilingual data
      const validationErrors = validateMultilingualData(productData);
      if (validationErrors.length > 0) {
        const errorMessage = `أخطاء في البيانات:\n${validationErrors.join('\n')}`;
        setError(errorMessage);
        showToast(ProductToast.validationFailed(validationErrors));
        return;
      }
      
      // إذا كان هناك صورة مرفوعة، استخدم الطريقة الجديدة
      if (formData.main_image_file) {
        const result = await ImageService.uploadImageWithProduct(productData as any, formData.main_image_file);
        if (result.product?.id) {
          // إظهار رسالة النجاح
          const productName = formData.title || 'المنتج الجديد';
          showToast(ProductToast.productCreated(productName));
          
          // تحديث formData بـ id المنتج للسماح برفع الصور الإضافية
          setFormData(prev => ({
            ...prev,
            id: result.product.id
          }));
          
          // انتظار قليلاً ثم الانتقال إلى صفحة التعديل
          setTimeout(() => {
            router.push(`/admin/products/${result.product.id}`);
          }, 2000);
        } else {
          router.push('/admin/products');
        }
      } else {
        // الطريقة القديمة بدون صورة
        const response = await ProductService.createProduct(productData as any);
        if (response?.id) {
          // إظهار رسالة النجاح
          const productName = formData.title || 'المنتج الجديد';
          showToast(ProductToast.productCreated(productName));
          
          // تحديث formData بـ id المنتج للسماح برفع الصور
          setFormData(prev => ({
            ...prev,
            id: response.id
          }));
          
          // انتظار قليلاً ثم الانتقال إلى صفحة التعديل
          setTimeout(() => {
            router.push(`/admin/products/${response.id}`);
          }, 2000);
        } else {
          router.push('/admin/products');
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setError(`فشل في إنشاء المنتج: ${errorMessage}`);
      showToast(ProductToast.productCreationFailed(errorMessage));
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
          <ProductTabs tabs={['المعلومات الأساسية', 'الحقول المخصصة', 'الوصف والمواصفات', 'التسعير والمخزون', 'المتغيرات', 'الصور والملفات', 'التسويق وSEO']}>
            <BasicInfoTab 
              formData={formData} 
              setFormData={setFormData} 
              categories={categories}
              productTypes={productTypes}
              onProductTypeChange={handleProductTypeChange}
            />
            <DynamicFieldsTab 
              formData={formData} 
              setFormData={setFormData}
              selectedProductType={selectedProductType}
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
            <VariantsTab 
              formData={formData} 
              setFormData={setFormData}
              selectedProductType={selectedProductType}
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