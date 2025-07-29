'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Comment {
  id: number;
  user_name: string;
  user_avatar: string;
  review_title: string;
  product_title: string;
  comment_text: string;
  is_approved: boolean;
  created_at: string;
  parent?: {
    id: number;
    user_name: string;
    comment_text: string;
  };
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('is_approved', filter === 'approved' ? 'true' : 'false');
      }
      
      const response = await fetch(`/api/admin/comments/?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data.results || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId: number) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/approve/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleReject = async (commentId: number) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/reject/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error rejecting comment:', error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة التعليقات</h1>
          <p className="text-gray-600 mt-1">إدارة تعليقات المراجعات</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/reviews"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="ri-arrow-right-line ml-2"></i>
            العودة للمراجعات
          </Link>
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
            جميع التعليقات
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

      {/* Comments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">التعليقات</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {comments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <i className="ri-chat-1-line text-4xl mb-4"></i>
              <p>لا توجد تعليقات</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                      <img
                        src={comment.user_avatar || '/default-avatar.png'}
                        alt={comment.user_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{comment.user_name}</h3>
                        <p className="text-sm text-gray-500">{comment.product_title}</p>
                      </div>
                      {getStatusBadge(comment.is_approved)}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">على مراجعة: "{comment.review_title}"</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{comment.comment_text}</p>
                    </div>

                    {/* Parent Comment */}
                    {comment.parent && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-xs text-gray-500 mb-1">رد على تعليق من {comment.parent.user_name}:</p>
                        <p className="text-sm text-gray-700">{comment.parent.comment_text}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>

                  {/* Actions */}
                  {comment.is_approved === null && (
                    <div className="flex flex-col space-y-2 mr-4">
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        <i className="ri-check-line ml-1"></i>
                        اعتماد
                      </button>
                      <button
                        onClick={() => handleReject(comment.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        <i className="ri-close-line ml-1"></i>
                        رفض
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 