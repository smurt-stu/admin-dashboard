'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrderStatusModal } from './OrderStatusModal';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
}

interface OrderActionsProps {
  order: Order;
  onRefresh: () => void;
}

export function OrderActions({ order, onRefresh }: OrderActionsProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusUpdate = async (newStatus: string, newPaymentStatus: string, notes?: string) => {
    try {
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
        onRefresh();
        setShowStatusModal(false);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleQuickAction = async (action: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        onRefresh();
      } else {
        console.error(`Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action} order:`, error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions */}
      {order.status === 'pending' && (
        <button
          onClick={() => handleQuickAction('confirm')}
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          title="تأكيد الطلب"
        >
          <i className="ri-check-line"></i>
        </button>
      )}
      
      {order.status === 'confirmed' && (
        <button
          onClick={() => handleQuickAction('ship')}
          className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          title="شحن الطلب"
        >
          <i className="ri-truck-line"></i>
        </button>
      )}
      
      {order.status === 'shipped' && (
        <button
          onClick={() => handleQuickAction('deliver')}
          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          title="تسليم الطلب"
        >
          <i className="ri-check-double-line"></i>
        </button>
      )}

      {/* View Details */}
      <Link
        href={`/admin/orders/${order.id}`}
        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        title="عرض التفاصيل"
      >
        <i className="ri-eye-line"></i>
      </Link>

      {/* Edit Status */}
      <button
        onClick={() => setShowStatusModal(true)}
        className="px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
        title="تعديل الحالة"
      >
        <i className="ri-edit-line"></i>
      </button>

      {/* Cancel Order */}
      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <button
          onClick={() => handleQuickAction('cancel')}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          title="إلغاء الطلب"
        >
          <i className="ri-close-line"></i>
        </button>
      )}

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