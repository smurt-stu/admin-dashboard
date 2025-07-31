# حل مشكلة إضافة الصور في صفحة تعديل المنتج

## المشكلة
في صفحة تعديل المنتج، لم يكن هناك طريقة واضحة لإضافة مزيد من الصور للمنتج.

## الحل المطبق

### 1. تحسين تبويب الصور والملفات
- ✅ إضافة وظيفة إضافة صور جديدة
- ✅ تحسين واجهة المستخدم
- ✅ إضافة أزرار التحكم (حذف، تعيين كرئيسية)
- ✅ معاينة مباشرة للصور

### 2. الميزات الجديدة

#### أ. إضافة صورة جديدة
```tsx
// زر إضافة صورة
<button onClick={() => setIsAddingImage(!isAddingImage)}>
  <i className="ri-add-line"></i>
  {isAddingImage ? 'إلغاء' : 'إضافة صورة'}
</button>

// نموذج إضافة الصورة
{isAddingImage && (
  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
    <input type="url" placeholder="رابط الصورة" />
    <input type="text" placeholder="وصف الصورة (اختياري)" />
    <button onClick={addNewImage}>إضافة الصورة</button>
  </div>
)}
```

#### ب. معرض الصور المحسن
```tsx
// عرض الصور مع أزرار التحكم
{formData.images.map((image, index) => (
  <div key={index} className="relative group">
    <img src={image.image_url} alt={image.caption} />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50">
      <button onClick={() => setPrimaryImage(index)}>تعيين كرئيسية</button>
      <button onClick={() => removeImage(index)}>حذف</button>
    </div>
  </div>
))}
```

#### ج. تحسين التبويبات
```tsx
// تحسين مظهر التبويبات
<nav className="flex space-x-8 rtl:space-x-reverse px-6 overflow-x-auto">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      className={`py-4 px-1 border-b-2 font-medium text-sm ${
        activeTab === tab.id
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <i className={tab.icon}></i>
      <span>{tab.label}</span>
    </button>
  ))}
</nav>
```

### 3. كيفية الوصول إلى تبويب الصور

1. انتقل إلى صفحة تعديل المنتج
2. انقر على تبويب **"الصور والملفات"** (التبويب الخامس)
3. ستجد جميع الخيارات المتاحة لإدارة صور المنتج

### 4. الوظائف المتاحة

#### إضافة صورة جديدة:
1. انقر على "إضافة صورة"
2. أدخل رابط الصورة
3. (اختياري) أدخل وصف للصورة
4. انقر على "إضافة الصورة"

#### حذف صورة:
1. مرر المؤشر فوق الصورة
2. انقر على أيقونة الحذف

#### تعيين صورة رئيسية:
1. مرر المؤشر فوق الصورة
2. انقر على أيقونة النجمة

### 5. التحسينات المستقبلية

#### أ. رفع الملفات
```tsx
// إضافة دعم رفع الملفات
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  // رفع الملف إلى الخادم
};
```

#### ب. السحب والإفلات
```tsx
// دعم السحب والإفلات
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  files.forEach(handleFileUpload);
};
```

#### ج. معاينة محسنة
```tsx
// معاينة محسنة مع مؤشرات التحميل
const ImagePreview = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="relative">
      {!loaded && !error && <div className="loading-spinner" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};
```

## النتيجة

الآن يمكن للمستخدمين:
- ✅ إضافة صور جديدة للمنتج بسهولة
- ✅ حذف الصور غير المرغوب فيها
- ✅ تعيين صورة رئيسية
- ✅ معاينة الصور مباشرة
- ✅ إدارة الملفات الرقمية

## الملفات المعدلة

1. `app/admin/products/[id]/edit/components/MediaTab.tsx` - تحسين تبويب الصور
2. `app/admin/products/[id]/edit/components/EditProductTabs.tsx` - تحسين التبويبات
3. `app/admin/products/[id]/edit/README.md` - دليل المستخدم
4. `app/admin/products/[id]/edit/MEDIA_TAB_GUIDE.md` - دليل المطور

## ملاحظات مهمة

- تأكد من أن روابط الصور صحيحة وقابلة للوصول
- يمكن إضافة عدد غير محدود من الصور
- جميع التغييرات يتم حفظها عند النقر على "حفظ التغييرات"
- الصورة الرئيسية ستظهر في قائمة المنتجات 