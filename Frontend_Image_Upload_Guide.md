# دليل رفع الصور للمنتجات - Frontend Developer Guide

## نظرة عامة

هذا الدليل يشرح كيفية رفع الصور للمنتجات في نظام SmantStu باستخدام API المطور. النظام يدعم Cloudflare R2 Storage للصور ويوفر واجهة برمجة احترافية لرفع وإدارة الصور.

---

## 1. إعدادات API الأساسية

### Base URL
```
https://smart-ai-api.onrender.com/api/v1/store/products/
```

### Authentication
جميع عمليات رفع الصور تتطلب مصادقة مدير (Admin):
```javascript
const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data'
};
```

---

## 2. أنواع الصور المدعومة

### Image Types
```javascript
const IMAGE_TYPES = {
    MAIN: 'main',           // الصورة الرئيسية للمنتج
    GALLERY: 'gallery',     // صور المعرض
    THUMBNAIL: 'thumbnail', // الصورة المصغرة
    VARIANT: 'variant'      // صورة متغير المنتج
};
```

### الصورة الرئيسية (Main Image)
- صورة واحدة فقط لكل منتج
- تظهر في قوائم المنتجات
- تلقائياً تظهر كصورة افتراضية

### صور المعرض (Gallery Images)
- صور إضافية للمنتج
- تستخدم في صفحة تفاصيل المنتج
- يمكن رفع عدد غير محدود

---

## 3. رفع صورة جديدة

### Endpoint
```
POST /api/v1/store/products/images/
```

### Request Format
```javascript
const uploadImage = async (productId, imageFile, options = {}) => {
    const formData = new FormData();
    
    // الحقول المطلوبة
    formData.append('product', productId);
    formData.append('image', imageFile);
    
    // الحقول الاختيارية
    if (options.imageType) {
        formData.append('image_type', options.imageType);
    }
    if (options.altText) {
        formData.append('alt_text', JSON.stringify({
            ar: options.altText.ar || '',
            en: options.altText.en || ''
        }));
    }
    if (options.caption) {
        formData.append('caption', JSON.stringify({
            ar: options.caption.ar || '',
            en: options.caption.en || ''
        }));
    }
    if (options.displayOrder !== undefined) {
        formData.append('display_order', options.displayOrder);
    }
    if (options.isPrimary) {
        formData.append('is_primary', options.isPrimary);
    }
    
    const response = await fetch(`${API_BASE_URL}images/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    });
    
    return response.json();
};
```

### مثال عملي
```javascript
// رفع صورة معرض
const uploadGalleryImage = async () => {
    const fileInput = document.getElementById('image-input');
    const productId = document.getElementById('product-id').value;
    
    const imageFile = fileInput.files[0];
    if (!imageFile) {
        alert('يرجى اختيار ملف صورة');
        return;
    }
    
    try {
        const result = await uploadImage(productId, imageFile, {
            imageType: 'gallery',
            altText: {
                ar: 'صورة المنتج',
                en: 'Product Image'
            },
            caption: {
                ar: 'صورة تفصيلية للمنتج',
                en: 'Detailed product image'
            },
            displayOrder: 1
        });
        
        console.log('تم رفع الصورة بنجاح:', result);
        alert('تم رفع الصورة بنجاح!');
        
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        alert('حدث خطأ في رفع الصورة');
    }
};
```

---

## 4. رفع صورة رئيسية

### تعيين صورة كرئيسية
```javascript
const setMainImage = async (imageId) => {
    try {
        const response = await fetch(`${API_BASE_URL}images/${imageId}/set-main/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('تم تعيين الصورة كرئيسية بنجاح');
            return result;
        } else {
            throw new Error(result.message || 'خطأ في تعيين الصورة الرئيسية');
        }
        
    } catch (error) {
        console.error('خطأ:', error);
        throw error;
    }
};
```

### رفع صورة رئيسية مباشرة
```javascript
const uploadMainImage = async (productId, imageFile) => {
    try {
        const result = await uploadImage(productId, imageFile, {
            imageType: 'main',
            isPrimary: true,
            altText: {
                ar: 'الصورة الرئيسية للمنتج',
                en: 'Main product image'
            }
        });
        
        console.log('تم رفع الصورة الرئيسية بنجاح');
        return result;
        
    } catch (error) {
        console.error('خطأ في رفع الصورة الرئيسية:', error);
        throw error;
    }
};
```

---

## 5. إعادة ترتيب الصور

### Endpoint
```
POST /api/v1/store/products/images/reorder/
```

### Implementation
```javascript
const reorderImages = async (imageOrders) => {
    try {
        const response = await fetch(`${API_BASE_URL}images/reorder/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orders: imageOrders
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('تم إعادة ترتيب الصور بنجاح');
            return result;
        } else {
            throw new Error(result.message || 'خطأ في إعادة ترتيب الصور');
        }
        
    } catch (error) {
        console.error('خطأ:', error);
        throw error;
    }
};

