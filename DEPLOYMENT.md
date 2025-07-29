# دليل النشر على Vercel

## المتطلبات الأساسية

1. حساب على [Vercel](https://vercel.com)
2. مشروع Git (GitHub, GitLab, أو Bitbucket)
3. Node.js 18+ محلي للتطوير

## خطوات النشر

### 1. إعداد المشروع محلياً

```bash
# تثبيت التبعيات
npm install

# تشغيل المشروع للتطوير
npm run dev

# بناء المشروع للتأكد من عدم وجود أخطاء
npm run build
```

### 2. رفع المشروع إلى Git

```bash
# تهيئة Git (إذا لم يكن موجوداً)
git init

# إضافة الملفات
git add .

# عمل commit
git commit -m "Initial commit for Vercel deployment"

# رفع إلى GitHub/GitLab/Bitbucket
git push origin main
```

### 3. النشر على Vercel

1. **تسجيل الدخول إلى Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخولك بحساب GitHub/GitLab/Bitbucket

2. **استيراد المشروع**
   - اضغط على "New Project"
   - اختر المستودع الخاص بك
   - Vercel سيكتشف تلقائياً أنه مشروع Next.js

3. **تكوين متغيرات البيئة**
   - في صفحة إعدادات المشروع، اذهب إلى "Environment Variables"
   - أضف المتغيرات التالية:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=your-database-url
API_BASE_URL=https://your-domain.vercel.app/api
```

4. **إعدادات البناء**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 4. إعدادات إضافية

#### تكوين قاعدة البيانات
- استخدم قاعدة بيانات خارجية (PostgreSQL, MySQL, أو MongoDB)
- أضف رابط قاعدة البيانات في متغيرات البيئة

#### تكوين المصادقة
- أضف `NEXTAUTH_SECRET` عشوائي وقوي
- تأكد من أن `NEXTAUTH_URL` يشير إلى نطاقك

#### تكوين الملفات الثابتة
- ضع الصور في مجلد `public/`
- استخدم Next.js Image component للتحسين

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في البناء**
   ```bash
   # تشغيل البناء محلياً للتحقق
   npm run build
   ```

2. **مشاكل في TypeScript**
   - تأكد من تثبيت `@types/*` المطلوبة
   - تحقق من إعدادات `tsconfig.json`

3. **مشاكل في الصور**
   - تأكد من إعدادات `next.config.ts`
   - أضف النطاقات المطلوبة في `remotePatterns`

### مراقبة الأداء

- استخدم Vercel Analytics لمراقبة الأداء
- تحقق من Function Logs في لوحة التحكم
- راقب Core Web Vitals

## الأمان

1. **متغيرات البيئة**
   - لا تضع معلومات حساسة في الكود
   - استخدم متغيرات البيئة لجميع الأسرار

2. **رؤوس HTTP**
   - تم تكوين رؤوس الأمان في `vercel.json`
   - تأكد من تفعيل HTTPS

3. **CORS**
   - قم بتكوين CORS حسب الحاجة
   - حدد النطاقات المسموح لها

## التحديثات

للتحديث:
```bash
# تحديث الكود
git add .
git commit -m "Update for deployment"
git push origin main

# Vercel سيقوم بالتحديث تلقائياً
```

## الدعم

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Support](https://vercel.com/support) 