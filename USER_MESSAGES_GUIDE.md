# دليل رسائل المستخدم - نظام إدارة المنتجات

## نظرة عامة

تم تطوير نظام رسائل متقدم ومتكامل لتوفير تجربة مستخدم ممتازة في جميع عمليات إدارة المنتجات. النظام يوفر رسائل واضحة ومفيدة للمستخدم في جميع الحالات.

## المكونات الرئيسية

### 1. نظام Toast Messages

#### المكونات:
- `ToastProvider`: مزود السياق الرئيسي
- `useToast`: Hook لاستخدام نظام الرسائل
- `ProductToast`: مجموعة رسائل مخصصة للمنتجات

#### الأنواع المتاحة:
- **نجاح (Success)**: رسائل خضراء للعمليات الناجحة
- **خطأ (Error)**: رسائل حمراء للأخطاء
- **تحذير (Warning)**: رسائل صفراء للتحذيرات
- **معلومات (Info)**: رسائل زرقاء للمعلومات

### 2. رسائل المنتجات المخصصة

#### رسائل النجاح:
```typescript
// إنشاء منتج جديد
showToast(ProductToast.productCreated("اسم المنتج"));

// تحديث منتج
showToast(ProductToast.productUpdated("اسم المنتج"));

// حذف منتج
showToast(ProductToast.productDeleted("اسم المنتج"));

// رفع صورة
showToast(ProductToast.imageUploaded("اسم الصورة"));
```

#### رسائل الخطأ:
```typescript
// فشل في إنشاء منتج
showToast(ProductToast.productCreationFailed("سبب الخطأ"));

// فشل في تحديث منتج
showToast(ProductToast.productUpdateFailed("سبب الخطأ"));

// فشل في حذف منتج
showToast(ProductToast.productDeleteFailed("سبب الخطأ"));

// فشل في رفع صورة
showToast(ProductToast.imageUploadFailed("سبب الخطأ"));

// أخطاء في التحقق من صحة البيانات
showToast(ProductToast.validationFailed(["خطأ 1", "خطأ 2"]));
```

#### رسائل التحذير:
```typescript
// تغييرات غير محفوظة
showToast(ProductToast.unsavedChanges());
```

#### رسائل المعلومات:
```typescript
// جاري التحميل
showToast(ProductToast.loadingData());

// جاري الحفظ
showToast(ProductToast.savingChanges());
```

## الاستخدام في الصفحات

### 1. صفحة إنشاء المنتج (`/admin/products/create`)

#### الرسائل المعروضة:
- **عند التحميل**: "جاري التحميل"
- **عند الحفظ**: "جاري الحفظ"
- **عند النجاح**: "تم إنشاء المنتج بنجاح"
- **عند الخطأ**: "فشل في إنشاء المنتج"
- **عند أخطاء التحقق**: "أخطاء في البيانات"

#### الكود المطلوب:
```typescript
import { useToast, ProductToast } from '../../../../components/ui/toast';

export default function CreateProductPage() {
  const { showToast } = useToast();
  
  const handleSubmit = async () => {
    try {
      showToast(ProductToast.savingChanges());
      // ... منطق الحفظ
      showToast(ProductToast.productCreated(productName));
    } catch (error) {
      showToast(ProductToast.productCreationFailed(error.message));
    }
  };
}
```

### 2. صفحة تعديل المنتج (`/admin/products/[id]/edit`)

#### الرسائل المعروضة:
- **عند التحميل**: "جاري التحميل"
- **عند الحفظ**: "جاري الحفظ"
- **عند النجاح**: "تم تحديث المنتج بنجاح"
- **عند الخطأ**: "فشل في تحديث المنتج"
- **عند أخطاء التحقق**: "أخطاء في البيانات"

### 3. صفحة قائمة المنتجات (`/admin/products`)

#### الرسائل المعروضة:
- **عند التحميل**: "جاري التحميل"
- **عند حذف منتج واحد**: "تم حذف المنتج بنجاح"
- **عند حذف عدة منتجات**: "تم حذف X منتج بنجاح"
- **عند فشل الحذف**: "فشل في حذف المنتج"

### 4. صفحة تفاصيل المنتج (`/admin/products/[id]`)

#### الرسائل المعروضة:
- **عند التحميل**: "جاري التحميل"
- **عند الحذف**: "تم حذف المنتج بنجاح"
- **عند فشل الحذف**: "فشل في حذف المنتج"

## ميزات النظام

### 1. التصميم المتجاوب
- رسائل تظهر في الزاوية العلوية اليمنى
- تصميم متجاوب مع جميع أحجام الشاشات
- دعم اللغة العربية والاتجاه RTL

