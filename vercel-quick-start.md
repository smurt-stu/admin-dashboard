# دليل النشر السريع على Vercel

## 🚀 النشر في 5 خطوات

### 1. رفع المشروع إلى Git
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ecommerce-store.git
git push -u origin main
```

### 2. إنشاء حساب Vercel
- اذهب إلى [vercel.com](https://vercel.com)
- سجل دخولك بحساب GitHub

### 3. استيراد المشروع
- اضغط "New Project"
- اختر المستودع الخاص بك
- اضغط "Import"

### 4. إضافة متغيرات البيئة
في إعدادات المشروع، أضف:
```env
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### 5. النشر
- اضغط "Deploy"
- انتظر 2-3 دقائق
- تم النشر! 🎉

## 📋 قائمة التحقق السريعة

- [x] المشروع يبني بدون أخطاء
- [x] تم رفع المشروع إلى Git
- [x] تم إنشاء حساب Vercel
- [x] تم إضافة متغيرات البيئة
- [x] تم النشر بنجاح

## 🔗 الروابط المفيدة

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**الوقت المطلوب**: 10 دقائق
**المستوى**: مبتدئ 