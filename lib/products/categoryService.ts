// Category Service - خدمة التصنيفات

import { 
  Category, 
  PaginatedResponse, 
  CategoryFilters,
  Product,
  CategoryStatistics
} from './types';
import { getAuthHeaders, handleApiError, buildQueryParams } from './utils';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export class CategoryService {
  // === CATEGORIES ===
  
  static async getCategories(params?: CategoryFilters): Promise<PaginatedResponse<Category>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getCategory(id: string): Promise<Category> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async deleteCategory(id: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
    if (!response.ok) {
      throw new Error('فشل في حذف التصنيف');
    }
  }

  // === STATISTICS ===
  
  static async getCategoryStatistics(id: string): Promise<CategoryStatistics> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/statistics/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  // === TREE OPERATIONS ===
  
  static async getCategoryTree(): Promise<Category[]> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/tree/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getParentCategories(): Promise<Category[]> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/parents/`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  // === REORDERING ===
  
  static async reorderCategories(categories: Array<{
    id: string;
    display_order: number;
  }>): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/reorder/`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ categories })
      }
    );
    if (!response.ok) {
      throw new Error('فشل في إعادة ترتيب الفئات');
    }
  }

  // === IMAGE MANAGEMENT ===
  
  static async uploadCategoryImage(id: string, imageFile: File): Promise<{
    image_url: string;
  }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/upload-image/`,
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

  // === PRODUCTS ===
  
  static async getCategoryProducts(id: string, params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
    search?: string;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/products/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  // === HELPER METHODS ===
  
  static async getActiveCategories(): Promise<Category[]> {
    const queryParams = new URLSearchParams({ is_active: 'true' });
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  static async getCategoriesWithProducts(): Promise<Category[]> {
    const queryParams = new URLSearchParams({ has_products: 'true' });
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  static async getCategoriesByProductType(productTypeId: string): Promise<Category[]> {
    const queryParams = new URLSearchParams({ product_type: productTypeId });
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleApiError(response);
    return data.results;
  }

  // === VALIDATION METHODS ===
  
  static validateCategoryName(name: { ar: string; en: string }): boolean {
    return Boolean(
      (name.ar && name.ar.length >= 2 && name.ar.length <= 100) &&
      (name.en && name.en.length >= 2 && name.en.length <= 100)
    );
  }

  static validateCategorySlug(slug: string): boolean {
    return Boolean(/^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 50);
  }

  // === UTILITY METHODS ===
  
  static generateCategorySlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static getCategoryPath(category: Category, categories: Category[]): Category[] {
    const path: Category[] = [];
    let currentCategory = category;
    
    while (currentCategory) {
      path.unshift(currentCategory);
      if (currentCategory.parent) {
        currentCategory = categories.find(c => c.id === currentCategory.parent?.id) || currentCategory.parent;
      } else {
        break;
      }
    }
    
    return path;
  }

  // === DEFAULT CATEGORIES ===
  
  static getDefaultCategories(): Partial<Category>[] {
    return [
      {
        name: {
          ar: 'ملابس رجالية',
          en: "Men's Clothing"
        },
        description: {
          ar: 'ملابس للرجال',
          en: 'Clothing for men'
        },
        icon: 'fas fa-male',
        display_order: 1,
        meta_title: {
          ar: 'ملابس رجالية - متجر الأزياء',
          en: "Men's Clothing - Fashion Store"
        },
        meta_description: {
          ar: 'أفضل الملابس الرجالية العصرية',
          en: 'Best modern men\'s clothing'
        }
      },
      {
        name: {
          ar: 'ملابس نسائية',
          en: "Women's Clothing"
        },
        description: {
          ar: 'ملابس للنساء',
          en: 'Clothing for women'
        },
        icon: 'fas fa-female',
        display_order: 2,
        meta_title: {
          ar: 'ملابس نسائية - متجر الأزياء',
          en: "Women's Clothing - Fashion Store"
        },
        meta_description: {
          ar: 'أفضل الملابس النسائية العصرية',
          en: 'Best modern women\'s clothing'
        }
      },
      {
        name: {
          ar: 'أحذية',
          en: 'Shoes'
        },
        description: {
          ar: 'أحذية وجزم',
          en: 'Shoes and footwear'
        },
        icon: 'fas fa-shoe-prints',
        display_order: 3,
        meta_title: {
          ar: 'أحذية - متجر الأزياء',
          en: 'Shoes - Fashion Store'
        },
        meta_description: {
          ar: 'أفضل الأحذية المريحة والأنيقة',
          en: 'Best comfortable and elegant shoes'
        }
      },
      {
        name: {
          ar: 'إلكترونيات',
          en: 'Electronics'
        },
        description: {
          ar: 'الأجهزة الإلكترونية والكهربائية',
          en: 'Electronic and electrical devices'
        },
        icon: 'fas fa-mobile-alt',
        display_order: 4,
        meta_title: {
          ar: 'إلكترونيات - متجر الأزياء',
          en: 'Electronics - Fashion Store'
        },
        meta_description: {
          ar: 'أفضل الأجهزة الإلكترونية الحديثة',
          en: 'Best modern electronic devices'
        }
      }
    ];
  }
} 