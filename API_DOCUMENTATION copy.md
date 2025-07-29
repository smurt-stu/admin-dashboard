# 📊 Marketing API Documentation

## نظرة عامة

تطبيق Marketing يوفر نظام متكامل لإدارة الكوبونات والعروض الترويجية مع واجهات برمجة منفصلة للمشرفين والمستخدمين العاديين. تم تطوير التطبيق بشكل احترافي مع دعم متعدد اللغات ونظام إحصائيات متقدم.

---

## 🔐 Authentication & Permissions

### للمستخدمين العاديين
- **Coupons**: `IsAuthenticated` - يتطلب تسجيل دخول
- **Promotions**: `AllowAny` - متاح للجميع

### للمشرفين
- جميع العمليات تتطلب صلاحيات المشرف (`IsAdminUser`)
- إدارة كاملة للكوبونات والعروض الترويجية
- إحصائيات وتحليلات مفصلة
- نظام كاش محسن للأداء

---

## 🎫 Coupons API

### Endpoints للمستخدمين العاديين

#### 1. عرض الكوبونات المتاحة
```http
GET /api/marketing/coupons/
```

**الاستجابة:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "code": "SAVE20",
      "title": "خصم 20% على كل شيء",
      "description": "خصم 20% على جميع المنتجات",
      "discount_type": "percentage",
      "discount_value": "20.00",
      "discount_text": "20%",
      "is_valid": true,
      "min_order_amount": "50.00",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-12-31T23:59:59Z",
      "time_remaining": {
        "days": 45,
        "hours": 12,
        "minutes": 30
      },
      "free_shipping": false,
      "usage_limit": 1000,
      "usage_limit_per_user": 1,
      "is_first_order_only": false,
      "is_combinable": true,
      "max_discount_amount": "100.00"
    },
    {
      "id": 2,
      "code": "NEWUSER50",
      "title": "خصم 50% للمستخدمين الجدد",
      "description": "خصم خاص للمستخدمين الجدد",
      "discount_type": "percentage",
      "discount_value": "50.00",
      "discount_text": "50%",
      "is_valid": true,
      "min_order_amount": "20.00",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-06-30T23:59:59Z",
      "time_remaining": {
        "days": 180,
        "hours": 12,
        "minutes": 30
      },
      "free_shipping": false,
      "usage_limit": 500,
      "usage_limit_per_user": 1,
      "is_first_order_only": true,
      "is_combinable": false,
      "max_discount_amount": "200.00"
    }
  ]
}
```

#### 2. عرض كوبون محدد
```http
GET /api/marketing/coupons/{id}/
```

#### 3. التحقق من صلاحية الكوبون
```http
POST /api/marketing/coupons/validate/
```

**الطلب:**
```json
{
  "code": "SAVE20"
}
```

**الاستجابة الناجحة:**
```json
{
  "id": 1,
  "code": "SAVE20",
  "title": "خصم 20% على كل شيء",
  "discount_type": "percentage",
  "discount_value": "20.00",
  "is_valid": true,
  "min_order_amount": "50.00"
}
```

**الاستجابة في حالة الخطأ:**
```json
{
  "detail": "لا يمكنك استخدام هذا الكوبون بعد الآن."
}
```

### Endpoints للمشرفين

#### 1. إدارة الكوبونات (CRUD)
```http
# إنشاء كوبون جديد
POST /api/marketing/admin/coupons/

# عرض جميع الكوبونات
GET /api/marketing/admin/coupons/

# عرض كوبون محدد
GET /api/marketing/admin/coupons/{id}/

# تحديث كوبون
PUT /api/marketing/admin/coupons/{id}/

