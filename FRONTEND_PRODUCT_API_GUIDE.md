# دليل الفرونت إند لإدارة المنتجات والصور

## مقدمة

هذا الدليل يوضح الطريقة الصحيحة التي يجب على مبرمج الفرونت إند اتباعها لإرسال وتعديل بيانات المنتج وإدارة الصور بشكل صحيح حسب الكود المصدري الحالي لنظام المتجر.

---

## 1. هيكل البيانات الأساسي للمنتج

### 1.1 الحقول المتعددة اللغات

النظام يدعم الحقول المتعددة اللغات باستخدام JSONField:

```javascript
// مثال على البيانات المتعددة اللغات
const productData = {
  title: {
    "ar": "عنوان المنتج بالعربية",
    "en": "Product Title in English"
  },
  subtitle: {
    "ar": "العنوان الفرعي بالعربية",
    "en": "Subtitle in English"
  },
  description: {
    "ar": "وصف المنتج بالعربية",
    "en": "Product description in English"
  },
  short_description: {
    "ar": "وصف مختصر بالعربية",
    "en": "Short description in English"
  },
  meta_title: {
    "ar": "عنوان SEO بالعربية",
    "en": "SEO title in English"
  },
  meta_description: {
    "ar": "وصف SEO بالعربية",
    "en": "SEO description in English"
  },
  keywords: {
    "ar": "كلمة1, كلمة2, كلمة3",
    "en": "keyword1, keyword2, keyword3"
  }
};
```

### 1.2 الحقول الأساسية المطلوبة

```javascript
const requiredFields = {
  category: 1,                    // معرف الفئة (مطلوب)
  product_type: "physical",       // نوع المنتج: physical, digital, service, subscription, bundle
  price: "99.99",                // السعر الأساسي (مطلوب)
  is_active: true,               // حالة المنتج
  track_stock: false,            // تتبع المخزون
  requires_shipping: true,        // يتطلب شحناً
  is_featured: false,            // منتج مميز
  is_bestseller: false,          // الأكثر مبيعاً
  is_new_arrival: false,         // وصول جديد
  is_on_sale: false              // في التخفيض
};
```

---

## 2. إنشاء منتج جديد

### 2.1 Endpoint
```
POST /api/v1/store/products/products/
```

