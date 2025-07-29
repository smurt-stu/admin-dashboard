'use client';

import { useState } from 'react';
import { OrderStatusModal } from '../../components/OrderStatusModal';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
}

interface OrderActionsProps {
  order: Order;
  onUpdate: () => void;
}

export function OrderActions({ order, onUpdate }: OrderActionsProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: string, newPaymentStatus: string, notes?: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          payment_status: newPaymentStatus,
          notes
        }),
      });

      if (response.ok) {
        onUpdate();
        setShowStatusModal(false);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${order.id}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        onUpdate();
      } else {
        console.error(`Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action} order:`, error);
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = order.status === 'pending';
  const canShip = order.status === 'confirmed';
  const canDeliver = order.status === 'shipped';
  const canCancel = !['cancelled', 'delivered'].includes(order.status);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">الإجراءات السريعة</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {canConfirm && (
            <button
              onClick={() => handleQuickAction('confirm')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="ri-check-line ml-2"></i>
              تأكيد الطلب
            </button>
          )}
          
          {canShip && (
            <button
              onClick={() => handleQuickAction('ship')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="ri-truck-line ml-2"></i>
              شحن الطلب
            </button>
          )}
          
          {canDeliver && (
            <button
              onClick={() => handleQuickAction('deliver')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="ri-check-double-line ml-2"></i>
              تسليم الطلب
            </button>
          )}
          
          <button
            onClick={() => setShowStatusModal(true)}
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ri-edit-line ml-2"></i>
            تعديل الحالة
          </button>
          
          {canCancel && (
            <button
              onClick={() => handleQuickAction('cancel')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="ri-close-line ml-2"></i>
              إلغاء الطلب
            </button>
          )}
          
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="ri-printer-line ml-2"></i>
            طباعة الطلب
          </button>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">إجراءات إضافية</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <i className="ri-mail-line ml-2"></i>
            إرسال إيميل للعميل
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
            <i className="ri-message-2-line ml-2"></i>
            إرسال SMS للعميل
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
            <i className="ri-download-line ml-2"></i>
            تصدير كـ PDF
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
            <i className="ri-file-copy-line ml-2"></i>
            نسخ رابط التتبع
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
            <i className="ri-refund-line ml-2"></i>
            طلب استرداد
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
            <i className="ri-delete-bin-line ml-2"></i>
            حذف الطلب
          </button>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <OrderStatusModal
          order={order}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
} 