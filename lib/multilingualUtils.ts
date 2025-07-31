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
// This function is now imported from lib/products/utils.ts
// export function validateImageFile(file: File): string[] {
//   const errors: string[] = [];
//   const maxSize = 5 * 1024 * 1024; // 5MB
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
//   
//   if (file.size > maxSize) {
//     errors.push('حجم الملف يجب أن يكون أقل من 5MB');
//   }
//   
//   if (!allowedTypes.includes(file.type)) {
//     errors.push('نوع الملف غير مدعوم. الأنواع المدعومة: JPEG, PNG, WebP');
//   }
//   
//   return errors;
// }

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

// Remove empty fields from data
function removeEmptyFields(data: any): any {
  const cleaned = { ...data };
  
  Object.keys(cleaned).forEach(key => {
    // لا نزيل الحقول التي لها قيمة 0 أو false لأنها قيم صحيحة
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined || cleaned[key] === 'NaN') {
      delete cleaned[key];
    } else if (Array.isArray(cleaned[key]) && cleaned[key].length === 0) {
      delete cleaned[key];
    } else if (key === 'variants_data' && Array.isArray(cleaned[key]) && cleaned[key].length === 0) {
      console.log('Removing empty variants_data array');
      delete cleaned[key];
    } else if (key === 'variants_data' && Array.isArray(cleaned[key]) && cleaned[key].length > 0) {
      console.log('Keeping variants_data array with length:', cleaned[key].length);
    } else if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
      cleaned[key] = removeEmptyFields(cleaned[key]);
      if (Object.keys(cleaned[key]).length === 0) {
        delete cleaned[key];
      }
    }
  });
  
  // طباعة تشخيصية للمتغيرات
  if (cleaned.variants_data) {
    console.log('Variants data survived cleaning:', cleaned.variants_data);
  } else {
    console.log('Variants data was removed during cleaning');
  }
  
  return cleaned;
}

