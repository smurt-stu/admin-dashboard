# دليل تكامل الواجهة الأمامية - تغييرات API

## ملخص التغييرات

تم إصلاح مشكلة في API حيث كانت الحقول متعددة اللغات تُرجع نصوص JSON بدلاً من النصوص المترجمة. الآن جميع الحقول تُرجع النصوص المترجمة مباشرة.

## التغييرات الرئيسية

### قبل التعديل
```json
{
    "title": {
        "ar": "فستان سهرة رمادي",
        "en": "shara fostan"
    },
    "category_name": "{'ar': 'الاسم الفئة بالعربية', 'en': 'Name in CATEGORY English'}"
}
```

### بعد التعديل
```json
{
    "title": "فستان سهرة رمادي",
    "category_name": "الاسم الفئة بالعربية"
}
```

## الحقول المتأثرة

### 1. حقل `title` في المنتجات
- **قبل**: كائن JSON يحتوي على ترجمات متعددة
- **بعد**: نص مباشر باللغة المحددة (العربية افتراضياً)

### 2. حقل `category_name` في المنتجات
- **قبل**: نص JSON يحتوي على ترجمات متعددة
- **بعد**: نص مباشر باللغة المحددة

### 3. حقل `name` في الفئات
- **قبل**: كائن JSON يحتوي على ترجمات متعددة
- **بعد**: نص مباشر باللغة المحددة

### 4. حقل `parent_name` في الفئات
- **قبل**: نص JSON يحتوي على ترجمات متعددة
- **بعد**: نص مباشر باللغة المحددة

## نقاط النهاية المتأثرة

### 1. قائمة المنتجات
```
GET /api/v1/store/products/products/
```

**الحقول المتأثرة:**
- `title`
- `category_name`

### 2. تفاصيل المنتج
```
GET /api/v1/store/products/products/{id}/
```

**الحقول المتأثرة:**
- `title`
- `category_name`

### 3. قائمة الفئات
```
GET /api/v1/store/products/categories/
```

**الحقول المتأثرة:**
- `name`
- `parent_name`

### 4. تفاصيل الفئة
```
GET /api/v1/store/products/categories/{id}/
```

**الحقول المتأثرة:**
- `name`
- `parent_name`

### 5. شجرة الفئات
```
GET /api/v1/store/products/categories/tree/
```

**الحقول المتأثرة:**
- `name`
- `parent_name`

## التعديلات المطلوبة في الكود

### 1. إزالة معالجة JSON

**قبل التعديل:**
```javascript
// معالجة عنوان المنتج
const productTitle = typeof product.title === 'string' 
    ? JSON.parse(product.title).ar 
    : product.title.ar;

// معالجة اسم الفئة
const categoryName = typeof product.category_name === 'string'
    ? JSON.parse(product.category_name).ar
    : product.category_name.ar;
```

**بعد التعديل:**
```javascript
// استخدام النص مباشرة
const productTitle = product.title;
const categoryName = product.category_name;
```

### 2. تبسيط عرض البيانات

**قبل التعديل:**
```javascript
// عرض عنوان المنتج
const displayTitle = (product) => {
    if (typeof product.title === 'object') {
        return product.title.ar || product.title.en || 'بدون عنوان';
    }
    try {
        const parsed = JSON.parse(product.title);
        return parsed.ar || parsed.en || 'بدون عنوان';
    } catch {
        return product.title || 'بدون عنوان';
    }
};
```

**بعد التعديل:**
```javascript
// عرض عنوان المنتج
const displayTitle = (product) => {
    return product.title || 'بدون عنوان';
};
```

### 3. تبسيط عرض اسم الفئة

**قبل التعديل:**
```javascript
// عرض اسم الفئة
const displayCategoryName = (product) => {
    if (typeof product.category_name === 'object') {
        return product.category_name.ar || product.category_name.en || 'فئة عامة';
    }
    try {
        const parsed = JSON.parse(product.category_name);
        return parsed.ar || parsed.en || 'فئة عامة';
    } catch {
        return product.category_name || 'فئة عامة';
    }
};
```