### 2.2 Headers المطلوبة
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
};
```

### 2.3 البيانات المطلوبة
```javascript
const createProductData = {
  // === المعلومات الأساسية ===
  title: {
    "ar": "عنوان المنتج",
    "en": "Product Title"
  },
  subtitle: {
    "ar": "العنوان الفرعي",
    "en": "Subtitle"
  },
  description: {
    "ar": "وصف مفصل للمنتج",
    "en": "Detailed product description"
  },
  short_description: {
    "ar": "وصف مختصر",
    "en": "Short description"
  },
  
  // === معلومات الفئة ===
  category: 1,
  
  // === نوع المنتج ===
  product_type: "physical", // physical, digital, service, subscription, bundle
  
  // === التسعير ===
  price: "99.99",
  compare_price: "129.99",      // سعر المقارنة (اختياري)
  cost_price: "50.00",          // سعر التكلفة (اختياري)
  discount_percentage: "10.00", // نسبة الخصم (اختياري)
  
  // === معلومات المنتج التقني ===
  sku: "PROD-001",              // كود المنتج (اختياري)
  barcode: "1234567890123",     // الباركود (اختياري)
  brand: "اسم العلامة التجارية", // العلامة التجارية (اختياري)
  model_number: "MODEL-123",    // رقم الموديل (اختياري)
  
  // === معلومات الكتب (للمنتجات الرقمية) ===
  author: "اسم المؤلف",          // المؤلف (اختياري)
  isbn: "978-0-123456-47-2",   // رقم ISBN (اختياري)
  language: "ar",               // اللغة: ar, en, fr, es, de, other
  pages_count: 300,             // عدد الصفحات (اختياري)
  publication_date: "2023-01-15", // تاريخ النشر (اختياري)
  
  // === إدارة المخزون ===
  stock_quantity: 100,          // كمية المخزون
  min_stock_alert: 10,          // تنبيه المخزون المنخفض
  max_order_quantity: 5,        // أقصى كمية للطلب
  track_stock: true,            // تتبع المخزون
  
  // === الشحن والأبعاد ===
  requires_shipping: true,       // يتطلب شحناً
  weight: "2.5",                // الوزن بالكجم (اختياري)
  dimensions: "30x20x10",       // الأبعاد (اختياري)
  
  // === الضمان والخدمة ===
  warranty_period: 12,          // فترة الضمان بالأشهر (اختياري)
  warranty_type: "manufacturer", // نوع الضمان (اختياري)
  condition: "new",             // حالة المنتج: new, refurbished, used, open_box, damaged
  
  // === التسويق والعرض ===
  is_featured: false,           // منتج مميز
  is_bestseller: false,         // الأكثر مبيعاً
  is_new_arrival: false,        // وصول جديد
  is_on_sale: false,            // في التخفيض
  launch_date: "2023-12-01",   // تاريخ الإطلاق (اختياري)
  tags: ["tag1", "tag2"],      // العلامات (اختياري)
  
  // === تحسين محركات البحث ===
  meta_title: {
    "ar": "عنوان SEO",
    "en": "SEO Title"
  },
  meta_description: {
    "ar": "وصف SEO",
    "en": "SEO Description"
  },
  keywords: {
    "ar": "كلمة1, كلمة2, كلمة3",
    "en": "keyword1, keyword2, keyword3"
  },
  
  // === المواصفات ===
  specifications: {
    "color": "أحمر",
    "size": "متوسط",
    "material": "قطن"
  },
  
  // === الملفات الرقمية ===
  digital_file: null,           // سيتم رفعه منفصلاً
  sample_file: null,            // ملف العينة (اختياري)
  
  // === الصور ===
  cover_image: null,            // سيتم رفعه منفصلاً
  images: []                    // سيتم رفعها منفصلاً
};
```

### 2.4 مثال على الكود
```javascript
async function createProduct(productData) {
  try {
    const response = await fetch('/api/v1/store/products/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في إنشاء المنتج: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error);
    throw error;
  }
}
```

---

## 3. تحديث منتج موجود

### 3.1 Endpoint
```
PUT /api/v1/store/products/products/{id}/
PATCH /api/v1/store/products/products/{id}/
```

### 3.2 مثال على الكود
```javascript
async function updateProduct(productId, updateData) {
  try {
    const response = await fetch(`/api/v1/store/products/products/${productId}/`, {
      method: 'PATCH', // أو PUT للتحديث الكامل
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في تحديث المنتج: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في تحديث المنتج:', error);
    throw error;
  }
}
```

---

## 4. إدارة صور المنتج

### 4.1 رفع صور المنتج

#### Endpoint
```
POST /api/v1/store/products/images/
```

#### البيانات المطلوبة
```javascript
const imageData = {
  product: 1,                    // معرف المنتج (مطلوب)
  image: file,                   // ملف الصورة (مطلوب)
  image_type: "gallery",         // نوع الصورة: main, gallery, detail, packaging, manual, certificate, preview
  alt_text: "وصف الصورة",        // النص البديل (اختياري)
  sort_order: 1,                 // ترتيب العرض (اختياري)
  is_active: true,               // الصورة نشطة (اختياري)
  is_preview: false,             // معاينة مجانية (اختياري)
  page_number: null              // رقم الصفحة (للكتب) (اختياري)
};
```

#### مثال على الكود
```javascript
async function uploadProductImage(imageData) {
  try {
    const formData = new FormData();
    
    // إضافة البيانات الأساسية
    formData.append('product', imageData.product);
    formData.append('image', imageData.image);
    formData.append('image_type', imageData.image_type);
    formData.append('alt_text', imageData.alt_text || '');
    formData.append('sort_order', imageData.sort_order || 0);
    formData.append('is_active', imageData.is_active ? 'true' : 'false');
    formData.append('is_preview', imageData.is_preview ? 'true' : 'false');
    
    if (imageData.page_number) {
      formData.append('page_number', imageData.page_number);
    }
    
    const response = await fetch('/api/v1/store/products/images/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
        // لا تضع Content-Type هنا، سيتم تعيينه تلقائياً
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في رفع الصورة: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    throw error;
  }
}
```

### 4.2 تعيين الصورة الرئيسية

#### Endpoint
```
POST /api/v1/store/products/images/{image_id}/set-main/
```

#### مثال على الكود
```javascript
async function setMainImage(imageId) {
  try {
    const response = await fetch(`/api/v1/store/products/images/${imageId}/set-main/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في تعيين الصورة الرئيسية: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في تعيين الصورة الرئيسية:', error);
    throw error;
  }
}
```

### 4.3 إعادة ترتيب الصور

#### Endpoint
```
POST /api/v1/store/products/images/reorder/
```

#### البيانات المطلوبة
```javascript
const reorderData = {
  orders: [
    { id: 1, order: 1 },
    { id: 2, order: 2 },
    { id: 3, order: 3 }
  ]
};
```

#### مثال على الكود
```javascript
async function reorderImages(orders) {
  try {
    const response = await fetch('/api/v1/store/products/images/reorder/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ orders })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في إعادة ترتيب الصور: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في إعادة ترتيب الصور:', error);
    throw error;
  }
}
```

### 4.4 حذف صورة

#### Endpoint
```
DELETE /api/v1/store/products/images/{image_id}/
```

#### مثال على الكود
```javascript
async function deleteProductImage(imageId) {
  try {
    const response = await fetch(`/api/v1/store/products/images/${imageId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في حذف الصورة: ${JSON.stringify(errorData)}`);
    }
    
    return true;
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    throw error;
  }
}
```

---

## 5. رفع الملفات الرقمية

### 5.1 رفع ملف رقمي

#### Endpoint
```
PUT /api/v1/store/products/products/{id}/
```

#### مثال على الكود
```javascript
async function uploadDigitalFile(productId, file) {
  try {
    const formData = new FormData();
    formData.append('digital_file', file);
    
    const response = await fetch(`/api/v1/store/products/products/${productId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في رفع الملف الرقمي: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في رفع الملف الرقمي:', error);
    throw error;
  }
}
```

---

## 6. إدارة المخزون

### 6.1 تحديث المخزون

#### Endpoint
```
POST /api/v1/store/products/products/{id}/update-stock/
```

#### البيانات المطلوبة
```javascript
const stockData = {
  stock_quantity: 150,           // الكمية الجديدة
  min_stock_alert: 10,           // تنبيه المخزون المنخفض
  max_order_quantity: 5,         // أقصى كمية للطلب
  track_stock: true              // تتبع المخزون
};
```

#### مثال على الكود
```javascript
async function updateProductStock(productId, stockData) {
  try {
    const response = await fetch(`/api/v1/store/products/products/${productId}/update-stock/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(stockData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في تحديث المخزون: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في تحديث المخزون:', error);
    throw error;
  }
}
```

---

## 7. التحديث الجماعي للمنتجات

### 7.1 Endpoint
```
POST /api/v1/store/products/products/bulk-update/
```

### 7.2 البيانات المطلوبة
```javascript
const bulkUpdateData = {
  product_ids: [1, 2, 3, 4, 5],  // قائمة معرفات المنتجات
  updates: {
    is_featured: true,            // تحديث الحقول المطلوبة
    discount_percentage: "15.00",
    is_on_sale: true
  }
};
```

### 7.3 مثال على الكود
```javascript
async function bulkUpdateProducts(productIds, updates) {
  try {
    const response = await fetch('/api/v1/store/products/products/bulk-update/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        product_ids: productIds,
        updates: updates
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`خطأ في التحديث الجماعي: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في التحديث الجماعي:', error);
    throw error;
  }
}
```

---

## 8. معالجة الأخطاء

### 8.1 أنواع الأخطاء الشائعة

```javascript
// خطأ في المصادقة
if (response.status === 401) {
  // إعادة توجيه للدخول
  redirectToLogin();
}

// خطأ في الصلاحيات
if (response.status === 403) {
  // عرض رسالة عدم وجود صلاحيات
  showPermissionError();
}

// خطأ في التحقق من البيانات
if (response.status === 400) {
  const errorData = await response.json();
  // عرض أخطاء التحقق
  showValidationErrors(errorData);
}

// خطأ في عدم العثور على المنتج
if (response.status === 404) {
  // عرض رسالة عدم العثور على المنتج
  showNotFoundError();
}
```

### 8.2 دالة معالجة الأخطاء الشاملة
```javascript
async function handleApiError(response) {
  if (response.ok) {
    return await response.json();
  }
  
  const errorData = await response.json();
  
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
}
```

---

## 9. أفضل الممارسات

### 9.1 التحقق من البيانات قبل الإرسال
```javascript
function validateProductData(data) {
  const errors = [];
  
  // التحقق من الحقول المطلوبة
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
  
  return errors;
}
```

### 9.2 معالجة الملفات
```javascript
function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    throw new Error('حجم الملف يجب أن يكون أقل من 5MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('نوع الملف غير مدعوم. الأنواع المدعومة: JPEG, PNG, WebP');
  }
  
  return true;
}
```

### 9.3 إدارة الحالة
```javascript
class ProductManager {
  constructor() {
    this.products = [];
    this.loading = false;
    this.error = null;
  }
  
  async createProduct(productData) {
    this.loading = true;
    this.error = null;
    
    try {
      const result = await createProduct(productData);
      this.products.push(result);
      return result;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }
  
  async updateProduct(productId, updateData) {
    this.loading = true;
    this.error = null;
    
    try {
      const result = await updateProduct(productId, updateData);
      const index = this.products.findIndex(p => p.id === productId);
      if (index !== -1) {
        this.products[index] = result;
      }
      return result;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }
}
```

---

## 10. ملخص النقاط المهمة

### 10.1 المصادقة والصلاحيات
- جميع عمليات التعديل تتطلب مصادقة مع token صحيح
- التحقق من صلاحيات المستخدم قبل تنفيذ العمليات
- استخدام headers مناسبة لكل نوع من الطلبات

### 10.2 الحقول المتعددة اللغات
- يجب إرسالها كـ JSON object مع رموز اللغات
- دعم اللغات: العربية (ar)، الإنجليزية (en)، الفرنسية (fr)، الإسبانية (es)، الألمانية (de)
- التحقق من وجود البيانات باللغة الأساسية (العربية)

### 10.3 الملفات والصور
- استخدام FormData لرفع الصور والملفات الرقمية
- التحقق من نوع وحجم الملفات قبل الرفع
- دعم أنواع الصور: JPEG, PNG, WebP
- الحد الأقصى لحجم الملف: 5MB

### 10.4 التحقق من البيانات
- التحقق من صحة البيانات قبل الإرسال
- معالجة شاملة لجميع أنواع الأخطاء
- عرض رسائل خطأ واضحة للمستخدم

### 10.5 الأداء والأمان
- استخدام التحديث الجزئي (PATCH) بدلاً من التحديث الكامل (PUT) عند الإمكان
- تحسين استعلامات قاعدة البيانات
- حماية من XSS وSQL injection

### 10.6 إدارة الحالة
- إدارة حالة التحميل والأخطاء
- تحديث الواجهة بشكل تفاعلي
- حفظ البيانات في حالة فشل الاتصال

---

## 11. أمثلة عملية

### 11.1 إنشاء منتج كامل مع الصور
```javascript
async function createCompleteProduct(productData, images) {
  try {
    // 1. إنشاء المنتج
    const product = await createProduct(productData);
    
    // 2. رفع الصور
    const uploadedImages = [];
    for (let i = 0; i < images.length; i++) {
      const imageData = {
        product: product.id,
        image: images[i],
        image_type: i === 0 ? 'main' : 'gallery',
        alt_text: `صورة ${i + 1} للمنتج`,
        sort_order: i + 1
      };
      
      const uploadedImage = await uploadProductImage(imageData);
      uploadedImages.push(uploadedImage);
    }
    
    return { product, images: uploadedImages };
  } catch (error) {
    console.error('خطأ في إنشاء المنتج الكامل:', error);
    throw error;
  }
}
```

### 11.2 تحديث منتج مع صور جديدة
```javascript
async function updateProductWithImages(productId, updateData, newImages) {
  try {
    // 1. تحديث بيانات المنتج
    const updatedProduct = await updateProduct(productId, updateData);
    
    // 2. رفع الصور الجديدة
    if (newImages && newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        const imageData = {
          product: productId,
          image: newImages[i],
          image_type: 'gallery',
          alt_text: `صورة جديدة ${i + 1}`,
          sort_order: 999 + i // ترتيب في النهاية
        };
        
        await uploadProductImage(imageData);
      }
    }
    
    return updatedProduct;
  } catch (error) {
    console.error('خطأ في تحديث المنتج مع الصور:', error);
    throw error;
  }
}
```

---

## 12. استكشاف الأخطاء وإصلاحها

### 12.1 مشاكل شائعة وحلولها

#### مشكلة: خطأ في رفع الصور
```javascript
// الحل: التحقق من نوع الملف
function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('نوع الملف غير مدعوم');
  }
  return true;
}
```

#### مشكلة: خطأ في الحقول المتعددة اللغات
```javascript
// الحل: التحقق من وجود اللغة الأساسية
function validateMultilingualData(data) {
  if (!data.title || !data.title.ar) {
    throw new Error('العنوان باللغة العربية مطلوب');
  }
  return true;
}
```

#### مشكلة: خطأ في المصادقة
```javascript
// الحل: التحقق من صلاحية التوكن
async function checkTokenValidity() {
  try {
    const response = await fetch('/api/v1/auth/verify/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

---

## 13. خاتمة

هذا الدليل يغطي جميع الجوانب المهمة للتعامل مع API المنتجات بشكل صحيح وآمن. يرجى اتباع هذه الإرشادات لضمان عمل التطبيق بشكل مثالي وتجنب المشاكل الشائعة.

### النقاط الرئيسية للتذكر:
1. **المصادقة**: دائماً تحقق من صلاحية التوكن
2. **التحقق**: تحقق من صحة البيانات قبل الإرسال
3. **معالجة الأخطاء**: عالج جميع أنواع الأخطاء بشكل مناسب
4. **الأداء**: استخدم التحديثات الجزئية عند الإمكان
5. **الأمان**: تحقق من الملفات قبل الرفع

---

*آخر تحديث: ديسمبر 2024* 