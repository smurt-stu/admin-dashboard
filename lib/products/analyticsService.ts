// Analytics Service - خدمة تحليلات المنتجات

import { 
  Analytics, 
  PaginatedResponse, 
  AnalyticsFilters,
  AnalyticsDashboard,
  InventoryReport
} from './types';
import { getAuthHeaders, handleApiError, buildQueryParams } from './utils';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export class AnalyticsService {
  // === ANALYTICS ===
  
  static async getAnalytics(params?: AnalyticsFilters): Promise<PaginatedResponse<Analytics>> {
    const queryParams = buildQueryParams(params || {});
    
    const response = await fetch(
      `${BASE_URL}/store/products/analytics/?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
    const response = await fetch(
      `${BASE_URL}/store/products/analytics/dashboard/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async getInventoryReport(): Promise<InventoryReport> {
    const response = await fetch(
      `${BASE_URL}/store/products/analytics/inventory-report/`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  // === PRODUCT PERFORMANCE ===
  
  static async getProductPerformance(productId: number, dateFrom?: string, dateTo?: string): Promise<Analytics[]> {
    const params: AnalyticsFilters = {
      product: productId,
      date_from: dateFrom,
      date_to: dateTo
    };
    
    const response = await this.getAnalytics(params);
    return response.results;
  }

  static async getTopPerformingProducts(limit: number = 10): Promise<Analytics[]> {
    const params: AnalyticsFilters = {
      page_size: limit,
      ordering: '-revenue'
    };
    
    const response = await this.getAnalytics(params);
    return response.results;
  }

  static async getLowPerformingProducts(limit: number = 10): Promise<Analytics[]> {
    const params: AnalyticsFilters = {
      page_size: limit,
      ordering: 'revenue'
    };
    
    const response = await this.getAnalytics(params);
    return response.results;
  }

  // === SALES ANALYTICS ===
  
  static async getSalesAnalytics(dateFrom?: string, dateTo?: string): Promise<{
    total_sales: number;
    total_revenue: number;
    average_order_value: number;
    conversion_rate: number;
  }> {
    const params: AnalyticsFilters = {
      date_from: dateFrom,
      date_to: dateTo
    };
    
    const response = await this.getAnalytics(params);
    const analytics = response.results;
    
    const totalSales = analytics.reduce((sum, item) => sum + item.sales_count, 0);
    const totalRevenue = analytics.reduce((sum, item) => sum + item.revenue, 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const conversionRate = analytics.reduce((sum, item) => sum + item.conversion_rate, 0) / analytics.length;
    
    return {
      total_sales: totalSales,
      total_revenue: totalRevenue,
      average_order_value: averageOrderValue,
      conversion_rate: conversionRate
    };
  }

  // === INVENTORY ANALYTICS ===
  
  static async getInventoryAnalytics(): Promise<{
    total_products: number;
    in_stock: number;
    low_stock: number;
    out_of_stock: number;
    stock_value: number;
  }> {
    const inventoryReport = await this.getInventoryReport();
    const dashboard = await this.getAnalyticsDashboard();
    
    return {
      total_products: dashboard.total_products,
      in_stock: inventoryReport.in_stock,
      low_stock: inventoryReport.low_stock,
      out_of_stock: inventoryReport.out_of_stock,
      stock_value: 0 // This would need to be calculated based on product prices
    };
  }

  // === TREND ANALYTICS ===
  
  static async getTrendAnalytics(days: number = 30): Promise<{
    date: string;
    views: number;
    sales: number;
    revenue: number;
  }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const params: AnalyticsFilters = {
      date_from: startDate.toISOString().split('T')[0],
      date_to: endDate.toISOString().split('T')[0],
      page_size: 1000 // Get all data for the period
    };
    
    const response = await this.getAnalytics(params);
    const analytics = response.results;
    
    // Group by date
    const groupedData = analytics.reduce((acc, item) => {
      const date = item.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          views: 0,
          sales: 0,
          revenue: 0
        };
      }
      
      acc[date].views += item.views_count;
      acc[date].sales += item.sales_count;
      acc[date].revenue += item.revenue;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
  }
} 