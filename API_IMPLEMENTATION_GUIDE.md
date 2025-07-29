# دليل تطبيق API نظام المنتجات الشامل

## نظرة عامة

تم تطبيق وثائق API نظام المنتجات الشامل على المشروع بنجاح. هذا الدليل يوضح كيفية استخدام الخدمات المحدثة والوظائف الجديدة.

## الملفات المحدثة

### 1. أنواع البيانات المحدثة (`lib/products/types.ts`)

تم تحديث أنواع البيانات لتتوافق مع الوثائق الجديدة:

```typescript
// أنواع جديدة مضافة
export interface ProductType {
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

export interface ProductVariant {
  id: string;
  name: string;
  options: Record<string, string>;
  price_modifier: string;
  stock_quantity: number;
  effective_price: string;
  // ... المزيد من الحقول
}

export interface CustomField {
  name: string;
  label: { ar: string; en: string };
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'date';
  required: boolean;
  options?: string[];
}
```

### 2. الخدمات الجديدة

#### أ. ProductTypeService (`lib/products/productTypeService.ts`)

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

#### ب. VariantService (`lib/products/variantService.ts`)

```typescript
import { VariantService } from '@/lib/products';

// عرض متغيرات منتج
const variants = await VariantService.getProductVariants('product-id', {
  color: 'أحمر',
  size: 'M',
  in_stock: true
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

### 3. الخدمات المحدثة

#### أ. CategoryService المحدث

```typescript
import { CategoryService } from '@/lib/products';

// عرض شجرة الفئات
const categoryTree = await CategoryService.getCategoryTree();

// عرض الفئات الرئيسية فقط
const parentCategories = await CategoryService.getParentCategories();

// إحصائيات الفئة
const stats = await CategoryService.getCategoryStatistics('category-id');

// رفع صورة الفئة
const imageResult = await CategoryService.uploadCategoryImage('category-id', imageFile);
```

#### ب. ProductService المحدث

```typescript
import { ProductService } from '@/lib/products';

// البحث المتقدم في المنتجات
const products = await ProductService.getProducts({
  search: 'قميص',
  category: 'clothing',
  product_type: 'electronics',
  price_min: 50,
  price_max: 200,
  size: 'M',
  color: 'أحمر',
  brand: 'Fashion Brand',
  is_featured: true,
  is_on_sale: true,
  in_stock: true,
  has_variants: true,
  has_images: true,
  tags: 'ملابس,أزياء',
  ordering: 'price_asc',
  lang: 'ar'
});
```

## الميزات الجديدة المطبقة

### 1. دعم اللغات المتعددة

جميع النصوص تدعم العربية والإنجليزية:

```typescript
const product = {
  title: { ar: 'قميص قطني كلاسيك', en: 'Classic Cotton Shirt' },
  description: { ar: 'قميص مريح وأنيق', en: 'Comfortable and elegant shirt' },
  meta_title: { ar: 'قميص قطني - متجر الأزياء', en: 'Cotton Shirt - Fashion Store' }
};
```

### 2. إدارة المخزون المتقدمة

```typescript
const variant = {
  stock_quantity: 25,
  min_stock_alert: 5,
  is_in_stock: true,
  is_low_stock: false,
  effective_price: '99.99'
};
```

### 3. إدارة الصور المحسنة

```typescript
const image = {
  image: 'products/shirt-main.jpg',
  image_type: 'main', // main, gallery, variant, category
  alt_text: { ar: 'صورة قميص قطني', en: 'Cotton shirt image' },
  caption: { ar: 'قميص قطني كلاسيك', en: 'Classic cotton shirt' },
  is_primary: true,
  display_order: 1
};
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

### مثال 1: إنشاء منتج كامل مع متغيرات

```typescript
import { 
  ProductService, 
  VariantService, 
  ProductTypeService,
  CategoryService 
} from '@/lib/products';

async function createCompleteProduct() {
  try {
    // 1. إنشاء نوع المنتج
    const productType = await ProductTypeService.createProductType({
      name: 'clothing',
      display_name: { ar: 'ملابس', en: 'Clothing' },
      description: 'الملابس والأنسجة',
      icon: 'fas fa-tshirt',
      color: '#e91e63',
      is_digital: false,
      requires_shipping: true,
      track_stock: true,
      has_variants: true,
      settings: {
        size_options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        color_options: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود', 'أبيض', 'رمادي', 'بني'],
        material_types: ['قطن', 'بوليستر', 'حرير', 'صوف', 'دينيم']
      },
      display_order: 1
    });

    // 2. إنشاء الفئة
    const category = await CategoryService.createCategory({
      name: { ar: 'قمصان', en: 'Shirts' },
      description: { ar: 'قمصان رجالية', en: 'Men\'s shirts' },
      icon: 'fas fa-tshirt',
      parent: 'parent-category-id',
      display_order: 1
    });

    // 3. إنشاء المنتج
    const product = await ProductService.createProduct({
      title: { ar: 'قميص قطني كلاسيك', en: 'Classic Cotton Shirt' },
      description: { ar: 'قميص قطني مريح وأنيق', en: 'Comfortable and elegant cotton shirt' },
      short_description: { ar: 'قميص قطني 100%', en: '100% cotton shirt' },
      sku: 'SHIRT-001',
      brand: 'Fashion Brand',
      price: '89.99',
      compare_price: '120.00',
      cost_price: '45.00',
      stock_quantity: 150,
      min_stock_alert: 10,
      weight: '0.25',
      dimensions: {
        length: '70',
        width: '50',
        height: '2'
      },
      is_featured: true,
      is_on_sale: true,
      tags: 'ملابس,أزياء,عصرية',
      category: category.id,
      product_type: productType.id,
      settings: {
        allow_reviews: true,
        allow_ratings: true,
        show_stock: true
      }
    });

    // 4. إنشاء المتغيرات
    const variants = await VariantService.createBulkVariants(product.id, {
      variants: [
        {
          name: 'أحمر - S',
          options: { color: 'أحمر', size: 'S' },
          price_modifier: '-5.00',
          stock_quantity: 20,
          min_stock_alert: 5
        },
        {
          name: 'أحمر - M',
          options: { color: 'أحمر', size: 'M' },
          price_modifier: '0.00',
          stock_quantity: 25,
          min_stock_alert: 5
        },
        {
          name: 'أحمر - L',
          options: { color: 'أحمر', size: 'L' },
          price_modifier: '10.00',
          stock_quantity: 30,
          min_stock_alert: 5
        }
      ]
    });

    console.log('تم إنشاء المنتج بنجاح:', {
      product: product.id,
      variants: variants.created_count,
      type: productType.name,
      category: category.name.ar
    });

    return { product, variants, productType, category };

  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error.message);
    throw error;
  }
}
```

