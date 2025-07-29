'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReviewStatistics {
  total_reviews: number;
  pending_reviews: number;
  approved_reviews: number;
  rejected_reviews: number;
  average_rating: number;
  total_comments: number;
  pending_comments: number;
  top_products: Array<{
    product_title: string;
    total_reviews: number;
    average_rating: number;
  }>;
  rating_distribution: {
    '5_star': number;
    '4_star': number;
    '3_star': number;
    '2_star': number;
    '1_star': number;
  };
  recent_activity: Array<{
    id: number;
    user_name: string;
    product_title: string;
    rating: number;
    created_at: string;
  }>;
}

export default function ReviewStatisticsPage() {
  const [stats, setStats] = useState<ReviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // days

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/admin/statistics/overview/?period=${selectedPeriod}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateStats = async () => {
    try {
      const response = await fetch('/api/admin/statistics/recalculate_all/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error recalculating statistics:', error);
    }
  };

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const renderRatingBar = (stars: number, count: number, total: number) => {
    const percentage = calculatePercentage(count, total);
    return (
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="flex items-center space-x-1 rtl:space-x-reverse min-w-[60px]">
          <span className="text-sm font-medium">{stars}</span>
          <i className="ri-star-fill text-yellow-400 text-sm"></i>
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="min-w-[60px] text-right">
          <span className="text-sm text-gray-600">{count}</span>
          <span className="text-xs text-gray-400 mr-1">({percentage}%)</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        <p>لا يمكن تحميل الإحصائيات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إحصائيات المراجعات</h1>
          <p className="text-gray-600 mt-1">تحليل شامل لمراجعات المنتجات والخدمات</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2 rtl:space-x-reverse">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">آخر 7 أيام</option>
            <option value="30">آخر 30 يوم</option>
            <option value="90">آخر 90 يوم</option>
            <option value="365">آخر سنة</option>
          </select>
          <button
            onClick={handleRecalculateStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <i className="ri-refresh-line ml-1"></i>
            إعادة حساب
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="ri-star-fill text-blue-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي المراجعات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_reviews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <i className="ri-time-fill text-yellow-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">في الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_reviews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="ri-check-fill text-green-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">متوسط التقييم</p>
              <p className="text-2xl font-bold text-gray-900">{stats.average_rating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="ri-chat-1-fill text-purple-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">التعليقات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_comments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع التقييمات</h3>
          <div className="space-y-3">
            {renderRatingBar(5, stats.rating_distribution['5_star'], stats.total_reviews)}
            {renderRatingBar(4, stats.rating_distribution['4_star'], stats.total_reviews)}
            {renderRatingBar(3, stats.rating_distribution['3_star'], stats.total_reviews)}
            {renderRatingBar(2, stats.rating_distribution['2_star'], stats.total_reviews)}
            {renderRatingBar(1, stats.rating_distribution['1_star'], stats.total_reviews)}
          </div>
        </div>

        {/* Review Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة المراجعات</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                <span className="text-sm text-gray-700">معتمدة</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.approved_reviews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></div>
                <span className="text-sm text-gray-700">في الانتظار</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.pending_reviews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                <span className="text-sm text-gray-700">مرفوضة</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.rejected_reviews.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أفضل المنتجات تقييماً</h3>
        <div className="space-y-4">
          {stats.top_products.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{product.product_title}</h4>
                  <p className="text-sm text-gray-500">{product.total_reviews} مراجعة</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`ri-star-${i < Math.round(product.average_rating) ? 'fill' : 'line'} text-yellow-400`}
                    ></i>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{product.average_rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
        <div className="space-y-3">
          {stats.recent_activity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-star-fill text-blue-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user_name}</p>
                  <p className="text-xs text-gray-500">{activity.product_title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`ri-star-${i < activity.rating ? 'fill' : 'line'} text-yellow-400 text-sm`}
                    ></i>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{new Date(activity.created_at).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 