// مثال على الاستخدام
const reorderExample = async () => {
    const orders = [
        { id: 1, order: 1 },
        { id: 2, order: 2 },
        { id: 3, order: 3 }
    ];
    
    await reorderImages(orders);
};
```

---

## 6. جلب صور المنتج

### جلب جميع صور المنتج
```javascript
const getProductImages = async (productId) => {
    try {
        const response = await fetch(`${API_BASE_URL}images/?product=${productId}`);
        const data = await response.json();
        
        if (response.ok) {
            return data.results || [];
        } else {
            throw new Error(data.message || 'خطأ في جلب الصور');
        }
        
    } catch (error) {
        console.error('خطأ:', error);
        throw error;
    }
};
```

### جلب صورة محددة
```javascript
const getImageDetails = async (imageId) => {
    try {
        const response = await fetch(`${API_BASE_URL}images/${imageId}/`);
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'خطأ في جلب تفاصيل الصورة');
        }
        
    } catch (error) {
        console.error('خطأ:', error);
        throw error;
    }
};
```

---

## 7. تحديث معلومات الصورة

### Endpoint
```
PUT /api/v1/store/products/images/{id}/
```

### Implementation
```javascript
const updateImage = async (imageId, updateData) => {
    try {
        const formData = new FormData();
        
        // إضافة الحقول المراد تحديثها
        if (updateData.altText) {
            formData.append('alt_text', JSON.stringify(updateData.altText));
        }
        if (updateData.caption) {
            formData.append('caption', JSON.stringify(updateData.caption));
        }
        if (updateData.displayOrder !== undefined) {
            formData.append('display_order', updateData.displayOrder);
        }
        if (updateData.imageType) {
            formData.append('image_type', updateData.imageType);
        }
        
        const response = await fetch(`${API_BASE_URL}images/${imageId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('تم تحديث الصورة بنجاح');
            return result;
        } else {
            throw new Error(result.message || 'خطأ في تحديث الصورة');
        }
        
    } catch (error) {
        console.error('خطأ:', error);
        throw error;
    }
};
```

---

## 8. حذف صورة

### Endpoint
```
DELETE /api/v1/store/products/images/{id}/
```

### Implementation
```javascript
const deleteImage = async (imageId) => {
    try {
        const response = await fetch(`${API_BASE_URL}images/${imageId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            console.log('تم حذف الصورة بنجاح');
            return true;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'خطأ في حذف الصورة');
        }
        
    } catch (error) {
        console.error('خطأ:', error);
        throw error;
    }
};
```

---

## 9. معالجة الأخطاء

### Error Handling
```javascript
const handleImageUploadError = (error) => {
    let errorMessage = 'حدث خطأ غير متوقع';
    
    if (error.response) {
        const status = error.response.status;
        
        switch (status) {
            case 400:
                errorMessage = 'بيانات غير صحيحة - تأكد من صحة الملف';
                break;
            case 401:
                errorMessage = 'غير مصرح لك برفع الصور - يرجى تسجيل الدخول كمدير';
                break;
            case 403:
                errorMessage = 'ليس لديك صلاحية لرفع الصور';
                break;
            case 404:
                errorMessage = 'المنتج غير موجود';
                break;
            case 413:
                errorMessage = 'حجم الملف كبير جداً - الحد الأقصى 5MB';
                break;
            case 415:
                errorMessage = 'نوع الملف غير مدعوم - يرجى استخدام JPG, PNG, GIF';
                break;
            case 500:
                errorMessage = 'خطأ في الخادم - يرجى المحاولة لاحقاً';
                break;
            default:
                errorMessage = `خطأ في الخادم (${status})`;
        }
    }
    
    return errorMessage;
};
```

---

## 10. التحقق من صحة الملفات

### File Validation
```javascript
const validateImageFile = (file) => {
    const errors = [];
    
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        errors.push('نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, GIF, WEBP');
    }
    
    // التحقق من حجم الملف (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        errors.push('حجم الملف كبير جداً. الحد الأقصى: 5MB');
    }
    
    // التحقق من أبعاد الصورة
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            if (img.width < 100 || img.height < 100) {
                errors.push('أبعاد الصورة صغيرة جداً. الحد الأدنى: 100x100 بكسل');
            }
            if (img.width > 4000 || img.height > 4000) {
                errors.push('أبعاد الصورة كبيرة جداً. الحد الأقصى: 4000x4000 بكسل');
            }
            resolve(errors);
        };
        img.onerror = () => {
            errors.push('الملف ليس صورة صحيحة');
            resolve(errors);
        };
        img.src = URL.createObjectURL(file);
    });
};
```

---

## 11. مثال كامل لصفحة رفع الصور

### HTML Structure
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رفع صور المنتج</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1>رفع صور المنتج</h1>
        
        <!-- نموذج رفع الصور -->
        <div class="card">
            <div class="card-header">رفع صورة جديدة</div>
            <div class="card-body">
                <form id="upload-form">
                    <div class="mb-3">
                        <label for="product-id" class="form-label">معرف المنتج</label>
                        <input type="text" id="product-id" class="form-control" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="image-file" class="form-label">ملف الصورة</label>
                        <input type="file" id="image-file" class="form-control" accept="image/*" required>
                        <div class="form-text">الحد الأقصى: 5MB | الأنواع المدعومة: JPG, PNG, GIF, WEBP</div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="image-type" class="form-label">نوع الصورة</label>
                        <select id="image-type" class="form-select">
                            <option value="gallery">معرض</option>
                            <option value="main">رئيسية</option>
                            <option value="thumbnail">مصغرة</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label for="alt-text-ar" class="form-label">النص البديل (عربي)</label>
                        <input type="text" id="alt-text-ar" class="form-control">
                    </div>
                    
                    <div class="mb-3">
                        <label for="alt-text-en" class="form-label">النص البديل (إنجليزي)</label>
                        <input type="text" id="alt-text-en" class="form-control">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">رفع الصورة</button>
                </form>
            </div>
        </div>
        
        <!-- عرض الصور المرفوعة -->
        <div class="card mt-4">
            <div class="card-header">صور المنتج</div>
            <div class="card-body">
                <div id="images-container"></div>
            </div>
        </div>
        
        <!-- رسائل الحالة -->
        <div id="status-messages"></div>
    </div>
    
    <script src="image-upload.js"></script>
</body>
</html>
```

