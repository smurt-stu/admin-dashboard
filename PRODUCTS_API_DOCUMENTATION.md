# وثائق API نظام المنتجات الشامل

## نظرة عامة

هذا الدليل التفصيلي يغطي جميع نقاط النهاية (Endpoints) لنظام المنتجات الديناميكي، بما في ذلك إدارة المنتجات، المتغيرات، الفئات، والصور. النظام يدعم أنواع مختلفة من المنتجات مع متغيرات متقدمة للأحجام والألوان.

## الهيكل العام للنظام

### 📊 النماذج الأساسية

1. **ProductType** - أنواع المنتجات
2. **Category** - الفئات الهرمية
3. **Product** - المنتجات الأساسية
4. **ProductVariant** - متغيرات المنتجات
5. **ProductImage** - صور المنتجات
6. **ProductField** - الحقول المخصصة

### 🔗 العلاقات الأساسية

```
ProductType (1) ←→ (N) Product
Category (1) ←→ (N) Product
Product (1) ←→ (N) ProductVariant
Product (1) ←→ (N) ProductImage
Product (1) ←→ (N) ProductField
ProductVariant (1) ←→ (N) ProductImage
```

## أنواع المنتجات المدعومة

### 👕 الملابس (Clothing)
- **الأحجام**: XS, S, M, L, XL, XXL
- **الألوان**: أحمر، أزرق، أخضر، أصفر، أسود، أبيض، رمادي، بني
- **المواد**: قطن، بوليستر، حرير، صوف، دينيم

### 👟 الأحذية (Shoes)
- **الأحجام**: 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
- **الألوان**: أحمر، أزرق، أخضر، أصفر، أسود، أبيض، رمادي، بني
- **الأنواع**: رياضي، رسمي، كاجوال، صيفي، شتوي

### 📚 الكتب (Books)
- **الأنواع**: كتب تعليمية، روايات، مراجع
- **اللغات**: عربي، إنجليزي، فرنسي
- **الأشكال**: ورقي، إلكتروني

### 🎮 الإلكترونيات (Electronics)
- **الأنواع**: هواتف، أجهزة كمبيوتر، أجهزة منزلية
- **الخصائص**: اللون، السعة، الطراز

## المصادقة والصلاحيات

### 🔐 رموز المصادقة المطلوبة

```http
Authorization: Bearer <access_token>
```

### 👥 أنواع المستخدمين

1. **المدير (Admin)**: صلاحيات كاملة
2. **مدير المتجر (Store Manager)**: إدارة المنتجات والفئات
3. **محرر المنتجات (Product Editor)**: تعديل المنتجات
4. **المشاهد (Viewer)**: عرض المنتجات فقط

### 🔑 الصلاحيات المطلوبة

- `products.view` - عرض المنتجات
- `products.add` - إضافة منتجات
- `products.edit` - تعديل المنتجات
- `products.delete` - حذف المنتجات
- `categories.manage` - إدارة الفئات
- `variants.manage` - إدارة المتغيرات
- `images.manage` - إدارة الصور

## رموز الاستجابة العامة

### ✅ نجح (200-299)
```json
{
    "success": true,
    "message": "تمت العملية بنجاح",
    "data": {...}
}
```

### ❌ خطأ (400-499)
```json
{
    "success": false,
    "error": "رسالة الخطأ",
    "code": "ERROR_CODE"
}
```

### ⚠️ خطأ في الخادم (500-599)
```json
{
    "success": false,
    "error": "خطأ في الخادم",
    "code": "SERVER_ERROR"
}
```

## معايير الاستعلام العامة

### 📄 التصفح والترقيم
```http
GET /api/products/?page=1&page_size=20
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "results": [...],
        "pagination": {
            "page": 1,
            "page_size": 20,
            "total_pages": 5,
            "total_count": 100,
            "has_next": true,
            "has_previous": false
        }
    }
}
```

### 🔍 البحث والتصفية
```http
GET /api/products/?search=قميص&category=clothing&price_min=50&price_max=200&size=M&color=أحمر
```

**معايير البحث المدعومة:**
- `search` - البحث في العنوان والوصف
- `category` - تصفية حسب الفئة
- `product_type` - تصفية حسب نوع المنتج
- `price_min` / `price_max` - نطاق السعر
- `size` - تصفية حسب الحجم
- `color` - تصفية حسب اللون
- `brand` - تصفية حسب الماركة
- `is_featured` - المنتجات المميزة
- `is_on_sale` - المنتجات المخفضة
- `in_stock` - المنتجات المتوفرة

### 📊 الترتيب
```http
GET /api/products/?ordering=price_asc
GET /api/products/?ordering=created_at_desc
GET /api/products/?ordering=name_asc
```

**خيارات الترتيب:**
- `price_asc` / `price_desc` - حسب السعر
- `created_at_asc` / `created_at_desc` - حسب تاريخ الإنشاء
- `name_asc` / `name_desc` - حسب الاسم
- `popularity_desc` - حسب الشعبية
- `rating_desc` - حسب التقييم

## دعم اللغات

### 🌐 معايير اللغة
```http
GET /api/products/?lang=ar
GET /api/products/?lang=en
```

### 📝 تنسيق البيانات متعددة اللغات
```json
{
    "title": {
        "ar": "قميص قطني كلاسيك",
        "en": "Classic Cotton Shirt"
    },
    "description": {
        "ar": "قميص قطني مريح وأنيق",
        "en": "Comfortable and elegant cotton shirt"
    }
}
```

## إدارة الملفات والصور

### 📁 رفع الصور
```http
POST /api/products/images/upload/
Content-Type: multipart/form-data
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "image_url": "https://example.com/media/products/image.jpg",
        "image_id": "uuid-here"
    }
}
```

### 🖼️ أنواع الصور المدعومة
- **المنتج الرئيسي**: صورة رئيسية للمنتج
- **معرض الصور**: صور إضافية للمعرض
- **صورة المتغير**: صورة خاصة بمتغير معين
- **صورة الفئة**: صورة للفئة

### 📏 مواصفات الصور
- **الحد الأقصى**: 5MB لكل صورة
- **الصيغ المدعومة**: JPG, PNG, WebP
- **الأبعاد الموصى بها**: 800x600px
- **الضغط التلقائي**: نعم

---

# الجزء الثاني: إدارة أنواع المنتجات (ProductType APIs)

## نظرة عامة على أنواع المنتجات

أنواع المنتجات هي الأساس الذي يحدد خصائص وسلوك المنتجات في النظام. كل نوع منتج له إعدادات خاصة ومتغيرات محددة.

## نقاط النهاية الأساسية

### 📋 عرض جميع أنواع المنتجات

```http
GET /api/product-types/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "results": [
            {
                "id": "uuid-here",
                "name": "clothing",
                "display_name": {
                    "ar": "ملابس",
                    "en": "Clothing"
                },
                "slug": "clothing",
                "description": "الملابس والأنسجة",
                "icon": "fas fa-tshirt",
                "color": "#e91e63",
                "is_digital": false,
                "requires_shipping": true,
                "track_stock": true,
                "has_variants": true,
                "template_name": "product_clothing",
                "settings": {
                    "size_options": ["XS", "S", "M", "L", "XL", "XXL"],
                    "color_options": ["أحمر", "أزرق", "أخضر", "أصفر", "أسود", "أبيض", "رمادي", "بني"],
                    "material_types": ["قطن", "بوليستر", "حرير", "صوف", "دينيم"]
                },
                "display_order": 1,
                "products_count": 15,
                "created_at": "2025-07-29T10:30:00Z",
                "updated_at": "2025-07-29T10:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "page_size": 20,
            "total_pages": 1,
            "total_count": 4,
            "has_next": false,
            "has_previous": false
        }
    }
}
```

### 🔍 عرض نوع منتج محدد

```http
GET /api/product-types/{id}/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "id": "uuid-here",
        "name": "clothing",
        "display_name": {
            "ar": "ملابس",
            "en": "Clothing"
        },
        "slug": "clothing",
        "description": "الملابس والأنسجة",
        "icon": "fas fa-tshirt",
        "color": "#e91e63",
        "is_digital": false,
        "requires_shipping": true,
        "track_stock": true,
        "has_variants": true,
        "template_name": "product_clothing",
        "settings": {
            "size_options": ["XS", "S", "M", "L", "XL", "XXL"],
            "color_options": ["أحمر", "أزرق", "أخضر", "أصفر", "أسود", "أبيض", "رمادي", "بني"],
            "material_types": ["قطن", "بوليستر", "حرير", "صوف", "دينيم"]
        },
        "display_order": 1,
        "products_count": 15,
        "products": [
            {
                "id": "product-uuid",
                "title": {
                    "ar": "قميص قطني كلاسيك",
                    "en": "Classic Cotton Shirt"
                },
                "price": "89.99",
                "is_featured": true
            }
        ],
        "created_at": "2025-07-29T10:30:00Z",
        "updated_at": "2025-07-29T10:30:00Z"
    }
}
```

### ➕ إنشاء نوع منتج جديد

```http
POST /api/product-types/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "name": "electronics",
    "display_name": {
        "ar": "إلكترونيات",
        "en": "Electronics"
    },
    "description": "الأجهزة الإلكترونية والكهربائية",
    "icon": "fas fa-mobile-alt",
    "color": "#2196f3",
    "is_digital": false,
    "requires_shipping": true,
    "track_stock": true,
    "has_variants": true,
    "template_name": "product_electronics",
    "settings": {
        "brand_options": ["Apple", "Samsung", "Sony", "LG"],
        "color_options": ["أحمر", "أزرق", "أسود", "أبيض", "ذهبي", "فضي"],
        "storage_options": ["32GB", "64GB", "128GB", "256GB", "512GB"]
    },
    "display_order": 3
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إنشاء نوع المنتج بنجاح",
    "data": {
        "id": "new-uuid-here",
        "name": "electronics",
        "display_name": {
            "ar": "إلكترونيات",
            "en": "Electronics"
        },
        "slug": "electronics",
        "description": "الأجهزة الإلكترونية والكهربائية",
        "icon": "fas fa-mobile-alt",
        "color": "#2196f3",
        "is_digital": false,
        "requires_shipping": true,
        "track_stock": true,
        "has_variants": true,
        "template_name": "product_electronics",
        "settings": {
            "brand_options": ["Apple", "Samsung", "Sony", "LG"],
            "color_options": ["أحمر", "أزرق", "أسود", "أبيض", "ذهبي", "فضي"],
            "storage_options": ["32GB", "64GB", "128GB", "256GB", "512GB"]
        },
        "display_order": 3,
        "products_count": 0,
        "created_at": "2025-07-29T11:00:00Z",
        "updated_at": "2025-07-29T11:00:00Z"
    }
}
```

