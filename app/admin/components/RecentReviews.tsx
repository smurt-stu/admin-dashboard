'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RecentReview {
  id: number;
  user_name: string;
  product_title: string;
  rating: number;
  title: string;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

export default function RecentReviews() {
  const [reviews, setReviews] = useState<RecentReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews/?limit=5&ordering=-created_at');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data.results || []);
      }
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`ri-star-${i < rating ? 'fill' : 'line'} text-yellow-400 text-sm`}
      ></i>
    ));
  };

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved === null) return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">في الانتظار</span>;
    return isApproved ? 
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">معتمد</span> :
      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">مرفوض</span>;
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">المراجعات الحديثة</h3>
        <Link
          href="/admin/reviews"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          عرض الكل
        </Link>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <i className="ri-star-line text-4xl mb-2"></i>
            <p className="text-sm">لا توجد مراجعات حديثة</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <span className="text-sm font-medium text-gray-900">{review.user_name}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{review.product_title}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs text-gray-500">({review.rating}/5)</span>
                    {getStatusBadge(review.is_approved)}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
              
              <h4 className="text-sm font-medium text-gray-900 mb-1">{review.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">
                {review.review_text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 