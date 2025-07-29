# Products Module - وحدة المنتجات

هذا الوحدة يوفر خدمات شاملة لإدارة المنتجات في النظام، بما في ذلك أنواع المنتجات، الفئات، المتغيرات، والصور.

## الخدمات المتاحة

### 1. ProductService - خدمة المنتجات الأساسية
```typescript
import { ProductService } from '@/lib/products';

// عرض جميع المنتجات
const products = await ProductService.getProducts({
  search: 'قميص',
  category: 'clothing',
  price_min: 50,
  price_max: 200,
  is_featured: true
});

// إنشاء منتج جديد
const newProduct = await ProductService.createProduct({
  title: { ar: 'قميص قطني', en: 'Cotton Shirt' },
  price: '89.99',
  category: 'category-id',
  product_type: 'type-id'
});

// تحديث منتج
await ProductService.updateProduct('product-id', {
  price: '99.99',
  is_featured: true
});

// حذف منتج
await ProductService.deleteProduct('product-id');
```

### 2. ProductTypeService - خدمة أنواع المنتجات
```typescript
import { ProductTypeService } from '@/lib/products';

// عرض جميع أنواع المنتجات
const productTypes = await ProductTypeService.getProductTypes({
  has_variants: true,
  is_digital: false
});

// إنشاء نوع منتج جديد
const newType = await ProductTypeService.createProductType({
  name: 'electronics',
  display_name: { ar: 'إلكترونيات', en: 'Electronics' },
  settings: {
    brand_options: ['Apple', 'Samsung'],
    color_options: ['أحمر', 'أزرق', 'أسود'],
    storage_options: ['32GB', '64GB', '128GB']
  }
});

// إحصائيات نوع المنتج
const stats = await ProductTypeService.getProductTypeStatistics('type-id');
```

### 3. CategoryService - خدمة الفئات
```typescript
import { CategoryService } from '@/lib/products';

// عرض جميع الفئات
const categories = await CategoryService.getCategories({
  is_active: true,
  parent: null // الفئات الرئيسية فقط
});

// عرض شجرة الفئات
const categoryTree = await CategoryService.getCategoryTree();

// إنشاء فئة جديدة
const newCategory = await CategoryService.createCategory({
  name: { ar: 'أحذية رياضية', en: 'Sports Shoes' },
  parent: 'parent-category-id'
});

// إحصائيات الفئة
const stats = await CategoryService.getCategoryStatistics('category-id');
```

### 4. VariantService - خدمة متغيرات المنتجات
```typescript
import { VariantService } from '@/lib/products';

// عرض متغيرات منتج
const variants = await VariantService.getProductVariants('product-id', {
  color: 'أحمر',
  size: 'M',
  in_stock: true
});

// إنشاء متغير جديد
const newVariant = await VariantService.createVariant('product-id', {
  name: 'أحمر - M',
  options: { color: 'أحمر', size: 'M' },
  price_modifier: '10.00',
  stock_quantity: 25
});

// إنشاء متغيرات متعددة
const bulkVariants = await VariantService.createBulkVariants('product-id', {
  variants: [
    { name: 'أحمر - S', options: { color: 'أحمر', size: 'S' }, stock_quantity: 20 },
    { name: 'أحمر - M', options: { color: 'أحمر', size: 'M' }, stock_quantity: 25 },
    { name: 'أحمر - L', options: { color: 'أحمر', size: 'L' }, stock_quantity: 30 }
  ]
});

// تحديث مخزون المتغير
await VariantService.updateVariantStock('variant-id', {
  stock_quantity: 40,
  reason: 'تحديث المخزون'
});
```

### 5. ImageService - خدمة الصور
```typescript
import { ImageService } from '@/lib/products';

// رفع صورة منتج
const imageResult = await ImageService.uploadProductImage('product-id', imageFile);

// رفع صورة متغير
const variantImage = await VariantService.uploadVariantImage('variant-id', imageFile);

// رفع صورة فئة
const categoryImage = await CategoryService.uploadCategoryImage('category-id', imageFile);
```

## أنواع البيانات الرئيسية

### ProductType
```typescript
interface ProductType {
  id: string;
  name: string;
  display_name: { ar: string; en: string };
  settings: {
    size_options?: string[];
    color_options?: string[];
    material_types?: string[];
    brand_options?: string[];
    storage_options?: string[];
    custom_fields?: CustomField[];
  };
  // ... المزيد من الحقول
}
```

### Product
```typescript
interface Product {
  id: string;
  title: { ar: string; en: string };
  category: Category;
  product_type: ProductType;
  variants?: ProductVariant[];
  images?: ProductImage[];
  // ... المزيد من الحقول
}
```

