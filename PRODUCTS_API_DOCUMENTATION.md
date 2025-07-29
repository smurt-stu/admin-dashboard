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
            },
            "settings": {
                "size_options": ["XS", "S", "M", "L", "XL", "XXL"],
                "color_options": ["أحمر", "أزرق", "أخضر", "أصفر", "أسود", "أبيض", "رمادي", "بني"],
                "material_types": ["قطن", "بوليستر", "حرير", "صوف", "دينيم"]
            }
        },
        "variants": [
            {
                "id": "variant-uuid",
                "name": "أحمر - M",
                "sku": "SHIRT-001-RED-M",
                "options": {
                    "color": "أحمر",
                    "size": "M"
                },
                "price_modifier": "0.00",
                "stock_quantity": 25,
                "is_in_stock": true,
                "image": "products/shirt-red-m.jpg"
            }
        ],
        "images": [
            {
                "id": "image-uuid",
                "image": "products/shirt-main.jpg",
                "image_type": "main",
                "alt_text": {
                    "ar": "صورة قميص قطني كلاسيك",
                    "en": "Classic cotton shirt image"
                },
                "caption": {
                    "ar": "قميص قطني كلاسيك",
                    "en": "Classic cotton shirt"
                },
                "is_primary": true,
                "display_order": 1
            }
        ],
        "fields": [
            {
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