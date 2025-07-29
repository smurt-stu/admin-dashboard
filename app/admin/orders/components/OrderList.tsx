'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderActions } from './OrderActions';

interface Order {
  id: string;
  order_number: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  items_count: number;
  has_physical_items: boolean;
  has_digital_items: boolean;
}

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
}

export function OrderList({ orders, loading, onRefresh }: OrderListProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              تم تحديد {selectedOrders.length} طلب
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                تحديث الحالة
              </button>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                تصدير المحدد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-right">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">رقم الطلب</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">العميل</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">المبلغ</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">التاريخ</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">المنتجات</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.user.first_name} {order.user.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} paymentStatus={order.payment_status} />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {formatPrice(order.total_amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{order.items_count} منتج</span>
                    <div className="flex gap-1">
                      {order.has_physical_items && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          <i className="ri-truck-line ml-1"></i>
                          مادي
                        </span>
                      )}
                      {order.has_digital_items && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          <i className="ri-download-line ml-1"></i>
                          رقمي
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <OrderActions order={order} onRefresh={onRefresh} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && !loading && (
        <div className="p-12 text-center">
          <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-500">لم يتم العثور على طلبات تطابق معايير البحث</p>
        </div>
      )}
    </div>
  );
} 