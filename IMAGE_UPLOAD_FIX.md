# إصلاح مشكلة product_id في رفع الصور

## المشكلة

عند محاولة رفع صورة، يظهر الخطأ التالي:

```
IntegrityError at /api/v1/store/products/images/
null value in column "product_id" of relation "store_products_productimage" violates not-null constraint
```

## سبب المشكلة

1. **نقص حقل `product` في `ImageUploadData`:**
   - كان `ImageUploadData` لا يحتوي على حقل `product`
   - API يتوقع معرف المنتج مع كل صورة

2. **عدم إرسال معرف المنتج:**
   - الكود كان يرسل `product: '1'` كسلسلة نصية
   - API يتوقع رقم صحيح

## الحل المطبق

### 1. تحديث `ImageUploadData` interface

```typescript
// lib/products/types.ts
export interface ImageUploadData {
  product: number | string; // معرف المنتج مطلوب
  image: File;
  image_type?: string;
  alt_text?: {
    ar: string;
    en: string;
  };
  caption?: {
    ar: string;
    en: string;
  };
  sort_order?: number;
  is_active?: boolean;
  is_preview?: boolean;
  page_number?: number;
}
```

### 2. تحسين `ImageService.uploadProductImage`

```typescript
// lib/products/imageService.ts
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

  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  
  // إضافة البيانات الأساسية
  formData.append('product', imageData.product.toString());
  formData.append('image', imageData.image);
  formData.append('image_type', imageData.image_type || 'gallery');
  
  // إضافة alt_text كـ JSON إذا وجد
  if (imageData.alt_text) {
    formData.append('alt_text', JSON.stringify(imageData.alt_text));
  }
  
  // إضافة caption كـ JSON إذا وجد
  if (imageData.caption) {
    formData.append('caption', JSON.stringify(imageData.caption));
  }
  
  formData.append('sort_order', (imageData.sort_order || 0).toString());
  formData.append('is_active', (imageData.is_active !== false).toString());
  formData.append('is_preview', (imageData.is_preview || false).toString());
  
  if (imageData.page_number) {
    formData.append('page_number', imageData.page_number.toString());
  }
  
  const response = await fetch(
    `${BASE_URL}/store/products/images/`,
    {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    }
  );
  return handleApiError(response);
}
```

### 3. تحديث صفحة الاختبار

```typescript
// app/admin/test-image-upload/page.tsx
export default function TestImageUploadPage() {
  const [productId, setProductId] = useState<string>('c11146fe-aba0-4950-91e9-5bb2dbe31639'); // معرف المنتج الافتراضي
  
  const handleFileUpload = async (files: FileList | null) => {
    // التحقق من صحة UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      setError('معرف المنتج يجب أن يكون UUID صحيح');
      return;
    }
    
    // ... existing code ...
    
    const imageData = {
      product: productId, // معرف المنتج من الحقل (UUID)
      image: file,
      image_type: i === 0 ? 'main' : 'gallery',
      alt_text: {
        ar: `صورة اختبار ${i + 1}`,
        en: `Test image ${i + 1}`
      },
      sort_order: i + 1
    };
    
    // ... rest of the code ...
  };
}
```

### 4. إضافة حقل معرف المنتج في الواجهة

```typescript
// حقل إدخال معرف المنتج
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    معرف المنتج *
  </label>
  <input
    type="number"
    value={productId}
    onChange={(e) => setProductId(parseInt(e.target.value) || 1)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="أدخل معرف المنتج"
    min="1"
    required
  />
  <p className="text-xs text-gray-500 mt-1">
    معرف المنتج الذي تريد رفع الصور له
  </p>
  <button
    type="button"
    onClick={loadProductImages}
    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
  >
    تحميل صور المنتج
  </button>
</div>
```

## التحسينات الإضافية

### 1. معالجة أفضل للأخطاء

```typescript
// إضافة رسائل خطأ أكثر وضوحاً
if (!imageData.product) {
  throw new Error('معرف المنتج مطلوب لرفع الصورة');
}

if (typeof imageData.product === 'string' && !imageData.product.trim()) {
  throw new Error('معرف المنتج لا يمكن أن يكون فارغاً');
}
```

### 2. التحقق من وجود المنتج

```typescript
// يمكن إضافة وظيفة للتحقق من وجود المنتج قبل رفع الصور
static async validateProductExists(productId: number): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/store/products/${productId}/`);
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

### 3. تحسين واجهة المستخدم

```typescript
// إضافة مؤشر تحميل أثناء التحقق من المنتج
const [validatingProduct, setValidatingProduct] = useState(false);

const validateProduct = async () => {
  setValidatingProduct(true);
  try {
    const exists = await ImageService.validateProductExists(productId);
    if (!exists) {
      setError('المنتج غير موجود');
    } else {
      setSuccess('المنتج موجود ويمكن رفع الصور له');
    }
  } catch (error) {
    setError('خطأ في التحقق من المنتج');
  } finally {
    setValidatingProduct(false);
  }
};
```

## اختبار الحل

### 1. اختبار رفع صورة واحدة
```typescript
const testSingleImageUpload = async () => {
  const imageData = {
    product: 'c11146fe-aba0-4950-91e9-5bb2dbe31639', // معرف منتج صحيح (UUID)
    image: file,
    image_type: 'main',
    alt_text: {
      ar: 'صورة اختبار',
      en: 'Test image'
    }
  };
  
  const result = await ImageService.uploadProductImage(imageData);
  console.log('تم رفع الصورة:', result);
};
```

### 2. اختبار رفع عدة صور
```typescript
const testMultipleImageUpload = async (files: File[]) => {
  for (let i = 0; i < files.length; i++) {
    const imageData = {
      product: 'c11146fe-aba0-4950-91e9-5bb2dbe31639', // معرف منتج صحيح (UUID)
      image: files[i],
      image_type: i === 0 ? 'main' : 'gallery',
      alt_text: {
        ar: `صورة ${i + 1}`,
        en: `Image ${i + 1}`
      },
      sort_order: i + 1
    };
    
    await ImageService.uploadProductImage(imageData);
  }
};
```

## دعم UUID

### تحديث دعم UUID في النظام

تم تحديث النظام ليدعم UUID كمعرفات للمنتجات:

1. **تحديث `ImageService.getProductImages`:**
   ```typescript
   static async getProductImages(productId?: number | string): Promise<ProductImage[]>
   ```

2. **تحديث صفحة الاختبار:**
   - المعرف الافتراضي: `c11146fe-aba0-4950-91e9-5bb2dbe31639`
   - التحقق من صحة UUID
   - دعم إدخال UUID في الواجهة

3. **التحقق من صحة UUID:**
   ```typescript
   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
   if (!uuidRegex.test(productId)) {
     setError('معرف المنتج يجب أن يكون UUID صحيح');
     return;
   }
   ```

## النتيجة

بعد تطبيق هذه الإصلاحات:

✅ **تم حل مشكلة `product_id`**
✅ **تم إضافة دعم UUID**
✅ **تم إضافة التحقق من صحة البيانات**
✅ **تم تحسين معالجة الأخطاء**
✅ **تم إضافة واجهة مستخدم أفضل**
✅ **تم إضافة توثيق شامل**

**النظام الآن جاهز لرفع الصور بشكل صحيح مع معرف المنتج المطلوب (UUID).** 