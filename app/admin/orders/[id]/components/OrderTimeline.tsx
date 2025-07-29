'use client';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  paid_at: string;
  shipped_at: string;
  delivered_at: string;
  notes: string;
}

interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'ri-time-line';
      case 'confirmed':
        return 'ri-check-line';
      case 'shipped':
        return 'ri-truck-line';
      case 'delivered':
        return 'ri-check-double-line';
      case 'cancelled':
        return 'ri-close-line';
      default:
        return 'ri-question-line';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'shipped':
        return 'مشحون';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const timelineEvents = [
    {
      id: 'created',
      title: 'تم إنشاء الطلب',
      description: `تم إنشاء الطلب رقم ${order.order_number}`,
      date: order.created_at,
      icon: 'ri-shopping-bag-line',
      color: 'bg-blue-500',
      completed: true
    },
    {
      id: 'paid',
      title: 'تم الدفع',
      description: 'تم تأكيد الدفع بنجاح',
      date: order.paid_at,
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-green-500',
      completed: !!order.paid_at
    },
    {
      id: 'confirmed',
      title: 'تم تأكيد الطلب',
      description: 'تم تأكيد الطلب من قبل الإدارة',
      date: order.updated_at,
      icon: 'ri-check-line',
      color: 'bg-blue-500',
      completed: ['confirmed', 'shipped', 'delivered'].includes(order.status)
    },
    {
      id: 'shipped',
      title: 'تم شحن الطلب',
      description: 'تم شحن الطلب إلى العميل',
      date: order.shipped_at,
      icon: 'ri-truck-line',
      color: 'bg-purple-500',
      completed: ['shipped', 'delivered'].includes(order.status)
    },
    {
      id: 'delivered',
      title: 'تم تسليم الطلب',
      description: 'تم تسليم الطلب للعميل بنجاح',
      date: order.delivered_at,
      icon: 'ri-check-double-line',
      color: 'bg-green-500',
      completed: order.status === 'delivered'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">التسلسل الزمني للطلب</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline Events */}
        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start">
              {/* Timeline Dot */}
              <div className={`absolute right-4 top-1 w-3 h-3 rounded-full border-2 border-white ${
                event.completed ? event.color : 'bg-gray-300'
              }`}></div>
              
              {/* Event Content */}
              <div className="mr-12 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.completed ? event.color : 'bg-gray-300'
                  }`}>
                    <i className={`${event.icon} text-white text-sm`}></i>
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      event.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {event.title}
                    </h4>
                    <p className={`text-sm ${
                      event.completed ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {event.description}
                    </p>
                  </div>
                </div>
                
                {event.date && (
                  <div className="text-xs text-gray-500 mr-11">
                    {formatDate(event.date)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
            <i className={`${getStatusIcon(order.status)} text-white text-lg`}></i>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">الحالة الحالية</h4>
            <p className="text-sm text-gray-600">{getStatusLabel(order.status)}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">ملاحظات</h4>
          <p className="text-sm text-blue-800">{order.notes}</p>
        </div>
      )}
    </div>
  );
} 