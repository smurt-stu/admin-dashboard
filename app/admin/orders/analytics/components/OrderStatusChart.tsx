'use client';

interface StatusData {
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface OrderStatusChartProps {
  data: StatusData | null;
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">توزيع حالات الطلبات</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  const statusData = [
    { key: 'pending', label: 'في الانتظار', color: 'bg-yellow-500', count: data.pending },
    { key: 'confirmed', label: 'مؤكد', color: 'bg-blue-500', count: data.confirmed },
    { key: 'shipped', label: 'مشحون', color: 'bg-purple-500', count: data.shipped },
    { key: 'delivered', label: 'تم التسليم', color: 'bg-green-500', count: data.delivered },
    { key: 'cancelled', label: 'ملغي', color: 'bg-red-500', count: data.cancelled }
  ];

  const totalOrders = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">توزيع حالات الطلبات</h3>
      
      <div className="space-y-4">
        {/* Pie Chart Representation */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            {statusData.map((item, index) => {
              const percentage = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
              const angle = (percentage / 100) * 360;
              const previousAngles = statusData
                .slice(0, index)
                .reduce((sum, prevItem) => {
                  const prevPercentage = totalOrders > 0 ? (prevItem.count / totalOrders) * 100 : 0;
                  return sum + (prevPercentage / 100) * 360;
                }, 0);

              return (
                <div
                  key={item.key}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${previousAngles}deg)`,
                  }}
                >
                  <div
                    className={`w-full h-full rounded-full ${item.color}`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos((angle * Math.PI) / 180) * 50}% ${50 + Math.sin((angle * Math.PI) / 180) * 50}%)`,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {statusData.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {item.count} ({totalOrders > 0 ? ((item.count / totalOrders) * 100).toFixed(1) : 0}%)
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">إجمالي الطلبات</span>
            <span className="font-medium text-gray-900">{totalOrders}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 