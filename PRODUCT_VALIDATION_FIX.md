# إصلاح مشكلة التحقق من وجود المنتج

## المشكلة الجديدة

بعد إصلاح مشكلة `product_id`، ظهرت مشكلة جديدة:

```
IntegrityError: null value in column "product_id" of relation "store_products_productimage" violates not-null constraint
```

**السبب:** Backend لا يتعرف على UUID كمعرف منتج صحيح، مما يعني أن المنتج غير موجود في قاعدة البيانات.

## التحليل

من الصورة المرفقة، يمكن رؤية أن:

1. ✅ **Frontend يرسل البيانات بشكل صحيح:**
   - `product`: `c11146fe-aba0-4950-91e9-5bb2dbe31639`
   - `image`: `(binary)`
   - `image_type`: `main`
   - `alt_text`: `{"ar":"1 صورة اختبار","en":"Test image 1"}`

2. ❌ **Backend لا يتعرف على المنتج:**
   - UUID لا يتوافق مع معرف منتج موجود في قاعدة البيانات
   - Backend يضع `product_id` كـ `null`

## الحل المطبق

### 1. إضافة وظيفة التحقق من وجود المنتج

```typescript
// lib/products/imageService.ts
static async validateProductExists(productId: string | number): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/store/products/${productId}/`, {
      headers: getAuthHeaders()
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

### 2. تحديث وظيفة رفع الصور للتحقق من المنتج

```typescript
static async uploadProductImage(imageData: ImageUploadData): Promise<ProductImage> {
  // التحقق من صحة الملف
  const validationErrors = validateImageFile(imageData.image);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(', '));
  }

  // التحقق من معرف المنتج
  if (!imageData.product) {
    throw new Error('معرف المنتج مطلوب');
  }

  // التحقق من وجود المنتج
  const productExists = await this.validateProductExists(imageData.product);
  if (!productExists) {
    throw new Error(`المنتج غير موجود: ${imageData.product}`);
  }

  // ... باقي الكود
}
```

### 3. إضافة زر التحقق في واجهة الاختبار

```typescript
// app/admin/test-image-upload/page.tsx
const validateProduct = async () => {
  // التحقق من صحة UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(productId)) {
    setError('معرف المنتج يجب أن يكون UUID صحيح');
    return;
  }
  
  try {
    const exists = await ImageService.validateProductExists(productId);
    if (exists) {
      setSuccess('المنتج موجود ويمكن رفع الصور له');
    } else {
      setError('المنتج غير موجود في قاعدة البيانات');
    }
  } catch (error) {
    setError('خطأ في التحقق من المنتج');
  }
};
```

### 4. تحديث الواجهة

```typescript
<div className="flex space-x-2 rtl:space-x-reverse mt-2">
  <button
    type="button"
    onClick={validateProduct}
    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
  >
    التحقق من المنتج
  </button>
  <button
    type="button"
    onClick={loadProductImages}
    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
  >
    تحميل صور المنتج
  </button>
</div>
```

## خطوات الاختبار

### 1. التحقق من وجود المنتج
1. اذهب إلى `/admin/test-image-upload`
2. أدخل UUID المنتج: `c11146fe-aba0-4950-91e9-5bb2dbe31639`
3. اضغط على "التحقق من المنتج"
4. إذا ظهرت رسالة "المنتج غير موجود"، فهذا يعني أن UUID غير صحيح

### 2. العثور على UUID صحيح
1. اذهب إلى صفحة المنتجات في النظام
2. انسخ UUID منتج موجود
3. استخدم هذا UUID في صفحة الاختبار

### 3. اختبار رفع الصور
1. بعد التأكد من وجود المنتج
2. ارفع الصور وستعمل بدون أخطاء

## الحلول البديلة

### 1. إنشاء منتج جديد للاختبار
```typescript
// يمكن إضافة وظيفة لإنشاء منتج اختبار
static async createTestProduct(): Promise<string> {
  const testProduct = {
    title: {
      ar: 'منتج اختبار',
      en: 'Test Product'
    },
    price: '100',
    category: 'test-category-id',
    product_type: 'physical'
  };
  
  const response = await fetch(`${BASE_URL}/store/products/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(testProduct)
  });
  
  const result = await response.json();
  return result.id; // سيعيد UUID المنتج الجديد
}
```

### 2. استخدام معرف منتج موجود
- ابحث عن منتج موجود في النظام
- استخدم UUID الخاص به للاختبار

### 3. تعديل Backend (إذا كان ممكناً)
- التأكد من أن Backend يدعم UUID
- التحقق من أن API يتعرف على UUID كمعرفات صحيحة

## النتيجة

بعد تطبيق هذه الإصلاحات:

✅ **تم إضافة التحقق من وجود المنتج**
✅ **تم إضافة رسائل خطأ واضحة**
✅ **تم إضافة واجهة للتحقق من المنتج**
✅ **تم منع رفع الصور لمنتج غير موجود**

**الخطوة التالية:** العثور على UUID منتج موجود في النظام واستخدامه للاختبار. 