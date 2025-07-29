// Utility functions for handling multilingual fields according to the API guide

export interface MultilingualField {
  ar: string;
  en: string;
}

export interface MultilingualData {
  title: MultilingualField;
  subtitle?: MultilingualField;
  description?: MultilingualField;
  short_description?: MultilingualField;
  meta_title?: MultilingualField;
  meta_description?: MultilingualField;
  keywords?: MultilingualField;
}

// Validate multilingual data
export function validateMultilingualData(data: Partial<MultilingualData>): string[] {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.title || !data.title.ar) {
    errors.push('العنوان باللغة العربية مطلوب');
  }
  
  // Check if English title is provided when Arabic is provided
  if (data.title?.ar && !data.title?.en) {
    errors.push('يجب إدخال العنوان باللغة الإنجليزية أيضاً');
  }
  
  // Check if Arabic subtitle is provided when English is provided
  if (data.subtitle?.en && !data.subtitle?.ar) {
    errors.push('يجب إدخال العنوان الفرعي باللغة العربية أيضاً');
  }
  
  // Check if Arabic description is provided when English is provided
  if (data.description?.en && !data.description?.ar) {
    errors.push('يجب إدخال الوصف باللغة العربية أيضاً');
  }
  
  return errors;
}

// Create multilingual field from string (for backward compatibility)
export function createMultilingualField(value: string): MultilingualField {
  return {
    ar: value,
    en: value
  };
}

// Get display value for multilingual field
export function getMultilingualDisplay(field: MultilingualField | string | undefined, language: 'ar' | 'en' = 'ar'): string {
  if (!field) return '';
  
  if (typeof field === 'string') {
    return field;
  }
  
  return field[language] || field.ar || field.en || '';
}

// Convert form data to API format
export function convertFormDataToAPI(formData: any): any {
  const apiData = { ...formData };
  
  // Convert string fields to multilingual objects
  if (typeof apiData.title === 'string') {
    apiData.title = createMultilingualField(apiData.title);
  }
  
  if (typeof apiData.subtitle === 'string') {
    apiData.subtitle = createMultilingualField(apiData.subtitle);
  }
  
  if (typeof apiData.description === 'string') {
    apiData.description = createMultilingualField(apiData.description);
  }
  
  if (typeof apiData.short_description === 'string') {
    apiData.short_description = createMultilingualField(apiData.short_description);
  }
  
  if (typeof apiData.meta_title === 'string') {
    apiData.meta_title = createMultilingualField(apiData.meta_title);
  }
  
  if (typeof apiData.meta_description === 'string') {
    apiData.meta_description = createMultilingualField(apiData.meta_description);
  }
  
  if (typeof apiData.keywords === 'string') {
    apiData.keywords = createMultilingualField(apiData.keywords);
  }
  
  // Convert category to number if it's a string
  if (typeof apiData.category === 'string' && apiData.category) {
    apiData.category = parseInt(apiData.category);
  }
  
  // Convert tags string to array
  if (typeof apiData.tags === 'string' && apiData.tags) {
    apiData.tags = apiData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
  }
  
  return apiData;
}

// Convert API data to form format
export function convertAPIToFormData(apiData: any): any {
  const formData = { ...apiData };
  
  // Convert multilingual objects to strings for form display
  if (formData.title && typeof formData.title === 'object') {
    formData.title = formData.title.ar || formData.title.en || '';
  }
  
  if (formData.subtitle && typeof formData.subtitle === 'object') {
    formData.subtitle = formData.subtitle.ar || formData.subtitle.en || '';
  }
  
  if (formData.description && typeof formData.description === 'object') {
    formData.description = formData.description.ar || formData.description.en || '';
  }
  
  if (formData.short_description && typeof formData.short_description === 'object') {
    formData.short_description = formData.short_description.ar || formData.short_description.en || '';
  }
  
  if (formData.meta_title && typeof formData.meta_title === 'object') {
    formData.meta_title = formData.meta_title.ar || formData.meta_title.en || '';
  }
  
  if (formData.meta_description && typeof formData.meta_description === 'object') {
    formData.meta_description = formData.meta_description.ar || formData.meta_description.en || '';
  }
  
  if (formData.keywords && typeof formData.keywords === 'object') {
    formData.keywords = formData.keywords.ar || formData.keywords.en || '';
  }
  
  // Convert tags array to string
  if (Array.isArray(formData.tags)) {
    formData.tags = formData.tags.join(', ');
  }
  
  return formData;
}

// Validate image file according to API guide
export function validateImageFile(file: File): string[] {
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
}