# حذف كوبون
DELETE /api/marketing/admin/coupons/{id}/
```

**مثال إنشاء كوبون:**
```json
{
  "code": "NEWUSER50",
  "title": "خصم 50% للمستخدمين الجدد",
  "description": "خصم خاص للمستخدمين الجدد",
  "discount_type": "percentage",
  "discount_value": "50.00",
  "max_discount_amount": "100.00",
  "min_order_amount": "20.00",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-06-30T23:59:59Z",
  "usage_limit": 1000,
  "usage_limit_per_user": 1,
  "is_first_order_only": true,
  "free_shipping": false,
  "is_combinable": false,
  "status": "active",
  "applicable_products": [1, 2, 3],
  "applicable_categories": [1, 2],
  "excluded_products": [],
  "excluded_categories": [],
  "allowed_customer_groups": [1]
}
```

**الاستجابة المتقدمة للكوبون:**
```json
{
  "id": 1,
  "code": "NEWUSER50",
  "title": "خصم 50% للمستخدمين الجدد",
  "description": "خصم خاص للمستخدمين الجدد",
  "discount_type": "percentage",
  "discount_value": "50.00",
  "max_discount_amount": "100.00",
  "discount_text": "50%",
  "min_order_amount": "20.00",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-06-30T23:59:59Z",
  "usage_limit": 1000,
  "usage_limit_per_user": 1,
  "usage_count": 0,
  "is_first_order_only": true,
  "free_shipping": false,
  "is_combinable": false,
  "status": "active",
  "is_active": true,
  "is_valid": true,
  "is_expired": false,
  "is_used_up": false,
  "time_remaining": {
    "days": 180,
    "hours": 12,
    "minutes": 30
  },
  "usage_percentage": 0.0,
  "applicable_products": [1, 2, 3],
  "applicable_categories": [1, 2],
  "excluded_products": [],
  "excluded_categories": [],
  "allowed_customer_groups": [1],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### 2. تفعيل/إلغاء تفعيل الكوبونات
```http
# تفعيل كوبون
POST /api/marketing/admin/coupons/{id}/activate/

# إلغاء تفعيل كوبون
POST /api/marketing/admin/coupons/{id}/deactivate/
```

#### 3. إحصائيات استخدام الكوبونات
```http
GET /api/marketing/admin/coupons/{id}/usage-stats/
```

**الاستجابة:**
```json
{
  "coupon_id": 1,
  "coupon_code": "SAVE20",
  "total_usage": 150,
  "total_discount": "1500.00",
  "monthly_stats": [
    {
      "month": "2024-01",
      "usage_count": 45,
      "total_discount": "450.00"
    },
    {
      "month": "2024-02",
      "usage_count": 55,
      "total_discount": "550.00"
    }
  ],
  "top_users": [
    {
      "user_id": 1,
      "username": "user1",
      "user_email": "user1@example.com",
      "usage_count": 3,
      "total_discount": "30.00"
    },
    {
      "user_id": 2,
      "username": "user2",
      "user_email": "user2@example.com",
      "usage_count": 2,
      "total_discount": "20.00"
    }
  ]
}
```

#### 4. نظرة عامة على الكوبونات
```http
GET /api/marketing/admin/coupons/overview/
```

#### 5. إدارة استخدامات الكوبونات
```http
GET /api/marketing/admin/coupon-usages/
GET /api/marketing/admin/coupon-usages/{id}/
```

**مثال استجابة استخدام الكوبون:**
```json
{
  "id": 1,
  "coupon": 1,
  "coupon_code": "SAVE20",
  "coupon_title": "خصم 20% على كل شيء",
  "user": 1,
  "user_username": "user1",
  "user_email": "user1@example.com",
  "order": 1,
  "order_number": "ORD-2024-001",
  "discount_amount": "20.00",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## 🎯 Promotions API

### Endpoints للمستخدمين العاديين

#### 1. عرض العروض الترويجية
```http
GET /api/marketing/promotions/
```

**Query Parameters:**
- `type`: نوع العرض (sale, buy_x_get_y, bundle, flash_sale)
- `featured`: عرض العروض المميزة فقط (true/false)

**الاستجابة:**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "تخفيضات الصيف",
      "description": "خصومات كبيرة على جميع المنتجات",
      "promotion_type": "sale",
      "start_date": "2024-06-01T00:00:00Z",
      "end_date": "2024-08-31T23:59:59Z",
      "discount_percentage": "30.00",
      "is_active_now": true,
      "time_remaining": {
        "days": 15,
        "hours": 8,
        "minutes": 30
      },
      "progress_percentage": 75,
      "products_count": 25,
      "banner_image": "/media/store/promotions/summer_sale.jpg",
      "banner_url": "/promotions/summer-sale",
      "min_purchase_amount": "100.00",
      "buy_quantity": 1,
      "get_quantity": 0,
      "is_featured": true
    },
    {
      "id": 2,
      "name": "عرض خاطف - 50% خصم",
      "description": "خصم كبير لفترة محدودة",
      "promotion_type": "flash_sale",
      "start_date": "2024-01-15T00:00:00Z",
      "end_date": "2024-01-15T23:59:59Z",
      "discount_percentage": "50.00",
      "is_active_now": true,
      "time_remaining": {
        "days": 0,
        "hours": 2,
        "minutes": 30
      },
      "progress_percentage": 95,
      "products_count": 10,
      "banner_image": "/media/store/promotions/flash_sale.jpg",
      "banner_url": "/promotions/flash-sale",
      "min_purchase_amount": "50.00",
      "buy_quantity": 1,
      "get_quantity": 0,
      "is_featured": false
    },
    {
      "id": 3,
      "name": "اشتر 2 واحصل على 1 مجاناً",
      "description": "عرض خاص على المنتجات المحددة",
      "promotion_type": "buy_x_get_y",
      "start_date": "2024-01-10T00:00:00Z",
      "end_date": "2024-01-20T23:59:59Z",
      "discount_percentage": "33.33",
      "is_active_now": true,
      "time_remaining": {
        "days": 7,
        "hours": 12,
        "minutes": 0
      },
      "progress_percentage": 50,
      "products_count": 15,
      "banner_image": "/media/store/promotions/buy_get.jpg",
      "banner_url": "/promotions/buy-get",
      "min_purchase_amount": "75.00",
      "buy_quantity": 2,
      "get_quantity": 1,
      "is_featured": true
    }
  ]
}
```

#### 2. عرض عرض ترويجي محدد
```http
GET /api/marketing/promotions/{id}/
```

**الاستجابة مع تفاصيل المنتجات:**
```json
{
  "id": 1,
  "name": "تخفيضات الصيف",
  "description": "خصومات كبيرة على جميع المنتجات",
  "promotion_type": "sale",
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "discount_percentage": "30.00",
  "is_active_now": true,
  "time_remaining": {
    "days": 15,
    "hours": 8,
    "minutes": 30
  },
  "progress_percentage": 75,
  "products_count": 25,
  "banner_image": "/media/store/promotions/summer_sale.jpg",
  "banner_url": "/promotions/summer-sale",
  "min_purchase_amount": "100.00",
  "buy_quantity": 1,
  "get_quantity": 0,
  "is_featured": true,
  "products": [
    {
      "id": 1,
      "name": "منتج 1",
      "price": "100.00",
      "discounted_price": "70.00",
      "image": "/media/products/product1.jpg",
      "category": "إلكترونيات",
      "stock": 50,
      "rating": 4.5
    },
    {
      "id": 2,
      "name": "منتج 2",
      "price": "150.00",
      "discounted_price": "105.00",
      "image": "/media/products/product2.jpg",
      "category": "ملابس",
      "stock": 30,
      "rating": 4.2
    },
    {
      "id": 3,
      "name": "منتج 3",
      "price": "80.00",
      "discounted_price": "56.00",
      "image": "/media/products/product3.jpg",
      "category": "أحذية",
      "stock": 25,
      "rating": 4.8
    }
  ]
}
```

#### 3. عرض العروض النشطة مجمعة
```http
GET /api/marketing/promotions/active_promotions/
```

**الاستجابة:**
```json
{
  "sale": [
    {
      "id": 1,
      "name": "تخفيضات الصيف",
      "description": "خصومات كبيرة على جميع المنتجات",
      "promotion_type": "sale",
      "discount_percentage": "30.00",
      "is_active_now": true,
      "time_remaining": {
        "days": 15,
        "hours": 8,
        "minutes": 30
      },
      "progress_percentage": 75,
      "products_count": 25,
      "banner_image": "/media/store/promotions/summer_sale.jpg",
      "banner_url": "/promotions/summer-sale"
    }
  ],
  "flash_sale": [
    {
      "id": 2,
      "name": "عرض خاطف - 50% خصم",
      "description": "خصم كبير لفترة محدودة",
      "promotion_type": "flash_sale",
      "discount_percentage": "50.00",
      "is_active_now": true,
      "time_remaining": {
        "days": 0,
        "hours": 2,
        "minutes": 30
      },
      "progress_percentage": 95,
      "products_count": 10,
      "banner_image": "/media/store/promotions/flash_sale.jpg",
      "banner_url": "/promotions/flash-sale"
    }
  ],
  "buy_x_get_y": [
    {
      "id": 3,
      "name": "اشتر 2 واحصل على 1 مجاناً",
      "description": "عرض خاص على المنتجات المحددة",
      "promotion_type": "buy_x_get_y",
      "discount_percentage": "33.33",
      "is_active_now": true,
      "time_remaining": {
        "days": 7,
        "hours": 12,
        "minutes": 0
      },
      "progress_percentage": 50,
      "products_count": 15,
      "banner_image": "/media/store/promotions/buy_get.jpg",
      "banner_url": "/promotions/buy-get"
    }
  ]
}
```

### Endpoints للمشرفين

#### 1. إدارة العروض الترويجية (CRUD)
```http
# إنشاء عرض جديد
POST /api/marketing/admin/promotions/

# عرض جميع العروض
GET /api/marketing/admin/promotions/

# عرض عرض محدد
GET /api/marketing/admin/promotions/{id}/

# تحديث عرض
PUT /api/marketing/admin/promotions/{id}/

# حذف عرض
DELETE /api/marketing/admin/promotions/{id}/
```

**مثال إنشاء عرض:**
```json
{
  "name": {
    "ar": "تخفيضات الصيف",
    "en": "Summer Sale"
  },
  "description": {
    "ar": "خصومات كبيرة على جميع المنتجات",
    "en": "Big discounts on all products"
  },
  "promotion_type": "sale",
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "discount_percentage": "30.00",
  "min_purchase_amount": "100.00",
  "buy_quantity": 1,
  "get_quantity": 0,
  "is_featured": true,
  "banner_image": null,
  "banner_url": "/promotions/summer-sale",
  "products": [1, 2, 3, 4, 5],
  "categories": [1, 2]
}
```

**الاستجابة المتقدمة للعرض الترويجي:**
```json
{
  "id": 1,
  "name": {
    "ar": "تخفيضات الصيف",
    "en": "Summer Sale"
  },
  "name_ar": "تخفيضات الصيف",
  "name_en": "Summer Sale",
  "description": {
    "ar": "خصومات كبيرة على جميع المنتجات",
    "en": "Big discounts on all products"
  },
  "description_ar": "خصومات كبيرة على جميع المنتجات",
  "description_en": "Big discounts on all products",
  "promotion_type": "sale",
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "discount_percentage": "30.00",
  "buy_quantity": 1,
  "get_quantity": 0,
  "min_purchase_amount": "100.00",
  "is_active": true,
  "is_featured": true,
  "is_active_now": true,
  "time_remaining": {
    "days": 15,
    "hours": 8,
    "minutes": 30
  },
  "progress_percentage": 75,
  "products_count": 5,
  "categories_count": 2,
  "banner_image": "/media/store/promotions/summer_sale.jpg",
  "banner_url": "/promotions/summer-sale",
  "products": [1, 2, 3, 4, 5],
  "categories": [1, 2],
  "created_at": "2024-06-01T00:00:00Z",
  "updated_at": "2024-06-01T00:00:00Z"
}
```

#### 2. تفعيل/إلغاء تفعيل العروض الترويجية
```http
# تفعيل عرض ترويجي
POST /api/marketing/admin/promotions/{id}/activate/

# إلغاء تفعيل عرض ترويجي
POST /api/marketing/admin/promotions/{id}/deactivate/
```

#### 3. إحصائيات العروض الترويجية
```http
GET /api/marketing/admin/promotions/{id}/stats/
```

#### 4. نظرة عامة على العروض الترويجية
```http
GET /api/marketing/admin/promotions/overview/
```

**الاستجابة:**
```json
{
  "promotion_id": 1,
  "promotion_name": "تخفيضات الصيف",
  "total_orders": 150,
  "total_revenue": "15000.00",
  "total_discount": "4500.00",
  "conversion_rate": 12.5,
  "top_products": [
    {
      "product_id": 1,
      "product_name": "منتج 1",
      "orders_count": 25,
      "total_revenue": "2500.00"
    },
    {
      "product_id": 2,
      "product_name": "منتج 2",
      "orders_count": 20,
      "total_revenue": "2000.00"
    }
  ],
  "time_remaining": {
    "days": 15,
    "hours": 8,
    "minutes": 30
  },
  "progress_percentage": 75
}
```

---

## 📊 Analytics & Reporting

### للمشرفين فقط

#### 1. إحصائيات التسويق العامة
```http
GET /api/marketing/admin/analytics/overview/
```

**الاستجابة:**
```json
{
  "coupons": {
    "total": 25,
    "active": 15,
    "expired": 5,
    "used_up": 5,
    "total_usage": 1250,
    "total_discount_amount": "15000.00",
    "monthly_stats": [
      {
        "month": "2024-01",
        "usage_count": 150,
        "total_discount": "1500.00"
      },
      {
        "month": "2024-02",
        "usage_count": 200,
        "total_discount": "2000.00"
      }
    ]
  },
  "promotions": {
    "total": 10,
    "active": 5,
    "current": 3,
    "featured": 2,
    "type_stats": [
      {
        "promotion_type": "sale",
        "count": 5,
        "active_count": 3
      },
      {
        "promotion_type": "flash_sale",
        "count": 3,
        "active_count": 2
      }
    ]
  }
}
```

#### 2. تقرير أداء الكوبونات
```http
GET /api/marketing/admin/analytics/coupons-performance/
```

**مثال استجابة أداء الكوبونات:**
```json
{
  "top_coupons": [
    {
      "coupon__id": 1,
      "coupon__code": "SAVE20",
      "coupon__title": "خصم 20% على كل شيء",
      "usage_count": 150,
      "total_discount": "1500.00"
    },
    {
      "coupon__id": 2,
      "coupon__code": "NEWUSER50",
      "coupon__title": "خصم 50% للمستخدمين الجدد",
      "usage_count": 100,
      "total_discount": "2500.00"
    }
  ],
  "discount_type_stats": [
    {
      "coupon__discount_type": "percentage",
      "usage_count": 200,
      "total_discount": "3000.00"
    },
    {
      "coupon__discount_type": "fixed",
      "usage_count": 50,
      "total_discount": "500.00"
    }
  ]
}
```

#### 3. تقرير أداء العروض الترويجية
```http
GET /api/marketing/admin/analytics/promotions-performance/
```

**مثال استجابة أداء العروض الترويجية:**
```json
{
  "type_stats": [
    {
      "promotion_type": "sale",
      "count": 5,
      "active_count": 3
    },
    {
      "promotion_type": "flash_sale",
      "count": 3,
      "active_count": 2
    },
    {
      "promotion_type": "buy_x_get_y",
      "count": 2,
      "active_count": 1
    }
  ],
  "featured_promotions": [
    {
      "id": 1,
      "name": {
        "ar": "تخفيضات الصيف",
        "en": "Summer Sale"
      },
      "promotion_type": "sale",
      "discount_percentage": "30.00"
    },
    {
      "id": 2,
      "name": {
        "ar": "عرض خاطف",
        "en": "Flash Sale"
      },
      "promotion_type": "flash_sale",
      "discount_percentage": "50.00"
    }
  ]
}
```

---

## 🔧 Error Handling

### رموز الأخطاء الشائعة

| الكود | الوصف |
|-------|--------|
| 400 | بيانات غير صحيحة |
| 401 | غير مصرح (يتطلب تسجيل دخول) |
| 403 | محظور (لا توجد صلاحيات كافية) |
| 404 | غير موجود |
| 429 | طلبات كثيرة جداً |

### أمثلة على الأخطاء

**خطأ في كود الكوبون:**
```json
{
  "code": ["كود الكوبون غير صحيح."]
}
```

**كوبون منتهي الصلاحية:**
```json
{
  "detail": "انتهت صلاحية هذا الكوبون."
}
```

**كوبون مستنفد:**
```json
{
  "detail": "تم استنفاد الحد الأقصى لاستخدام هذا الكوبون."
}
```

---

## 📝 Usage Examples

### تطبيق كوبون على السلة

```javascript
// التحقق من صلاحية الكوبون
const validateCoupon = async (code) => {
  try {
    const response = await fetch('/api/marketing/coupons/validate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    });
    
    if (response.ok) {
      const coupon = await response.json();
      // تطبيق الكوبون على السلة
      applyCouponToCart(coupon);
    } else {
      const error = await response.json();
      showError(error.detail);
    }
  } catch (error) {
    console.error('Error validating coupon:', error);
  }
};
```

### عرض العروض الترويجية

```javascript
// جلب العروض النشطة
const getActivePromotions = async () => {
  try {
    const response = await fetch('/api/marketing/promotions/?featured=true');
    const data = await response.json();
    
    // عرض العروض في الصفحة الرئيسية
    displayPromotions(data.results);
  } catch (error) {
    console.error('Error fetching promotions:', error);
  }
};
```

### استخدام نظام الكاش

```javascript
// جلب الكوبونات مع الكاش
const getCachedCoupons = async () => {
  try {
    const response = await fetch('/api/marketing/coupons/', {
      headers: {
        'Cache-Control': 'max-age=300' // كاش لمدة 5 دقائق
      }
    });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching cached coupons:', error);
  }
};
```

### إدارة الكوبونات للمشرفين

```javascript
// تفعيل كوبون
const activateCoupon = async (couponId) => {
  try {
    const response = await fetch(`/api/marketing/admin/coupons/${couponId}/activate/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      showSuccess('تم تفعيل الكوبون بنجاح');
    }
  } catch (error) {
    console.error('Error activating coupon:', error);
  }
};

