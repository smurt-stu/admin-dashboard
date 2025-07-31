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
export { ProductImageService } from './imageService';
export { AnalyticsService } from './analyticsService';

// Create ImageService alias for backward compatibility
export const ImageService = {
  // Alias methods to match expected interface
  uploadProductImage: async (imageData: any) => {
    const { ProductImageService } = await import('./imageService');
    return ProductImageService.uploadImage(
      imageData.product,
      imageData.image,
      {
        imageType: imageData.image_type,
        altText: imageData.alt_text,
        caption: imageData.caption,
        displayOrder: imageData.sort_order,
        isPrimary: imageData.image_type === 'main'
      }
    );
  },
  
  deleteProductImage: async (imageId: number) => {
    const { ProductImageService } = await import('./imageService');
    return ProductImageService.deleteImage(imageId.toString());
  },
  
  setMainImage: async (imageId: number) => {
    const { ProductImageService } = await import('./imageService');
    return ProductImageService.setMainImage(imageId.toString());
  },
  
  getProductImages: async (productId: string) => {
    const { ProductImageService } = await import('./imageService');
    return ProductImageService.getProductImages(productId);
  },
  
  validateProductExists: async (productId: string) => {
    // This method doesn't exist in ProductImageService, so we'll create a simple implementation
    try {
      const response = await fetch(`https://smart-ai-api.onrender.com/api/v1/store/products/${productId}/`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },
  
  uploadImageWithProduct: async (productData: any, imageFile: File) => {
    const { ProductImageService } = await import('./imageService');
    return ProductImageService.uploadImage(
      productData.id,
      imageFile,
      {
        imageType: 'main',
        altText: {
          ar: productData.name?.ar || 'صورة المنتج',
          en: productData.name?.en || 'Product image'
        },
        isPrimary: true
      }
    );
  }
};

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