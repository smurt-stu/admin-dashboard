# تقرير API إدارة أنواع المنتجات

## نظرة عامة

هذا التقرير يوضح كيفية استخدام API إدارة أنواع المنتجات في النظام. تم استخراج جميع المعلومات من كود المصدر مباشرة.

---

## الرابط الأساسي

```
/api/v1/store/products/product-types/
```

---

## نموذج البيانات (Data Model)

### ProductType Model

```json
{
  "id": "UUID",
  "name": "string",                    // اسم النوع (مثل: book, electronics)
  "display_name": {                    // اسم العرض متعدد اللغات
    "ar": "كتاب",
    "en": "Book"
  },
  "slug": "string",                    // الرابط الفريد
  "description": "string",             // وصف النوع
  "icon": "string",                    // أيقونة FontAwesome
  "color": "string",                   // لون النوع (Hex)
  "is_digital": "boolean",             // هل المنتج رقمي
  "requires_shipping": "boolean",      // هل يحتاج شحن
  "track_stock": "boolean",            // هل يتتبع المخزون
  "has_variants": "boolean",           // هل يدعم المتغيرات
  "template_name": "string",           // قالب العرض المخصص
  "settings": "object",                // إعدادات إضافية
  "display_order": "integer",          // ترتيب العرض
  "is_active": "boolean",              // الحالة النشطة
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## نقاط النهاية (Endpoints)

### 1. قائمة أنواع المنتجات

**GET** `/api/v1/store/products/product-types/`

**الوصف:** الحصول على قائمة جميع أنواع المنتجات

**المعاملات:**
- `is_active` - فلترة حسب الحالة النشطة
- `has_variants` - فلترة حسب وجود المتغيرات
- `requires_shipping` - فلترة حسب الحاجة للشحن
- `is_digital` - فلترة حسب المنتجات الرقمية
- `track_stock` - فلترة حسب تتبع المخزون
- `search` - البحث في الاسم والوصف
- `ordering` - ترتيب النتائج
- `page` - رقم الصفحة
- `page_size` - حجم الصفحة

**مثال الاستجابة:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid-1",
      "name": "book",
      "display_name": "كتاب",
      "slug": "book",
      "icon": "fas fa-book",
      "color": "#007bff",
      "is_digital": false,
      "requires_shipping": true,
      "has_variants": false,
      "products_count": 25,
      "display_order": 1,
      "is_active": true
    }
  ]
}
```

### 2. تفاصيل نوع منتج

**GET** `/api/v1/store/products/product-types/{id}/`

**الوصف:** الحصول على تفاصيل نوع منتج محدد

**مثال الاستجابة:**
```json
{
  "id": "uuid-1",
  "name": "book",
  "display_name": "كتاب",
  "slug": "book",
  "description": "الكتب والمنشورات",
  "icon": "fas fa-book",
  "color": "#007bff",
  "is_digital": false,
  "requires_shipping": true,
  "track_stock": true,
  "has_variants": false,
  "template_name": "book_template",
  "field_schema": {
    "basic_fields": ["title", "description", "price", "weight", "dimensions", "stock_quantity", "min_stock_alert"],
    "custom_fields": []
  },
  "settings": {},
  "display_order": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "is_active": true
}
```

### 3. إنشاء نوع منتج جديد

**POST** `/api/v1/store/products/product-types/`

**الوصف:** إنشاء نوع منتج جديد (يتطلب صلاحيات إدارية)

**مثال الطلب:**
```json
{
  "name": "electronics",
  "display_name": {
    "ar": "إلكترونيات",
    "en": "Electronics"
  },
  "description": "الأجهزة الإلكترونية والكهربائية",
  "icon": "fas fa-laptop",
  "color": "#28a745",
  "is_digital": false,
  "requires_shipping": true,
  "track_stock": true,
  "has_variants": true,
  "template_name": "electronics_template",
  "settings": {
    "warranty_required": true,
    "specifications_required": true
  },
  "display_order": 2,
  "is_active": true
}
```

### 4. تحديث نوع منتج

**PUT/PATCH** `/api/v1/store/products/product-types/{id}/`

**الوصف:** تحديث نوع منتج موجود (يتطلب صلاحيات إدارية)

**مثال الطلب (PATCH):**
```json
{
  "display_name": {
    "ar": "إلكترونيات متطورة",
    "en": "Advanced Electronics"
  },
  "is_active": false
}
```

### 5. حذف نوع منتج

**DELETE** `/api/v1/store/products/product-types/{id}/`

**الوصف:** حذف نوع منتج (يتطلب صلاحيات إدارية)

### 6. أنواع المنتجات النشطة

**GET** `/api/v1/store/products/product-types/active_types/`

**الوصف:** الحصول على أنواع المنتجات النشطة فقط

### 7. منتجات نوع معين

**GET** `/api/v1/store/products/product-types/{id}/products/`

**الوصف:** الحصول على المنتجات التي تنتمي لنوع معين

**المعاملات:**
- `category` - فلترة حسب الفئة
- `price_min` - الحد الأدنى للسعر
- `price_max` - الحد الأقصى للسعر
- `ordering` - ترتيب النتائج

---

## أمثلة الاستخدام للمطورين

### 1. جلب جميع أنواع المنتجات

```javascript
// باستخدام Fetch API
fetch('/api/v1/store/products/product-types/')
  .then(response => response.json())
  .then(data => {
    console.log('أنواع المنتجات:', data.results);
  })
  .catch(error => {
    console.error('خطأ في جلب أنواع المنتجات:', error);
  });
```

