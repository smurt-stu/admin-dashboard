
'use client';

import Link from 'next/link';

export default function RecentOrders() {
  const orders = [
    {
      id: '#ORD-001',
      customer: 'أحمد محمد',
      date: '2024-01-15',
      total: '1,250 ريال',
      status: 'pending',
      statusText: 'في الانتظار'
    },
    {
      id: '#ORD-002',
      customer: 'فاطمة علي',
      date: '2024-01-15',
      total: '890 ريال',
      status: 'processing',
      statusText: 'قيد التجهيز'
    },
    {
      id: '#ORD-003',
      customer: 'محمد عبدالله',
      date: '2024-01-14',
      total: '2,150 ريال',
      status: 'shipped',
      statusText: 'تم الشحن'
    },
    {
      id: '#ORD-004',
      customer: 'نورا سعد',
      date: '2024-01-14',
      total: '750 ريال',
      status: 'delivered',
      statusText: 'تم التسليم'
    },
    {
      id: '#ORD-005',
      customer: 'خالد الأحمد',
      date: '2024-01-13',
      total: '1,890 ريال',
      status: 'cancelled',
      statusText: 'ملغي'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">الطلبات الأخيرة</h3>
        <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
          عرض جميع الطلبات
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 font-medium text-gray-600">رقم الطلب</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">العميل</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">التاريخ</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">المبلغ</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">الحالة</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-blue-600">{order.id}</td>
                <td className="py-4 px-4 text-gray-800">{order.customer}</td>
                <td className="py-4 px-4 text-gray-600">{order.date}</td>
                <td className="py-4 px-4 font-medium text-gray-800">{order.total}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.statusText}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer">
                    عرض التفاصيل
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
