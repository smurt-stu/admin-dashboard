# إصلاح مشكلة بنية البيانات في الفئات

## المشكلة

كانت هناك مشكلة في بنية البيانات المرسلة والمستلمة من API للفئات. المشكلة كانت في عدم تطابق بنية البيانات بين Frontend و Backend.

### البيانات المرسلة (المشكلة):
```json
{
    "id": "c281093a-dc78-4901-9c23-71cfe77d84b6",
    "name": "c281093a-dc78-4901-9c23-71cfe77d84b6",  // ❌ نص عادي
    "slug": "category-c281093a-dc78-4901-9c23-71cfe77d84b6",
    "description": "",
    "parent": null,
    "icon": "ri-folder-line",
    "image": null,
    "full_path": "c281093a-dc78-4901-9c23-71cfe77d84b6",
    "children": [],
    "display_order": 0,
    "meta_title": {
        "ar": "مياه",
        "en": "مياه"
    },
    "meta_description": {
        "ar": "مياه",
        "en": "مياه"
    },
    "created_at": "2025-07-30T09:41:12.566634Z",
    "updated_at": "2025-07-30T09:42:44.261713Z",
    "is_active": true
}
```

### البيانات المستلمة (المشكلة):
```json
{
    "id": "c281093a-dc78-4901-9c23-71cfe77d84b6",
    "name": "c281093a-dc78-4901-9c23-71cfe77d84b6",  // ❌ نص عادي
    "slug": "category-c281093a-dc78-4901-9c23-71cfe77d84b6",
    "icon": "ri-folder-line",
    "level": 0,
    "products_count": 0,
    "display_order": 0,
    "is_active": true
}
```

## المشاكل المحددة

1. **حقل `name`**: يجب أن يكون كائن ثنائي اللغة `{ar: string, en: string}` وليس نص عادي
2. **حقل `description`**: مفقود في الاستجابة
3. **حقول إضافية**: `meta_title`, `meta_description` مفقودة في الاستجابة
4. **حقل `level`**: غير موجود في نوع البيانات TypeScript

## الحل

تم إصلاح المشكلة في الملفات التالية:

### 1. صفحة تعديل الفئة (`app/admin/categories/[id]/edit/page.tsx`)

```typescript
// قبل الإصلاح
const categoryData = {
  name: formData.name,
  description: formData.description,
  // ...
};

// بعد الإصلاح
const categoryData = {
  name: {
    ar: formData.name.ar || '',
    en: formData.name.en || ''
  },
  description: {
    ar: formData.description.ar || '',
    en: formData.description.en || ''
  },
  // ...
};
```

### 2. صفحة إنشاء الفئة (`app/admin/categories/create/page.tsx`)

تم تطبيق نفس الإصلاح في صفحة إنشاء الفئات.

### 3. صفحة عرض الفئة (`app/admin/categories/[id]/page.tsx`)

تم إنشاء صفحة عرض تفاصيل الفئة مع:
- عرض المعلومات الأساسية
- عرض الإحصائيات
- عرض معلومات SEO
- عرض الفئة الأب والفئات الفرعية
- إجراءات التعديل والحذف

## البنية الصحيحة للبيانات

### البيانات المرسلة (بعد الإصلاح):
```json
{
    "id": "c281093a-dc78-4901-9c23-71cfe77d84b6",
    "name": {
        "ar": "مياه",
        "en": "Water"
    },
    "slug": "category-c281093a-dc78-4901-9c23-71cfe77d84b6",
    "description": {
        "ar": "وصف الفئة باللغة العربية",
        "en": "Category description in English"
    },
    "parent": null,
    "icon": "ri-folder-line",
    "display_order": 0,
    "meta_title": {
        "ar": "عنوان SEO بالعربية",
        "en": "SEO title in English"
    },
    "meta_description": {
        "ar": "وصف SEO بالعربية",
        "en": "SEO description in English"
    },
    "is_active": true
}
```

### البيانات المستلمة (المتوقعة):
```json
{
    "id": "c281093a-dc78-4901-9c23-71cfe77d84b6",
    "name": {
        "ar": "مياه",
        "en": "Water"
    },
    "slug": "category-c281093a-dc78-4901-9c23-71cfe77d84b6",
    "description": {
        "ar": "وصف الفئة باللغة العربية",
        "en": "Category description in English"
    },
    "icon": "ri-folder-line",
    "display_order": 0,
    "products_count": 0,
    "children_count": 0,
    "is_active": true,
    "meta_title": {
        "ar": "عنوان SEO بالعربية",
        "en": "SEO title in English"
    },
    "meta_description": {
        "ar": "وصف SEO بالعربية",
        "en": "SEO description in English"
    },
    "created_at": "2025-07-30T09:41:12.566634Z",
    "updated_at": "2025-07-30T09:42:44.261713Z"
}
```

## ملاحظات مهمة

1. **المشكلة ليست من Backend**: المشكلة كانت في Frontend حيث كان يتم إرسال البيانات ببنية خاطئة
2. **تطابق البنية**: يجب أن تتطابق بنية البيانات المرسلة مع بنية البيانات المتوقعة من Backend
3. **التحقق من البيانات**: يجب التحقق من وجود البيانات قبل إرسالها لتجنب الأخطاء
4. **التعامل مع اللغات**: يجب التعامل مع البيانات ثنائية اللغة بشكل صحيح

## الاختبار

بعد الإصلاح، يجب اختبار:
1. إنشاء فئة جديدة
2. تعديل فئة موجودة
3. عرض تفاصيل الفئة
4. حذف فئة
5. تفعيل/إلغاء تفعيل فئة

## الملفات المعدلة

- `app/admin/categories/[id]/edit/page.tsx`
- `app/admin/categories/create/page.tsx`
- `app/admin/categories/[id]/page.tsx` (جديد) 