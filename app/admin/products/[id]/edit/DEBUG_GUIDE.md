# دليل استخدام نظام التتبع - صفحة تعديل المنتج

## نظرة عامة

تم إضافة نظام تتبع شامل لمراقبة ما يحدث في صفحة تعديل المنتج وتحديد سبب مشكلة الانتقال بين التابز.

## كيفية استخدام نظام التتبع

### 1. تفعيل وضع التتبع
- انقر على زر "Show Debug" في أعلى الصفحة
- سيظهر لوحة التتبع في أسفل يمين الصفحة

### 2. مراقبة السجلات (Logs)
- جميع الأحداث يتم تسجيلها في Console (F12)
- يمكن تحميل السجلات كملف نصي عبر زر "Download Logs"
- السجلات تُحفظ أيضاً في localStorage للتحليل لاحقاً

### 3. أنواع السجلات

#### أ) تغيير التابز (Tab Changes)
```
TAB CHANGE: basic → pricing
```
- يسجل كل تغيير في التابز مع السبب
- يتضمن stack trace لتحديد مصدر التغيير

#### ب) تحميل البيانات (Data Loading)
```
DATA LOAD: Product ID detected
DATA LOAD: Starting product load
DATA LOAD: Product data received
```
- يسجل كل عملية تحميل بيانات
- يتضمن تفاصيل البيانات المحملة

#### ج) الأخطاء (Errors)
```
ERROR: Product load failed
ERROR: Failed to load detailed product type
```
- يسجل جميع الأخطاء مع stack trace
- يساعد في تحديد سبب المشاكل

#### د) تغييرات الحالة (State Changes)
```
STATE CHANGE: formData
STATE CHANGE: activeTab
```
- يسجل تغييرات الحالة المهمة
- يساعد في تتبع تدفق البيانات

### 4. لوحة التتبع (Debug Panel)

#### معلومات الحالة الحالية:
- **Active Tab**: التاب النشط حالياً
- **Loading**: حالة التحميل
- **Saving**: حالة الحفظ
- **Product**: حالة تحميل المنتج
- **Categories**: عدد الفئات المحملة
- **Product Types**: عدد أنواع المنتجات المحملة
- **Selected Product Type**: حالة نوع المنتج المحدد

#### الأزرار:
- **Clear**: مسح جميع السجلات
- **Download Logs**: تحميل السجلات كملف نصي

## كيفية تحليل المشاكل

### 1. مشكلة الانتقال بين التابز

#### تحقق من:
```javascript
// في Console
TAB CHANGE: basic → pricing
// تحقق من وجود أخطاء بعد تغيير التاب
ERROR: ...
```

#### المؤشرات المحتملة:
- عدم تحميل نوع المنتج بشكل صحيح
- مشاكل في الحقول المخصصة
- أخطاء في تحويل البيانات

### 2. مشاكل تحميل البيانات

#### تحقق من:
```javascript
DATA LOAD: Loading detailed product type
DATA LOAD: Detailed product type loaded
// أو
ERROR: Failed to load detailed product type
```

#### المؤشرات المحتملة:
- مشاكل في الاتصال بالخادم
- بيانات غير صحيحة من API
- مشاكل في تحويل البيانات

### 3. مشاكل في الحقول المخصصة

#### تحقق من:
```javascript
SpecificationsTab: Component mounted/updated
SpecificationsTab: Custom fields changed
```

#### المؤشرات المحتملة:
- عدم تحميل إعدادات نوع المنتج
- مشاكل في تحويل البيانات
- أخطاء في عرض الحقول

## خطوات التشخيص

### 1. فتح Console
```bash
F12 → Console
```

### 2. تفعيل وضع التتبع
- انقر على "Show Debug"
- راقب لوحة التتبع

### 3. إعادة إنتاج المشكلة
- انتقل بين التابز
- راقب السجلات في Console

### 4. تحليل السجلات
- ابحث عن الأخطاء (ERROR)
- تحقق من تسلسل تحميل البيانات
- راقب تغييرات التابز

### 5. تحميل السجلات
- انقر على "Download Logs"
- احفظ الملف للتحليل لاحقاً

## أمثلة على المشاكل الشائعة

### مشكلة 1: عدم تحميل نوع المنتج
```
DATA LOAD: Loading detailed product type
ERROR: Failed to load detailed product type
```
**الحل**: تحقق من صحة ID نوع المنتج

### مشكلة 2: مشاكل في الحقول المخصصة
```
SpecificationsTab: Component mounted/updated
// لا توجد سجلات للحقول المخصصة
```
**الحل**: تحقق من إعدادات نوع المنتج

### مشكلة 3: مشاكل في تحويل البيانات
```
DATA LOAD: Converting product to form data
ERROR: ...
```
**الحل**: تحقق من تنسيق البيانات من API

## نصائح إضافية

1. **استخدم Filtres في Console** للتركيز على نوع معين من السجلات
2. **احفظ السجلات** قبل إعادة تحميل الصفحة
3. **قارن السجلات** بين الحالات المختلفة
4. **استخدم Network tab** لمراقبة طلبات API

## إزالة نظام التتبع

بعد حل المشكلة، يمكن إزالة نظام التتبع عبر:
1. حذف class `EditProductLogger`
2. إزالة جميع استدعاءات `logger.log()`
3. إزالة `DebugPanel` component 