### JavaScript Implementation
```javascript
// image-upload.js
class ProductImageManager {
    constructor() {
        this.apiBaseUrl = 'https://smart-ai-api.onrender.com/api/v1/store/products/';
        this.accessToken = localStorage.getItem('accessToken');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadProductImages();
    }
    
    setupEventListeners() {
        const form = document.getElementById('upload-form');
        form.addEventListener('submit', (e) => this.handleUpload(e));
        
        const productIdInput = document.getElementById('product-id');
        productIdInput.addEventListener('change', () => this.loadProductImages());
    }
    
    async handleUpload(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const fileInput = document.getElementById('image-file');
        const productId = document.getElementById('product-id').value;
        const imageType = document.getElementById('image-type').value;
        const altTextAr = document.getElementById('alt-text-ar').value;
        const altTextEn = document.getElementById('alt-text-en').value;
        
        // التحقق من صحة الملف
        const file = fileInput.files[0];
        if (!file) {
            this.showMessage('يرجى اختيار ملف صورة', 'error');
            return;
        }
        
        const validationErrors = await this.validateImageFile(file);
        if (validationErrors.length > 0) {
            this.showMessage(validationErrors.join('\n'), 'error');
            return;
        }
        
        // إعداد البيانات
        formData.append('product', productId);
        formData.append('image', file);
        formData.append('image_type', imageType);
        
        if (altTextAr || altTextEn) {
            formData.append('alt_text', JSON.stringify({
                ar: altTextAr,
                en: altTextEn
            }));
        }
        
        try {
            this.showMessage('جاري رفع الصورة...', 'info');
            
            const response = await fetch(`${this.apiBaseUrl}images/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showMessage('تم رفع الصورة بنجاح!', 'success');
                this.loadProductImages();
                form.reset();
            } else {
                throw new Error(result.message || 'خطأ في رفع الصورة');
            }
            
        } catch (error) {
            console.error('خطأ في رفع الصورة:', error);
            this.showMessage(`خطأ: ${error.message}`, 'error');
        }
    }
    
    async validateImageFile(file) {
        const errors = [];
        
        // التحقق من نوع الملف
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            errors.push('نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, GIF, WEBP');
        }
        
        // التحقق من حجم الملف
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            errors.push('حجم الملف كبير جداً. الحد الأقصى: 5MB');
        }
        
        return errors;
    }
    
    async loadProductImages() {
        const productId = document.getElementById('product-id').value;
        if (!productId) return;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}images/?product=${productId}`);
            const data = await response.json();
            
            if (response.ok) {
                this.displayImages(data.results || []);
            } else {
                throw new Error(data.message || 'خطأ في جلب الصور');
            }
            
        } catch (error) {
            console.error('خطأ في جلب الصور:', error);
            this.showMessage(`خطأ في جلب الصور: ${error.message}`, 'error');
        }
    }
    
    displayImages(images) {
        const container = document.getElementById('images-container');
        
        if (images.length === 0) {
            container.innerHTML = '<p class="text-muted">لا توجد صور لهذا المنتج</p>';
            return;
        }
        
        const imagesHtml = images.map(image => `
            <div class="card mb-3" style="max-width: 300px;">
                <img src="${image.image_url}" class="card-img-top" alt="${image.alt_text?.ar || 'صورة المنتج'}">
                <div class="card-body">
                    <h6 class="card-title">${image.image_type}</h6>
                    <p class="card-text">${image.alt_text?.ar || ''}</p>
                    <div class="btn-group">
                        ${image.image_type !== 'main' ? 
                            `<button class="btn btn-sm btn-primary" onclick="imageManager.setMainImage(${image.id})">تعيين كرئيسية</button>` : 
                            '<span class="badge bg-success">رئيسية</span>'
                        }
                        <button class="btn btn-sm btn-danger" onclick="imageManager.deleteImage(${image.id})">حذف</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="row">
                ${imagesHtml}
            </div>
        `;
    }
    
    async setMainImage(imageId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}images/${imageId}/set-main/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showMessage('تم تعيين الصورة كرئيسية بنجاح', 'success');
                this.loadProductImages();
            } else {
                throw new Error(result.message || 'خطأ في تعيين الصورة الرئيسية');
            }
            
        } catch (error) {
            console.error('خطأ:', error);
            this.showMessage(`خطأ: ${error.message}`, 'error');
        }
    }
    
    async deleteImage(imageId) {
        if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}images/${imageId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            
            if (response.ok) {
                this.showMessage('تم حذف الصورة بنجاح', 'success');
                this.loadProductImages();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'خطأ في حذف الصورة');
            }
            
        } catch (error) {
            console.error('خطأ:', error);
            this.showMessage(`خطأ: ${error.message}`, 'error');
        }
    }
    
    showMessage(message, type = 'info') {
        const container = document.getElementById('status-messages');
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        container.innerHTML = alertHtml;
        
        // إزالة الرسالة تلقائياً بعد 5 ثواني
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}

// تهيئة مدير الصور
const imageManager = new ProductImageManager();
```

