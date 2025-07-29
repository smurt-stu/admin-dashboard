# دليل النشر على Vercel - خطوة بخطوة

## ✅ التحضير المسبق

### 1. تأكد من أن المشروع جاهز
```bash
# تشغيل المشروع محلياً
npm run dev

# بناء المشروع للتأكد من عدم وجود أخطاء
npm run build

# تشغيل المشروع للإنتاج
npm start
```

### 2. رفع المشروع إلى Git
```bash
# تهيئة Git (إذا لم يكن موجوداً)
git init

# إضافة جميع الملفات
git add .

# عمل commit أولي
git commit -m "Initial commit for Vercel deployment"

# إضافة remote repository
git remote add origin https://github.com/your-username/ecommerce-store.git

# رفع المشروع
git push -u origin main
```

## 🚀 النشر على Vercel

### الخطوة 1: إنشاء حساب Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط على "Sign Up"
3. اختر "Continue with GitHub" (أو GitLab/Bitbucket)
4. اتبع خطوات التسجيل

### الخطوة 2: استيراد المشروع
1. في لوحة تحكم Vercel، اضغط على "New Project"
2. اختر المستودع الخاص بك (`ecommerce-store`)
3. Vercel سيكتشف تلقائياً أنه مشروع Next.js
4. اضغط على "Import"

### الخطوة 3: تكوين المشروع
في صفحة إعدادات المشروع:

#### إعدادات البناء (Build Settings)
- **Framework Preset**: Next.js (تلقائي)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Root Directory**: `./` (افتراضي)

#### متغيرات البيئة (Environment Variables)
أضف المتغيرات التالية:

```env
# إعدادات التطبيق
NODE_ENV=production
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here

# قاعدة البيانات (إذا كنت تستخدم واحدة)
DATABASE_URL=your-database-connection-string

# إعدادات API
API_BASE_URL=https://your-project-name.vercel.app/api

# إعدادات إضافية
SITE_URL=https://your-project-name.vercel.app
```

### الخطوة 4: النشر
1. اضغط على "Deploy"
2. انتظر حتى يكتمل البناء (عادة 2-3 دقائق)
3. ستظهر رسالة "Deployment successful"

## 🔧 الإعدادات المتقدمة

### تكوين النطاق المخصص
1. في إعدادات المشروع، اذهب إلى "Domains"
2. اضغط على "Add Domain"
3. أدخل نطاقك المخصص
4. اتبع تعليمات DNS

### إعدادات الأمان
تم تكوين رؤوس HTTP الأمنية في `vercel.json`:
- `X-Content-Type-Options`: nosniff
- `X-Frame-Options`: DENY
- `X-XSS-Protection`: 1; mode=block
- `Referrer-Policy`: strict-origin-when-cross-origin
- `Permissions-Policy`: camera=(), microphone=(), geolocation=()

### تحسين الأداء
- تم تفعيل ضغط الملفات
- تم إزالة console.log في الإنتاج
- تم تحسين الصور تلقائياً
- تم تفعيل Code Splitting

## 📊 مراقبة الأداء

### Vercel Analytics
1. في لوحة تحكم Vercel، اذهب إلى "Analytics"
2. تفعيل Vercel Analytics
3. مراقبة Core Web Vitals

### Function Logs
1. اذهب إلى "Functions" في لوحة التحكم
2. تحقق من Function Logs للأخطاء
3. راقب وقت الاستجابة

## 🔄 التحديثات المستقبلية

### نشر تحديثات جديدة
```bash
# تحديث الكود
git add .
git commit -m "Update: [وصف التحديث]"
git push origin main

# Vercel سيقوم بالتحديث تلقائياً
```

### Rollback إلى إصدار سابق
1. في لوحة تحكم Vercel، اذهب إلى "Deployments"
2. اختر الإصدار المطلوب
3. اضغط على "Promote to Production"

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في البناء
```bash
# تشغيل البناء محلياً للتحقق
npm run build

# فحص الأخطاء
npm run lint
npm run type-check
```

#### 2. مشاكل في الصور
- تأكد من إعدادات `next.config.ts`
- أضف النطاقات المطلوبة في `remotePatterns`

#### 3. مشاكل في المصادقة
- تأكد من صحة `NEXTAUTH_URL`
- تأكد من قوة `NEXTAUTH_SECRET`

#### 4. مشاكل في الأداء
- تحقق من حجم الصور
- استخدم Next.js Image component
- فحص Function Logs

### الحصول على المساعدة
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Next.js Documentation](https://nextjs.org/docs)

## 📈 تحسينات إضافية

### 1. تحسين SEO
- تم إضافة meta tags محسنة
- تم إنشاء sitemap.xml
- تم إضافة robots.txt

### 2. تحسين الأمان
- تم تكوين رؤوس HTTP الأمنية
- تم إضافة حماية من XSS و CSRF
- تم تفعيل HTTPS

### 3. تحسين الأداء
- تم تفعيل ضغط الملفات
- تم تحسين الصور
- تم تفعيل Code Splitting

## 🎉 النجاح!

بعد اتباع هذه الخطوات، سيكون مشروعك متاحاً على:
`https://your-project-name.vercel.app`

### الخطوات التالية
1. اختبر جميع الوظائف
2. راجع الأداء
3. أضف نطاق مخصص
4. قم بإعداد المراقبة
5. خطط للتحديثات المستقبلية

---

**ملاحظة**: تأكد من تحديث جميع الروابط في الكود لتشير إلى نطاقك الجديد بدلاً من `your-domain.vercel.app` 