### ✏️ تعديل نوع منتج

```http
PUT /api/product-types/{id}/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "display_name": {
        "ar": "ملابس عصرية",
        "en": "Modern Clothing"
    },
    "description": "ملابس عصرية وأنيقة",
    "color": "#ff5722",
    "settings": {
        "size_options": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "color_options": ["أحمر", "أزرق", "أخضر", "أصفر", "أسود", "أبيض", "رمادي", "بني", "أرجواني"],
        "material_types": ["قطن", "بوليستر", "حرير", "صوف", "دينيم", "كشمير"]
    }
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث نوع المنتج بنجاح",
    "data": {
        "id": "uuid-here",
        "name": "clothing",
        "display_name": {
            "ar": "ملابس عصرية",
            "en": "Modern Clothing"
        },
        "updated_at": "2025-07-29T11:15:00Z"
    }
}
```

### 🗑️ حذف نوع منتج

```http
DELETE /api/product-types/{id}/
Authorization: Bearer <admin_token>
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم حذف نوع المنتج بنجاح"
}
```

## نقاط النهاية المتقدمة

### 📊 إحصائيات نوع المنتج

```http
GET /api/product-types/{id}/statistics/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "total_products": 15,
        "active_products": 12,
        "total_variants": 135,
        "total_revenue": "12500.50",
        "average_price": "833.37",
        "top_categories": [
            {
                "category_name": "قمصان",
                "products_count": 5
            },
            {
                "category_name": "بناطيل",
                "products_count": 4
            }
        ],
        "top_colors": [
            {
                "color": "أحمر",
                "variants_count": 25
            },
            {
                "color": "أزرق",
                "variants_count": 22
            }
        ],
        "top_sizes": [
            {
                "size": "M",
                "variants_count": 30
            },
            {
                "size": "L",
                "variants_count": 28
            }
        ]
    }
}
```

### 🔧 إعدادات نوع المنتج

```http
GET /api/product-types/{id}/settings/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "size_options": ["XS", "S", "M", "L", "XL", "XXL"],
        "color_options": ["أحمر", "أزرق", "أخضر", "أصفر", "أسود", "أبيض", "رمادي", "بني"],
        "material_types": ["قطن", "بوليستر", "حرير", "صوف", "دينيم"],
        "brand_options": [],
        "storage_options": [],
        "custom_fields": [
            {
                "name": "material",
                "label": {
                    "ar": "المادة",
                    "en": "Material"
                },
                "type": "select",
                "required": true
            },
            {
                "name": "care_instructions",
                "label": {
                    "ar": "تعليمات العناية",
                    "en": "Care Instructions"
                },
                "type": "textarea",
                "required": false
            }
        ]
    }
}
```

### 📝 تحديث إعدادات نوع المنتج

```http
PUT /api/product-types/{id}/settings/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "size_options": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    "color_options": ["أحمر", "أزرق", "أخضر", "أصفر", "أسود", "أبيض", "رمادي", "بني", "أرجواني"],
    "material_types": ["قطن", "بوليستر", "حرير", "صوف", "دينيم", "كشمير"],
    "custom_fields": [
        {
            "name": "material",
            "label": {
                "ar": "المادة",
                "en": "Material"
            },
            "type": "select",
            "required": true,
            "options": ["قطن", "بوليستر", "حرير", "صوف", "دينيم", "كشمير"]
        },
        {
            "name": "care_instructions",
            "label": {
                "ar": "تعليمات العناية",
                "en": "Care Instructions"
            },
            "type": "textarea",
            "required": false
        }
    ]
}
```

## معايير الاستعلام المدعومة

### 🔍 البحث والتصفية

```http
GET /api/product-types/?search=ملابس&has_variants=true&is_digital=false
```

**المعايير المدعومة:**
- `search` - البحث في الاسم والوصف
- `has_variants` - تصفية حسب دعم المتغيرات
- `is_digital` - تصفية حسب نوع المنتج (رقمي/مادي)
- `requires_shipping` - تصفية حسب الحاجة للشحن
- `track_stock` - تصفية حسب تتبع المخزون
- `is_active` - تصفية حسب الحالة النشطة

### 📊 الترتيب

```http
GET /api/product-types/?ordering=display_order_asc
GET /api/product-types/?ordering=products_count_desc
GET /api/product-types/?ordering=name_asc
```

**خيارات الترتيب:**
- `display_order_asc` / `display_order_desc` - حسب ترتيب العرض
- `products_count_asc` / `products_count_desc` - حسب عدد المنتجات
- `name_asc` / `name_desc` - حسب الاسم
- `created_at_asc` / `created_at_desc` - حسب تاريخ الإنشاء

## أخطاء شائعة وحلولها

### ❌ خطأ: اسم نوع المنتج مكرر

```json
{
    "success": false,
    "error": "نوع المنتج بهذا الاسم موجود بالفعل",
    "code": "DUPLICATE_PRODUCT_TYPE_NAME"
}
```

**الحل:** استخدم اسم فريد أو تحقق من الأنواع الموجودة أولاً.

### ❌ خطأ: لا يمكن حذف نوع منتج يحتوي على منتجات

```json
{
    "success": false,
    "error": "لا يمكن حذف نوع المنتج لأنه يحتوي على منتجات",
    "code": "PRODUCT_TYPE_HAS_PRODUCTS"
}
```

**الحل:** احذف أو انقل المنتجات أولاً، ثم احذف نوع المنتج.

### ❌ خطأ: إعدادات غير صحيحة

```json
{
    "success": false,
    "error": "الإعدادات غير صحيحة",
    "code": "INVALID_SETTINGS",
    "details": {
        "size_options": "يجب أن تكون قائمة غير فارغة",
        "color_options": "يجب أن تكون قائمة غير فارغة"
    }
}
```

**الحل:** تأكد من أن الإعدادات تحتوي على قيم صحيحة.

## أمثلة عملية

### مثال 1: إنشاء نوع منتج للملابس

```javascript
// إنشاء نوع منتج للملابس
const clothingType = {
    name: "clothing",
    display_name: {
        ar: "ملابس",
        en: "Clothing"
    },
    description: "الملابس والأنسجة",
    icon: "fas fa-tshirt",
    color: "#e91e63",
    is_digital: false,
    requires_shipping: true,
    track_stock: true,
    has_variants: true,
    template_name: "product_clothing",
    settings: {
        size_options: ["XS", "S", "M", "L", "XL", "XXL"],
        color_options: ["أحمر", "أزرق", "أخضر", "أصفر", "أسود", "أبيض", "رمادي", "بني"],
        material_types: ["قطن", "بوليستر", "حرير", "صوف", "دينيم"]
    },
    display_order: 1
};

fetch('/api/product-types/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(clothingType)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('تم إنشاء نوع المنتج:', data.data);
    }
});
```

### مثال 2: عرض أنواع المنتجات مع إحصائيات

```javascript
// عرض أنواع المنتجات مع إحصائيات
fetch('/api/product-types/?include_statistics=true')
.then(response => response.json())
.then(data => {
    if (data.success) {
        data.data.results.forEach(type => {
            console.log(`${type.display_name.ar}: ${type.products_count} منتج`);
        });
    }
});
```

---

# الجزء الثالث: إدارة الفئات (Category APIs)

## نظرة عامة على الفئات

الفئات هي نظام هرمي لتنظيم المنتجات. تدعم الفئات العلاقات الأب-الابن، مما يسمح بإنشاء فئات رئيسية وفئات فرعية.

## نقاط النهاية الأساسية

### 📋 عرض جميع الفئات

```http
GET /api/categories/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "results": [
            {
                "id": "uuid-here",
                "name": {
                    "ar": "ملابس رجالية",
                    "en": "Men's Clothing"
                },
                "slug": "mens-clothing",
                "description": {
                    "ar": "ملابس للرجال",
                    "en": "Clothing for men"
                },
                "icon": "fas fa-male",
                "image": "categories/mens-clothing.jpg",
                "display_order": 1,
                "is_active": true,
                "parent": null,
                "children": [
                    {
                        "id": "child-uuid",
                        "name": {
                            "ar": "قمصان",
                            "en": "Shirts"
                        },
                        "slug": "shirts",
                        "products_count": 5
                    }
                ],
                "products_count": 15,
                "meta_title": {
                    "ar": "ملابس رجالية - متجر الأزياء",
                    "en": "Men's Clothing - Fashion Store"
                },
                "meta_description": {
                    "ar": "أفضل الملابس الرجالية العصرية",
                    "en": "Best modern men's clothing"
                },
                "created_at": "2025-07-29T10:30:00Z",
                "updated_at": "2025-07-29T10:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "page_size": 20,
            "total_pages": 1,
            "total_count": 16,
            "has_next": false,
            "has_previous": false
        }
    }
}
```

### 🔍 عرض فئة محددة

```http
GET /api/categories/{id}/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "id": "uuid-here",
        "name": {
            "ar": "ملابس رجالية",
            "en": "Men's Clothing"
        },
        "slug": "mens-clothing",
        "description": {
            "ar": "ملابس للرجال",
            "en": "Clothing for men"
        },
        "icon": "fas fa-male",
        "image": "categories/mens-clothing.jpg",
        "display_order": 1,
        "is_active": true,
        "parent": null,
        "children": [
            {
                "id": "child-uuid-1",
                "name": {
                    "ar": "قمصان",
                    "en": "Shirts"
                },
                "slug": "shirts",
                "products_count": 5,
                "children": []
            },
            {
                "id": "child-uuid-2",
                "name": {
                    "ar": "بناطيل",
                    "en": "Pants"
                },
                "slug": "pants",
                "products_count": 4,
                "children": []
            }
        ],
        "products": [
            {
                "id": "product-uuid",
                "title": {
                    "ar": "قميص قطني كلاسيك",
                    "en": "Classic Cotton Shirt"
                },
                "price": "89.99",
                "main_image": "products/shirt-main.jpg",
                "is_featured": true
            }
        ],
        "products_count": 15,
        "meta_title": {
            "ar": "ملابس رجالية - متجر الأزياء",
            "en": "Men's Clothing - Fashion Store"
        },
        "meta_description": {
            "ar": "أفضل الملابس الرجالية العصرية",
            "en": "Best modern men's clothing"
        },
        "created_at": "2025-07-29T10:30:00Z",
        "updated_at": "2025-07-29T10:30:00Z"
    }
}
```

### ➕ إنشاء فئة جديدة

