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
    const response = await fetch(
      `${BASE_URL}/store/products/products/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
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