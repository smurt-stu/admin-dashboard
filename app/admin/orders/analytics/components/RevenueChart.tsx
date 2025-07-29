'use client';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[] | null;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">الإيرادات الشهرية</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(item => item.revenue));
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">الإيرادات الشهرية</h3>
      
      <div className="space-y-4">
        {/* Chart Bars */}
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((item, index) => {
            const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t">
                  <div
                    className="bg-blue-500 rounded-t transition-all duration-300"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">إجمالي الإيرادات</span>
            <span className="font-medium text-gray-900">{formatPrice(totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 