```http
POST /api/categories/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "name": {
        "ar": "أحذية رياضية",
        "en": "Sports Shoes"
    },
    "description": {
        "ar": "أحذية رياضية مريحة",
        "en": "Comfortable sports shoes"
    },
    "icon": "fas fa-running",
    "parent": "parent-category-uuid",
    "display_order": 2,
    "meta_title": {
        "ar": "أحذية رياضية - متجر الأزياء",
        "en": "Sports Shoes - Fashion Store"
    },
    "meta_description": {
        "ar": "أفضل الأحذية الرياضية المريحة",
        "en": "Best comfortable sports shoes"
    }
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إنشاء الفئة بنجاح",
    "data": {
        "id": "new-uuid-here",
        "name": {
            "ar": "أحذية رياضية",
            "en": "Sports Shoes"
        },
        "slug": "sports-shoes",
        "description": {
            "ar": "أحذية رياضية مريحة",
            "en": "Comfortable sports shoes"
        },
        "icon": "fas fa-running",
        "image": null,
        "display_order": 2,
        "is_active": true,
        "parent": {
            "id": "parent-uuid",
            "name": {
                "ar": "أحذية",
                "en": "Shoes"
            }
        },
        "children": [],
        "products_count": 0,
        "meta_title": {
            "ar": "أحذية رياضية - متجر الأزياء",
            "en": "Sports Shoes - Fashion Store"
        },
        "meta_description": {
            "ar": "أفضل الأحذية الرياضية المريحة",
            "en": "Best comfortable sports shoes"
        },
        "created_at": "2025-07-29T11:00:00Z",
        "updated_at": "2025-07-29T11:00:00Z"
    }
}
```

### ✏️ تعديل فئة

```http
PUT /api/categories/{id}/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "name": {
        "ar": "أحذية رياضية عصرية",
        "en": "Modern Sports Shoes"
    },
    "description": {
        "ar": "أحذية رياضية عصرية ومريحة",
        "en": "Modern and comfortable sports shoes"
    },
    "display_order": 3,
    "meta_title": {
        "ar": "أحذية رياضية عصرية - متجر الأزياء",
        "en": "Modern Sports Shoes - Fashion Store"
    }
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث الفئة بنجاح",
    "data": {
        "id": "uuid-here",
        "name": {
            "ar": "أحذية رياضية عصرية",
            "en": "Modern Sports Shoes"
        },
        "updated_at": "2025-07-29T11:15:00Z"
    }
}
```

### 🗑️ حذف فئة

```http
DELETE /api/categories/{id}/
Authorization: Bearer <admin_token>
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم حذف الفئة بنجاح"
}
```

## نقاط النهاية المتقدمة

### 📊 إحصائيات الفئة

```http
GET /api/categories/{id}/statistics/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "total_products": 15,
        "active_products": 12,
        "total_variants": 135,
        "total_revenue": "12500.50",
        "average_price": "833.37",
        "top_products": [
            {
                "id": "product-uuid",
                "title": {
                    "ar": "قميص قطني كلاسيك",
                    "en": "Classic Cotton Shirt"
                },
                "price": "89.99",
                "sales_count": 25
            }
        ],
        "price_range": {
            "min": "29.99",
            "max": "299.99",
            "average": "89.99"
        },
        "subcategories": [
            {
                "id": "subcategory-uuid",
                "name": {
                    "ar": "قمصان",
                    "en": "Shirts"
                },
                "products_count": 5
            }
        ]
    }
}
```

### 🌳 شجرة الفئات

```http
GET /api/categories/tree/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": [
        {
            "id": "root-uuid",
            "name": {
                "ar": "ملابس رجالية",
                "en": "Men's Clothing"
            },
            "slug": "mens-clothing",
            "products_count": 15,
            "children": [
                {
                    "id": "child-uuid-1",
                    "name": {
                        "ar": "قمصان",
                        "en": "Shirts"
                    },
                    "slug": "shirts",
                    "products_count": 5,
                    "children": []
                },
                {
                    "id": "child-uuid-2",
                    "name": {
                        "ar": "بناطيل",
                        "en": "Pants"
                    },
                    "slug": "pants",
                    "products_count": 4,
                    "children": []
                }
            ]
        },
        {
            "id": "root-uuid-2",
            "name": {
                "ar": "ملابس نسائية",
                "en": "Women's Clothing"
            },
            "slug": "womens-clothing",
            "products_count": 12,
            "children": []
        }
    ]
}
```

### 📁 فئات الأب فقط

```http
GET /api/categories/parents/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "results": [
            {
                "id": "parent-uuid",
                "name": {
                    "ar": "ملابس رجالية",
                    "en": "Men's Clothing"
                },
                "slug": "mens-clothing",
                "products_count": 15,
                "children_count": 3
            },
            {
                "id": "parent-uuid-2",
                "name": {
                    "ar": "ملابس نسائية",
                    "en": "Women's Clothing"
                },
                "slug": "womens-clothing",
                "products_count": 12,
                "children_count": 2
            }
        ]
    }
}
```

### 🔄 إعادة ترتيب الفئات

```http
PUT /api/categories/reorder/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "categories": [
        {
            "id": "category-uuid-1",
            "display_order": 1
        },
        {
            "id": "category-uuid-2",
            "display_order": 2
        },
        {
            "id": "category-uuid-3",
            "display_order": 3
        }
    ]
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إعادة ترتيب الفئات بنجاح"
}
```

### 🖼️ رفع صورة الفئة

```http
POST /api/categories/{id}/upload-image/
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```
image: [file]
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم رفع صورة الفئة بنجاح",
    "data": {
        "image_url": "https://example.com/media/categories/category-image.jpg"
    }
}
```

## معايير الاستعلام المدعومة

### 🔍 البحث والتصفية

```http
GET /api/categories/?search=ملابس&is_active=true&parent=null
```

**المعايير المدعومة:**
- `search` - البحث في الاسم والوصف
- `is_active` - تصفية حسب الحالة النشطة
- `parent` - تصفية حسب الفئة الأب (null للفئات الرئيسية)
- `has_products` - تصفية حسب وجود منتجات
- `product_type` - تصفية حسب نوع المنتج

### 📊 الترتيب

```http
GET /api/categories/?ordering=display_order_asc
GET /api/categories/?ordering=products_count_desc
GET /api/categories/?ordering=name_asc
```

**خيارات الترتيب:**
- `display_order_asc` / `display_order_desc` - حسب ترتيب العرض
- `products_count_asc` / `products_count_desc` - حسب عدد المنتجات
- `name_asc` / `name_desc` - حسب الاسم
- `created_at_asc` / `created_at_desc` - حسب تاريخ الإنشاء

### 🌐 دعم اللغات

```http
GET /api/categories/?lang=ar
GET /api/categories/?lang=en
```

## أخطاء شائعة وحلولها

### ❌ خطأ: اسم الفئة مكرر

```json
{
    "success": false,
    "error": "الفئة بهذا الاسم موجودة بالفعل",
    "code": "DUPLICATE_CATEGORY_NAME"
}
```

**الحل:** استخدم اسم فريد أو تحقق من الفئات الموجودة أولاً.

### ❌ خطأ: لا يمكن حذف فئة تحتوي على منتجات

```json
{
    "success": false,
    "error": "لا يمكن حذف الفئة لأنها تحتوي على منتجات",
    "code": "CATEGORY_HAS_PRODUCTS"
}
```

**الحل:** انقل المنتجات إلى فئة أخرى أولاً، ثم احذف الفئة.

### ❌ خطأ: لا يمكن حذف فئة تحتوي على فئات فرعية

```json
{
    "success": false,
    "error": "لا يمكن حذف الفئة لأنها تحتوي على فئات فرعية",
    "code": "CATEGORY_HAS_CHILDREN"
}
```

**الحل:** احذف أو انقل الفئات الفرعية أولاً، ثم احذف الفئة الرئيسية.

### ❌ خطأ: فئة الأب غير موجودة

```json
{
    "success": false,
    "error": "فئة الأب غير موجودة",
    "code": "PARENT_CATEGORY_NOT_FOUND"
}
```

**الحل:** تأكد من وجود فئة الأب قبل إنشاء الفئة الفرعية.

## أمثلة عملية

### مثال 1: إنشاء فئة هرمية

```javascript
// إنشاء فئة رئيسية
const parentCategory = {
    name: {
        ar: "ملابس رجالية",
        en: "Men's Clothing"
    },
    description: {
        ar: "ملابس للرجال",
        en: "Clothing for men"
    },
    icon: "fas fa-male",
    display_order: 1
};

