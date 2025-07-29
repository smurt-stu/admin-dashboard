'use client';

import { useState } from 'react';

interface MerchantReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: number;
  reviewTitle: string;
  onReplySubmitted: () => void;
}

export default function MerchantReplyModal({
  isOpen,
  onClose,
  reviewId,
  reviewTitle,
  onReplySubmitted
}: MerchantReplyModalProps) {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/merchant_reply/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_reply: replyText.trim()
        })
      });

      if (response.ok) {
        setReplyText('');
        onReplySubmitted();
        onClose();
      } else {
        console.error('Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إضافة رد التاجر</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">المراجعة:</p>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
              "{reviewTitle}"
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="replyText" className="block text-sm font-medium text-gray-700 mb-2">
                رد التاجر
              </label>
              <textarea
                id="replyText"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="اكتب رد التاجر هنا..."
                required
              />
            </div>

            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال الرد'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 