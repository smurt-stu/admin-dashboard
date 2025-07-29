'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MerchantReplyModal from './components/MerchantReplyModal';

interface Review {
  id: number;
  user_name: string;
  user_avatar: string;
  product_title: string;
  rating: number;
  quality_rating: number;
  value_rating: number;
  ease_of_use_rating: number;
  title: string;
  review_text: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpfulness_score: number;
  created_at: string;
  merchant_reply?: string;
}

interface ReviewStats {
  total_reviews: number;
  pending_reviews: number;
  approved_reviews: number;
  average_rating: number;
  total_comments: number;
  pending_comments: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total_reviews: 0,
    pending_reviews: 0,
    approved_reviews: 0,
    average_rating: 0,
    total_comments: 0,
    pending_comments: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [merchantReplyModal, setMerchantReplyModal] = useState<{
    isOpen: boolean;
    reviewId: number;
    reviewTitle: string;
  }>({
    isOpen: false,
    reviewId: 0,
    reviewTitle: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('is_approved', filter === 'approved' ? 'true' : 'false');
      }
      
      const response = await fetch(`/api/admin/reviews/?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data.results || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/statistics/overview/');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/approve/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/reject/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleMerchantReply = (reviewId: number, reviewTitle: string) => {
    setMerchantReplyModal({
      isOpen: true,
      reviewId,
      reviewTitle
    });
  };

  const handleReplySubmitted = () => {
    fetchReviews();
    fetchStats();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`ri-star-${i < rating ? 'fill' : 'line'} text-yellow-400`}
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المراجعات</h1>
          <p className="text-gray-600 mt-1">إدارة مراجعات المنتجات والخدمات</p>
        </div>
                 <div className="mt-4 sm:mt-0 flex space-x-2 rtl:space-x-reverse">
           <Link
             href="/admin/reviews/comments"
             className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
           >
             <i className="ri-chat-1-fill ml-2"></i>
             إدارة التعليقات
           </Link>
           <Link
             href="/admin/reviews/statistics"
             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
           >
             <i className="ri-bar-chart-fill ml-2"></i>
             إحصائيات مفصلة
           </Link>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="ri-star-fill text-blue-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي المراجعات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_reviews}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.pending_reviews}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.total_comments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            جميع المراجعات
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            في الانتظار
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'approved' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            معتمدة
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'rejected' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            مرفوضة
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">المراجعات</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <i className="ri-inbox-line text-4xl mb-4"></i>
              <p>لا توجد مراجعات</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                      <img
                        src={review.user_avatar || '/default-avatar.png'}
                        alt={review.user_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{review.user_name}</h3>
                        <p className="text-sm text-gray-500">{review.product_title}</p>
                      </div>
                      {review.is_verified_purchase && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          <i className="ri-check-line ml-1"></i>
                          مشتري موثق
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">({review.rating}/5)</span>
                        {getStatusBadge(review.is_approved)}
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
                    </div>

                    {/* Sub-ratings */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">الجودة</p>
                        <div className="flex justify-center">
                          {renderStars(review.quality_rating)}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">القيمة</p>
                        <div className="flex justify-center">
                          {renderStars(review.value_rating)}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">سهولة الاستخدام</p>
                        <div className="flex justify-center">
                          {renderStars(review.ease_of_use_rating)}
                        </div>
                      </div>
                    </div>

                    {/* Merchant Reply */}
                    {review.merchant_reply && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">رد التاجر:</p>
                        <p className="text-sm text-blue-800">{review.merchant_reply}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>مفيدة: {review.helpfulness_score}</span>
                      <span>{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>

                                     {/* Actions */}
                   <div className="flex flex-col space-y-2 mr-4">
                     {review.is_approved === null && (
                       <>
                         <button
                           onClick={() => handleApprove(review.id)}
                           className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                         >
                           <i className="ri-check-line ml-1"></i>
                           اعتماد
                         </button>
                         <button
                           onClick={() => handleReject(review.id)}
                           className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                         >
                           <i className="ri-close-line ml-1"></i>
                           رفض
                         </button>
                       </>
                     )}
                     <button
                       onClick={() => handleMerchantReply(review.id, review.title)}
                       className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                     >
                       <i className="ri-reply-line ml-1"></i>
                       رد التاجر
                     </button>
                   </div>
                </div>
              </div>
            ))
          )}
                 </div>
       </div>

       {/* Merchant Reply Modal */}
       <MerchantReplyModal
         isOpen={merchantReplyModal.isOpen}
         onClose={() => setMerchantReplyModal({ isOpen: false, reviewId: 0, reviewTitle: '' })}
         reviewId={merchantReplyModal.reviewId}
         reviewTitle={merchantReplyModal.reviewTitle}
         onReplySubmitted={handleReplySubmitted}
       />
     </div>
   );
 } 