fetch('/api/categories/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(parentCategory)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        const parentId = data.data.id;
        
        // إنشاء فئة فرعية
        const childCategory = {
            name: {
                ar: "قمصان",
                en: "Shirts"
            },
            description: {
                ar: "قمصان رجالية",
                en: "Men's shirts"
            },
            icon: "fas fa-tshirt",
            parent: parentId,
            display_order: 1
        };
        
        return fetch('/api/categories/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(childCategory)
        });
    }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('تم إنشاء الفئة الفرعية:', data.data);
    }
});
```

### مثال 2: عرض شجرة الفئات

```javascript
// عرض شجرة الفئات
fetch('/api/categories/tree/')
.then(response => response.json())
.then(data => {
    if (data.success) {
        data.data.forEach(category => {
            console.log(`${category.name.ar} (${category.products_count} منتج)`);
            category.children.forEach(child => {
                console.log(`  └─ ${child.name.ar} (${child.products_count} منتج)`);
            });
        });
    }
});
```

### مثال 3: إحصائيات الفئة

```javascript
// عرض إحصائيات فئة محددة
const categoryId = 'category-uuid';
fetch(`/api/categories/${categoryId}/statistics/`)
.then(response => response.json())
.then(data => {
    if (data.success) {
        const stats = data.data;
        console.log(`إجمالي المنتجات: ${stats.total_products}`);
        console.log(`إجمالي المتغيرات: ${stats.total_variants}`);
        console.log(`إجمالي الإيرادات: ${stats.total_revenue}`);
        console.log(`متوسط السعر: ${stats.average_price}`);
    }
});
```

---

# الجزء الرابع: إدارة المنتجات (Product APIs)

## نظرة عامة على المنتجات

المنتجات هي العنصر الأساسي في النظام. كل منتج ينتمي إلى نوع منتج وفئة، ويمكن أن يحتوي على متغيرات متعددة وحقول مخصصة.

## نقاط النهاية الأساسية

### 📋 عرض جميع المنتجات

```http
GET /api/products/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "results": [
            {
                "id": "uuid-here",
                "title": {
                    "ar": "قميص قطني كلاسيك",
                    "en": "Classic Cotton Shirt"
                },
                "slug": "classic-cotton-shirt",
                "description": {
                    "ar": "قميص قطني مريح وأنيق",
                    "en": "Comfortable and elegant cotton shirt"
                },
                "short_description": {
                    "ar": "قميص قطني 100%",
                    "en": "100% cotton shirt"
                },
                "sku": "SHIRT-001",
                "brand": "Fashion Brand",
                "price": "89.99",
                "compare_price": "120.00",
                "cost_price": "45.00",
                "discount_percentage": "25.01",
                "stock_quantity": 150,
                "min_stock_alert": 10,
                "weight": "0.25",
                "dimensions": {
                    "length": "70",
                    "width": "50",
                    "height": "2"
                },
                "digital_file": null,
                "sample_file": null,
                "main_image": "products/shirt-main.jpg",
                "is_featured": true,
                "is_on_sale": true,
                "tags": "ملابس,أزياء,عصرية",
                "meta_title": {
                    "ar": "قميص قطني كلاسيك - متجر الأزياء",
                    "en": "Classic Cotton Shirt - Fashion Store"
                },
                "meta_description": {
                    "ar": "قميص قطني مريح وأنيق",
                    "en": "Comfortable and elegant cotton shirt"
                },
                "settings": {
                    "allow_reviews": true,
                    "allow_ratings": true,
                    "show_stock": true
                },
                "category": {
                    "id": "category-uuid",
                    "name": {
                        "ar": "قمصان",
                        "en": "Shirts"
                    },
                    "slug": "shirts"
                },
                "product_type": {
                    "id": "type-uuid",
                    "name": "clothing",
                    "display_name": {
                        "ar": "ملابس",
                        "en": "Clothing"
                    }
                },
                "variants_count": 9,
                "images_count": 3,
                "fields_count": 4,
                "is_in_stock": true,
                "is_low_stock": false,
                "effective_price": "89.99",
                "created_at": "2025-07-29T10:30:00Z",
                "updated_at": "2025-07-29T10:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "page_size": 20,
            "total_pages": 3,
            "total_count": 54,
            "has_next": true,
            "has_previous": false
        }
    }
}
```

### 🔍 عرض منتج محدد

```http
GET /api/products/{id}/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "id": "c83d1ee9-6501-433e-967e-ddaa65e95bce",
        "title": "حذاء رياضي مريح",
        "slug": "comfortable-sports-shoes",
        "short_description": "حذاء رياضي مريح",
        "category_name": "ملابس رجالية",
        "product_type_name": "أحذية",
        "brand": "SportMax",
        "price": "149.99",
        "effective_price": 149.99,
        "compare_price": "199.00",
        "savings_amount": 49.01,
        "discount_percentage": "0.00",
        "is_featured": true,
        "is_on_sale": true,
        "is_in_stock": true,
        "main_image": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_main.jpg",
        "main_image_url": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_main.jpg",
        "created_at": "2025-07-29T14:14:10.691117Z",
        "is_active": true,
        "description": "حذاء رياضي مريح مناسب للجري والرياضة",
        "category": {
            "id": "fa27eaa1-3c7b-42b6-89fc-559363673157",
            "name": "ملابس رجالية",
            "slug": "mlbs-rjly-b3e69913",
            "icon": "fas fa-male",
            "level": 0,
            "products_count": 4,
            "display_order": 6,
            "is_active": true
        },
        "product_type": {
            "id": "e2cfd623-f546-4f27-98ea-c9f548f629d8",
            "name": "shoes",
            "display_name": "أحذية",
            "slug": "shoes",
            "description": "الأحذية والجزم",
            "icon": "fas fa-shoe-prints",
            "color": "#795548",
            "is_digital": false,
            "requires_shipping": true,
            "track_stock": true,
            "has_variants": true,
            "template_name": "product_shoes",
            "field_schema": {
                "basic_fields": [
                    "title",
                    "description",
                    "price",
                    "weight",
                    "dimensions",
                    "stock_quantity",
                    "min_stock_alert"
                ],
                "custom_fields": []
            },
            "settings": {
                "shoe_types": [
                    "رياضي",
                    "رسمي",
                    "كاجوال",
                    "صيفي",
                    "شتوي"
                ],
                "size_options": [
                    "36",
                    "37",
                    "38",
                    "39",
                    "40",
                    "41",
                    "42",
                    "43",
                    "44",
                    "45"
                ],
                "color_options": [
                    "أحمر",
                    "أزرق",
                    "أخضر",
                    "أصفر",
                    "أسود",
                    "أبيض",
                    "رمادي",
                    "بني"
                ]
            },
            "display_order": 0,
            "created_at": "2025-07-29T14:14:04.477265Z",
            "updated_at": "2025-07-29T14:14:04.477286Z",
            "is_active": true
        },
        "sku": "SHO-8675DC57",
        "cost_price": null,
        "stock_quantity": 40,
        "min_stock_alert": 5,
        "weight": null,
        "dimensions": {},
        "digital_file": null,
        "sample_file": null,
        "tags": "أحذية,أنيقة,مريحة",
        "tags_list": [
            "أحذية",
            "أنيقة",
            "مريحة"
        ],
        "custom_fields": [
            {
                "id": "aa9cb0de-cfb0-4749-8d8f-bae921abb5aa",
                "field_name": "النوع",
                "label": "النوع",
                "field_type": "text",
                "field_value": {
                    "ar": "رياضي",
                    "en": "رياضي"
                },
                "display_value": "{'ar': 'رياضي', 'en': 'رياضي'}",
                "formatted_value": {
                    "name": "النوع",
                    "label": "النوع",
                    "type": "text",
                    "value": {
                        "ar": "رياضي",
                        "en": "رياضي"
                    },
                    "display_value": "{'ar': 'رياضي', 'en': 'رياضي'}",
                    "is_required": false,
                    "options": null
                },
                "display_order": 1,
                "is_required": false,
                "is_searchable": true,
                "is_filterable": true,
                "options": [],
                "settings": {},
                "is_active": true
            },
            {
                "id": "d58f3d49-306e-47cd-ad1d-99fe2e7c6e43",
                "field_name": "المادة",
                "label": "المادة",
                "field_type": "text",
                "field_value": {
                    "ar": "جلد طبيعي",
                    "en": "جلد طبيعي"
                },
                "display_value": "{'ar': 'جلد طبيعي', 'en': 'جلد طبيعي'}",
                "formatted_value": {
                    "name": "المادة",
                    "label": "المادة",
                    "type": "text",
                    "value": {
                        "ar": "جلد طبيعي",
                        "en": "جلد طبيعي"
                    },
                    "display_value": "{'ar': 'جلد طبيعي', 'en': 'جلد طبيعي'}",
                    "is_required": false,
                    "options": null
                },
                "display_order": 2,
                "is_required": false,
                "is_searchable": true,
                "is_filterable": true,
                "options": [],
                "settings": {},
                "is_active": true
            },
            {
                "id": "d340923e-d66f-418a-ae8e-0703ee8e3856",
                "field_name": "النعل",
                "label": "النعل",
                "field_type": "text",
                "field_value": {
                    "ar": "مطاطي",
                    "en": "مطاطي"
                },
                "display_value": "{'ar': 'مطاطي', 'en': 'مطاطي'}",
                "formatted_value": {
                    "name": "النعل",
                    "label": "النعل",
                    "type": "text",
                    "value": {
                        "ar": "مطاطي",
                        "en": "مطاطي"
                    },
                    "display_value": "{'ar': 'مطاطي', 'en': 'مطاطي'}",
                    "is_required": false,
                    "options": null
                },
                "display_order": 3,
                "is_required": false,
                "is_searchable": true,
                "is_filterable": true,
                "options": [],
                "settings": {},
                "is_active": true
            },
            {
                "id": "510fc11d-dd63-4ff6-ae3f-dd7ecc3626d1",
                "field_name": "الضمان",
                "label": "الضمان",
                "field_type": "text",
                "field_value": {
                    "ar": "1 سنة",
                    "en": "1 سنة"
                },
                "display_value": "{'ar': '1 سنة', 'en': '1 سنة'}",
                "display_value": "{'ar': '1 سنة', 'en': '1 سنة'}",
                "formatted_value": {
                    "name": "الضمان",
                    "label": "الضمان",
                    "type": "text",
                    "value": {
                        "ar": "1 سنة",
                        "en": "1 سنة"
                    },
                    "display_value": "{'ar': '1 سنة', 'en': '1 سنة'}",
                    "is_required": false,
                    "options": null
                },
                "display_order": 4,
                "is_required": false,
                "is_searchable": true,
                "is_filterable": true,
                "options": [],
                "settings": {},
                "is_active": true
            }
        ],
        "images": [
            {
                "id": "698b352c-16ed-427b-bfc8-62cdff7a93bf",
                "image": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_main.jpg",
                "image_url": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_main.jpg",
                "image_type": "main",
                "alt_text": "صورة حذاء رياضي مريح",
                "caption": "صورة حذاء رياضي مريح",
                "display_order": 1,
                "is_primary": true,
                "is_active": true
            },
            {
                "id": "f49d9d6c-aa8e-4c9b-8f12-37f9ea4322fe",
                "image": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_2.jpg",
                "image_url": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_2.jpg",
                "image_type": "gallery",
                "alt_text": "صورة حذاء رياضي مريح 2",
                "caption": "صورة حذاء رياضي مريح 2",
                "display_order": 2,
                "is_primary": false,
                "is_active": true
            },
            {
                "id": "f4c4c823-39be-4d1b-a3e4-f7ae15dbeed4",
                "image": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_3.jpg",
                "image_url": "https://pub-e2db5a4b3e434dfba3c99b85e98a2a2d.r2.dev/media/products/fashion/comfortable-sports-shoes_3.jpg",
                "image_type": "gallery",
                "alt_text": "صورة حذاء رياضي مريح 3",
                "caption": "صورة حذاء رياضي مريح 3",
                "display_order": 3,
                "is_primary": false,
                "is_active": true
            }
        ],
        "variants": [
            {
                "id": "1a47286c-1205-4077-814c-a794a85e1198",
                "name": "أحمر - 36",
                "sku": "SHO-8675DC57-VAR-B8636E",
                "options": {
                    "size": "36",
                    "color": "أحمر"
                },
                "option_display": {
                    "size": "36",
                    "color": "أحمر"
                },
                "price_modifier": "-5.00",
                "effective_price": 144.99,
                "stock_quantity": 41,
                "is_in_stock": true,
                "image": null,
                "display_order": 1,
                "is_active": true
            },
            {
                "id": "9f0b70e5-8e1b-4590-9b04-c4b15868a3f1",
                "name": "أزرق - 36",
                "sku": "SHO-8675DC57-VAR-769DFC",
                "options": {
                    "size": "36",
                    "color": "أزرق"
                },
                "option_display": {
                    "size": "36",
                    "color": "أزرق"
                },
                "price_modifier": "-5.00",
                "effective_price": 144.99,
                "stock_quantity": 12,
                "is_in_stock": true,
                "image": null,
                "display_order": 2,
                "is_active": true
            }
        ],
        "meta_title": {
            "ar": "حذاء رياضي مريح",
            "en": "Comfortable Sports Shoes"
        },
        "meta_description": {
            "ar": "حذاء رياضي مريح",
            "en": "Comfortable sports shoes"
        },
        "settings": {},
        "updated_at": "2025-07-29T14:14:20.526285Z",
        "is_digital": false,
        "requires_shipping": true
    }
}
```
                "id": "field-uuid",
                "field_name": "material",
                "field_label": {
                    "ar": "المادة",
                    "en": "Material"
                },
                "field_type": "text",
                "field_value": {
                    "ar": "قطن 100%",
                    "en": "100% cotton"
                },
                "is_searchable": true,
                "is_filterable": true,
                "display_order": 1
            }
        ],
        "variants_count": 9,
        "images_count": 3,
        "fields_count": 4,
        "is_in_stock": true,
        "is_low_stock": false,
        "effective_price": "89.99",
        "created_at": "2025-07-29T10:30:00Z",
        "updated_at": "2025-07-29T10:30:00Z"
    }
}
```