### ProductVariant
```typescript
interface ProductVariant {
  id: string;
  name: string;
  options: Record<string, string>;
  price_modifier: string;
  stock_quantity: number;
  effective_price: string;
  // ... المزيد من الحقول
}
```

### Category
```typescript
interface Category {
  id: string;
  name: { ar: string; en: string };
  parent?: Category;
  children?: Category[];
  products_count: number;
  // ... المزيد من الحقول
}
```

## الميزات المتقدمة

### 1. دعم اللغات المتعددة
جميع النصوص تدعم العربية والإنجليزية:
```typescript
const product = {
  title: { ar: 'قميص قطني', en: 'Cotton Shirt' },
  description: { ar: 'قميص مريح', en: 'Comfortable shirt' }
};
```

### 2. إدارة المخزون المتقدمة
```typescript
// تتبع المخزون مع التنبيهات
const variant = {
  stock_quantity: 25,
  min_stock_alert: 5,
  is_low_stock: false
};
```

### 3. إدارة الصور
```typescript
// أنواع الصور المدعومة
const imageTypes = ['main', 'gallery', 'variant', 'category'];
```

### 4. الإحصائيات والتحليلات
```typescript
// إحصائيات المنتج
const productStats = await ProductService.getProductStatistics('product-id');

// إحصائيات الفئة
const categoryStats = await CategoryService.getCategoryStatistics('category-id');

// إحصائيات نوع المنتج
const typeStats = await ProductTypeService.getProductTypeStatistics('type-id');
```

## أمثلة عملية

### إنشاء منتج كامل مع متغيرات
```typescript
import { ProductService, VariantService, ProductTypeService } from '@/lib/products';

async function createCompleteProduct() {
  // 1. إنشاء نوع المنتج
  const productType = await ProductTypeService.createProductType({
    name: 'clothing',
    display_name: { ar: 'ملابس', en: 'Clothing' },
    settings: {
      size_options: ['XS', 'S', 'M', 'L', 'XL'],
      color_options: ['أحمر', 'أزرق', 'أخضر', 'أسود', 'أبيض']
    }
  });

  // 2. إنشاء المنتج
  const product = await ProductService.createProduct({
    title: { ar: 'قميص قطني كلاسيك', en: 'Classic Cotton Shirt' },
    price: '89.99',
    category: 'category-id',
    product_type: productType.id
  });

  // 3. إنشاء المتغيرات
  const variants = await VariantService.createBulkVariants(product.id, {
    variants: [
      { name: 'أحمر - M', options: { color: 'أحمر', size: 'M' }, stock_quantity: 25 },
      { name: 'أزرق - L', options: { color: 'أزرق', size: 'L' }, stock_quantity: 30 }
    ]
  });

  return { product, variants };
}
```

### البحث والتصفية المتقدمة
```typescript
// البحث في المنتجات
const searchResults = await ProductService.getProducts({
  search: 'قميص',
  category: 'clothing',
  price_min: 50,
  price_max: 200,
  size: 'M',
  color: 'أحمر',
  is_featured: true,
  in_stock: true,
  ordering: 'price_asc'
});

// البحث في المتغيرات
const variantResults = await VariantService.getProductVariants('product-id', {
  color: 'أحمر',
  size: 'M',
  in_stock: true,
  price_min: 80,
  price_max: 100
});
```

## التحقق من الصحة

جميع الخدمات تتضمن دوال للتحقق من صحة البيانات:

```typescript
// التحقق من اسم نوع المنتج
const isValidName = ProductTypeService.validateProductTypeName('electronics');

// التحقق من إعدادات نوع المنتج
const isValidSettings = ProductTypeService.validateProductTypeSettings(settings);

// التحقق من اسم المتغير
const isValidVariantName = VariantService.validateVariantName('أحمر - M');

// التحقق من خيارات المتغير
const isValidOptions = VariantService.validateVariantOptions({ color: 'أحمر', size: 'M' });
```

## إدارة الأخطاء

جميع الخدمات تتعامل مع الأخطاء بشكل موحد:

```typescript
try {
  const product = await ProductService.createProduct(productData);
  console.log('تم إنشاء المنتج بنجاح:', product);
} catch (error) {
  console.error('خطأ في إنشاء المنتج:', error.message);
  
  // التعامل مع أنواع مختلفة من الأخطاء
  if (error.code === 'DUPLICATE_PRODUCT_SKU') {
    console.error('الكود مكرر، يرجى استخدام كود آخر');
  } else if (error.code === 'CATEGORY_NOT_FOUND') {
    console.error('الفئة غير موجودة');
  }
}
```

## التحديثات المستقبلية

- دعم المزيد من أنواع المنتجات
- إضافة نظام التقييمات والمراجعات
- تحسين نظام البحث والتصفية
- إضافة دعم للوحات التحكم والإحصائيات المتقدمة 