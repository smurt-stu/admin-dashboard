# دليل استكشاف أخطاء Vercel

## 🚨 مشاكل شائعة وحلولها

### 1. خطأ في البناء (Build Error)

#### المشكلة:
```
Error: Build failed
```

#### الحلول:
```bash
# تشغيل البناء محلياً للتحقق
npm run build

# فحص الأخطاء
npm run lint
npm run type-check

# تنظيف الكاش
rm -rf .next
npm run build
```

### 2. خطأ في TypeScript

#### المشكلة:
```
TypeScript compilation failed
```

#### الحلول:
```bash
# فحص أخطاء TypeScript
npx tsc --noEmit

# تحديث types
npm install @types/node @types/react @types/react-dom

# إضافة ignoreBuildErrors في next.config.ts
typescript: {
  ignoreBuildErrors: true,
}
```

### 3. خطأ في الصور

#### المشكلة:
```
Error: Invalid src prop on `next/image`
```

#### الحلول:
```typescript
// في next.config.ts
images: {
  domains: ['your-domain.com'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

### 4. خطأ في المصادقة

#### المشكلة:
```
NextAuth configuration error
```

#### الحلول:
```env
# تأكد من صحة المتغيرات
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### 5. خطأ في Function Timeout

#### المشكلة:
```
Function execution timed out
```

#### الحلول:
```json
// في vercel.json
{
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 30
    }
  }
}
```

## 🔧 إصلاحات متقدمة

### 1. تحسين الأداء

#### مشكلة: بطء التحميل
```typescript
// في next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}
```

### 2. إصلاح مشاكل CORS

#### مشكلة: خطأ CORS
```typescript
// في next.config.ts
async headers() {
  return [
    {
      source: '/api/(.*)',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ]
}
```

### 3. إصلاح مشاكل البيئة

#### مشكلة: متغيرات البيئة غير موجودة
```bash
# تأكد من إضافة المتغيرات في Vercel
# Settings > Environment Variables
```

## 📊 مراقبة الأخطاء

### 1. Function Logs
```bash
# في لوحة تحكم Vercel
# Functions > [Function Name] > Logs
```

### 2. Build Logs
```bash
# في لوحة تحكم Vercel
# Deployments > [Deployment] > Build Logs
```

### 3. Runtime Logs
```bash
# في لوحة تحكم Vercel
# Functions > Runtime Logs
```

## 🛠️ أدوات التشخيص

### 1. فحص الأداء
```bash
# تحليل البناء
npm run analyze

# فحص الحجم
npx @next/bundle-analyzer
```

### 2. فحص الأمان
```bash
# فحص التبعيات
npm audit

# إصلاح الثغرات
npm audit fix
```

### 3. فحص الكود
```bash
# فحص ESLint
npm run lint

# فحص TypeScript
npm run type-check
```

## 📞 الحصول على المساعدة

### 1. Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### 2. Next.js Support
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)

### 3. TypeScript Support
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🔄 إجراءات الطوارئ

### 1. Rollback سريع
```bash
# في لوحة تحكم Vercel
# Deployments > [Previous Deployment] > Promote
```

### 2. إعادة النشر
```bash
# في لوحة تحكم Vercel
# Deployments > [Deployment] > Redeploy
```

### 3. تنظيف الكاش
```bash
# محلياً
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 📝 نصائح للوقاية

### 1. قبل كل نشر
- [ ] تشغيل `npm run build` محلياً
- [ ] فحص `npm run lint`
- [ ] فحص `npm run type-check`
- [ ] اختبار الوظائف الأساسية

### 2. مراقبة مستمرة
- [ ] مراقبة Function Logs
- [ ] مراقبة Build Logs
- [ ] مراقبة الأداء
- [ ] مراقبة الأخطاء

### 3. تحديثات دورية
- [ ] تحديث التبعيات
- [ ] فحص الثغرات الأمنية
- [ ] تحسين الأداء
- [ ] تحديث التوثيق

---

**آخر تحديث**: [التاريخ]
**الإصدار**: 1.0.0 