// جلب إحصائيات الكوبون
const getCouponStats = async (couponId) => {
  try {
    const response = await fetch(`/api/marketing/admin/coupons/${couponId}/usage-stats/`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const stats = await response.json();
    displayCouponStats(stats);
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
  }
};
```

### إدارة العروض الترويجية للمشرفين

```javascript
// إنشاء عرض ترويجي جديد
const createPromotion = async (promotionData) => {
  try {
    const response = await fetch('/api/marketing/admin/promotions/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: {
          ar: 'عرض جديد',
          en: 'New Promotion'
        },
        description: {
          ar: 'وصف العرض',
          en: 'Promotion description'
        },
        promotion_type: 'sale',
        discount_percentage: 20.00,
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-12-31T23:59:59Z',
        is_featured: true
      })
    });
    
    if (response.ok) {
      showSuccess('تم إنشاء العرض الترويجي بنجاح');
    }
  } catch (error) {
    console.error('Error creating promotion:', error);
  }
};
```

---

## 🔧 الميزات المتقدمة

### 🚀 نظام الكاش (Caching)
- كاش للكوبونات النشطة
- كاش لإحصائيات الكوبونات
- كاش للعروض الترويجية
- مسح تلقائي للكاش عند التحديث

### 🔔 نظام الإشعارات
- إشعارات عند إنشاء كوبونات جديدة
- إشعارات عند إنشاء عروض ترويجية جديدة
- قابل للتطوير لإرسال إيميلات وإشعارات

### ✅ التحقق من صحة البيانات
- التحقق من تفرد كود الكوبون
- التحقق من صحة التواريخ
- التحقق من نسب الخصم
- رسائل خطأ واضحة ومفيدة

### 🌍 دعم متعدد اللغات
- أسماء وأوصاف العروض بعدة لغات
- fallback ذكي للغات غير المدعومة
- دعم كامل للعربية والإنجليزية

### ⏰ نظام الوقت المتبقي
- حساب دقيق للوقت المتبقي للعروض
- نسبة تقدم العرض
- عرض الوقت بالأيام والساعات والدقائق

## 🔒 Security Considerations

1. **Authentication**: جميع عمليات الكوبونات تتطلب تسجيل دخول
2. **Rate Limiting**: تطبيق حدود على عدد الطلبات
3. **Validation**: التحقق من صحة البيانات المدخلة
4. **Authorization**: التحقق من صلاحيات المستخدم
5. **Audit Trail**: تسجيل جميع العمليات للمشرفين
6. **Caching Security**: حماية البيانات المخزنة في الكاش

---

## 🧪 الاختبارات والجودة

### ✅ اختبارات النماذج
- اختبارات إنشاء الكوبونات والعروض
- اختبارات حساب الخصم
- اختبارات صلاحية الكوبونات
- اختبارات دعم متعدد اللغات
- اختبارات قيود الاستخدام

### ✅ اختبارات الواجهات
- اختبارات عرض الكوبونات للمستخدمين
- اختبارات التحقق من صلاحية الكوبونات
- اختبارات عرض العروض الترويجية
- اختبارات الواجهات الإدارية
- اختبارات التحليلات والإحصائيات

### 🚀 تشغيل الاختبارات
```bash
# تشغيل جميع اختبارات التطبيق
python manage.py test apps.marketing