### مثال 2: البحث والتصفية المتقدمة

```typescript
// البحث في المنتجات
const searchResults = await ProductService.getProducts({
  search: 'قميص',
  category: 'clothing',
  product_type: 'electronics',
  price_min: 50,
  price_max: 200,
  size: 'M',
  color: 'أحمر',
  brand: 'Fashion Brand',
  is_featured: true,
  is_on_sale: true,
  in_stock: true,
  has_variants: true,
  has_images: true,
  tags: 'ملابس,أزياء',
  ordering: 'price_asc',
  lang: 'ar',
  page: 1,
  page_size: 20
});

console.log(`تم العثور على ${searchResults.pagination.total_count} منتج`);
console.log(`الصفحة ${searchResults.pagination.page} من ${searchResults.pagination.total_pages}`);

// البحث في المتغيرات
const variantResults = await VariantService.getProductVariants('product-id', {
  color: 'أحمر',
  size: 'M',
  in_stock: true,
  price_min: 80,
  price_max: 100,
  is_active: true,
  has_image: true,
  ordering: 'display_order_asc'
});
```

### مثال 3: إدارة المخزون

```typescript
// تحديث مخزون المنتج
await ProductService.updateStock('product-id', {
  stock_quantity: 200,
  min_stock_alert: 15,
  reason: 'تحديث المخزون'
});

// تحديث مخزون المتغير
await VariantService.updateVariantStock('variant-id', {
  stock_quantity: 40,
  min_stock_alert: 8,
  reason: 'تحديث المخزون'
});

// عرض المنتجات منخفضة المخزون
const lowStockProducts = await ProductService.getLowStockProducts({
  page: 1,
  page_size: 50
});

// عرض المتغيرات منخفضة المخزون
const lowStockVariants = await VariantService.getLowStockVariants('product-id');
```

### مثال 4: إدارة الصور

```typescript
import { ImageService } from '@/lib/products';

// رفع صورة المنتج
const productImage = await ImageService.uploadProductImage('product-id', imageFile);

// رفع صورة المتغير
const variantImage = await VariantService.uploadVariantImage('variant-id', imageFile);

// رفع صورة الفئة
const categoryImage = await CategoryService.uploadCategoryImage('category-id', imageFile);
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

// التحقق من اسم الفئة
const isValidCategoryName = CategoryService.validateCategoryName({
  ar: 'ملابس رجالية',
  en: "Men's Clothing"
});

// التحقق من slug الفئة
const isValidSlug = CategoryService.validateCategorySlug('mens-clothing');
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
  switch (error.code) {
    case 'DUPLICATE_PRODUCT_SKU':
      console.error('الكود مكرر، يرجى استخدام كود آخر');
      break;
    case 'CATEGORY_NOT_FOUND':
      console.error('الفئة غير موجودة');
      break;
    case 'PRODUCT_TYPE_NOT_FOUND':
      console.error('نوع المنتج غير موجود');
      break;
    case 'INVALID_PRICE':
      console.error('السعر غير صحيح');
      break;
    case 'INVALID_OPTIONS':
      console.error('الخيارات غير صحيحة');
      break;
    default:
      console.error('خطأ غير معروف:', error.message);
  }
}
```

## التحديثات المستقبلية

1. **إضافة خدمة الحقول المخصصة** - ProductFieldService
2. **تحسين نظام البحث** - إضافة البحث الدلالي
3. **إضافة نظام التقييمات** - ProductReviewService
4. **تحسين الأداء** - إضافة التخزين المؤقت
5. **إضافة المزيد من التحليلات** - تحليلات متقدمة

## الخلاصة

تم تطبيق وثائق API نظام المنتجات الشامل بنجاح على المشروع. جميع الخدمات الجديدة متاحة للاستخدام وتدعم:

- ✅ دعم اللغات المتعددة (العربية والإنجليزية)
- ✅ إدارة أنواع المنتجات مع إعدادات مخصصة
- ✅ إدارة المتغيرات المتقدمة
- ✅ إدارة الفئات الهرمية
- ✅ إدارة الصور المحسنة
- ✅ الإحصائيات والتحليلات
- ✅ التحقق من صحة البيانات
- ✅ معالجة الأخطاء الشاملة
- ✅ البحث والتصفية المتقدمة

جميع الخدمات جاهزة للاستخدام في واجهات المستخدم والوظائف الإدارية. 