'use client';

import { useState, useEffect } from 'react';
import { OrderAnalytics } from './components/OrderAnalytics';
import { RevenueChart } from './components/RevenueChart';
import { OrderStatusChart } from './components/OrderStatusChart';
import { TopProducts } from './components/TopProducts';
import { CustomerInsights } from './components/CustomerInsights';

interface AnalyticsData {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
  orders_by_status: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenue_by_month: Array<{
    month: string;
    revenue: number;
  }>;
  top_products: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  customer_insights: {
    new_customers: number;
    returning_customers: number;
    average_customer_value: number;
  };
  revenue_data?: any;
  status_data?: any;
}

export default function OrderAnalyticsPage() {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/analytics?range=${dateRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const dateRangeOptions = [
    { value: 'week', label: 'آخر أسبوع' },
    { value: 'month', label: 'آخر شهر' },
    { value: 'quarter', label: 'آخر 3 أشهر' },
    { value: 'year', label: 'آخر سنة' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تحليلات الطلبات</h1>
          <p className="text-gray-600 mt-1">إحصائيات وتحليلات شاملة للطلبات</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-printer-line ml-2"></i>
            طباعة التقرير
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <OrderAnalytics analytics={analytics} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={analytics?.revenue_data} />
        <OrderStatusChart data={analytics?.status_data} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts data={analytics?.top_products || null} />
        <CustomerInsights data={analytics?.customer_insights || null} />
      </div>
    </div>
  );
} 