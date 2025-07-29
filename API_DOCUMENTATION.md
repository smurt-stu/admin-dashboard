# 📋 وثائق API نظام المراجعات والتقييمات

## 🎯 نظرة عامة

نظام المراجعات والتقييمات يوفر منصة شاملة لإدارة مراجعات المنتجات والخدمات مع ميزات متقدمة للمشرفين والمستخدمين العاديين.

### الميزات الرئيسية:
- ✅ نظام مراجعات متكامل مع تقييمات فرعية
- ✅ تصويت على فائدة المراجعات
- ✅ نظام تعليقات متداخل
- ✅ إحصائيات تفصيلية للمنتجات
- ✅ إدارة متقدمة للمشرفين
- ✅ تحقق من المشتريات الموثقة

---

## 🔐 الصلاحيات والأمان

### للمستخدمين العاديين:
- قراءة المراجعات المعتمدة
- إنشاء مراجعات جديدة
- التصويت على فائدة المراجعات
- إضافة تعليقات
- عرض إحصائيات المنتجات

### للمشرفين:
- إدارة جميع المراجعات (معتمدة وغير معتمدة)
- اعتماد/رفض المراجعات
- إضافة ردود التاجر
- إدارة التعليقات
- عرض إحصائيات تفصيلية
- إعادة حساب الإحصائيات

---

## 📡 نقاط النهاية (Endpoints)

### 1. إدارة المراجعات الرئيسية

#### `GET /api/store-reviews/reviews/`
**الوصف:** الحصول على قائمة المراجعات المعتمدة

**الصلاحيات:** للجميع

