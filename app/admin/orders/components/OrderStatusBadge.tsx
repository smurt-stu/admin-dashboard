'use client';

interface OrderStatusBadgeProps {
  status: string;
  paymentStatus: string;
}

export function OrderStatusBadge({ status, paymentStatus }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'في الانتظار',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: 'ri-time-line'
        };
      case 'confirmed':
        return {
          label: 'مؤكد',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: 'ri-check-line'
        };
      case 'shipped':
        return {
          label: 'مشحون',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          icon: 'ri-truck-line'
        };
      case 'delivered':
        return {
          label: 'تم التسليم',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: 'ri-check-double-line'
        };
      case 'cancelled':
        return {
          label: 'ملغي',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: 'ri-close-line'
        };
      default:
        return {
          label: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: 'ri-question-line'
        };
    }
  };

  const getPaymentStatusConfig = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'pending':
        return {
          label: 'في الانتظار',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: 'ri-time-line'
        };
      case 'completed':
        return {
          label: 'مكتمل',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: 'ri-check-line'
        };
      case 'failed':
        return {
          label: 'فشل',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: 'ri-close-line'
        };
      case 'refunded':
        return {
          label: 'مسترد',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          icon: 'ri-refund-line'
        };
      default:
        return {
          label: paymentStatus,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: 'ri-question-line'
        };
    }
  };

  const orderStatus = getStatusConfig(status);
  const paymentStatusConfig = getPaymentStatusConfig(paymentStatus);

  return (
    <div className="space-y-1">
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${orderStatus.bgColor} ${orderStatus.textColor}`}>
        <i className={`${orderStatus.icon} ml-1`}></i>
        {orderStatus.label}
      </span>
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${paymentStatusConfig.bgColor} ${paymentStatusConfig.textColor}`}>
        <i className={`${paymentStatusConfig.icon} ml-1`}></i>
        {paymentStatusConfig.label}
      </span>
    </div>
  );
} 