### 2. إنشاء نوع منتج جديد

```javascript
const newProductType = {
  name: 'software',
  display_name: {
    ar: 'برمجيات',
    en: 'Software'
  },
  description: 'البرامج والتطبيقات',
  icon: 'fas fa-code',
  color: '#dc3545',
  is_digital: true,
  requires_shipping: false,
  track_stock: false,
  has_variants: false,
  display_order: 3,
  is_active: true
};

fetch('/api/v1/store/products/product-types/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(newProductType)
})
.then(response => response.json())
.then(data => {
  console.log('تم إنشاء نوع المنتج:', data);
})
.catch(error => {
  console.error('خطأ في إنشاء نوع المنتج:', error);
});
```

### 3. تحديث نوع منتج

```javascript
const updates = {
  display_name: {
    ar: 'برمجيات متطورة',
    en: 'Advanced Software'
  },
  is_active: false
};

fetch('/api/v1/store/products/product-types/uuid-1/', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(updates)
})
.then(response => response.json())
.then(data => {
  console.log('تم تحديث نوع المنتج:', data);
})
.catch(error => {
  console.error('خطأ في تحديث نوع المنتج:', error);
});
```

### 4. جلب المنتجات حسب النوع

```javascript
fetch('/api/v1/store/products/product-types/uuid-1/products/?ordering=-created_at&page_size=10')
  .then(response => response.json())
  .then(data => {
    console.log('المنتجات من هذا النوع:', data.results);
  })
  .catch(error => {
    console.error('خطأ في جلب المنتجات:', error);
  });
```

### 5. فلترة أنواع المنتجات

```javascript
// جلب الأنواع الرقمية فقط
fetch('/api/v1/store/products/product-types/?is_digital=true')
  .then(response => response.json())
  .then(data => {
    console.log('الأنواع الرقمية:', data.results);
  });

// جلب الأنواع التي تحتاج شحن
fetch('/api/v1/store/products/product-types/?requires_shipping=true')
  .then(response => response.json())
  .then(data => {
    console.log('الأنواع التي تحتاج شحن:', data.results);
  });
```

---

## معالجة الأخطاء

### رموز الحالة HTTP

- `200 OK` - نجح الطلب
- `201 Created` - تم إنشاء المورد بنجاح
- `400 Bad Request` - بيانات الطلب غير صحيحة
- `401 Unauthorized` - مطلوب مصادقة
- `403 Forbidden` - مطلوب صلاحيات إدارية
- `404 Not Found` - المورد غير موجود
- `500 Internal Server Error` - خطأ في الخادم

### أمثلة رسائل الخطأ

```json
{
  "detail": "Authentication credentials were not provided."
}
```

```json
{
  "name": [
    "نوع المنتج بهذا الاسم موجود بالفعل."
  ]
}
```

```json
{
  "slug": [
    "نوع المنتج بهذا الرابط موجود بالفعل."
  ]
}
```

---

## الميزات المتقدمة

### 1. مخطط الحقول (Field Schema)

كل نوع منتج يحتوي على مخطط الحقول المطلوبة:

```json
{
  "field_schema": {
    "basic_fields": [
      "title", "description", "price", "weight", 
      "dimensions", "stock_quantity", "min_stock_alert"
    ],
    "custom_fields": []
  }
}
```

### 2. الإعدادات المخصصة

يمكن تخزين إعدادات مخصصة لكل نوع منتج:

```json
{
  "settings": {
    "warranty_required": true,
    "specifications_required": true,
    "max_file_size": "10MB",
    "allowed_file_types": ["pdf", "epub", "mobi"]
  }
}
```

### 3. دعم متعدد اللغات

جميع النصوص تدعم اللغتين العربية والإنجليزية:

```json
{
  "display_name": {
    "ar": "كتب إلكترونية",
    "en": "E-books"
  }
}
```

---

## أفضل الممارسات

### 1. إدارة الحالة

- استخدم `is_active` للتحكم في ظهور النوع
- لا تحذف الأنواع المستخدمة، بل عطلها

### 2. تسمية الأنواع

- استخدم أسماء واضحة ومختصرة
- تجنب المسافات في الاسم الأساسي
- استخدم `display_name` للعرض للمستخدمين

### 3. إعدادات النوع

- حدد `is_digital` بدقة للملفات الرقمية
- استخدم `requires_shipping` للمنتجات المادية
- فعّل `track_stock` للمنتجات الملموسة

### 4. الأمان

- تأكد من وجود صلاحيات إدارية للعمليات الحساسة
- استخدم HTTPS في الإنتاج
- تحقق من صحة البيانات المدخلة

---

## ملاحظات مهمة

1. **الصلاحيات المطلوبة:** جميع عمليات الإنشاء والتحديث والحذف تتطلب صلاحيات إدارية
2. **التخزين المؤقت:** النظام يستخدم التخزين المؤقت لتحسين الأداء
3. **التحقق من الصحة:** يتم التحقق من صحة البيانات تلقائياً
4. **التحديثات التلقائية:** يتم تحديث `slug` و `display_name` تلقائياً
5. **المرونة:** النظام يدعم أنواع منتجات ديناميكية مع إعدادات مخصصة

---

*تم إنشاء هذا التقرير بناءً على تحليل كود المصدر المباشر* 