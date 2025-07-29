'use client';

interface CustomerInsightsData {
  new_customers: number;
  returning_customers: number;
  average_customer_value: number;
}

interface CustomerInsightsProps {
  data: CustomerInsightsData | null;
}

export function CustomerInsights({ data }: CustomerInsightsProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">رؤى العملاء</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  const totalCustomers = data.new_customers + data.returning_customers;
  const newCustomerPercentage = totalCustomers > 0 ? (data.new_customers / totalCustomers) * 100 : 0;
  const returningCustomerPercentage = totalCustomers > 0 ? (data.returning_customers / totalCustomers) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">رؤى العملاء</h3>
      
      <div className="space-y-6">
        {/* Customer Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">توزيع العملاء</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">عملاء جدد</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {data.new_customers} ({newCustomerPercentage.toFixed(1)}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">عملاء عائدون</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {data.returning_customers} ({returningCustomerPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${newCustomerPercentage}%` }}
            ></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${returningCustomerPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Average Customer Value */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">متوسط قيمة العميل</h4>
              <p className="text-xs text-gray-500">متوسط الإنفاق لكل عميل</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{formatPrice(data.average_customer_value)}</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">رؤى مهمة</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• {newCustomerPercentage.toFixed(1)}% من العملاء جدد</li>
            <li>• {returningCustomerPercentage.toFixed(1)}% من العملاء عائدون</li>
            <li>• متوسط قيمة العميل: {formatPrice(data.average_customer_value)}</li>
            <li>• إجمالي العملاء: {totalCustomers}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 