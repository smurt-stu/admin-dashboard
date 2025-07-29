'use client';

interface OrderItem {
  id: string;
  product_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchase_type: string;
  download_count?: number;
  download_limit?: number;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">منتجات الطلب</h3>
        <p className="text-sm text-gray-600 mt-1">
          {items.length} منتج في هذا الطلب
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">المنتج</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">النوع</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الكمية</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">سعر الوحدة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الإجمالي</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">التنزيلات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{item.product_title}</div>
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                    item.purchase_type === 'digital' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <i className={`${item.purchase_type === 'digital' ? 'ri-download-line' : 'ri-truck-line'} ml-1`}></i>
                    {item.purchase_type === 'digital' ? 'رقمي' : 'مادي'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatPrice(item.unit_price)}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {formatPrice(item.total_price)}
                </td>
                <td className="px-6 py-4">
                  {item.purchase_type === 'digital' ? (
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {item.download_count || 0} / {item.download_limit || 5}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {item.download_count && item.download_limit 
                          ? `${Math.round(((item.download_count / item.download_limit) * 100))}% مستخدم`
                          : '0% مستخدم'
                        }
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">غير متاح</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            إجمالي المنتجات: {items.length}
          </div>
          <div className="text-sm text-gray-600">
            إجمالي الكمية: {items.reduce((sum, item) => sum + item.quantity, 0)}
          </div>
        </div>
      </div>
    </div>
  );
} 