# تشغيل اختبارات محددة
python manage.py test apps.marketing.tests.CouponModelTest
python manage.py test apps.marketing.tests.PromotionModelTest
python manage.py test apps.marketing.tests.CouponViewSetTest
```

## 📚 Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Authentication Guide](../authentication/README.md)
- [Store Products API](../store_products/API_DOCUMENTATION.md)
- [Cart & Checkout API](../store_cart/API_DOCUMENTATION.md)
- [Marketing App README](./README.md)
- [Marketing Summary](./MARKETING_SUMMARY.md)

---

## 🔄 التحديثات والإضافات الأخيرة

### ✅ الإضافات الجديدة
1. **نظام الكاش المتقدم**: تحسين الأداء مع كاش ذكي
2. **إحصائيات مفصلة**: إحصائيات شاملة للكوبونات والعروض
3. **اختبارات شاملة**: اختبارات لجميع الوظائف والنماذج
4. **دعم متعدد اللغات**: دعم كامل للعربية والإنجليزية
5. **نظام الإشعارات**: إشعارات عند إنشاء كوبونات وعروض جديدة
6. **التحقق من صحة البيانات**: تحقق شامل من جميع المدخلات
7. **نظام الوقت المتبقي**: حساب دقيق للوقت المتبقي للعروض

### 🔧 التحسينات التقنية
1. **تحسين الأداء**: استخدام الكاش وتقليل استعلامات قاعدة البيانات
2. **تحسين الأمان**: صلاحيات محددة وحماية البيانات
3. **تحسين الوثائق**: وثائق شاملة مع أمثلة عملية
4. **تحسين الاختبارات**: اختبارات شاملة لجميع الوظائف

### 📊 الميزات الإدارية الجديدة
1. **تفعيل/إلغاء تفعيل**: إمكانية تفعيل وإلغاء تفعيل الكوبونات والعروض
2. **إحصائيات مفصلة**: إحصائيات شاملة مع رسوم بيانية
3. **تقارير الأداء**: تقارير مفصلة لأداء الكوبونات والعروض
4. **نظرة عامة**: لوحات تحكم شاملة للمشرفين

## 🤝 Support

للحصول على المساعدة أو الإبلاغ عن مشاكل:
- إنشاء Issue في GitHub Repository
- التواصل مع فريق التطوير
- مراجعة Logs في النظام
- مراجعة الوثائق المتاحة 