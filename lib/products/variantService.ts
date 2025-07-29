// ProductVariant Service - خدمة إدارة متغيرات المنتجات

import { 
  ProductVariant, 
  PaginatedResponse, 
  VariantFormData,
  BulkVariantData,
  StockUpdateData
} from './types';
import { getAuthHeaders, handleApiError, buildQueryParams } from './utils';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export class VariantService {
  // === VARIANTS ===
  
  static async getProductVariants(productId: string, params?: {
    color?: string;
    size?: string;
    in_stock?: boolean;
    price_min?: number;
    price_max?: number;
    is_active?: boolean;
    has_image?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<ProductVariant>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/${productId}/variants/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getVariant(id: string): Promise<ProductVariant> {
    const response = await fetch(
      `${BASE_URL}/store/products/variants/${id}/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async createVariant(productId: string, data: VariantFormData): Promise<ProductVariant> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${productId}/variants/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async updateVariant(id: string, data: Partial<VariantFormData>): Promise<ProductVariant> {
    const response = await fetch(
      `${BASE_URL}/store/products/variants/${id}/`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async deleteVariant(id: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/variants/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
    if (!response.ok) {
      throw new Error('فشل في حذف المتغير');
    }
  }

  // === BULK OPERATIONS ===
  
  static async createBulkVariants(productId: string, data: BulkVariantData): Promise<{
    created_count: number;
    variants: ProductVariant[];
  }> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${productId}/variants/bulk/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async reorderVariants(productId: string, variants: Array<{
    id: string;
    display_order: number;
  }>): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${productId}/variants/reorder/`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ variants })
      }
    );
    if (!response.ok) {
      throw new Error('فشل في إعادة ترتيب المتغيرات');
    }
  }

  // === STOCK MANAGEMENT ===
  
  static async updateVariantStock(id: string, data: StockUpdateData): Promise<{
    old_stock: number;
    new_stock: number;
    difference: number;
  }> {
    const response = await fetch(
      `${BASE_URL}/store/products/variants/${id}/stock/`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  // === IMAGE MANAGEMENT ===
  
  static async uploadVariantImage(id: string, imageFile: File): Promise<{
    image_url: string;
  }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(
      `${BASE_URL}/store/products/variants/${id}/upload-image/`,
      {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          // لا نضع Content-Type هنا لأن FormData يضعه تلقائياً
        },
        body: formData
      }
    );
    return handleApiError(response);
  }

  // === STATISTICS ===
  
  static async getVariantStatistics(id: string): Promise<{
    total_sales: number;
    total_revenue: number;
    average_rating: number;
    reviews_count: number;
    stock_status: {
      current_stock: number;
      reserved_stock: number;
      available_stock: number;
      is_low_stock: boolean;
    };
    sales_trend: Array<{
      date: string;
      sales: number;
    }>;
  }> {
    const response = await fetch(
      `${BASE_URL}/store/products/variants/${id}/statistics/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  // === HELPER METHODS ===
  
  static async getLowStockVariants(productId: string): Promise<ProductVariant[]> {
    const queryParams = new URLSearchParams({ in_stock: 'true', is_low_stock: 'true' });
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/${productId}/variants/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  static async getActiveVariants(productId: string): Promise<ProductVariant[]> {
    const queryParams = new URLSearchParams({ is_active: 'true' });
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/${productId}/variants/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  // === VALIDATION METHODS ===
  
  static validateVariantName(name: string): boolean {
    return name.length >= 2 && name.length <= 100;
  }

  static validateVariantOptions(options: Record<string, string>): boolean {
    return Object.keys(options).length > 0 && 
           Object.values(options).every(value => value && value.length > 0);
  }

  static validatePriceModifier(priceModifier: string): boolean {
    const num = parseFloat(priceModifier);
    return !isNaN(num) && num >= -1000 && num <= 10000;
  }

  static validateStockQuantity(quantity: number): boolean {
    return quantity >= 0 && quantity <= 100000;
  }

  // === UTILITY METHODS ===
  
  static generateVariantName(options: Record<string, string>): string {
    return Object.values(options).join(' - ');
  }

  static generateVariantSKU(productSKU: string, options: Record<string, string>): string {
    const optionValues = Object.values(options).map(value => 
      value.replace(/\s+/g, '').toUpperCase()
    );
    return `${productSKU}-${optionValues.join('-')}`;
  }

  static calculateEffectivePrice(basePrice: number, priceModifier: number): number {
    return basePrice + priceModifier;
  }

  // === DEFAULT VARIANTS ===
  
  static getDefaultClothingVariants(): VariantFormData[] {
    const colors = ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود', 'أبيض'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const variants: VariantFormData[] = [];
    
    colors.forEach(color => {
      sizes.forEach(size => {
        variants.push({
          name: `${color} - ${size}`,
          options: { color, size },
          price_modifier: '0.00',
          stock_quantity: 25,
          min_stock_alert: 5,
          settings: {
            is_active: true,
            allow_purchase: true
          }
        });
      });
    });
    
    return variants;
  }

  static getDefaultShoesVariants(): VariantFormData[] {
    const colors = ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود', 'أبيض'];
    const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
    const variants: VariantFormData[] = [];
    
    colors.forEach(color => {
      sizes.forEach(size => {
        variants.push({
          name: `${color} - ${size}`,
          options: { color, size },
          price_modifier: '0.00',
          stock_quantity: 20,
          min_stock_alert: 3,
          settings: {
            is_active: true,
            allow_purchase: true
          }
        });
      });
    });
    
    return variants;
  }

  static getDefaultElectronicsVariants(): VariantFormData[] {
    const colors = ['أحمر', 'أزرق', 'أسود', 'أبيض', 'ذهبي', 'فضي'];
    const storage = ['32GB', '64GB', '128GB', '256GB', '512GB'];
    const variants: VariantFormData[] = [];
    
    colors.forEach(color => {
      storage.forEach(storageSize => {
        variants.push({
          name: `${color} - ${storageSize}`,
          options: { color, storage: storageSize },
          price_modifier: '0.00',
          stock_quantity: 15,
          min_stock_alert: 2,
          settings: {
            is_active: true,
            allow_purchase: true
          }
        });
      });
    });
    
    return variants;
  }
} 