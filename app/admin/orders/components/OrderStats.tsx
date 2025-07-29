'use client';

import { useState, useEffect } from 'react';

interface OrderStats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export function OrderStats() {
  const [stats, setStats] = useState<OrderStats>({
    total_orders: 0,
    pending_orders: 0,
    confirmed_orders: 0,
    shipped_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_revenue: 0,
    average_order_value: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // هنا سيتم استدعاء API لجلب الإحصائيات
      const response = await fetch('/api/admin/orders/analytics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats.total_orders,
      icon: 'ri-shopping-bag-line',
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'الطلبات في الانتظار',
      value: stats.pending_orders,
      icon: 'ri-time-line',
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'الطلبات المؤكدة',
      value: stats.confirmed_orders,
      icon: 'ri-check-line',
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'الطلبات المشحونة',
      value: stats.shipped_orders,
      icon: 'ri-truck-line',
      color: 'bg-purple-500',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'إجمالي الإيرادات',
      value: formatPrice(stats.total_revenue),
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-green-600',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'متوسط قيمة الطلب',
      value: formatPrice(stats.average_order_value),
      icon: 'ri-calculator-line',
      color: 'bg-indigo-500',
      change: '+2%',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
                <span className="text-xs text-gray-500 mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
              <i className={`${card.icon} text-white text-xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 