
'use client';

import { useState, useEffect } from 'react';
import { ProductService } from '../../../lib/productService';
import { UserService, UsersResponse } from '../../../lib/userService';

interface DashboardAnalytics {
  total_products: number;
  total_views: number;
  total_sales: number;
  total_revenue: number;
  conversion_rate: number;
}

export default function StatsCards() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [usersStats, setUsersStats] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [productAnalytics, usersResponse] = await Promise.all([
        ProductService.getAnalyticsDashboard(),
        UserService.getUsers(1, '')
      ]);
      setAnalytics(productAnalytics);
      setUsersStats(usersResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="card-responsive animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 rtl:space-x-reverse">
        <i className="ri-error-warning-fill text-red-500"></i>
        <span className="text-red-700 text-responsive">{error}</span>
      </div>
    );
  }

  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: analytics?.total_products?.toLocaleString('ar-SA') || '0',
      change: 'منتج متاح',
      icon: 'ri-box-3-fill',
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'إجمالي المشاهدات',
      value: analytics?.total_views?.toLocaleString('ar-SA') || '0',
      change: 'مشاهدة',
      icon: 'ri-eye-fill',
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'إجمالي المستخدمين',
      value: usersStats?.count?.toLocaleString('ar-SA') || '0',
      change: 'عضو مسجل',
      icon: 'ri-user-add-fill',
      color: 'bg-purple-500',
      trend: 'up'
    },
    {
      title: 'إجمالي المبيعات',
      value: analytics?.total_sales?.toLocaleString('ar-SA') || '0',
      change: 'مبيعات',
      icon: 'ri-shopping-cart-fill',
      color: 'bg-orange-500',
      trend: 'up'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card-responsive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 text-responsive">{stat.title}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</h3>
              <div className="flex items-center mt-2">
                <i className={`ri-arrow-${stat.trend}-line text-green-500 ml-1 text-sm`}></i>
                <span className="text-sm text-green-500 text-responsive">{stat.change}</span>
                <span className="text-sm text-gray-500 mr-2 text-responsive">من الشهر الماضي</span>
              </div>
            </div>
            <div className={`${stat.color} p-2 sm:p-3 rounded-full`}>
              <i className={`${stat.icon} text-white text-lg sm:text-2xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
