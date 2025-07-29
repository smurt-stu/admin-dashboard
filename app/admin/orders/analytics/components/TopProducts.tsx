'use client';

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface TopProductsProps {
  data: TopProduct[] | null;
}

export function TopProducts({ data }: TopProductsProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">المنتجات الأكثر مبيعاً</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">المنتجات الأكثر مبيعاً</h3>
      
      <div className="space-y-4">
        {data.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.quantity} وحدة مباعة</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatPrice(product.revenue)}</p>
              <p className="text-xs text-gray-500">إجمالي الإيرادات</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">إجمالي الإيرادات من هذه المنتجات</span>
          <span className="font-medium text-gray-900">
            {formatPrice(data.reduce((sum, product) => sum + product.revenue, 0))}
          </span>
        </div>
      </div>
    </div>
  );
} 