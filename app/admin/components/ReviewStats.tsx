'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReviewStats {
  total_reviews: number;
  pending_reviews: number;
  approved_reviews: number;
  average_rating: number;
  total_comments: number;
  pending_comments: number;
}

export default function ReviewStats() {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewStats();
  }, []);

  const fetchReviewStats = async () => {
    try {
      const response = await fetch('/api/admin/statistics/overview/');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">إحصائيات المراجعات</h3>
        <Link
          href="/admin/reviews"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          عرض الكل
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total_reviews}</div>
          <div className="text-sm text-gray-600">إجمالي المراجعات</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending_reviews}</div>
          <div className="text-sm text-gray-600">في الانتظار</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">متوسط التقييم</span>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <i
                  key={i}
                  className={`ri-star-${i < Math.round(stats.average_rating) ? 'fill' : 'line'} text-yellow-400 text-sm`}
                ></i>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">{stats.average_rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">التعليقات</span>
          <span className="text-sm font-medium text-gray-900">{stats.total_comments}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">التعليقات في الانتظار</span>
          <span className="text-sm font-medium text-gray-900">{stats.pending_comments}</span>
        </div>
      </div>

      {stats.pending_reviews > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <i className="ri-time-fill text-yellow-600"></i>
            <span className="text-sm text-yellow-800">
              {stats.pending_reviews} مراجعة في انتظار الاعتماد
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 