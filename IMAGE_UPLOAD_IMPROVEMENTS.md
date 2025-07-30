# تحسينات نظام رفع صور المنتجات

## نظرة عامة

بناءً على التقرير المرفق `Frontend_Image_Upload_Guide.md`، تم تحديد الحاجة لتحسين نظام رفع الصور الحالي ليتوافق مع API المطور.

---

## 1. المشاكل الحالية

### 1.1 عدم استخدام API الفعلي
```typescript
// المشكلة الحالية
image: 'https://readdy.ai/api/search-image?query=...'

// المطلوب
image: 'https://smart-ai-api.onrender.com/api/v1/store/products/images/'
```

### 1.2 عدم رفع ملفات حقيقية
```typescript
// المشكلة الحالية
<input type="url" value={formData.main_image} />

// المطلوب
<input type="file" accept="image/*" onChange={handleFileUpload} />
```

### 1.3 عدم استخدام ImageService
- الكود لا يستخدم `ImageService` الموجود
- لا يوجد ربط مع API الفعلي

---

## 2. التحسينات المطلوبة

### 2.1 تحديث MediaTab.tsx

```typescript
// app/admin/products/create/components/MediaTab.tsx
'use client';

import { useState, useRef } from 'react';
import { ImageService } from '../../../../../lib/products/imageService';
import { validateImageFile } from '../../../../../lib/products/utils';

interface MediaTabProps {
  formData: any;
  setFormData: (data: any) => void;
  productType: string;
  productId?: string; // مطلوب للتعديل
}

export default function MediaTab({ formData, setFormData, productType, productId }: MediaTabProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // التحقق من صحة الملف
        const validationErrors = validateImageFile(file);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(', '));
        }
        
        // رفع الصورة
        const imageData = {
          product: productId || 'temp',
          image: file,
          image_type: i === 0 ? 'main' : 'gallery',
          alt_text: {
            ar: `صورة ${i + 1} للمنتج`,
            en: `Product image ${i + 1}`
          },
          sort_order: i + 1
        };
        
        const uploadedImage = await ImageService.uploadProductImage(imageData);
        uploadedImages.push(uploadedImage);
        
        // تحديث التقدم
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      
      // تحديث البيانات
      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages]
      }));
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطأ في رفع الصور');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = async (imageId: string) => {
    try {
      await ImageService.deleteProductImage(parseInt(imageId));
      setFormData((prev: any) => ({
        ...prev,
        images: prev.images?.filter((img: any) => img.id !== imageId) || []
      }));
    } catch (error) {
      setError('خطأ في حذف الصورة');
    }
  };

  const setMainImage = async (imageId: string) => {
    try {
      await ImageService.setMainImage(parseInt(imageId));
      setFormData((prev: any) => ({
        ...prev,
        images: prev.images?.map((img: any) => ({
          ...img,
          is_primary: img.id === imageId
        })) || []
      }));
    } catch (error) {
      setError('خطأ في تعيين الصورة الرئيسية');
    }
  };

  return (
    <div className="space-y-6">
      {/* منطقة رفع الصور */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-4">
          <i className="ri-image-line text-4xl text-gray-400"></i>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              اسحب الصور هنا أو انقر للاختيار
            </h3>
            <p className="text-sm text-gray-500">
              يمكنك رفع عدة صور مرة واحدة
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={uploading}
          >
            {uploading ? 'جاري الرفع...' : 'اختيار الصور'}
          </button>
        </div>
        
        {/* شريط التقدم */}
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(uploadProgress)}% مكتمل
            </p>
          </div>
        )}
        
        {/* رسائل الخطأ */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* معرض الصور */}
      {formData.images && formData.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formData.images.map((image: any) => (
            <div key={image.id} className="relative group">
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={image.image}
                  alt={image.alt_text?.ar || 'صورة المنتج'}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 rtl:space-x-reverse">
                    {!image.is_primary && (
                      <button
                        onClick={() => setMainImage(image.id)}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                        title="تعيين كصورة رئيسية"
                      >
                        <i className="ri-star-line"></i>
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                      title="حذف الصورة"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
                {image.is_primary && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      رئيسية
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {image.alt_text?.ar || 'بدون وصف'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {image.image_type}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* إرشادات الصور */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">إرشادات الصور</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• الحد الأقصى لحجم الملف: 5MB</li>
          <li>• الأنواع المدعومة: JPG, PNG, WebP</li>
          <li>• الأبعاد المفضلة: 800×600 بكسل</li>
          <li>• الصورة الأولى ستكون الصورة الرئيسية</li>
          <li>• يمكنك إعادة ترتيب الصور لاحقاً</li>
        </ul>
      </div>
    </div>
  );
}
```

### 2.2 تحديث صفحة إنشاء المنتج

```typescript
// app/admin/products/create/page.tsx
// إضافة productId مؤقت للصور
const [tempProductId, setTempProductId] = useState<string | null>(null);

// في handleSubmit
const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();
  setSaving(true);
  setError(null);

  try {
    // إنشاء المنتج أولاً
    const productData = convertFormDataToAPI(formData);
    const createdProduct = await ProductService.createProduct(productData);
    
    // رفع الصور إذا وجدت
    if (formData.images && formData.images.length > 0) {
      for (const image of formData.images) {
        if (image instanceof File) {
          await ImageService.uploadProductImage({
            product: createdProduct.id,
            image: image,
            image_type: 'gallery'
          });
        }
      }
    }
    
    router.push('/admin/products');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'خطأ في حفظ المنتج');
  } finally {
    setSaving(false);
  }
};
```

