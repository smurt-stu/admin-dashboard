// Products Module - تجميع جميع خدمات المنتجات

// Export all types
export * from './types';

// Export all utilities (excluding conflicting functions)
export { 
  getAuthHeaders,
  handleApiError,
  buildQueryParams,
  formatPrice,
  getStockStatus,
  generateSlug,
  getProductTypeDisplay,
  getConditionDisplay,
  getLanguageDisplay,
  isProductOnSale,
  calculateDiscountPercentage,
  getProductStatusBadges,
  validateProductData,
  createFormData
} from './utils';

// Export all services
export { ProductService } from './productService';
export { ProductTypeService } from './productTypeService';
export { CategoryService } from './categoryService';
export { VariantService } from './variantService';
export { ImageService } from './imageService';
export { AnalyticsService } from './analyticsService';

// Export multilingual utilities (excluding conflicting functions)
export type { 
  MultilingualField,
  MultilingualData
} from '../multilingualUtils';

export { 
  createMultilingualField,
  getMultilingualDisplay,
  convertFormDataToAPI,
  convertAPIToFormData,
  createProductData
} from '../multilingualUtils';

// Re-export for backward compatibility
export { ProductService as default } from './productService'; 