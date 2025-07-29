'use client';

interface Analytics {
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
}

interface OrderAnalyticsProps {
  analytics: Analytics | null;
}

export function OrderAnalytics({ analytics }: OrderAnalyticsProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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

  const statsCards = [
    {
      title: 'إجمالي الطلبات',
      value: analytics.total_orders.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: 'ri-shopping-bag-line',
      color: 'bg-blue-500'
    },
    {
      title: 'إجمالي الإيرادات',
      value: formatPrice(analytics.total_revenue),
      change: '+15%',
      changeType: 'positive',
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-green-500'
    },
    {
      title: 'متوسط قيمة الطلب',
      value: formatPrice(analytics.average_order_value),
      change: '+3%',
      changeType: 'positive',
      icon: 'ri-calculator-line',
      color: 'bg-purple-500'
    },
    {
      title: 'معدل التحويل',
      value: formatPercentage(analytics.conversion_rate),
      change: '+2%',
      changeType: 'positive',
      icon: 'ri-line-chart-line',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <span className="text-xs text-gray-500 mr-2">من الفترة السابقة</span>
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