// Create product data according to API guide
export function createProductData(formData: any): any {
  // Validate ISBN if provided
  if (formData.isbn && !validateISBN(formData.isbn)) {
    throw new Error('رقم ISBN غير صالح');
  }
  
  // Validate category
  if (!formData.category) {
    throw new Error('يجب اختيار فئة صحيحة');
  }
  
  // تحويل category إلى string إذا كان رقم
  const categoryId = typeof formData.category === 'number' ? formData.category.toString() : formData.category;
  
  // Validate product_type
  if (formData.product_type) {
    // إذا كان product_type UUID، نرسله كما هو
    // إذا كان string، نتحقق من أنه نوع صحيح
    const validProductTypes = ['physical', 'digital', 'service', 'subscription', 'bundle'];
    if (typeof formData.product_type === 'string' && !validProductTypes.includes(formData.product_type)) {
      // لا نرمي خطأ إذا كان UUID - هذا طبيعي
      // throw new Error('نوع المنتج غير صحيح. الأنواع المتاحة: physical, digital, service, subscription, bundle');
    }
  }
  
  // تحويل product_type إلى string إذا كان رقم
  const productTypeId = typeof formData.product_type === 'number' ? formData.product_type.toString() : formData.product_type;
  
  // Validate main image (only for creation, not update)
  if (!formData.main_image && !formData.id) {
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
    category: categoryId, // إرسال UUID مباشرة
    
    // === نوع المنتج ===
    product_type: productTypeId || "physical",
    
    // === التسعير ===
    price: parseFloat(formData.price || "0.00").toString(),
    compare_price: formData.compare_price ? parseFloat(formData.compare_price).toString() : undefined,
    cost_price: (() => {
      if (formData.cost_price === undefined || formData.cost_price === null || formData.cost_price === '') {
        return undefined;
      }
      const parsed = parseFloat(formData.cost_price);
      return isNaN(parsed) ? undefined : parsed.toString();
    })(),
    discount_percentage: (() => {
      if (formData.discount_percentage === undefined || formData.discount_percentage === null || formData.discount_percentage === '') {
        return undefined;
      }
      const parsed = parseFloat(formData.discount_percentage);
      return isNaN(parsed) ? undefined : parsed.toString();
    })(),
    
    // === معلومات المنتج التقني ===
    sku: formData.sku || undefined,
    barcode: formData.barcode || undefined,
    brand: formData.brand || undefined,
    model_number: formData.model_number || undefined,
    
    // === معلومات الكتب (للمنتجات الرقمية) ===
    author: formData.author || undefined,
    isbn: formData.isbn || undefined,
    language: formData.language || "ar",
    pages_count: (() => {
      if (formData.pages_count === undefined || formData.pages_count === null || formData.pages_count === '') {
        return undefined;
      }
      const parsed = parseInt(formData.pages_count);
      return isNaN(parsed) ? undefined : parsed;
    })(),
    publication_date: formData.publication_date || undefined,
    
    // === إدارة المخزون ===
    stock_quantity: (() => {
      const parsed = parseInt(formData.stock_quantity || 0);
      return isNaN(parsed) ? 0 : parsed;
    })(),
    min_stock_alert: (() => {
      const parsed = parseInt(formData.min_stock_alert || 10);
      return isNaN(parsed) ? 10 : parsed;
    })(),
    max_order_quantity: (() => {
      const parsed = parseInt(formData.max_order_quantity || 5);
      return isNaN(parsed) ? 5 : parsed;
    })(),
    track_stock: formData.track_stock !== false,
    
    // === الشحن والأبعاد ===
    requires_shipping: formData.requires_shipping !== false,
    weight: (() => {
      if (formData.weight === undefined || formData.weight === null || formData.weight === '') {
        return undefined;
      }
      const parsed = parseFloat(formData.weight);
      return isNaN(parsed) ? undefined : parsed.toString();
    })(),
    dimensions: formData.dimensions || undefined,
    
    // === الضمان والخدمة ===
    warranty_period: (() => {
      if (formData.warranty_period === undefined || formData.warranty_period === null || formData.warranty_period === '') {
        return undefined;
      }
      const parsed = parseInt(formData.warranty_period);
      return isNaN(parsed) ? undefined : parsed;
    })(),
    warranty_type: formData.warranty_type || undefined,
    condition: formData.condition || "new",
    
    // === التسويق والعرض ===
    is_featured: formData.is_featured || false,
    is_bestseller: formData.is_bestseller || false,
    is_new_arrival: formData.is_new_arrival || false,
    is_on_sale: formData.is_on_sale || false,
    launch_date: formData.launch_date || undefined,
    tags: formData.tags || undefined,
    
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
    digital_file: formData.digital_file || undefined,
    sample_file: formData.sample_file || undefined,
    
    // === الصور ===
    cover_image: formData.cover_image || undefined,
    // لا نرسل main_image إذا كان URL وليس ملف
    main_image: formData.main_image && !formData.main_image.startsWith('http') ? formData.main_image : undefined,
    images: formData.images || []
  };
  
  // === الحقول المخصصة والمتغيرات ===
  // إرسال الحقول المخصصة في جميع الحالات
  if (formData.custom_fields_data && Object.keys(formData.custom_fields_data).length > 0) {
    console.log('Processing custom fields data:', formData.custom_fields_data);
    
    // إرسال الحقول المخصصة كـ custom_fields_data
    const customFieldsData: Record<string, any> = {};
    
    Object.entries(formData.custom_fields_data).forEach(([fieldName, fieldValue]) => {
      // إذا كان الحقل يحتوي على معلومات إضافية (مثل type, label, options)
      if (typeof fieldValue === 'object' && fieldValue !== null && !Array.isArray(fieldValue)) {
        const fieldObj = fieldValue as any;
        
        // إذا كان الحقل متعدد اللغات
        if (fieldObj.ar !== undefined || fieldObj.en !== undefined) {
          customFieldsData[fieldName] = {
            value: fieldValue,
            type: 'multilingual',
            label: { ar: fieldName, en: fieldName }, // سيتم تحديثه من الباكند
            required: false
          };
        } else {
          // إذا كان الحقل يحتوي على معلومات كاملة
          customFieldsData[fieldName] = {
            value: fieldObj.value || fieldValue,
            type: fieldObj.type || 'text',
            label: fieldObj.label || { ar: fieldName, en: fieldName },
            required: fieldObj.required || false,
            options: fieldObj.options || [],
            searchable: fieldObj.searchable || false,
            filterable: fieldObj.filterable || false
          };
        }
      } else {
        // إذا كان الحقل قيمة بسيطة
        customFieldsData[fieldName] = {
          value: fieldValue,
          type: 'text', // نوع افتراضي
          label: { ar: fieldName, en: fieldName },
          required: false
        };
      }
    });
    
    productData.custom_fields_data = customFieldsData;
    console.log('Custom fields data being sent:', customFieldsData);
  }
  
  // إضافة المتغيرات الموجودة في formData
  console.log('Checking for variants in formData:', {
    hasVariants: !!formData.variants,
    isArray: Array.isArray(formData.variants),
    length: formData.variants?.length,
    variants: formData.variants
  });
  
  if (formData.variants && Array.isArray(formData.variants) && formData.variants.length > 0) {
    // تحويل المتغيرات إلى التنسيق المطلوب من الباكند
    const formattedVariants = formData.variants.map((variant: any, index: number) => ({
      name: variant.name || '',
      options: variant.options || {},
      price_modifier: (() => {
        // تحويل السعر إلى تعديل السعر
        if (variant.price_modifier !== undefined) {
          return variant.price_modifier.toString();
        }
        if (variant.price !== undefined) {
          return variant.price.toString();
        }
        return '0.00';
      })(),
      stock_quantity: variant.stock_quantity || 0,
      min_stock_alert: variant.min_stock_alert || 5,
      weight: variant.weight || undefined,
      dimensions: variant.dimensions || undefined,
      display_order: variant.display_order || index + 1,
      is_active: variant.is_active !== false,
      settings: variant.settings || {
        is_active: true,
        allow_purchase: true
      }
    }));
    
    productData.variants_data = formattedVariants;
    console.log('Formatted variants being sent:', formattedVariants);
  } else {
    console.log('No variants found in formData or variants array is empty');
  }
  
  // إزالة الحقول الفارغة
  const cleanedData = removeEmptyFields(productData);
  
  // طباعة البيانات للتصحيح
  console.log('Processed product data:', cleanedData);
  console.log('Form data input:', {
    cost_price: formData.cost_price,
    discount_percentage: formData.discount_percentage,
    weight: formData.weight,
    dimensions: formData.dimensions,
    custom_fields_data: formData.custom_fields_data,
    variants: formData.variants
  });
  
  return cleanedData;
} 