**بعد التعديل:**
```javascript
// عرض اسم الفئة
const displayCategoryName = (product) => {
    return product.category_name || 'فئة عامة';
};
```

## أمثلة على التكامل

### مثال 1: عرض قائمة المنتجات

```javascript
// قبل التعديل
const ProductList = ({ products }) => {
    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{displayTitle(product)}</h3>
                    <p>الفئة: {displayCategoryName(product)}</p>
                </div>
            ))}
        </div>
    );
};

// بعد التعديل
const ProductList = ({ products }) => {
    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.title}</h3>
                    <p>الفئة: {product.category_name}</p>
                </div>
            ))}
        </div>
    );
};
```

### مثال 2: عرض شجرة الفئات

```javascript
// قبل التعديل
const CategoryTree = ({ categories }) => {
    const displayName = (category) => {
        if (typeof category.name === 'object') {
            return category.name.ar || category.name.en || 'فئة';
        }
        try {
            const parsed = JSON.parse(category.name);
            return parsed.ar || parsed.en || 'فئة';
        } catch {
            return category.name || 'فئة';
        }
    };

    return (
        <ul>
            {categories.map(category => (
                <li key={category.id}>
                    {displayName(category)}
                    {category.children && <CategoryTree categories={category.children} />}
                </li>
            ))}
        </ul>
    );
};

// بعد التعديل
const CategoryTree = ({ categories }) => {
    return (
        <ul>
            {categories.map(category => (
                <li key={category.id}>
                    {category.name}
                    {category.children && <CategoryTree categories={category.children} />}
                </li>
            ))}
        </ul>
    );
};
```

## اختبار التغييرات

### 1. اختبار API مباشرة
```bash
curl -X GET "https://smart-ai-api.onrender.com/api/v1/store/products/products/?page=1&page_size=20&ordering=-created_at"
```

### 2. اختبار في المتصفح
```javascript
// اختبار استدعاء API
fetch('/api/v1/store/products/products/')
    .then(response => response.json())
    .then(data => {
        console.log('المنتجات:', data.results);
        data.results.forEach(product => {
            console.log('العنوان:', product.title);
            console.log('اسم الفئة:', product.category_name);
        });
    });
```

## ملاحظات مهمة

### 1. اللغة الافتراضية
- اللغة الافتراضية هي العربية (`ar`)
- إذا لم يتم تحديد لغة في الطلب، سيتم استخدام العربية

### 2. التوافق مع الإصدارات السابقة
- التغييرات متوافقة مع الإصدارات السابقة
- لا توجد تغييرات في بنية البيانات الأساسية
- فقط تم تبسيط طريقة عرض النصوص

### 3. معالجة الأخطاء
```javascript
// معالجة الحالات الفارغة
const safeDisplay = (text, fallback = 'بدون عنوان') => {
    return text || fallback;
};

// استخدام آمن
const productTitle = safeDisplay(product.title, 'بدون عنوان');
const categoryName = safeDisplay(product.category_name, 'فئة عامة');
```

## قائمة مراجعة للمطور

- [ ] إزالة جميع معالجات JSON للحقول المتأثرة
- [ ] تبسيط عرض `title` في المنتجات
- [ ] تبسيط عرض `category_name` في المنتجات
- [ ] تبسيط عرض `name` في الفئات
- [ ] تبسيط عرض `parent_name` في الفئات
- [ ] اختبار جميع الصفحات التي تعرض المنتجات
- [ ] اختبار جميع الصفحات التي تعرض الفئات
- [ ] اختبار شجرة الفئات
- [ ] اختبار البحث والتصفية
- [ ] اختبار التطبيق على الأجهزة المحمولة

## الدعم

إذا واجهت أي مشاكل في التكامل، يرجى التواصل مع فريق التطوير الخلفي للحصول على الدعم. 