**المعاملات:**
```json
{
  "content_type": "integer",     // نوع المنتج (اختياري)
  "object_id": "string",         // معرف المنتج (اختياري)
  "min_rating": "integer",       // الحد الأدنى للتقييم (اختياري)
  "max_rating": "integer",       // الحد الأقصى للتقييم (اختياري)
  "search": "string",            // البحث في العنوان والمحتوى
  "ordering": "string",          // الترتيب (created_at, rating, helpfulness_score)
  "page": "integer"              // رقم الصفحة
}
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "count": 150,
    "next": "http://api.example.com/reviews/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "user": 123,
        "user_name": "أحمد محمد",
        "user_avatar": "https://example.com/avatar.jpg",
        "content_type": 15,
        "object_id": "550e8400-e29b-41d4-a716-446655440000",
        "product_title": "كتاب البرمجة المتقدم",
        "product_url": "/products/book-123",
        "rating": 5,
        "quality_rating": 5,
        "value_rating": 4,
        "ease_of_use_rating": 5,
        "title": "كتاب ممتاز للمبرمجين",
        "review_text": "محتوى مفيد جداً...",
        "is_verified_purchase": true,
        "is_approved": true,
        "helpfulness_score": 12,
        "user_found_helpful": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### `POST /api/store-reviews/reviews/`
**الوصف:** إنشاء مراجعة جديدة

**الصلاحيات:** مستخدم مسجل دخول

**المعاملات:**
```json
{
  "content_type": 15,
  "object_id": "550e8400-e29b-41d4-a716-446655440000",
  "rating": 5,
  "quality_rating": 5,
  "value_rating": 4,
  "ease_of_use_rating": 5,
  "title": "عنوان المراجعة",
  "review_text": "نص المراجعة التفصيلي",
  "is_verified_purchase": true
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء المراجعة بنجاح",
  "data": {
    "id": 1,
    "user": 123,
    "rating": 5,
    "title": "عنوان المراجعة",
    "review_text": "نص المراجعة التفصيلي",
    "is_verified_purchase": true,
    "is_approved": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### `GET /api/store-reviews/reviews/{id}/`
**الوصف:** الحصول على مراجعة محددة

**الصلاحيات:** للجميع

#### `PUT /api/store-reviews/reviews/{id}/`
**الوصف:** تحديث مراجعة

**الصلاحيات:** مالك المراجعة أو مشرف

#### `DELETE /api/store-reviews/reviews/{id}/`
**الوصف:** حذف مراجعة

**الصلاحيات:** مالك المراجعة أو مشرف

#### `POST /api/store-reviews/reviews/{id}/helpful/`
**الوصف:** التصويت على فائدة المراجعة

**الصلاحيات:** مستخدم مسجل دخول

**المعاملات:**
```json
{
  "is_helpful": true
}
```

#### `GET /api/store-reviews/reviews/my_reviews/`
**الوصف:** الحصول على مراجعات المستخدم الحالي

**الصلاحيات:** مستخدم مسجل دخول

### 2. إحصائيات المراجعات

#### `GET /api/store-reviews/reviews/statistics/`
**الوصف:** الحصول على إحصائيات مراجعات منتج معين

**الصلاحيات:** للجميع

**المعاملات:**
```json
{
  "content_type": 15,
  "object_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "content_type": 15,
    "object_id": "550e8400-e29b-41d4-a716-446655440000",
    "total_reviews": 150,
    "average_rating": 4.5,
    "average_quality_rating": 4.6,
    "average_value_rating": 4.3,
    "average_ease_rating": 4.4,
    "rating_distribution": {
      "5_star": 75,
      "4_star": 45,
      "3_star": 20,
      "2_star": 7,
      "1_star": 3
    },
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

#### `GET /api/store-reviews/reviews/product_summary/`
**الوصف:** الحصول على ملخص شامل لمراجعات المنتج

**الصلاحيات:** للجميع

**المعاملات:**
```json
{
  "content_type": 15,
  "object_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "product_id": "550e8400-e29b-41d4-a716-446655440000",
    "product_title": "كتاب البرمجة المتقدم",
    "total_reviews": 150,
    "average_rating": 4.5,
    "latest_reviews": [...],
    "rating_distribution": {
      "5_star": 75,
      "4_star": 45,
      "3_star": 20,
      "2_star": 7,
      "1_star": 3,
      "5_star_percentage": 50.0,
      "4_star_percentage": 30.0,
      "3_star_percentage": 13.3,
      "2_star_percentage": 4.7,
      "1_star_percentage": 2.0
    }
  }
}
```

### 3. إدارة التعليقات

#### `GET /api/store-reviews/comments/`
**الوصف:** الحصول على تعليقات مراجعة معينة

**الصلاحيات:** للجميع

**المعاملات:**
```json
{
  "review_pk": 1
}
```

#### `POST /api/store-reviews/comments/`
**الوصف:** إضافة تعليق جديد

**الصلاحيات:** مستخدم مسجل دخول

**المعاملات:**
```json
{
  "review_pk": 1,
  "comment_text": "نص التعليق",
  "parent": null  // للرد على تعليق آخر
}
```

### 4. إدارة التصويت على الفائدة

#### `POST /api/store-reviews/helpfulness/`
**الوصف:** التصويت على فائدة المراجعة

**الصلاحيات:** مستخدم مسجل دخول

**المعاملات:**
```json
{
  "review": 1,
  "is_helpful": true
}
```

### 5. إحصائيات النظام (للمشرفين)

#### `GET /api/store-reviews/statistics/`
**الوصف:** الحصول على إحصائيات المراجعات

**الصلاحيات:** مشرف

#### `POST /api/store-reviews/statistics/update_statistics/`
**الوصف:** إعادة حساب إحصائيات منتج معين

**الصلاحيات:** مشرف

**المعاملات:**
```json
{
  "content_type": 15,
  "object_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### `GET /api/store-reviews/statistics/top_rated_products/`
**الوصف:** الحصول على أفضل المنتجات تقييماً

**الصلاحيات:** للجميع

**المعاملات:**
```json
{
  "limit": 10
}
```

---

## 🔧 نقاط النهاية الإدارية (Admin Endpoints)

### إدارة المراجعات للمشرفين

#### `GET /api/admin/reviews/`
**الوصف:** الحصول على جميع المراجعات (معتمدة وغير معتمدة)

**الصلاحيات:** مشرف

**المعاملات:**
```json
{
  "is_approved": "boolean",      // تصفية حسب حالة الاعتماد
  "rating": "integer",           // تصفية حسب التقييم
  "is_verified_purchase": "boolean", // تصفية حسب التحقق
  "content_type": "integer",     // تصفية حسب نوع المنتج
  "search": "string",            // البحث
  "ordering": "string"           // الترتيب
}
```

#### `PUT /api/admin/reviews/{id}/approve/`
**الوصف:** اعتماد مراجعة

**الصلاحيات:** مشرف

#### `PUT /api/admin/reviews/{id}/reject/`
**الوصف:** رفض مراجعة

**الصلاحيات:** مشرف

#### `PUT /api/admin/reviews/{id}/merchant_reply/`
**الوصف:** إضافة رد التاجر

**الصلاحيات:** مشرف

**المعاملات:**
```json
{
  "merchant_reply": "نص رد التاجر"
}
```

### إدارة التعليقات للمشرفين

#### `GET /api/admin/comments/`
**الوصف:** الحصول على جميع التعليقات

**الصلاحيات:** مشرف

#### `PUT /api/admin/comments/{id}/approve/`
**الوصف:** اعتماد تعليق

**الصلاحيات:** مشرف

#### `PUT /api/admin/comments/{id}/reject/`
**الوصف:** رفض تعليق

**الصلاحيات:** مشرف

### إحصائيات النظام للمشرفين

#### `GET /api/admin/statistics/overview/`
**الوصف:** نظرة عامة على إحصائيات النظام

**الصلاحيات:** مشرف

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "total_reviews": 15000,
    "pending_reviews": 250,
    "approved_reviews": 14750,
    "total_comments": 5000,
    "pending_comments": 100,
    "average_rating_system": 4.2,
    "top_products": [...],
    "recent_activity": [...]
  }
}
```

#### `POST /api/admin/statistics/recalculate_all/`
**الوصف:** إعادة حساب جميع الإحصائيات

**الصلاحيات:** مشرف

---

## 📊 نماذج البيانات

### نموذج المراجعة (Review)
```json
{
  "id": "integer",
  "user": "integer",
  "user_name": "string",
  "user_avatar": "string",
  "content_type": "integer",
  "object_id": "string",
  "product_title": "string",
  "product_url": "string",
  "rating": "integer (1-5)",
  "quality_rating": "integer (1-5)",
  "value_rating": "integer (1-5)",
  "ease_of_use_rating": "integer (1-5)",
  "title": "string",
  "review_text": "string",
  "is_verified_purchase": "boolean",
  "is_approved": "boolean",
  "helpfulness_score": "integer",
  "user_found_helpful": "boolean",
  "merchant_reply": "string",
  "merchant_replied_at": "datetime",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### نموذج إحصائيات المراجعات (ReviewStatistics)
```json
{
  "id": "integer",
  "content_type": "integer",
  "object_id": "string",
  "total_reviews": "integer",
  "average_rating": "decimal",
  "average_quality_rating": "decimal",
  "average_value_rating": "decimal",
  "average_ease_rating": "decimal",
  "rating_distribution": {
    "5_star": "integer",
    "4_star": "integer",
    "3_star": "integer",
    "2_star": "integer",
    "1_star": "integer"
  },
  "last_updated": "datetime"
}
```

---

## 🚨 رموز الأخطاء

| الكود | الوصف |
|-------|--------|
| 400 | بيانات غير صحيحة |
| 401 | غير مصرح (يجب تسجيل الدخول) |
| 403 | ممنوع (صلاحيات غير كافية) |
| 404 | غير موجود |
| 409 | تعارض (مثل مراجعة موجودة مسبقاً) |
| 422 | بيانات غير صالحة |
| 429 | طلبات كثيرة جداً |
| 500 | خطأ في الخادم |

---

## 📝 أمثلة الاستخدام

### إنشاء مراجعة جديدة
```bash
curl -X POST "https://api.example.com/api/store-reviews/reviews/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": 15,
    "object_id": "550e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "title": "منتج ممتاز",
    "review_text": "جودة عالية وسعر مناسب",
    "is_verified_purchase": true
  }'
```

### الحصول على إحصائيات منتج
```bash
curl -X GET "https://api.example.com/api/store-reviews/reviews/statistics/?content_type=15&object_id=550e8400-e29b-41d4-a716-446655440000"
```

### التصويت على فائدة مراجعة
```bash
curl -X POST "https://api.example.com/api/store-reviews/reviews/1/helpful/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_helpful": true}'
```

---

## 🔄 التحديثات المستقبلية

- [ ] دعم الصور والفيديوهات في المراجعات
- [ ] نظام تقارير المراجعات المسيئة
- [ ] تحليلات متقدمة للمراجعات
- [ ] نظام المكافآت للمراجعات المفيدة
- [ ] دعم المراجعات باللغة الإنجليزية
- [ ] نظام التوصيات بناءً على المراجعات

---

## 📞 الدعم

للمساعدة التقنية أو الاستفسارات حول API، يرجى التواصل مع فريق التطوير.

**البريد الإلكتروني:** dev@example.com  
**الهاتف:** +966-50-123-4567  
**ساعات العمل:** الأحد - الخميس، 9:00 ص - 6:00 م 