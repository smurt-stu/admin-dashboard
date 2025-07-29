# دليل تحسين الأداء على Vercel

## 🚀 تحسينات أساسية

### 1. تحسين Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  // تحسين الصور
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // ضغط الملفات
  compress: true,
  
  // إزالة console.log في الإنتاج
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // تحسين التحميل
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // إزالة رأس poweredBy
  poweredByHeader: false,
  
  // تحسين ETags
  generateEtags: false,
}
```

### 2. تحسين Vercel Config

```json
// vercel.json
{
  "version": 2,
  "functions": {
    "app/**/*.tsx": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/admin/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

## 📦 تحسينات البناء

### 1. تحسين Bundle Size

```bash
# تحليل حجم البناء
npm run analyze

# فحص التبعيات غير المستخدمة
npx depcheck

# تحسين التبعيات
npm prune --production
```

### 2. تحسين الصور

```typescript
// استخدام Next.js Image
import Image from 'next/image'

// تحسين الصور
<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 3. تحسين الخطوط

```typescript
// في layout.tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
```

## 🔧 تحسينات متقدمة

### 1. Code Splitting

```typescript
// تحميل مكونات بشكل تدريجي
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
```

### 2. تحسين API Routes

```typescript
// api/products.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // إضافة cache headers
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
  
  // تحسين الاستجابة
  const data = await fetchData()
  res.status(200).json(data)
}
```

### 3. تحسين CSS

```css
/* globals.css */
/* تحسين تحميل CSS */
@layer base {
  * {
    box-sizing: border-box;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
}
```

## 📊 مراقبة الأداء

### 1. Core Web Vitals

```typescript
// تحسين LCP (Largest Contentful Paint)
<Image
  src="/hero.jpg"
  alt="Hero"
  priority={true}
  width={1200}
  height={600}
/>

// تحسين CLS (Cumulative Layout Shift)
<div className="aspect-video">
  <Image
    src="/video-thumbnail.jpg"
    alt="Video"
    fill
    className="object-cover"
  />
</div>
```

### 2. تحسين FID (First Input Delay)

```typescript
// تقليل JavaScript غير الضروري
const handleClick = useCallback(() => {
  // logic here
}, [])
```

### 3. تحسين TTFB (Time to First Byte)

```typescript
// تحسين Server-Side Rendering
export async function getStaticProps() {
  const data = await fetchData()
  
  return {
    props: {
      data,
    },
    revalidate: 60, // ISR
  }
}
```

## 🎯 تحسينات محددة

### 1. تحسين لوحة الإدارة

```typescript
// تحميل البيانات بشكل تدريجي
const AdminDashboard = () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // تحميل البيانات عند الحاجة
    fetchData().then(setData)
  }, [])
  
  if (!data) return <LoadingSpinner />
  
  return <Dashboard data={data} />
}
```

### 2. تحسين قائمة المنتجات

```typescript
// تحسين قائمة المنتجات
const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### 3. تحسين النماذج

```typescript
// تحسين النماذج
const ProductForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await submitData(data)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

## 📈 أدوات المراقبة

### 1. Vercel Analytics

```typescript
// تفعيل Vercel Analytics
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Web Vitals

```typescript
// مراقبة Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // إرسال البيانات إلى خدمة التحليلات
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## 🔍 اختبار الأداء

### 1. اختبار محلي

```bash
# اختبار الأداء محلياً
npm run build
npm start

# فحص حجم البناء
npm run analyze
```

### 2. اختبار Vercel

```bash
# نشر إلى Vercel
git push origin main

# مراقبة الأداء في لوحة التحكم
# Vercel Dashboard > Analytics
```

### 3. أدوات خارجية

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

## 📝 نصائح إضافية

### 1. تحسين التحميل

- استخدم `priority` للصور المهمة
- استخدم `loading="lazy"` للصور الأخرى
- استخدم `placeholder="blur"` لتحسين UX

### 2. تحسين الكاش

- استخدم ISR (Incremental Static Regeneration)
- استخدم SWR أو React Query للبيانات الديناميكية
- استخدم Service Workers للتخزين المؤقت

### 3. تحسين الشبكة

- استخدم CDN للصور والملفات الثابتة
- ضغط الملفات
- استخدم HTTP/2

---

**آخر تحديث**: [التاريخ]
**الإصدار**: 1.0.0 