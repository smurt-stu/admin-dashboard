# متجري - متجر إلكتروني متكامل

مشروع متجر إلكتروني متكامل مبني بـ Next.js مع لوحة إدارة شاملة.

## المميزات

### 🛍️ المتجر
- عرض المنتجات مع التصنيفات
- نظام بحث متقدم
- سلة التسوق
- نظام المفضلة
- صفحات تفصيلية للمنتجات

### 🎛️ لوحة الإدارة
- إدارة المنتجات (إضافة، تعديل، حذف)
- إدارة العملاء
- إدارة الطلبات
- إدارة المراجعات والتعليقات
- إحصائيات المبيعات
- نظام الكوبونات والعروض
- إدارة التسويق

### 🎨 التصميم
- تصميم متجاوب (Responsive Design)
- واجهة عربية بالكامل
- دعم RTL
- تصميم عصري وأنيق

## التقنيات المستخدمة

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Vercel

## التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- npm أو yarn

### خطوات التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/ecommerce-store.git
cd ecommerce-store

# تثبيت التبعيات
npm install

# تشغيل المشروع للتطوير
npm run dev

# بناء المشروع
npm run build

# تشغيل المشروع للإنتاج
npm start
```

## النشر على Vercel

### 1. إعداد المشروع
```bash
# تأكد من أن المشروع يعمل محلياً
npm run build
```

### 2. رفع المشروع إلى Git
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 3. النشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخولك بحساب GitHub/GitLab/Bitbucket
3. اضغط على "New Project"
4. اختر المستودع الخاص بك
5. Vercel سيكتشف تلقائياً أنه مشروع Next.js

### 4. تكوين متغيرات البيئة
في إعدادات المشروع على Vercel، أضف المتغيرات التالية:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=your-database-url
API_BASE_URL=https://your-domain.vercel.app/api
```

## هيكل المشروع

```
admin/
├── app/                    # صفحات التطبيق
│   ├── admin/             # لوحة الإدارة
│   │   ├── components/    # مكونات لوحة الإدارة
│   │   ├── customers/     # إدارة العملاء
│   │   ├── products/      # إدارة المنتجات
│   │   ├── reviews/       # إدارة المراجعات
│   │   └── marketing/     # إدارة التسويق
│   ├── components/        # مكونات عامة
│   └── globals.css        # الأنماط العامة
├── components/            # مكونات إضافية
├── lib/                   # مكتبات وخدمات
├── public/               # الملفات الثابتة
└── vercel.json           # إعدادات Vercel
```

## الأمان

- تم تكوين رؤوس HTTP الأمنية
- دعم HTTPS
- حماية من XSS و CSRF
- إدارة آمنة للمصادقة

## الأداء

- تحسين الصور تلقائياً
- Code Splitting
- Lazy Loading
- تحسين CSS
- إزالة console.log في الإنتاج

## SEO

- Meta tags محسنة
- Sitemap.xml
- Robots.txt
- Open Graph tags
- Twitter Cards
- Schema markup

## المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

- 📧 البريد الإلكتروني: support@your-domain.com
- 📖 التوثيق: [docs.your-domain.com](https://docs.your-domain.com)
- 🐛 الإبلاغ عن الأخطاء: [GitHub Issues](https://github.com/your-username/ecommerce-store/issues)

## التحديثات

### v1.0.0
- الإصدار الأولي
- لوحة إدارة أساسية
- إدارة المنتجات والعملاء
- نظام المراجعات

## الروابط المفيدة

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