### 2.3 تحديث صفحة تعديل المنتج

```typescript
// app/admin/products/[id]/edit/page.tsx
// إضافة تحميل الصور
const [images, setImages] = useState<any[]>([]);

const loadProductImages = async () => {
  try {
    const productImages = await ImageService.getProductImages(parseInt(productId));
    setImages(productImages);
  } catch (error) {
    console.error('خطأ في تحميل الصور:', error);
  }
};

// في useEffect
useEffect(() => {
  loadProduct();
  loadCategories();
  loadProductTypes();
  loadProductImages(); // إضافة هذا
}, [productId]);
```

---

## 3. إضافة مكونات مساعدة

### 3.1 مكون معاينة الصور

```typescript
// app/admin/components/ImagePreview.tsx
'use client';

interface ImagePreviewProps {
  image: any;
  onDelete?: () => void;
  onSetMain?: () => void;
  isMain?: boolean;
}

export default function ImagePreview({ image, onDelete, onSetMain, isMain }: ImagePreviewProps) {
  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg border border-gray-200">
        <img
          src={image.image}
          alt={image.alt_text?.ar || 'صورة المنتج'}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 rtl:space-x-reverse">
            {!isMain && onSetMain && (
              <button
                onClick={onSetMain}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                title="تعيين كصورة رئيسية"
              >
                <i className="ri-star-line"></i>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                title="حذف الصورة"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            )}
          </div>
        </div>
        {isMain && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
              رئيسية
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3.2 مكون رفع الملفات

```typescript
// app/admin/components/FileUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { validateImageFile } from '../../../lib/products/utils';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export default function FileUpload({ 
  onUpload, 
  multiple = true, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024,
  disabled = false 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file, index) => {
      if (file.size > maxSize) {
        errors.push(`الملف ${index + 1}: حجم الملف كبير جداً`);
        return;
      }

      if (accept.includes('image/*') && !file.type.startsWith('image/')) {
        errors.push(`الملف ${index + 1}: نوع الملف غير مدعوم`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return [];
    }

    setError(null);
    return validFiles;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-4">
          <i className="ri-upload-cloud-line text-4xl text-gray-400"></i>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              اسحب الملفات هنا أو انقر للاختيار
            </h3>
            <p className="text-sm text-gray-500">
              الحد الأقصى: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 4. اختبار النظام

### 4.1 إنشاء صفحة اختبار

```typescript
// app/admin/test-image-upload/page.tsx
'use client';

import { useState } from 'react';
import { ImageService } from '../../../lib/products/imageService';

export default function TestImageUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    setError(null);

    try {
      const uploadedImages = [];
      
      for (const file of files) {
        const imageData = {
          product: '1', // معرف مؤقت للاختبار
          image: file,
          image_type: 'gallery',
          alt_text: {
            ar: `صورة اختبار`,
            en: `Test image`
          }
        };
        
        const uploadedImage = await ImageService.uploadProductImage(imageData);
        uploadedImages.push(uploadedImage);
      }
      
      setImages([...images, ...uploadedImages]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطأ في رفع الصور');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">اختبار رفع الصور</h1>
      
      <div className="space-y-6">
        <FileUpload onUpload={handleUpload} disabled={uploading} />
        
        {uploading && (
          <div className="text-center">
            <p>جاري رفع الصور...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {images.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">الصور المرفوعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <img
                    src={image.image}
                    alt={image.alt_text?.ar || 'صورة'}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {image.alt_text?.ar}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. خطة التنفيذ

### المرحلة الأولى (الأولوية العالية)
1. ✅ تحديث `MediaTab.tsx` لاستخدام رفع ملفات حقيقي
2. ✅ ربط النظام مع `ImageService`
3. ✅ إضافة معالجة الأخطاء والتحقق من صحة الملفات
4. ✅ إضافة مؤشرات التقدم

### المرحلة الثانية (الأولوية المتوسطة)
1. ✅ إضافة مكونات مساعدة (`ImagePreview`, `FileUpload`)
2. ✅ تحسين تجربة المستخدم (drag & drop)
3. ✅ إضافة إعادة ترتيب الصور
4. ✅ إضافة معاينة الصور

### المرحلة الثالثة (الأولوية المنخفضة)
1. ✅ إضافة ضغط الصور
2. ✅ إضافة تحرير الصور الأساسي
3. ✅ إضافة دعم للصور المتعددة
4. ✅ إضافة نظام النسخ الاحتياطي

---

## 6. ملاحظات مهمة

1. **الأمان**: تأكد من التحقق من صلاحيات المستخدم قبل رفع الصور
2. **الأداء**: استخدم ضغط الصور لتحسين سرعة التحميل
3. **التوافق**: تأكد من دعم جميع المتصفحات الحديثة
4. **التجربة**: وفر تغذية راجعة فورية للمستخدم

---

## الخلاصة

النظام الحالي يحتاج إلى تحديثات أساسية ليتوافق مع API المطور. التحسينات المقترحة ستوفر:

- ✅ رفع ملفات حقيقي بدلاً من روابط
- ✅ استخدام API الفعلي
- ✅ معالجة شاملة للأخطاء
- ✅ تجربة مستخدم محسنة
- ✅ دعم متعدد اللغات
- ✅ إدارة شاملة للصور

**النظام سيكون جاهزاً للاستخدام في الإنتاج بعد تطبيق هذه التحسينات.** 