### 2. الرسائل التفاعلية
- إمكانية إغلاق الرسائل يدوياً
- إغلاق تلقائي بعد فترة زمنية محددة
- إمكانية إضافة أزرار إجراءات

### 3. الأيقونات والألوان
- **نجاح**: أيقونة ✓ خضراء
- **خطأ**: أيقونة ⚠ حمراء
- **تحذير**: أيقونة ⚠ صفراء
- **معلومات**: أيقونة ℹ زرقاء

### 4. التوقيت
- رسائل النجاح: 5 ثوانٍ
- رسائل الخطأ: 7 ثوانٍ
- رسائل التحذير: 6 ثوانٍ
- رسائل المعلومات: 3-4 ثوانٍ

## إضافة رسائل جديدة

### 1. إضافة رسالة جديدة في ProductToast:
```typescript
// في components/ui/toast.tsx
export const ProductToast = {
  // ... الرسائل الموجودة
  
  // رسالة جديدة
  newMessage: (param: string) => ({
    type: 'success' as ToastType,
    title: 'عنوان الرسالة',
    message: `نص الرسالة مع ${param}`,
    duration: 5000
  })
};
```

### 2. استخدام الرسالة الجديدة:
```typescript
showToast(ProductToast.newMessage("المعامل"));
```

## التحذير من التغييرات غير المحفوظة

### المكون: `UnsavedChangesWarning`

#### الاستخدام:
```typescript
import UnsavedChangesWarning from '../../../components/ui/unsaved-changes-warning';

// في المكون
<UnsavedChangesWarning
  hasUnsavedChanges={hasChanges}
  onSave={handleSave}
  saveButtonText="حفظ التغييرات"
  warningMessage="لديك تغييرات غير محفوظة"
/>
```

#### الميزات:
- تحذير عند محاولة مغادرة الصفحة
- إمكانية حفظ التغييرات أو تجاهلها
- رسائل toast تلقائية عند وجود تغييرات

## أفضل الممارسات

### 1. توقيت الرسائل
- استخدم رسائل "جاري التحميل" عند بدء العمليات الطويلة
- استخدم رسائل "جاري الحفظ" عند حفظ البيانات
- اترك وقتاً كافياً لقراءة رسائل النجاح قبل الانتقال

### 2. محتوى الرسائل
- استخدم أسماء المنتجات في الرسائل
- اذكر سبب الخطأ بوضوح
- استخدم لغة بسيطة ومفهومة

### 3. تجربة المستخدم
- لا تظهر رسائل متعددة في نفس الوقت
- تأكد من أن الرسائل لا تحجب المحتوى المهم
- استخدم ألوان وأيقونات مناسبة

## استكشاف الأخطاء

### 1. الرسائل لا تظهر
- تأكد من إضافة `ToastProvider` في Layout
- تأكد من استيراد `useToast` بشكل صحيح
- تحقق من أن المكون يستخدم 'use client'

### 2. الرسائل تظهر في المكان الخطأ
- تحقق من CSS classes
- تأكد من z-index مناسب
- تحقق من اتجاه الصفحة (RTL/LTR)

### 3. الرسائل لا تختفي
- تحقق من duration parameter
- تأكد من عدم وجود memory leaks
- تحقق من event listeners

## التخصيص

### 1. تغيير الألوان
```css
/* في globals.css */
.toast-success {
  @apply bg-green-50 border-green-200 text-green-800;
}

.toast-error {
  @apply bg-red-50 border-red-200 text-red-800;
}
```

### 2. تغيير الموقع
```typescript
// في components/ui/toast.tsx
<div className="fixed top-4 right-4 z-50 space-y-2">
  {/* تغيير الموقع هنا */}
</div>
```

### 3. إضافة رسائل جديدة
```typescript
// إضافة أنواع جديدة
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';

// إضافة رسائل مخصصة
export const CustomToast = {
  customMessage: () => ({
    type: 'custom' as ToastType,
    title: 'رسالة مخصصة',
    message: 'محتوى الرسالة',
    duration: 5000
  })
};
```

## الخلاصة

نظام الرسائل الجديد يوفر:
- ✅ رسائل واضحة ومفيدة
- ✅ تصميم متجاوب وجميل
- ✅ دعم كامل للغة العربية
- ✅ سهولة الاستخدام والتخصيص
- ✅ تجربة مستخدم ممتازة
- ✅ تحذيرات من التغييرات غير المحفوظة

هذا النظام يضمن أن المستخدمين يحصلون على تغذية راجعة فورية ومناسبة لجميع إجراءاتهم في نظام إدارة المنتجات. 