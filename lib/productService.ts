// Legacy Product Service - للتوافق مع الكود القديم
// يرجى استخدام lib/products/ بدلاً من هذا الملف

import { 
  ProductService as NewProductService,
  CategoryService,
  ImageService,
  AnalyticsService,
  Product,
  Category,
  ProductImage,
  Department,
  Analytics,
  PaginatedResponse
} from './products';

// Re-export for backward compatibility
export type {
  Product,
  Category,
  ProductImage,
  Department,
  Analytics,
  PaginatedResponse
};

// Legacy class for backward compatibility
export class ProductService extends NewProductService {
  // This class extends the new ProductService to maintain backward compatibility
  // All methods are inherited from the new service
}

// Export other services for convenience
export { CategoryService, ImageService, AnalyticsService };

// Legacy exports for backward compatibility
export * from './products'; 