### ➕ إنشاء منتج جديد

```http
POST /api/products/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "title": {
        "ar": "فستان أنيق مسائي",
        "en": "Elegant Evening Dress"
    },
    "description": {
        "ar": "فستان أنيق مناسب للمناسبات المسائية",
        "en": "Elegant dress suitable for evening occasions"
    },
    "short_description": {
        "ar": "فستان أنيق مسائي",
        "en": "Elegant evening dress"
    },
    "sku": "DRESS-001",
    "brand": "Elegance",
    "price": "299.99",
    "compare_price": "399.00",
    "cost_price": "150.00",
    "stock_quantity": 50,
    "min_stock_alert": 5,
    "weight": "0.5",
    "dimensions": {
        "length": "120",
        "width": "60",
        "height": "5"
    },
    "is_featured": true,
    "is_on_sale": true,
    "tags": "فساتين,أنيقة,مسائية",
    "meta_title": {
        "ar": "فستان أنيق مسائي - متجر الأزياء",
        "en": "Elegant Evening Dress - Fashion Store"
    },
    "meta_description": {
        "ar": "فستان أنيق مناسب للمناسبات المسائية",
        "en": "Elegant dress suitable for evening occasions"
    },
    "settings": {
        "allow_reviews": true,
        "allow_ratings": true,
        "show_stock": true
    },
    "category": "category-uuid",
    "product_type": "type-uuid"
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إنشاء المنتج بنجاح",
    "data": {
        "id": "new-uuid-here",
        "title": {
            "ar": "فستان أنيق مسائي",
            "en": "Elegant Evening Dress"
        },
        "slug": "elegant-evening-dress",
        "sku": "DRESS-001",
        "price": "299.99",
        "stock_quantity": 50,
        "is_featured": true,
        "is_on_sale": true,
        "category": {
            "id": "category-uuid",
            "name": {
                "ar": "فساتين",
                "en": "Dresses"
            }
        },
        "product_type": {
            "id": "type-uuid",
            "name": "clothing",
            "display_name": {
                "ar": "ملابس",
                "en": "Clothing"
            }
        },
        "created_at": "2025-07-29T11:00:00Z",
        "updated_at": "2025-07-29T11:00:00Z"
    }
}
```

### ✏️ تعديل منتج

```http
PUT /api/products/{id}/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "title": {
        "ar": "فستان أنيق مسائي عصرية",
        "en": "Modern Elegant Evening Dress"
    },
    "price": "349.99",
    "compare_price": "449.00",
    "stock_quantity": 75,
    "is_featured": true,
    "tags": "فساتين,أنيقة,مسائية,عصرية"
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث المنتج بنجاح",
    "data": {
        "id": "uuid-here",
        "title": {
            "ar": "فستان أنيق مسائي عصرية",
            "en": "Modern Elegant Evening Dress"
        },
        "price": "349.99",
        "updated_at": "2025-07-29T11:15:00Z"
    }
}
```

### 🗑️ حذف منتج

```http
DELETE /api/products/{id}/
Authorization: Bearer <admin_token>
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم حذف المنتج بنجاح"
}
```

## نقاط النهاية المتقدمة

### 📊 إحصائيات المنتج

```http
GET /api/products/{id}/statistics/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "total_views": 1250,
        "total_sales": 45,
        "total_revenue": "4049.55",
        "average_rating": 4.5,
        "reviews_count": 12,
        "top_variants": [
            {
                "id": "variant-uuid",
                "name": "أحمر - M",
                "sales_count": 15,
                "revenue": "1349.85"
            }
        ],
        "stock_status": {
            "total_stock": 150,
            "available_stock": 105,
            "reserved_stock": 45,
            "low_stock_variants": 2
        }
    }
}
```

### 🔄 نسخ منتج

```http
POST /api/products/{id}/duplicate/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "title_suffix": {
        "ar": " - نسخة",
        "en": " - Copy"
    },
    "copy_variants": true,
    "copy_images": true,
    "copy_fields": true
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم نسخ المنتج بنجاح",
    "data": {
        "id": "new-uuid-here",
        "title": {
            "ar": "قميص قطني كلاسيك - نسخة",
            "en": "Classic Cotton Shirt - Copy"
        },
        "sku": "SHIRT-001-COPY",
        "variants_count": 9,
        "images_count": 3,
        "fields_count": 4
    }
}
```

### 📈 تحديث المخزون

```http
PUT /api/products/{id}/stock/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "stock_quantity": 200,
    "min_stock_alert": 15,
    "reason": "تحديث المخزون"
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث المخزون بنجاح",
    "data": {
        "old_stock": 150,
        "new_stock": 200,
        "difference": 50
    }
}
```

### 🏷️ إدارة العلامات

```http
PUT /api/products/{id}/tags/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "tags": "ملابس,أزياء,عصرية,أنيقة,مسائية"
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث العلامات بنجاح",
    "data": {
        "tags": "ملابس,أزياء,عصرية,أنيقة,مسائية",
        "tags_array": ["ملابس", "أزياء", "عصرية", "أنيقة", "مسائية"]
    }
}
```

## معايير الاستعلام المدعومة

### 🔍 البحث والتصفية

```http
GET /api/products/?search=قميص&category=clothing&price_min=50&price_max=200&size=M&color=أحمر&brand=Fashion&is_featured=true&is_on_sale=true&in_stock=true
```

**المعايير المدعومة:**
- `search` - البحث في العنوان والوصف والعلامات
- `category` - تصفية حسب الفئة
- `product_type` - تصفية حسب نوع المنتج
- `price_min` / `price_max` - نطاق السعر
- `size` - تصفية حسب الحجم
- `color` - تصفية حسب اللون
- `brand` - تصفية حسب الماركة
- `is_featured` - المنتجات المميزة
- `is_on_sale` - المنتجات المخفضة
- `in_stock` - المنتجات المتوفرة
- `has_variants` - المنتجات التي لها متغيرات
- `has_images` - المنتجات التي لها صور
- `tags` - تصفية حسب العلامات

### 📊 الترتيب

```http
GET /api/products/?ordering=price_asc
GET /api/products/?ordering=created_at_desc
GET /api/products/?ordering=name_asc
GET /api/products/?ordering=popularity_desc
```

**خيارات الترتيب:**
- `price_asc` / `price_desc` - حسب السعر
- `created_at_asc` / `created_at_desc` - حسب تاريخ الإنشاء
- `name_asc` / `name_desc` - حسب الاسم
- `popularity_desc` - حسب الشعبية
- `rating_desc` - حسب التقييم
- `sales_desc` - حسب المبيعات
- `stock_asc` / `stock_desc` - حسب المخزون

### 🌐 دعم اللغات

```http
GET /api/products/?lang=ar
GET /api/products/?lang=en
```

### 📄 التصفح والترقيم

```http
GET /api/products/?page=1&page_size=20
```

## أخطاء شائعة وحلولها

### ❌ خطأ: SKU مكرر

```json
{
    "success": false,
    "error": "المنتج بهذا الكود موجود بالفعل",
    "code": "DUPLICATE_PRODUCT_SKU"
}
```

**الحل:** استخدم SKU فريد أو تحقق من المنتجات الموجودة أولاً.

### ❌ خطأ: الفئة غير موجودة

```json
{
    "success": false,
    "error": "الفئة غير موجودة",
    "code": "CATEGORY_NOT_FOUND"
}
```

**الحل:** تأكد من وجود الفئة قبل إنشاء المنتج.

### ❌ خطأ: نوع المنتج غير موجود

```json
{
    "success": false,
    "error": "نوع المنتج غير موجود",
    "code": "PRODUCT_TYPE_NOT_FOUND"
}
```

**الحل:** تأكد من وجود نوع المنتج قبل إنشاء المنتج.

### ❌ خطأ: سعر غير صحيح

```json
{
    "success": false,
    "error": "السعر يجب أن يكون أكبر من صفر",
    "code": "INVALID_PRICE"
}
```

**الحل:** تأكد من أن السعر قيمة إيجابية.

## أمثلة عملية

### مثال 1: إنشاء منتج مع متغيرات

```javascript
// إنشاء منتج جديد
const product = {
    title: {
        ar: "قميص قطني كلاسيك",
        en: "Classic Cotton Shirt"
    },
    description: {
        ar: "قميص قطني مريح وأنيق",
        en: "Comfortable and elegant cotton shirt"
    },
    sku: "SHIRT-001",
    brand: "Fashion Brand",
    price: "89.99",
    compare_price: "120.00",
    stock_quantity: 150,
    category: "category-uuid",
    product_type: "type-uuid",
    is_featured: true,
    tags: "ملابس,أزياء,عصرية"
};

fetch('/api/products/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(product)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('تم إنشاء المنتج:', data.data);
        
        // إنشاء متغيرات للمنتج
        const variants = [
            {
                name: "أحمر - M",
                options: { color: "أحمر", size: "M" },
                price_modifier: "0.00",
                stock_quantity: 25
            },
            {
                name: "أزرق - L",
                options: { color: "أزرق", size: "L" },
                price_modifier: "0.00",
                stock_quantity: 30
            }
        ];
        
        variants.forEach(variant => {
            fetch(`/api/products/${data.data.id}/variants/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(variant)
            });
        });
    }
});
```

### مثال 2: البحث في المنتجات

```javascript
// البحث في المنتجات
const searchParams = new URLSearchParams({
    search: 'قميص',
    category: 'clothing',
    price_min: '50',
    price_max: '200',
    size: 'M',
    color: 'أحمر',
    is_featured: 'true',
    ordering: 'price_asc',
    page: '1',
    page_size: '20'
});

