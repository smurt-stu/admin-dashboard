import { AuthService } from './auth';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

// Types
export interface Product {
  id: string;
  title: string; // Changed from { ar: string; en: string } to string
  slug: string;
  category: string;
  category_name: string; // This is already a string, no change needed
  price: string;
  effective_price: number;
  product_type: string;
  main_image: string | null;
  rating: number | null;
  review_count: number;
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  created_at: string;
}

export interface ProductImage {
  id: number;
  product: number;
  image: string;
  alt_text: string;
  is_main: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string; // Changed from { ar: string; en: string } to string
  description?: string;
  parent?: string;
  parent_name?: string; // Added for parent category name
  is_active: boolean;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Analytics {
  id: number;
  product: number;
  views_count: number;
  sales_count: number;
  revenue: number;
  conversion_rate: number;
  date: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export class ProductService {
  // === CATEGORIES ===
  
  static async getCategories(params?: { 
    search?: string; 
    is_active?: boolean; 
    parent?: number;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Category>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getCategory(id: string): Promise<Category> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
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
    return response.json();
  }

  static async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  static async deleteCategory(id: string): Promise<void> {
    await fetch(
      `${BASE_URL}/store/products/categories/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
  }

  static async getCategoryTree(): Promise<Category[]> {
    const response = await fetch(
      `${BASE_URL}/store/products/categories/tree/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getCategoryProducts(id: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/categories/${id}/products/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  // === PRODUCTS ===
  
  static async getProducts(params?: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
    is_bestseller?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getProduct(id: string): Promise<Product> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
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
    return response.json();
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
    return response.json();
  }

  static async deleteProduct(id: string): Promise<void> {
    await fetch(
      `${BASE_URL}/store/products/products/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
  }

  // === SPECIAL PRODUCT ENDPOINTS ===
  
  static async getFeaturedProducts(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/featured/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getBestsellers(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/bestsellers/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getNewArrivals(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/new-arrivals/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getOnSaleProducts(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/on-sale/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
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
    return response.json();
  }

  static async getLowStockProducts(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/low-stock/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async bulkUpdateProducts(products: { id: number; [key: string]: any }[]): Promise<void> {
    await fetch(
      `${BASE_URL}/store/products/products/bulk-update/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ products })
      }
    );
  }

  static async getRelatedProducts(id: number): Promise<Product[]> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/related/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async updateStock(id: number, data: {
    quantity?: number;
    operation?: 'add' | 'subtract' | 'set';
  }): Promise<Product> {
    const response = await fetch(
      `${BASE_URL}/store/products/products/${id}/update-stock/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  // === PRODUCT IMAGES ===
  
  static async getProductImages(productId?: number): Promise<ProductImage[]> {
    const queryParams = productId ? `?product=${productId}` : '';
    const response = await fetch(
      `${BASE_URL}/store/products/images/${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async uploadProductImage(data: FormData): Promise<ProductImage> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(
      `${BASE_URL}/store/products/images/`,
      {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: data
      }
    );
    return response.json();
  }

  static async updateProductImage(id: number, data: Partial<ProductImage>): Promise<ProductImage> {
    const response = await fetch(
      `${BASE_URL}/store/products/images/${id}/`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  static async deleteProductImage(id: number): Promise<void> {
    await fetch(
      `${BASE_URL}/store/products/images/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
  }

  static async setMainImage(id: number): Promise<void> {
    await fetch(
      `${BASE_URL}/store/products/images/${id}/set-main/`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    );
  }

  static async reorderImages(orders: { id: number; order: number }[]): Promise<void> {
    await fetch(
      `${BASE_URL}/store/products/images/reorder/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orders })
      }
    );
  }

  // === DEPARTMENTS ===
  
  static async getDepartments(): Promise<Department[]> {
    const response = await fetch(
      `${BASE_URL}/store/products/departments/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getDepartment(id: number): Promise<Department> {
    const response = await fetch(
      `${BASE_URL}/store/products/departments/${id}/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async createDepartment(data: Partial<Department>): Promise<Department> {
    const response = await fetch(
      `${BASE_URL}/store/products/departments/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  static async updateDepartment(id: number, data: Partial<Department>): Promise<Department> {
    const response = await fetch(
      `${BASE_URL}/store/products/departments/${id}/`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  static async deleteDepartment(id: number): Promise<void> {
    await fetch(
      `${BASE_URL}/store/products/departments/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
  }

  // === ANALYTICS ===
  
  static async getAnalytics(params?: {
    product?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Analytics>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/analytics/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getAnalyticsDashboard(): Promise<{
    total_products: number;
    total_views: number;
    total_sales: number;
    total_revenue: number;
    conversion_rate: number;
  }> {
    const response = await fetch(
      `${BASE_URL}/store/products/analytics/dashboard/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getInventoryReport(): Promise<{
    in_stock: number;
    low_stock: number;
    out_of_stock: number;
  }> {
    const response = await fetch(
      `${BASE_URL}/store/products/analytics/inventory-report/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  // === STORE CORE SETTINGS ===
  
  static async getStoreSettings(): Promise<any> {
    const response = await fetch(
      `${BASE_URL}/store/core/settings/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }

  static async getStoreConstants(): Promise<any> {
    const response = await fetch(
      `${BASE_URL}/store/core/constants/`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }
} 