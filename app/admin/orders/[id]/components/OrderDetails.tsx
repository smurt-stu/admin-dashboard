'use client';

import { OrderStatusBadge } from '../../components/OrderStatusBadge';

interface Order {
  id: string;
  order_number: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
  paid_at: string;
  shipped_at: string;
  delivered_at: string;
  shipping_address: {
    street_address: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
  };
}

interface OrderDetailsProps {
  order: Order;
  onUpdate: () => void;
}

export function OrderDetails({ order, onUpdate }: OrderDetailsProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">حالة الطلب</h3>
          <div className="flex items-center justify-between">
            <OrderStatusBadge status={order.status} paymentStatus={order.payment_status} />
            <div className="text-sm text-gray-500">
              آخر تحديث: {formatDate(order.updated_at)}
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات العميل</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <p className="text-gray-900">{order.user.first_name} {order.user.last_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <p className="text-gray-900">{order.user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <p className="text-gray-900">{order.user.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم العميل</label>
              <p className="text-gray-900">#{order.user.id}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">عنوان الشحن</h3>
          <div className="space-y-2">
            <p className="text-gray-900">{order.shipping_address.street_address}</p>
            <p className="text-gray-900">
              {order.shipping_address.city}, {order.shipping_address.state_province}
            </p>
            <p className="text-gray-900">
              {order.shipping_address.postal_code}, {order.shipping_address.country}
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات الدفع</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
              <p className="text-gray-900">{order.payment_method}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الدفع</label>
              <p className="text-gray-900">
                {order.paid_at ? formatDate(order.paid_at) : 'لم يتم الدفع بعد'}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ملاحظات</h3>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ملخص الطلب</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الضريبة</span>
              <span className="font-medium">{formatPrice(order.tax_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الشحن</span>
              <span className="font-medium">{formatPrice(order.shipping_cost)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">الخصم</span>
                <span className="font-medium text-green-600">-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-900">الإجمالي</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">التواريخ المهمة</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الإنشاء</label>
              <p className="text-sm text-gray-900">{formatDate(order.created_at)}</p>
            </div>
            {order.shipped_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الشحن</label>
                <p className="text-sm text-gray-900">{formatDate(order.shipped_at)}</p>
              </div>
            )}
            {order.delivered_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسليم</label>
                <p className="text-sm text-gray-900">{formatDate(order.delivered_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 