fetch(`/api/products/?${searchParams}`)
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log(`تم العثور على ${data.data.pagination.total_count} منتج`);
        data.data.results.forEach(product => {
            console.log(`${product.title.ar} - ${product.price} ريال`);
        });
    }
});
```

### مثال 3: تحديث مخزون المنتج

```javascript
// تحديث مخزون المنتج
const productId = 'product-uuid';
const stockUpdate = {
    stock_quantity: 200,
    min_stock_alert: 15,
    reason: 'تحديث المخزون'
};

fetch(`/api/products/${productId}/stock/`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(stockUpdate)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log(`تم تحديث المخزون من ${data.data.old_stock} إلى ${data.data.new_stock}`);
    }
});
```

---

## العناصر المطلوبة في عرض تفاصيل المنتج

بناءً على استجابة API الفعلية، يجب أن يتضمن عرض تفاصيل المنتج العناصر التالية:

### 📊 المعلومات الأساسية
- **ID المنتج**: معرف فريد للمنتج
- **العنوان**: عنوان المنتج باللغات المدعومة
- **الوصف القصير**: وصف مختصر للمنتج
- **الوصف الكامل**: وصف تفصيلي للمنتج
- **SKU**: رمز المنتج الفريد
- **الماركة**: ماركة المنتج

### 💰 المعلومات المالية
- **السعر الأساسي**: سعر المنتج الأساسي
- **السعر الفعال**: السعر النهائي بعد الخصومات
- **سعر المقارنة**: السعر الأصلي قبل الخصم
- **مبلغ التوفير**: المبلغ المحفوظ من الخصم
- **نسبة الخصم**: نسبة الخصم المطبقة

### 📦 معلومات المخزون والشحن
- **كمية المخزون**: الكمية المتوفرة
- **تنبيه المخزون الأدنى**: الحد الأدنى للمخزون
- **حالة المخزون**: متوفر/غير متوفر
- **الوزن**: وزن المنتج
- **الأبعاد**: أبعاد المنتج
- **يتطلب شحن**: هل يحتاج شحن أم لا
- **رقمي**: هل المنتج رقمي أم مادي

### 🏷️ التصنيف والعلامات
- **الفئة**: فئة المنتج مع التفاصيل الكاملة
- **نوع المنتج**: نوع المنتج مع الإعدادات
- **العلامات**: قائمة العلامات
- **قائمة العلامات**: مصفوفة العلامات

### 🖼️ الصور والوسائط
- **الصورة الرئيسية**: رابط الصورة الرئيسية
- **معرض الصور**: قائمة جميع صور المنتج
- **الملف الرقمي**: للمنتجات الرقمية
- **ملف العينة**: ملف تجريبي

### ⚙️ الحقول المخصصة
- **الحقول المخصصة**: قائمة الحقول المخصصة
- **قيم الحقول**: القيم المدخلة لكل حقل
- **إعدادات الحقول**: خصائص كل حقل

### 🔄 المتغيرات
- **قائمة المتغيرات**: جميع متغيرات المنتج
- **خيارات المتغيرات**: الأحجام والألوان المتوفرة
- **أسعار المتغيرات**: أسعار كل متغير
- **مخزون المتغيرات**: مخزون كل متغير

### 📈 الحالة والإعدادات
- **مميز**: هل المنتج مميز
- **في العرض**: هل المنتج في عرض خاص
- **نشط**: حالة المنتج
- **الإعدادات**: إعدادات خاصة بالمنتج

### 🔍 تحسين محركات البحث
- **عنوان الصفحة**: عنوان الصفحة للـ SEO
- **وصف الصفحة**: وصف الصفحة للـ SEO

### 📅 التواريخ
- **تاريخ الإنشاء**: متى تم إنشاء المنتج
- **تاريخ التحديث**: آخر تحديث للمنتج

## مثال على عرض تفاصيل المنتج الكاملة

```javascript
// عرض تفاصيل المنتج الكاملة
const productId = 'c83d1ee9-6501-433e-967e-ddaa65e95bce';

fetch(`/api/products/${productId}/`)
.then(response => response.json())
.then(data => {
    if (data.success) {
        const product = data.data;
        
        // عرض المعلومات الأساسية
        console.log(`العنوان: ${product.title}`);
        console.log(`SKU: ${product.sku}`);
        console.log(`الماركة: ${product.brand}`);
        
        // عرض المعلومات المالية
        console.log(`السعر: ${product.price} ريال`);
        console.log(`السعر الفعال: ${product.effective_price} ريال`);
        console.log(`التوفير: ${product.savings_amount} ريال`);
        
        // عرض معلومات المخزون
        console.log(`المخزون: ${product.stock_quantity} قطعة`);
        console.log(`حالة المخزون: ${product.is_in_stock ? 'متوفر' : 'غير متوفر'}`);
        
        // عرض الفئة ونوع المنتج
        console.log(`الفئة: ${product.category.name}`);
        console.log(`نوع المنتج: ${product.product_type.display_name}`);
        
        // عرض العلامات
        console.log(`العلامات: ${product.tags}`);
        
        // عرض الحقول المخصصة
        product.custom_fields.forEach(field => {
            console.log(`${field.label}: ${field.field_value.ar}`);
        });
        
        // عرض المتغيرات
        product.variants.forEach(variant => {
            console.log(`${variant.name}: ${variant.effective_price} ريال (المخزون: ${variant.stock_quantity})`);
        });
        
        // عرض الصور
        product.images.forEach(image => {
            console.log(`صورة ${image.display_order}: ${image.image_url}`);
        });
    }
});
```

## تحسين واجهة المستخدم لعرض تفاصيل المنتج

### 🎨 تصميم واجهة تفاصيل المنتج

#### 1. القسم العلوي - المعلومات الأساسية
```html
<div class="product-header">
    <div class="product-images">
        <!-- معرض الصور الرئيسي -->
        <div class="main-image">
            <img src="{{ product.main_image_url }}" alt="{{ product.title }}">
        </div>
        <div class="image-gallery">
            <!-- صور إضافية -->
        </div>
    </div>
    
    <div class="product-info">
        <h1>{{ product.title }}</h1>
        <div class="product-meta">
            <span class="sku">SKU: {{ product.sku }}</span>
            <span class="brand">الماركة: {{ product.brand }}</span>
        </div>
        
        <!-- الأسعار -->
        <div class="pricing">
            <div class="current-price">{{ product.effective_price }} ريال</div>
            {% if product.compare_price %}
            <div class="compare-price">{{ product.compare_price }} ريال</div>
            <div class="savings">توفير {{ product.savings_amount }} ريال</div>
            {% endif %}
        </div>
        
        <!-- حالة المخزون -->
        <div class="stock-status">
            {% if product.is_in_stock %}
            <span class="in-stock">متوفر ({{ product.stock_quantity }} قطعة)</span>
            {% else %}
            <span class="out-of-stock">غير متوفر</span>
            {% endif %}
        </div>
    </div>
</div>
```

#### 2. قسم المتغيرات
```html
<div class="product-variants">
    <h3>الخيارات المتوفرة</h3>
    
    <!-- اختيار الحجم -->
    <div class="size-selector">
        <label>الحجم:</label>
        <div class="size-options">
            {% for variant in product.variants %}
            <button class="size-option" data-variant-id="{{ variant.id }}">
                {{ variant.options.size }}
            </button>
            {% endfor %}
        </div>
    </div>
    
    <!-- اختيار اللون -->
    <div class="color-selector">
        <label>اللون:</label>
        <div class="color-options">
            {% for variant in product.variants %}
            <button class="color-option" data-color="{{ variant.options.color }}">
                {{ variant.options.color }}
            </button>
            {% endfor %}
        </div>
    </div>
    
    <!-- معلومات المتغير المحدد -->
    <div class="selected-variant">
        <div class="variant-price">{{ selected_variant.effective_price }} ريال</div>
        <div class="variant-stock">المخزون: {{ selected_variant.stock_quantity }}</div>
    </div>
</div>
```

#### 3. قسم الحقول المخصصة
```html
<div class="custom-fields">
    <h3>مواصفات المنتج</h3>
    
    {% for field in product.custom_fields %}
    <div class="field-item">
        <span class="field-label">{{ field.label }}:</span>
        <span class="field-value">{{ field.field_value.ar }}</span>
    </div>
    {% endfor %}
</div>
```

#### 4. قسم الوصف والتفاصيل
```html
<div class="product-description">
    <h3>وصف المنتج</h3>
    <div class="description-content">
        {{ product.description }}
    </div>
    
    <!-- العلامات -->
    <div class="product-tags">
        {% for tag in product.tags_list %}
        <span class="tag">{{ tag }}</span>
        {% endfor %}
    </div>
</div>
```

#### 5. قسم معلومات الشحن والتسليم
```html
<div class="shipping-info">
    <h3>معلومات الشحن</h3>
    
    {% if product.requires_shipping %}
    <div class="shipping-details">
        <p>✅ يتطلب شحن</p>
        {% if product.weight %}
        <p>الوزن: {{ product.weight }} كجم</p>
        {% endif %}
        {% if product.dimensions %}
        <p>الأبعاد: {{ product.dimensions.length }} × {{ product.dimensions.width }} × {{ product.dimensions.height }} سم</p>
        {% endif %}
    </div>
    {% else %}
    <div class="digital-product">
        <p>📱 منتج رقمي - لا يتطلب شحن</p>
    </div>
    {% endif %}
</div>
```

### 🎯 تحسينات إضافية

#### 1. عرض الأسعار الديناميكي
```javascript
// تحديث السعر حسب المتغير المحدد
function updatePrice(variantId) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
        document.querySelector('.current-price').textContent = 
            `${variant.effective_price} ريال`;
        
        // تحديث معلومات المخزون
        document.querySelector('.variant-stock').textContent = 
            `المخزون: ${variant.stock_quantity}`;
    }
}
```

#### 2. معرض الصور التفاعلي
```javascript
// تبديل الصور في المعرض
function switchImage(imageUrl) {
    document.querySelector('.main-image img').src = imageUrl;
}

// إضافة تأثيرات التكبير
function initImageZoom() {
    const mainImage = document.querySelector('.main-image img');
    mainImage.addEventListener('mouseenter', () => {
        mainImage.style.transform = 'scale(1.1)';
    });
    
    mainImage.addEventListener('mouseleave', () => {
        mainImage.style.transform = 'scale(1)';
    });
}
```

#### 3. عرض الحقول المخصصة بشكل جميل
```css
.custom-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
}

