// Product Service - الخدمة الأساسية للمنتجات

import { 
  Product, 
  PaginatedResponse, 
  ProductFilters,
  StockUpdateData,
  BulkUpdateData
} from './types';
import { getAuthHeaders, handleApiError, buildQueryParams } from './utils';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

// دالة لتحديد الحقول التي تم تعديلها فقط
function getChangedFields(originalData: Partial<Product>, newData: Partial<Product>): Partial<Product> {
  const changedFields: Partial<Product> = {};
  
  for (const [key, newValue] of Object.entries(newData)) {
    const originalValue = originalData[key as keyof Product];
    
    // معالجة خاصة للحقول الحساسة
    if (key === 'main_image') {
      // لا نرسل main_image إذا كان URL وليس ملف جديد
      if (newValue && typeof newValue === 'string' && newValue.startsWith('http')) {
        continue; // تخطي هذا الحقل
      }
    }
    
    if (key === 'tags') {
      // تحويل tags إلى string إذا كان array
      const newTagsString = Array.isArray(newValue) ? newValue.join(', ') : newValue;
      const originalTagsString = Array.isArray(originalValue) ? originalValue.join(', ') : originalValue;
      
      if (newTagsString !== originalTagsString) {
        changedFields[key as keyof Product] = newTagsString as any;
      }
      continue;
    }
    
    // مقارنة القيم لتحديد ما إذا كان الحقل قد تغير
    if (JSON.stringify(newValue) !== JSON.stringify(originalValue)) {
      changedFields[key as keyof Product] = newValue as any;
    }
  }
  
  return changedFields;
}

export class ProductService {
  // === PRODUCTS ===
  
  static async getProducts(params?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getProduct(id: string): Promise<Product> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async createProduct(data: Partial<Product>): Promise<Product> {
    console.log('Sending product data:', data);
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`فشل في إنشاء المنتج: ${response.status} - ${errorText}`);
    }
    
    return handleApiError(response);
  }

  static async updateProduct(id: string, data: Partial<Product>, originalData?: Partial<Product>): Promise<Product> {
    let updateData = data;
    
    // إذا تم توفير البيانات الأصلية، نرسل فقط الحقول المعدلة
    if (originalData) {
      updateData = getChangedFields(originalData, data);
      console.log('Changed fields only:', updateData);
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      }
    );
    return handleApiError(response);
  }

  static async deleteProduct(id: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
    if (!response.ok) {
      throw new Error('فشل في حذف المنتج');
    }
  }

  // === SPECIAL PRODUCT ENDPOINTS ===
  
  static async getFeaturedProducts(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/featured/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getBestsellers(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/bestsellers/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getNewArrivals(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/new-arrivals/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getOnSaleProducts(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/on-sale/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async searchProducts(query: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams({ q: query });
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/search/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getLowStockProducts(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/low-stock/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async bulkUpdateProducts(productIds: number[], updates: Partial<Product>): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/bulk-update/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          product_ids: productIds,
          updates: updates
        })
      }
    );
    return handleApiError(response);
  }

  static async getRelatedProducts(id: number): Promise<Product[]> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/related/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async updateStock(id: number, data: StockUpdateData): Promise<Product> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/update-stock/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }
} 