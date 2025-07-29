'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrderList } from './components/OrderList';
import { OrderFilters } from './components/OrderFilters';
import { OrderStats } from './components/OrderStats';
import { OrderSearch } from './components/OrderSearch';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateRange: '',
    minAmount: '',
    maxAmount: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filters, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // هنا سيتم استدعاء API لجلب الطلبات
      const response = await fetch('/api/admin/orders?' + new URLSearchParams({
        ...filters,
        search: searchQuery
      }));
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-600 mt-1">إدارة وتتبع جميع طلبات العملاء</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders/analytics"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-bar-chart-line ml-2"></i>
            التقارير
          </Link>
          <Link
            href="/admin/orders/export"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <i className="ri-download-line ml-2"></i>
            تصدير
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStats />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderFilters filters={filters} onFilterChange={handleFilterChange} />
          <OrderSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <OrderList 
          orders={orders} 
          loading={loading} 
          onRefresh={fetchOrders}
        />
      </div>
    </div>
  );
} 