// Validate ISBN format
function validateISBN(isbn: string): boolean {
  if (!isbn) return true; // Empty ISBN is valid (optional field)
  
  // Remove spaces and hyphens
  const cleanISBN = isbn.replace(/[\s-]/g, '');
  
  // Check if it's a valid ISBN-10 or ISBN-13
  if (cleanISBN.length === 10) {
    // ISBN-10 validation
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanISBN[i]) * (10 - i);
    }
    const checkDigit = cleanISBN[9] === 'X' ? 10 : parseInt(cleanISBN[9]);
    sum += checkDigit;
    return sum % 11 === 0;
  } else if (cleanISBN.length === 13) {
    // ISBN-13 validation
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanISBN[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = parseInt(cleanISBN[12]);
    return (10 - (sum % 10)) % 10 === checkDigit;
  }
  
  return false;
}

// Create product data according to API guide
export function createProductData(formData: any): any {
  // Validate ISBN if provided
  if (formData.isbn && !validateISBN(formData.isbn)) {
    throw new Error('رقم ISBN غير صالح');
  }
  
  // Validate category
  if (!formData.category || isNaN(parseInt(formData.category))) {
    throw new Error('يجب اختيار فئة صحيحة');
  }
  
  // Validate product_type
  const validProductTypes = ['physical', 'digital', 'service', 'subscription', 'bundle'];
  if (formData.product_type && !validProductTypes.includes(formData.product_type)) {
    throw new Error('نوع المنتج غير صحيح. الأنواع المتاحة: physical, digital, service, subscription, bundle');
  }
  
  // Validate main image
  if (!formData.main_image) {
    throw new Error('الصورة الرئيسية مطلوبة');
  }
  
  // Validate price
  if (!formData.price || parseFloat(formData.price) <= 0) {
    throw new Error('السعر مطلوب ويجب أن يكون أكبر من صفر');
  }
  
  const productData: any = {
    // === المعلومات الأساسية ===
    title: {
      ar: formData.title || '',
      en: formData.title_en || formData.title || ''
    },
    subtitle: formData.subtitle ? {
      ar: formData.subtitle,
      en: formData.subtitle_en || formData.subtitle
    } : undefined,
    description: formData.description ? {
      ar: formData.description,
      en: formData.description_en || formData.description
    } : undefined,
    short_description: formData.short_description ? {
      ar: formData.short_description,
      en: formData.short_description_en || formData.short_description
    } : undefined,
    
    // === معلومات الفئة ===
    category: parseInt(formData.category) || 1,
    
    // === نوع المنتج ===
    product_type: formData.product_type || "physical",
    
    // === التسعير ===
    price: formData.price || "0.00",
    compare_price: formData.compare_price || undefined,
    cost_price: formData.cost_price || undefined,
    discount_percentage: formData.discount_percentage || undefined,
    
    // === معلومات المنتج التقني ===
    sku: formData.sku || undefined,
    barcode: formData.barcode || undefined,
    brand: formData.brand || undefined,
    model_number: formData.model_number || undefined,
    
    // === معلومات الكتب (للمنتجات الرقمية) ===
    author: formData.author || undefined,
    isbn: formData.isbn || undefined,
    language: formData.language || "ar",
    pages_count: formData.pages_count || undefined,
    publication_date: formData.publication_date || undefined,
    
    // === إدارة المخزون ===
    stock_quantity: formData.stock_quantity || 0,
    min_stock_alert: formData.min_stock_alert || 10,
    max_order_quantity: formData.max_order_quantity || 5,
    track_stock: formData.track_stock !== false,
    
    // === الشحن والأبعاد ===
    requires_shipping: formData.requires_shipping !== false,
    weight: formData.weight || undefined,
    dimensions: formData.dimensions || undefined,
    
    // === الضمان والخدمة ===
    warranty_period: formData.warranty_period || undefined,
    warranty_type: formData.warranty_type || undefined,
    condition: formData.condition || "new",
    
    // === التسويق والعرض ===
    is_featured: formData.is_featured || false,
    is_bestseller: formData.is_bestseller || false,
    is_new_arrival: formData.is_new_arrival || false,
    is_on_sale: formData.is_on_sale || false,
    launch_date: formData.launch_date || undefined,
    tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
    
    // === تحسين محركات البحث ===
    meta_title: formData.meta_title ? {
      ar: formData.meta_title,
      en: formData.meta_title_en || formData.meta_title
    } : undefined,
    meta_description: formData.meta_description ? {
      ar: formData.meta_description,
      en: formData.meta_description_en || formData.meta_description
    } : undefined,
    keywords: formData.keywords ? {
      ar: formData.keywords,
      en: formData.keywords_en || formData.keywords
    } : undefined,
    
    // === المواصفات ===
    specifications: formData.specifications || undefined,
    
    // === الملفات الرقمية ===
    digital_file: undefined, // سيتم رفعه منفصلاً
    sample_file: undefined, // ملف العينة (اختياري)
    
    // === الصور ===
    cover_image: undefined, // سيتم رفعه منفصلاً
    images: [] // سيتم رفعها منفصلاً
  };
  
  return productData;
} 