'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductService, CategoryService, ProductTypeService, Product, Category, ProductType } from '../../../../../lib/products';
import { createProductData, validateMultilingualData, convertAPIToFormData } from '../../../../../lib/multilingualUtils';

// Import components
import EditProductTabs from './components/EditProductTabs';
import BasicInfoTab from './components/BasicInfoTab';
import PricingTab from './components/PricingTab';
import SpecificationsTab from './components/SpecificationsTab';
import VariantsTab from './components/VariantsTab';
import MediaTab from './components/MediaTab';
import MarketingTab from './components/MarketingTab';
import EditProductSidebar from './components/EditProductSidebar';

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
  variants?: any[];
}

// نظام التتبع الشامل
class EditProductLogger {
  private static instance: EditProductLogger;
  private logs: string[] = [];
  private startTime: number = Date.now();

  static getInstance(): EditProductLogger {
    if (!EditProductLogger.instance) {
      EditProductLogger.instance = new EditProductLogger();
    }
    return EditProductLogger.instance;
  }

  log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const timeDiff = Date.now() - this.startTime;
    const logEntry = `[${timestamp}] (+${timeDiff}ms) ${message}`;
    
    console.log(logEntry, data || '');
    this.logs.push(logEntry);
    
    // حفظ في localStorage للتحليل لاحقاً
    try {
      const existingLogs = localStorage.getItem('editProductLogs') || '[]';
      const allLogs = JSON.parse(existingLogs);
      allLogs.push({ timestamp, timeDiff, message, data });
      localStorage.setItem('editProductLogs', JSON.stringify(allLogs.slice(-100))); // حفظ آخر 100 log
    } catch (error) {
      console.error('Error saving log to localStorage:', error);
    }
  }

  logTabChange(fromTab: string, toTab: string, reason?: string) {
    this.log(`TAB CHANGE: ${fromTab} → ${toTab}`, { reason, stack: new Error().stack });
  }

  logDataLoad(operation: string, data?: any) {
    this.log(`DATA LOAD: ${operation}`, data);
  }

  logError(operation: string, error: any) {
    this.log(`ERROR: ${operation}`, { error: error.message, stack: error.stack });
  }

  logStateChange(component: string, oldState: any, newState: any) {
    this.log(`STATE CHANGE: ${component}`, { old: oldState, new: newState });
  }

  getLogs(): string[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('editProductLogs');
  }

  downloadLogs() {
    const logText = this.logs.join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edit-product-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

const logger = EditProductLogger.getInstance();

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
  const [debugMode, setDebugMode] = useState(false);
  
  // حالة منفصلة لنوع المنتج المحدد مع الإعدادات الكاملة
  const [selectedProductTypeWithSettings, setSelectedProductTypeWithSettings] = useState<ProductType | null>(null);
  
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
    specifications: { ar: '', en: '' },
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
    dimensions: { length: 0, width: 0, height: 0 },
    warranty_period: 12,
    warranty_type: '',
    condition: 'new',
    in_stock: false,
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
    images: [],
    variants: []
  });

  // تتبع التغييرات في activeTab
  useEffect(() => {
    logger.logTabChange('initial', activeTab, 'component mount');
  }, []);

  // مراقبة تغييرات activeTab
  useEffect(() => {
    console.log('ActiveTab changed to:', activeTab);
    logger.log('ActiveTab state changed', { activeTab });
  }, [activeTab]);

  // تحميل المنتج والبيانات الأساسية
  useEffect(() => {
    if (productId) {
      logger.logDataLoad('Product ID detected', { productId });
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      logger.logDataLoad('Starting product load', { productId });
      setLoading(true);
      setError(null);
      
      // تحميل المنتج
      logger.logDataLoad('Fetching product data');
      const productData = await ProductService.getProduct(productId);
      logger.logDataLoad('Product data received', { 
        productId: productData.id,
        title: productData.title,
        category: productData.category,
        product_type: productData.product_type
      });
      
      setProduct(productData);
      
      // تحويل بيانات المنتج إلى نموذج التحرير
      logger.logDataLoad('Converting product data to form data');
      const convertedFormData = convertProductToFormData(productData);
      logger.logDataLoad('Form data converted', { 
        title: convertedFormData.title,
        category: convertedFormData.category,
        product_type: convertedFormData.product_type
      });
      
      setFormData(convertedFormData);
      
      // تحميل نوع المنتج المحدد مع الإعدادات الكاملة
      if (convertedFormData.product_type) {
        logger.logDataLoad('Loading product type settings', { productTypeId: convertedFormData.product_type });
        await loadSelectedProductType(convertedFormData.product_type);
      }
      
      // تحميل الفئات وأنواع المنتجات
      logger.logDataLoad('Loading categories and product types');
      await Promise.all([
        loadCategories(),
        loadProductTypes()
      ]);
      
      logger.logDataLoad('All data loaded successfully');
      
    } catch (err: any) {
      const errorMessage = err.message || 'فشل في تحميل المنتج';
      logger.logError('Product load failed', err);
      setError(errorMessage);
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  // دالة تحويل بيانات المنتج إلى نموذج التحرير
  const convertProductToFormData = (productData: Product): ProductFormData => {
    logger.logDataLoad('Converting product to form data', { 
      productId: productData.id,
      hasTitle: !!productData.title,
      hasCategory: !!productData.category,
      hasProductType: !!productData.product_type
    });
    
    const converted = {
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
            const fieldValue = field.field_value;
            if (typeof fieldValue === 'object' && fieldValue !== null) {
              acc[field.field_name || field.name] = fieldValue;
            } else {
              acc[field.field_name || field.name] = fieldValue || '';
            }
            return acc;
          }, {})
        : (productData as any).custom_fields || {},
      custom_fields_data: Array.isArray((productData as any).custom_fields) 
        ? (productData as any).custom_fields.reduce((acc: any, field: any) => {
            const fieldValue = field.field_value;
            const fieldName = field.field_name || field.name;
            
            if (typeof fieldValue === 'object' && fieldValue !== null) {
              acc[fieldName] = fieldValue;
            } else {
              acc[fieldName] = fieldValue || '';
            }
            
            return acc;
          }, {})
        : (productData as any).custom_fields_data || {},
      images: (productData as any).images || [],
      variants: (productData as any).variants || []
    };
    
    logger.logDataLoad('Form data conversion completed', { 
      title: converted.title,
      category: converted.category,
      product_type: converted.product_type,
      customFieldsCount: Object.keys(converted.custom_fields_data).length
    });
    
    return converted;
  };

  // تحميل نوع المنتج المحدد مع الإعدادات الكاملة
  const loadSelectedProductType = async (productTypeId: string) => {
    try {
      logger.logDataLoad('Loading detailed product type', { productTypeId });
      const detailedProductType = await ProductTypeService.getProductType(productTypeId);
      logger.logDataLoad('Detailed product type loaded', { 
        productTypeId: detailedProductType.id,
        name: detailedProductType.name,
        hasSettings: !!detailedProductType.settings,
        customFieldsCount: detailedProductType.settings?.custom_fields?.length || 0
      });
      setSelectedProductTypeWithSettings(detailedProductType);
    } catch (err) {
      logger.logError('Failed to load detailed product type', err);
      console.error('Error loading detailed product type:', err);
      setSelectedProductTypeWithSettings(null);
    }
  };

  const loadCategories = async () => {
    try {
      logger.logDataLoad('Loading categories');
      const response = await CategoryService.getCategories({ is_active: true });
      const categories = response?.results || [];
      logger.logDataLoad('Categories loaded', { count: categories.length });
      setCategories(categories);
    } catch (err: any) {
      logger.logError('Failed to load categories', err);
      console.error('Error loading categories:', err);
    }
  };

  const loadProductTypes = async () => {
    try {
      logger.logDataLoad('Loading product types');
      const response = await ProductTypeService.getProductTypes({ is_active: true });
      const productTypes = response?.results || [];
      logger.logDataLoad('Product types loaded', { count: productTypes.length });
      setProductTypes(productTypes);
    } catch (err: any) {
      logger.logError('Failed to load product types', err);
      console.error('Error loading product types:', err);
    }
  };

  // تحميل نوع المنتج المحدد عند تغيير product_type
  useEffect(() => {
    if (formData.product_type) {
      logger.logDataLoad('Product type changed, loading settings', { productTypeId: formData.product_type });
      loadSelectedProductType(formData.product_type);
    }
  }, [formData.product_type]);

  const handleInputChange = (field: string, value: any) => {
    logger.log('Input change', { field, value, currentTab: activeTab });
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // تتبع تغيير التابز
  const handleTabChange = (newTab: string) => {
    logger.logTabChange(activeTab, newTab, 'user click');
    console.log('Tab change requested:', { from: activeTab, to: newTab });
    setActiveTab(newTab);
    // لا نرسل النموذج هنا - فقط نغير التاب
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      logger.logDataLoad('Starting form submission');
      setSaving(true);
      setError(null);
      
      // Create product data according to API guide
      logger.logDataLoad('Creating product data');
      const productData = createProductData(formData);
      
      // Validate multilingual data
      logger.logDataLoad('Validating multilingual data');
      const validationErrors = validateMultilingualData(productData);
      if (validationErrors.length > 0) {
        logger.logError('Validation failed', { errors: validationErrors });
        setError(`أخطاء في البيانات:\n${validationErrors.join('\n')}`);
        return;
      }
      
      // تحويل البيانات الأصلية إلى نفس التنسيق للمقارنة
      const originalProductData = product ? createProductData(convertAPIToFormData(product)) : undefined;
      
      logger.logDataLoad('Updating product', { productId });
      const response = await ProductService.updateProduct(productId, productData as any, originalProductData);
      logger.logDataLoad('Product updated successfully', { responseId: response?.id });
      
      if (response?.id) {
        router.push(`/admin/products/${response.id}`);
      } else {
        router.push('/admin/products');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      logger.logError('Form submission failed', err);
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
    logger.log('Title change', { value, currentTab: activeTab });
    handleInputChange('title', value);
    handleInputChange('slug', generateSlug(value));
  };

  const getCategoryDisplayName = (category: Category) => {
    return (category as any).display_name || category.name || 'غير محدد';
  };

  const getProductTypeDisplayName = (productType: ProductType) => {
    return (productType as any).display_name || productType.name || 'غير محدد';
  };

  // Debug panel
  const DebugPanel = () => {
    if (!debugMode) return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md max-h-64 overflow-auto text-xs z-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Debug Panel</h3>
          <button 
            onClick={() => logger.clearLogs()}
            className="bg-red-600 px-2 py-1 rounded text-xs"
          >
            Clear
          </button>
        </div>
        <div className="space-y-1">
          <div>Active Tab: {activeTab}</div>
          <div>Loading: {loading.toString()}</div>
          <div>Saving: {saving.toString()}</div>
          <div>Product: {product ? 'Loaded' : 'Not loaded'}</div>
          <div>Categories: {categories.length}</div>
          <div>Product Types: {productTypes.length}</div>
          <div>Selected Product Type: {selectedProductTypeWithSettings ? 'Loaded' : 'Not loaded'}</div>
        </div>
        <button 
          onClick={() => logger.downloadLogs()}
          className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs w-full"
        >
          Download Logs
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">خطأ في التحميل</p>
            <p>{error}</p>
          </div>
          <Link
            href="/admin/products"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            العودة إلى قائمة المنتجات
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">المنتج غير موجود</p>
          <Link
            href="/admin/products"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            العودة إلى قائمة المنتجات
          </Link>
        </div>
      </div>
    );
  }

  // Render active tab content
  const renderActiveTab = () => {
    logger.log('Rendering tab content', { activeTab });
    console.log('Rendering tab content for:', activeTab);
    
    switch (activeTab) {
      case 'basic':
        console.log('Rendering BasicInfoTab');
        return (
          <BasicInfoTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleTitleChange={handleTitleChange}
            categories={categories}
            productTypes={productTypes}
            getCategoryDisplayName={getCategoryDisplayName}
            getProductTypeDisplayName={getProductTypeDisplayName}
          />
        );
      case 'pricing':
        console.log('Rendering PricingTab');
        return (
          <PricingTab
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 'specifications':
        console.log('Rendering SpecificationsTab');
        return (
          <SpecificationsTab
            formData={formData}
            handleInputChange={handleInputChange}
            selectedProductTypeWithSettings={selectedProductTypeWithSettings}
          />
        );
      case 'variants':
        console.log('Rendering VariantsTab');
        return (
          <VariantsTab
            product={product}
            formData={formData}
            handleInputChange={handleInputChange}
            selectedProductTypeWithSettings={selectedProductTypeWithSettings}
          />
        );
      case 'media':
        console.log('Rendering MediaTab');
        return (
          <MediaTab
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 'marketing':
        console.log('Rendering MarketingTab');
        return (
          <MarketingTab
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      default:
        logger.log('Unknown tab', { activeTab });
        console.log('Unknown tab:', activeTab);
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">تعديل المنتج</h1>
            <p className="text-gray-600">تحديث معلومات المنتج</p>
          </div>
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <EditProductTabs
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                />

                <div className="p-6">
                  {renderActiveTab()}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <EditProductSidebar
              productId={productId}
              formData={formData}
              saving={saving}
              onSubmit={handleSubmit}
            />
          </div>
        </form>
      </div>
      
      <DebugPanel />
    </div>
  );
} 