---

## 12. أفضل الممارسات

### 1. التحقق من الملفات
- تحقق من نوع الملف قبل الرفع
- تحقق من حجم الملف (الحد الأقصى 5MB)
- تحقق من أبعاد الصورة

### 2. معالجة الأخطاء
- استخدم try-catch لجميع عمليات API
- اعرض رسائل خطأ واضحة للمستخدم
- سجل الأخطاء للتشخيص

### 3. تجربة المستخدم
- اعرض مؤشر تحميل أثناء الرفع
- امنح تغذية راجعة فورية للمستخدم
- استخدم drag & drop لسهولة الاستخدام

### 4. الأمان
- تحقق من صلاحيات المستخدم
- تحقق من صحة البيانات المدخلة
- استخدم HTTPS لجميع الطلبات

---

## 13. استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ 401 (Unauthorized)
```javascript
// تأكد من وجود token صحيح
const token = localStorage.getItem('accessToken');
if (!token) {
    // توجيه المستخدم لصفحة تسجيل الدخول
    window.location.href = '/login';
}
```

#### 2. خطأ 413 (Payload Too Large)
```javascript
// تحقق من حجم الملف قبل الرفع
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) {
    alert('حجم الملف كبير جداً');
    return;
}
```

#### 3. خطأ 415 (Unsupported Media Type)
```javascript
// تحقق من نوع الملف
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
    alert('نوع الملف غير مدعوم');
    return;
}
```

---

## 14. اختبار API

### استخدام أداة الاختبار المدمجة
```html
<!-- استخدم ملف frontend_tester/product_images_tester.html -->
<!-- يحتوي على واجهة اختبار كاملة لجميع العمليات -->
```

---

## الخلاصة

هذا الدليل يوفر جميع المعلومات المطلوبة لمبرمج Frontend لتنفيذ نظام رفع الصور بشكل احترافي. النظام يدعم:

- ✅ رفع صور متعددة للمنتج الواحد
- ✅ أنواع صور مختلفة (رئيسية، معرض، مصغرة)
- ✅ دعم متعدد اللغات للنصوص البديلة
- ✅ إعادة ترتيب الصور
- ✅ تعيين صورة رئيسية
- ✅ حذف الصور
- ✅ معالجة شاملة للأخطاء
- ✅ تحقق من صحة الملفات

**النظام جاهز للاستخدام في الإنتاج ويعمل مع Cloudflare R2 Storage.** 