.field-item {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

.field-label {
    font-weight: bold;
    color: #495057;
}

.field-value {
    color: #212529;
    margin-right: 0.5rem;
}
```

#### 4. تحسين عرض المتغيرات
```css
.variant-selector {
    margin: 1rem 0;
}

.size-options, .color-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.size-option, .color-option {
    padding: 0.5rem 1rem;
    border: 2px solid #dee2e6;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.size-option:hover, .color-option:hover {
    border-color: #007bff;
}

.size-option.selected, .color-option.selected {
    border-color: #007bff;
    background: #007bff;
    color: white;
}
```

### 📱 تحسينات للأجهزة المحمولة

```css
/* تصميم متجاوب */
@media (max-width: 768px) {
    .product-header {
        flex-direction: column;
    }
    
    .product-images {
        order: 1;
    }
    
    .product-info {
        order: 2;
    }
    
    .size-options, .color-options {
        justify-content: center;
    }
    
    .custom-fields {
        grid-template-columns: 1fr;
    }
}
```

### ⚡ تحسينات الأداء

#### 1. تحميل الصور بشكل تدريجي
```javascript
// تحميل الصور بشكل تدريجي
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}
```

#### 2. تخزين مؤقت للبيانات
```javascript
// تخزين مؤقت لبيانات المنتج
function cacheProductData(productId, data) {
    localStorage.setItem(`product_${productId}`, JSON.stringify({
        data: data,
        timestamp: Date.now()
    });
}

function getCachedProductData(productId) {
    const cached = localStorage.getItem(`product_${productId}`);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // التحقق من صلاحية البيانات (24 ساعة)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            return data;
        }
    }
    return null;
}
```

## التعامل مع الأخطاء الشائعة في عرض تفاصيل المنتج

### ❌ الأخطاء الشائعة وحلولها

#### 1. خطأ: المنتج غير موجود
```javascript
// التعامل مع منتج غير موجود
fetch(`/api/products/${productId}/`)
.then(response => {
    if (response.status === 404) {
        throw new Error('المنتج غير موجود');
    }
    return response.json();
})
.then(data => {
    if (data.success) {
        displayProduct(data.data);
    } else {
        showError(data.error);
    }
})
.catch(error => {
    showError('حدث خطأ في تحميل المنتج');
    console.error('Error:', error);
});

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        </div>
    `;
    document.querySelector('.product-container').appendChild(errorDiv);
}
```

#### 2. خطأ: الصور غير متوفرة
```javascript
// التعامل مع الصور المفقودة
function handleImageError(img) {
    img.onerror = function() {
        this.src = '/images/placeholder.jpg';
        this.alt = 'صورة غير متوفرة';
    };
}

// تطبيق على جميع الصور
document.querySelectorAll('.product-images img').forEach(img => {
    handleImageError(img);
});
```

#### 3. خطأ: المتغيرات غير متوفرة
```javascript
// التحقق من توفر المتغيرات
function checkVariantsAvailability(product) {
    if (!product.variants || product.variants.length === 0) {
        document.querySelector('.product-variants').style.display = 'none';
        return;
    }
    
    // التحقق من توفر المخزون
    const availableVariants = product.variants.filter(v => v.is_in_stock);
    if (availableVariants.length === 0) {
        showOutOfStockMessage();
    }
}

function showOutOfStockMessage() {
    const message = document.createElement('div');
    message.className = 'out-of-stock-message';
    message.innerHTML = `
        <div class="alert alert-warning">
            <i class="fas fa-exclamation-circle"></i>
            جميع المتغيرات غير متوفرة حالياً
        </div>
    `;
    document.querySelector('.product-variants').appendChild(message);
}
```

#### 4. خطأ: الحقول المخصصة فارغة
```javascript
// التعامل مع الحقول المخصصة الفارغة
function displayCustomFields(fields) {
    const container = document.querySelector('.custom-fields');
    
    if (!fields || fields.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    fields.forEach(field => {
        if (!field.field_value || !field.field_value.ar) {
            // إخفاء الحقول الفارغة
            return;
        }
        
        const fieldElement = createFieldElement(field);
        container.appendChild(fieldElement);
    });
}

function createFieldElement(field) {
    const div = document.createElement('div');
    div.className = 'field-item';
    div.innerHTML = `
        <span class="field-label">${field.label}:</span>
        <span class="field-value">${field.field_value.ar}</span>
    `;
    return div;
}
```

### 🔄 حالات التحميل والانتظار

#### 1. عرض حالة التحميل
```javascript
function showLoadingState() {
    const container = document.querySelector('.product-container');
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-border" role="status">
                <span class="sr-only">جاري التحميل...</span>
            </div>
            <p>جاري تحميل تفاصيل المنتج...</p>
        </div>
    `;
}

function hideLoadingState() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}
```

#### 2. تحميل تدريجي للمحتوى
```javascript
function loadProductContent(product) {
    // تحميل المعلومات الأساسية أولاً
    loadBasicInfo(product);
    
    // تحميل الصور
    setTimeout(() => loadImages(product.images), 100);
    
    // تحميل المتغيرات
    setTimeout(() => loadVariants(product.variants), 200);
    
    // تحميل الحقول المخصصة
    setTimeout(() => loadCustomFields(product.custom_fields), 300);
}

function loadBasicInfo(product) {
    document.querySelector('.product-title').textContent = product.title;
    document.querySelector('.product-price').textContent = product.effective_price;
    // ... باقي المعلومات الأساسية
}
```

### 🛡️ التحقق من صحة البيانات

#### 1. التحقق من البيانات المطلوبة
```javascript
function validateProductData(product) {
    const required = ['id', 'title', 'price', 'sku'];
    const missing = required.filter(field => !product[field]);
    
    if (missing.length > 0) {
        console.error('بيانات مفقودة:', missing);
        return false;
    }
    
    return true;
}

function sanitizeProductData(product) {
    // تنظيف البيانات من القيم الفارغة
    return {
        ...product,
        title: product.title || 'بدون عنوان',
        description: product.description || 'لا يوجد وصف',
        price: product.price || '0',
        stock_quantity: product.stock_quantity || 0
    };
}
```

#### 2. التحقق من صحة الصور
```javascript
function validateImages(images) {
    if (!Array.isArray(images)) {
        return [];
    }
    
    return images.filter(image => {
        return image && image.image_url && image.is_active;
    });
}
```

### 📊 مراقبة الأداء

#### 1. قياس وقت التحميل
```javascript
function measureLoadTime() {
    const startTime = performance.now();
    
    return {
        end: () => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;
            
            console.log(`وقت تحميل المنتج: ${loadTime.toFixed(2)}ms`);
            
            // إرسال البيانات للتحليل
            if (loadTime > 3000) {
                console.warn('تحميل بطيء للمنتج');
            }
        }
    };
}

