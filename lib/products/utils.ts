// Product Utilities - الأدوات المساعدة للمنتجات

import { MultilingualField, MultilingualData } from '../multilingualUtils';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to validate multilingual data
export const validateMultilingualData = (data: any): string[] => {
  const errors: string[] = [];
  
  // Check required multilingual fields
  if (!data.title || !data.title.ar) {
    errors.push('العنوان باللغة العربية مطلوب');
  }
  
  return errors;
};

// Helper function to handle API errors
export const handleApiError = async (response: Response) => {
  if (response.ok) {
    return await response.json();
  }
  
  const errorData = await response.json().catch(() => ({}));
  
  switch (response.status) {
    case 400:
      throw new Error(`بيانات غير صحيحة: ${JSON.stringify(errorData)}`);
    case 401:
      throw new Error('يجب تسجيل الدخول أولاً');
    case 403:
      throw new Error('ليس لديك صلاحية للقيام بهذا الإجراء');
    case 404:
      throw new Error('المنتج غير موجود');
    case 500:
      throw new Error('خطأ في الخادم، يرجى المحاولة لاحقاً');
    default:
      throw new Error(`خطأ غير متوقع: ${response.status}`);
  }
};

// Helper function to build query parameters
export const buildQueryParams = (params: Record<string, any>): URLSearchParams => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }
  return queryParams;
};

// Helper function to validate image file
export const validateImageFile = (file: File): string[] => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    errors.push('حجم الملف يجب أن يكون أقل من 5MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('نوع الملف غير مدعوم. الأنواع المدعومة: JPEG, PNG, WebP');
  }
  
  return errors;
};

// Helper function to format price
export const formatPrice = (price: string | number): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'JOD'
  }).format(numericPrice);
};

// Helper function to get stock status
export const getStockStatus = (inStock: boolean) => {
  if (!inStock) {
    return { color: 'bg-red-100 text-red-800', text: 'نفد المخزون' };
  } else {
    return { color: 'bg-green-100 text-green-800', text: 'متوفر' };
  }
};

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to get product type display name
export const getProductTypeDisplay = (type: string): string => {
  const types: Record<string, string> = {
    'physical': 'منتج مادي',
    'digital': 'منتج رقمي',
    'service': 'خدمة',
    'subscription': 'اشتراك',
    'bundle': 'حزمة'
  };
  return types[type] || type;
};

// Helper function to get condition display name
export const getConditionDisplay = (condition: string): string => {
  const conditions: Record<string, string> = {
    'new': 'جديد',
    'refurbished': 'مجدول',
    'used': 'مستعمل',
    'open_box': 'مفتوح',
    'damaged': 'تالف'
  };
  return conditions[condition] || condition;
};

// Helper function to get language display name
export const getLanguageDisplay = (language: string): string => {
  const languages: Record<string, string> = {
    'ar': 'العربية',
    'en': 'الإنجليزية',
    'fr': 'الفرنسية',
    'es': 'الإسبانية',
    'de': 'الألمانية',
    'other': 'أخرى'
  };
  return languages[language] || language;
};

// Helper function to check if product is on sale
export const isProductOnSale = (product: any): boolean => {
  return product.is_on_sale || 
         (product.compare_price && parseFloat(product.price) < parseFloat(product.compare_price));
};

// Helper function to calculate discount percentage
export const calculateDiscountPercentage = (price: string, comparePrice: string): number => {
  if (!comparePrice || parseFloat(comparePrice) <= 0) return 0;
  
  const currentPrice = parseFloat(price);
  const originalPrice = parseFloat(comparePrice);
  
  if (currentPrice >= originalPrice) return 0;
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Helper function to get product status badges
export const getProductStatusBadges = (product: any) => {
  const badges = [];
  
  if (product.is_featured) {
    badges.push({ text: 'مميز', color: 'bg-blue-100 text-blue-800' });
  }
  
  if (product.is_bestseller) {
    badges.push({ text: 'الأكثر مبيعاً', color: 'bg-purple-100 text-purple-800' });
  }
  
  if (product.is_new_arrival) {
    badges.push({ text: 'وصل حديثاً', color: 'bg-green-100 text-green-800' });
  }
  
  if (isProductOnSale(product)) {
    badges.push({ text: 'في التخفيض', color: 'bg-orange-100 text-orange-800' });
  }
  
  return badges;
};

// Helper function to validate product data before submission
export const validateProductData = (data: any): string[] => {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.title || !data.title.ar) {
    errors.push('العنوان مطلوب');
  }
  
  if (!data.category) {
    errors.push('الفئة مطلوبة');
  }
  
  if (!data.price || parseFloat(data.price) <= 0) {
    errors.push('السعر يجب أن يكون أكبر من صفر');
  }
  
  if (!data.product_type) {
    errors.push('نوع المنتج مطلوب');
  }
  
  // Check multilingual data
  const multilingualErrors = validateMultilingualData(data);
  errors.push(...multilingualErrors);
  
  return errors;
};

// Helper function to create FormData for file uploads
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  return formData;
}; 