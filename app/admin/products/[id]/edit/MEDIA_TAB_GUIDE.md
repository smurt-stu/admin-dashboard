# دليل تبويب الصور والملفات

## نظرة عامة

تبويب الصور والملفات (`MediaTab`) هو مكون React مسؤول عن إدارة جميع الوسائط المرتبطة بالمنتج، بما في ذلك الصور والملفات الرقمية.

## المكونات الرئيسية

### 1. الصورة الرئيسية
```tsx
// حقل إدخال رابط الصورة الرئيسية
<input
  type="url"
  value={formData.main_image}
  onChange={(e) => handleInputChange('main_image', e.target.value)}
  placeholder="https://example.com/image.jpg"
/>
```

### 2. إضافة صورة جديدة
```tsx
// نموذج إضافة صورة جديدة
const addNewImage = () => {
  if (newImageUrl.trim()) {
    const newImage = {
      image_url: newImageUrl.trim(),
      caption: newImageCaption.trim() || 'صورة المنتج',
      is_primary: false
    };
    
    const updatedImages = [...(formData.images || []), newImage];
    handleInputChange('images', updatedImages);
  }
};
```

### 3. معرض الصور
```tsx
// عرض الصور في شبكة
{formData.images.map((image: any, index: number) => (
  <div key={index} className="relative group">
    <img src={image.image_url} alt={image.caption} />
    {/* أزرار التحكم */}
  </div>
))}
```

## الوظائف الرئيسية

### إضافة صورة جديدة
- التحقق من صحة الرابط
- إضافة وصف اختياري
- تعيين الصورة كغير رئيسية افتراضياً

### حذف صورة
- إزالة الصورة من المصفوفة
- تحديث حالة المكون

### تعيين صورة رئيسية
- إلغاء تعيين الصورة الرئيسية السابقة
- تعيين الصورة الجديدة كرئيسية

### معاينة الصور
- عرض الصور في شبكة متجاوبة
- معالجة أخطاء تحميل الصور
- مؤشرات بصرية للصورة الرئيسية

## تحسينات مقترحة

### 1. رفع الملفات
```tsx
// إضافة وظيفة رفع الملفات
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const { imageUrl } = await response.json();
    addNewImage(imageUrl);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 2. السحب والإفلات
```tsx
// إضافة دعم السحب والإفلات
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  files.forEach(handleFileUpload);
};
```

### 3. معاينة محسنة
```tsx
// معاينة محسنة للصور
const ImagePreview = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="relative">
      {!loaded && !error && <div className="loading-spinner" />}
      {error && <div className="error-placeholder" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
```

### 4. تحسين الأداء
```tsx
// استخدام React.memo لتحسين الأداء
const MediaTab = React.memo(({ formData, handleInputChange }: MediaTabProps) => {
  // مكون محسن
});

// استخدام useCallback للدوال
const addNewImage = useCallback(() => {
  // منطق إضافة الصورة
}, [newImageUrl, newImageCaption, formData.images]);
```

## معالجة الأخطاء

### 1. روابط غير صحيحة
```tsx
const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### 2. صور غير قابلة للتحميل
```tsx
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = 'none';
  // إظهار رسالة خطأ للمستخدم
};
```

### 3. حجم الملفات
```tsx
const validateFileSize = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
};
```

## التكامل مع API

### 1. حفظ الصور
```tsx
const saveProductImages = async (productId: string, images: any[]) => {
  try {
    const response = await fetch(`/api/products/${productId}/images`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save images');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving images:', error);
    throw error;
  }
};
```

### 2. حذف الصور
```tsx
const deleteProductImage = async (productId: string, imageId: string) => {
  try {
    const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
```

## اختبار المكون

### 1. اختبار إضافة صورة
```tsx
test('should add new image to gallery', () => {
  const { getByText, getByPlaceholderText } = render(<MediaTab />);
  
  fireEvent.click(getByText('إضافة صورة'));
  fireEvent.change(getByPlaceholderText('https://example.com/image.jpg'), {
    target: { value: 'https://example.com/test.jpg' }
  });
  fireEvent.click(getByText('إضافة الصورة'));
  
  expect(screen.getByAltText('صورة المنتج')).toBeInTheDocument();
});
```

### 2. اختبار حذف صورة
```tsx
test('should remove image from gallery', () => {
  const { getByTitle } = render(<MediaTab />);
  
  const deleteButton = getByTitle('حذف الصورة');
  fireEvent.click(deleteButton);
  
  expect(screen.queryByAltText('صورة المنتج')).not.toBeInTheDocument();
});
```

## ملاحظات مهمة

1. **الأمان**: تأكد من التحقق من صحة روابط الصور
2. **الأداء**: استخدم lazy loading للصور الكبيرة
3. **التجربة**: وفر رسائل واضحة للمستخدم عند حدوث أخطاء
4. **التوافق**: تأكد من عمل المكون على جميع المتصفحات
5. **الوصول**: تأكد من إضافة alt text مناسب لجميع الصور 