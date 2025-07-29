// ProductType Service - خدمة إدارة أنواع المنتجات

import { 
  ProductType, 
  PaginatedResponse, 
  ProductTypeFilters,
  ProductTypeStatistics
} from './types';
import { getAuthHeaders, handleApiError, buildQueryParams } from './utils';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export class ProductTypeService {
  // === PRODUCT TYPES ===
  
  static async getProductTypes(params?: ProductTypeFilters): Promise<PaginatedResponse<ProductType>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getProductType(id: string): Promise<ProductType> {
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/${id}/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async createProductType(data: Partial<ProductType>): Promise<ProductType> {
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async updateProductType(id: string, data: Partial<ProductType>): Promise<ProductType> {
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/${id}/`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async deleteProductType(id: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
    if (!response.ok) {
      throw new Error('فشل في حذف نوع المنتج');
    }
  }

  // === STATISTICS ===
  
  static async getProductTypeStatistics(id: string): Promise<ProductTypeStatistics> {
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/${id}/statistics/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  // === SETTINGS ===
  
  static async getProductTypeSettings(id: string): Promise<ProductType['settings']> {
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/${id}/settings/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async updateProductTypeSettings(id: string, settings: ProductType['settings']): Promise<ProductType['settings']> {
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/${id}/settings/`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
      }
    );
    return handleApiError(response);
  }

  // === HELPER METHODS ===
  
  static async getProductTypesWithStatistics(): Promise<PaginatedResponse<ProductType>> {
    const queryParams = new URLSearchParams({ include_statistics: 'true' });
    
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getActiveProductTypes(): Promise<ProductType[]> {
    const queryParams = new URLSearchParams({ is_active: 'true' });
    
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  static async getProductTypesByCategory(categoryId: string): Promise<ProductType[]> {
    const queryParams = new URLSearchParams({ category: categoryId });
    
    const response = await fetch(
      `${BASE_URL}/store/products/product-types/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  // === VALIDATION METHODS ===
  
  static validateProductTypeName(name: string): boolean {
    return name.length >= 2 && name.length <= 50;
  }

  static validateProductTypeSettings(settings: ProductType['settings']): boolean {
    if (!settings) return false;
    
    // التحقق من وجود خيارات على الأقل
    const hasOptions = Boolean(
      (settings.size_options && settings.size_options.length > 0) || 
      (settings.color_options && settings.color_options.length > 0) || 
      (settings.material_types && settings.material_types.length > 0) ||
      (settings.brand_options && settings.brand_options.length > 0) ||
      (settings.storage_options && settings.storage_options.length > 0)
    );
    
    return hasOptions;
  }

  // === DEFAULT PRODUCT TYPES ===
  
  static getDefaultProductTypes(): Partial<ProductType>[] {
    return [
      {
        name: 'clothing',
        display_name: {
          ar: 'ملابس',
          en: 'Clothing'
        },
        description: 'الملابس والأنسجة',
        icon: 'fas fa-tshirt',
        color: '#e91e63',
        is_digital: false,
        requires_shipping: true,
        track_stock: true,
        has_variants: true,
        template_name: 'product_clothing',
        settings: {
          size_options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          color_options: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود', 'أبيض', 'رمادي', 'بني'],
          material_types: ['قطن', 'بوليستر', 'حرير', 'صوف', 'دينيم']
        },
        display_order: 1
      },
      {
        name: 'shoes',
        display_name: {
          ar: 'أحذية',
          en: 'Shoes'
        },
        description: 'الأحذية والجزم',
        icon: 'fas fa-shoe-prints',
        color: '#ff9800',
        is_digital: false,
        requires_shipping: true,
        track_stock: true,
        has_variants: true,
        template_name: 'product_shoes',
        settings: {
          size_options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
          color_options: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود', 'أبيض', 'رمادي', 'بني'],
          material_types: ['جلد', 'قماش', 'مطاط', 'بلاستيك']
        },
        display_order: 2
      },
      {
        name: 'books',
        display_name: {
          ar: 'كتب',
          en: 'Books'
        },
        description: 'الكتب والمطبوعات',
        icon: 'fas fa-book',
        color: '#4caf50',
        is_digital: false,
        requires_shipping: true,
        track_stock: true,
        has_variants: false,
        template_name: 'product_books',
        settings: {
          material_types: ['ورقي', 'إلكتروني'],
          brand_options: ['دار النشر الأولى', 'دار النشر الثانية', 'دار النشر الثالثة']
        },
        display_order: 3
      },
      {
        name: 'electronics',
        display_name: {
          ar: 'إلكترونيات',
          en: 'Electronics'
        },
        description: 'الأجهزة الإلكترونية والكهربائية',
        icon: 'fas fa-mobile-alt',
        color: '#2196f3',
        is_digital: false,
        requires_shipping: true,
        track_stock: true,
        has_variants: true,
        template_name: 'product_electronics',
        settings: {
          brand_options: ['Apple', 'Samsung', 'Sony', 'LG', 'Huawei', 'Xiaomi'],
          color_options: ['أحمر', 'أزرق', 'أسود', 'أبيض', 'ذهبي', 'فضي'],
          storage_options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']
        },
        display_order: 4
      }
    ];
  }
} 