// استخدام
const timer = measureLoadTime();
fetch(`/api/products/${productId}/`)
.then(response => response.json())
.then(data => {
    displayProduct(data.data);
    timer.end();
});
```

#### 2. مراقبة الأخطاء
```javascript
function trackProductErrors(error, productId) {
    const errorData = {
        productId: productId,
        error: error.message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // إرسال البيانات للتحليل
    console.error('خطأ في المنتج:', errorData);
    
    // يمكن إرسال البيانات لخدمة التحليل
    // analytics.track('product_error', errorData);
}
```

### 🎯 تحسينات إضافية

#### 1. إعادة المحاولة التلقائية
```javascript
async function fetchProductWithRetry(productId, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(`/api/products/${productId}/`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn(`محاولة ${i + 1} فشلت:`, error);
            
            if (i === maxRetries - 1) {
                throw error;
            }
            
            // انتظار قبل إعادة المحاولة
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

#### 2. التحديث التلقائي للمخزون
```javascript
function autoUpdateStock(productId) {
    // تحديث المخزون كل 5 دقائق
    setInterval(async () => {
        try {
            const response = await fetch(`/api/products/${productId}/`);
            const data = await response.json();
            
            if (data.success) {
                updateStockDisplay(data.data.stock_quantity);
            }
        } catch (error) {
            console.error('خطأ في تحديث المخزون:', error);
        }
    }, 5 * 60 * 1000); // 5 دقائق
}

function updateStockDisplay(newStock) {
    const stockElement = document.querySelector('.stock-quantity');
    if (stockElement) {
        stockElement.textContent = newStock;
        
        // تحديث حالة المخزون
        if (newStock <= 0) {
            stockElement.classList.add('out-of-stock');
        } else {
            stockElement.classList.remove('out-of-stock');
        }
    }
}
```

## الجزء التالي: إدارة المتغيرات (ProductVariant APIs)

سيتم استكمال الوثائق في الأجزاء التالية:
1. **إدارة المتغيرات** - ProductVariant APIs
2. **إدارة الصور** - ProductImage APIs
3. **إدارة الحقول المخصصة** - ProductField APIs
4. **واجهات المستخدم** - Frontend Integration
5. **أمثلة عملية** - Real-world Examples 

---

# الجزء الخامس: إدارة المتغيرات (ProductVariant APIs)

## نظرة عامة على المتغيرات

المتغيرات هي نسخ مختلفة من المنتج الأساسي، مثل أحجام وألوان مختلفة. كل متغير له خصائصه الخاصة من سعر ومخزون وأبعاد.

## نقاط النهاية الأساسية

### 📋 عرض متغيرات منتج

```http
GET /api/products/{product_id}/variants/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "results": [
            {
                "id": "variant-uuid",
                "name": "أحمر - M",
                "sku": "SHIRT-001-RED-M",
                "options": {
                    "color": "أحمر",
                    "size": "M"
                },
                "price_modifier": "0.00",
                "cost_price": "45.00",
                "stock_quantity": 25,
                "min_stock_alert": 5,
                "weight": "0.25",
                "dimensions": {
                    "length": "70",
                    "width": "50",
                    "height": "2"
                },
                "image": "products/shirt-red-m.jpg",
                "settings": {
                    "is_active": true,
                    "allow_purchase": true
                },
                "display_order": 1,
                "is_in_stock": true,
                "is_low_stock": false,
                "effective_price": "89.99",
                "created_at": "2025-07-29T10:30:00Z",
                "updated_at": "2025-07-29T10:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "page_size": 20,
            "total_pages": 1,
            "total_count": 9,
            "has_next": false,
            "has_previous": false
        }
    }
}
```

### 🔍 عرض متغير محدد

```http
GET /api/variants/{id}/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "id": "variant-uuid",
        "name": "أحمر - M",
        "sku": "SHIRT-001-RED-M",
        "options": {
            "color": "أحمر",
            "size": "M"
        },
        "price_modifier": "0.00",
        "cost_price": "45.00",
        "stock_quantity": 25,
        "min_stock_alert": 5,
        "weight": "0.25",
        "dimensions": {
            "length": "70",
            "width": "50",
            "height": "2"
        },
        "image": "products/shirt-red-m.jpg",
        "settings": {
            "is_active": true,
            "allow_purchase": true
        },
        "display_order": 1,
        "product": {
            "id": "product-uuid",
            "title": {
                "ar": "قميص قطني كلاسيك",
                "en": "Classic Cotton Shirt"
            },
            "price": "89.99"
        },
        "images": [
            {
                "id": "image-uuid",
                "image": "products/shirt-red-m.jpg",
                "image_type": "variant",
                "alt_text": {
                    "ar": "صورة قميص أحمر مقاس M",
                    "en": "Red shirt size M image"
                },
                "is_primary": true
            }
        ],
        "is_in_stock": true,
        "is_low_stock": false,
        "effective_price": "89.99",
        "created_at": "2025-07-29T10:30:00Z",
        "updated_at": "2025-07-29T10:30:00Z"
    }
}
```

### ➕ إنشاء متغير جديد

```http
POST /api/products/{product_id}/variants/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "name": "أزرق - L",
    "options": {
        "color": "أزرق",
        "size": "L"
    },
    "price_modifier": "10.00",
    "cost_price": "50.00",
    "stock_quantity": 30,
    "min_stock_alert": 5,
    "weight": "0.28",
    "dimensions": {
        "length": "75",
        "width": "55",
        "height": "2"
    },
    "settings": {
        "is_active": true,
        "allow_purchase": true
    },
    "display_order": 2
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إنشاء المتغير بنجاح",
    "data": {
        "id": "new-variant-uuid",
        "name": "أزرق - L",
        "sku": "SHIRT-001-BLUE-L",
        "options": {
            "color": "أزرق",
            "size": "L"
        },
        "price_modifier": "10.00",
        "stock_quantity": 30,
        "effective_price": "99.99",
        "is_in_stock": true,
        "created_at": "2025-07-29T11:00:00Z",
        "updated_at": "2025-07-29T11:00:00Z"
    }
}
```

### ✏️ تعديل متغير

```http
PUT /api/variants/{id}/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "name": "أزرق - L - محدث",
    "price_modifier": "15.00",
    "stock_quantity": 35,
    "settings": {
        "is_active": true,
        "allow_purchase": true
    }
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث المتغير بنجاح",
    "data": {
        "id": "variant-uuid",
        "name": "أزرق - L - محدث",
        "price_modifier": "15.00",
        "effective_price": "104.99",
        "updated_at": "2025-07-29T11:15:00Z"
    }
}
```

### 🗑️ حذف متغير

```http
DELETE /api/variants/{id}/
Authorization: Bearer <admin_token>
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم حذف المتغير بنجاح"
}
```

## نقاط النهاية المتقدمة

### 📊 إحصائيات المتغير

```http
GET /api/variants/{id}/statistics/
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "total_sales": 15,
        "total_revenue": "1349.85",
        "average_rating": 4.3,
        "reviews_count": 8,
        "stock_status": {
            "current_stock": 25,
            "reserved_stock": 5,
            "available_stock": 20,
            "is_low_stock": false
        },
        "sales_trend": [
            {
                "date": "2025-07-25",
                "sales": 3
            },
            {
                "date": "2025-07-26",
                "sales": 2
            }
        ]
    }
}
```

### 📈 تحديث المخزون

```http
PUT /api/variants/{id}/stock/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "stock_quantity": 40,
    "min_stock_alert": 8,
    "reason": "تحديث المخزون"
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث مخزون المتغير بنجاح",
    "data": {
        "old_stock": 25,
        "new_stock": 40,
        "difference": 15
    }
}
```

### 🔄 إنشاء متغيرات متعددة

```http
POST /api/products/{product_id}/variants/bulk/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "variants": [
        {
            "name": "أحمر - S",
            "options": {
                "color": "أحمر",
                "size": "S"
            },
            "price_modifier": "-5.00",
            "stock_quantity": 20
        },
        {
            "name": "أحمر - M",
            "options": {
                "color": "أحمر",
                "size": "M"
            },
            "price_modifier": "0.00",
            "stock_quantity": 25
        },
        {
            "name": "أحمر - L",
            "options": {
                "color": "أحمر",
                "size": "L"
            },
            "price_modifier": "10.00",
            "stock_quantity": 30
        }
    ]
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إنشاء 3 متغيرات بنجاح",
    "data": {
        "created_count": 3,
        "variants": [
            {
                "id": "variant-uuid-1",
                "name": "أحمر - S",
                "sku": "SHIRT-001-RED-S",
                "effective_price": "84.99"
            },
            {
                "id": "variant-uuid-2",
                "name": "أحمر - M",
                "sku": "SHIRT-001-RED-M",
                "effective_price": "89.99"
            },
            {
                "id": "variant-uuid-3",
                "name": "أحمر - L",
                "sku": "SHIRT-001-RED-L",
                "effective_price": "99.99"
            }
        ]
    }
}
```

### 🖼️ رفع صورة المتغير

```http
POST /api/variants/{id}/upload-image/
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```
image: [file]
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم رفع صورة المتغير بنجاح",
    "data": {
        "image_url": "https://example.com/media/products/variant-image.jpg"
    }
}
```

### 🔄 إعادة ترتيب المتغيرات

```http
PUT /api/products/{product_id}/variants/reorder/
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**البيانات المطلوبة:**
```json
{
    "variants": [
        {
            "id": "variant-uuid-1",
            "display_order": 1
        },
        {
            "id": "variant-uuid-2",
            "display_order": 2
        },
        {
            "id": "variant-uuid-3",
            "display_order": 3
        }
    ]
}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إعادة ترتيب المتغيرات بنجاح"
}
```

## معايير الاستعلام المدعومة

### 🔍 البحث والتصفية

```http
GET /api/products/{product_id}/variants/?color=أحمر&size=M&in_stock=true&price_min=80&price_max=100
```

**المعايير المدعومة:**
- `color` - تصفية حسب اللون
- `size` - تصفية حسب الحجم
- `in_stock` - المتغيرات المتوفرة
- `price_min` / `price_max` - نطاق السعر
- `is_active` - المتغيرات النشطة
- `has_image` - المتغيرات التي لها صور

### 📊 الترتيب

```http
GET /api/products/{product_id}/variants/?ordering=display_order_asc
GET /api/products/{product_id}/variants/?ordering=price_asc
GET /api/products/{product_id}/variants/?ordering=stock_desc
```

**خيارات الترتيب:**
- `display_order_asc` / `display_order_desc` - حسب ترتيب العرض
- `price_asc` / `price_desc` - حسب السعر
- `stock_asc` / `stock_desc` - حسب المخزون
- `name_asc` / `name_desc` - حسب الاسم
- `created_at_asc` / `created_at_desc` - حسب تاريخ الإنشاء

## أخطاء شائعة وحلولها

### ❌ خطأ: SKU مكرر

```json
{
    "success": false,
    "error": "المتغير بهذا الكود موجود بالفعل",
    "code": "DUPLICATE_VARIANT_SKU"
}
```

**الحل:** استخدم SKU فريد أو تحقق من المتغيرات الموجودة أولاً.

### ❌ خطأ: خيارات غير صحيحة

```json
{
    "success": false,
    "error": "الخيارات غير صحيحة",
    "code": "INVALID_OPTIONS",
    "details": {
        "color": "اللون غير مدعوم",
        "size": "الحجم غير مدعوم"
    }
}
```

**الحل:** تأكد من أن الخيارات متوافقة مع إعدادات نوع المنتج.

### ❌ خطأ: سعر تعديل غير صحيح

```json
{
    "success": false,
    "error": "سعر التعديل غير صحيح",
    "code": "INVALID_PRICE_MODIFIER"
}
```

**الحل:** تأكد من أن سعر التعديل قيمة صحيحة.

### ❌ خطأ: مخزون غير كافي

```json
{
    "success": false,
    "error": "المخزون غير كافي",
    "code": "INSUFFICIENT_STOCK"
}
```

**الحل:** تأكد من توفر المخزون الكافي قبل إجراء العملية.

## أمثلة عملية

### مثال 1: إنشاء متغيرات متعددة

```javascript
// إنشاء متغيرات متعددة لمنتج
const productId = 'product-uuid';
const variants = [
    {
        name: "أحمر - S",
        options: { color: "أحمر", size: "S" },
        price_modifier: "-5.00",
        stock_quantity: 20
    },
    {
        name: "أحمر - M",
        options: { color: "أحمر", size: "M" },
        price_modifier: "0.00",
        stock_quantity: 25
    },
    {
        name: "أحمر - L",
        options: { color: "أحمر", size: "L" },
        price_modifier: "10.00",
        stock_quantity: 30
    }
];

fetch(`/api/products/${productId}/variants/bulk/`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ variants })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log(`تم إنشاء ${data.data.created_count} متغير`);
        data.data.variants.forEach(variant => {
            console.log(`${variant.name}: ${variant.effective_price} ريال`);
        });
    }
});
```

### مثال 2: تحديث مخزون المتغير

```javascript
// تحديث مخزون متغير محدد
const variantId = 'variant-uuid';
const stockUpdate = {
    stock_quantity: 40,
    min_stock_alert: 8,
    reason: 'تحديث المخزون'
};

fetch(`/api/variants/${variantId}/stock/`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(stockUpdate)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log(`تم تحديث المخزون من ${data.data.old_stock} إلى ${data.data.new_stock}`);
    }
});
```

### مثال 3: عرض متغيرات منتج مع تصفية

```javascript
// عرض متغيرات منتج مع تصفية
const productId = 'product-uuid';
const searchParams = new URLSearchParams({
    color: 'أحمر',
    in_stock: 'true',
    ordering: 'price_asc'
});

fetch(`/api/products/${productId}/variants/?${searchParams}`)
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log(`تم العثور على ${data.data.pagination.total_count} متغير`);
        data.data.results.forEach(variant => {
            console.log(`${variant.name}: ${variant.effective_price} ريال (المخزون: ${variant.stock_quantity})`);
        });
    }
});
```

---

## الجزء التالي: إدارة الصور (ProductImage APIs)

سيتم استكمال الوثائق في الأجزاء التالية:
1. **إدارة الصور** - ProductImage APIs
2. **إدارة الحقول المخصصة** - ProductField APIs
3. **واجهات المستخدم** - Frontend Integration
4. **أمثلة عملية** - Real-world Examples