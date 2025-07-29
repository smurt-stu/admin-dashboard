'use client';

interface OrderFiltersProps {
  filters: {
    status: string;
    paymentStatus: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
  };
  onFilterChange: (filters: any) => void;
}

export function OrderFilters({ filters, onFilterChange }: OrderFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const statusOptions = [
    { value: '', label: 'جميع الحالات' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'shipped', label: 'مشحون' },
    { value: 'delivered', label: 'تم التسليم' },
    { value: 'cancelled', label: 'ملغي' }
  ];

  const paymentStatusOptions = [
    { value: '', label: 'جميع حالات الدفع' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'failed', label: 'فشل' },
    { value: 'refunded', label: 'مسترد' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'جميع التواريخ' },
    { value: 'today', label: 'اليوم' },
    { value: 'yesterday', label: 'أمس' },
    { value: 'week', label: 'آخر أسبوع' },
    { value: 'month', label: 'آخر شهر' },
    { value: 'quarter', label: 'آخر 3 أشهر' },
    { value: 'year', label: 'آخر سنة' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">تصفية الطلبات</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حالة الطلب
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حالة الدفع
          </label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفترة الزمنية
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min Amount Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأدنى للمبلغ
          </label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Max Amount Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأقصى للمبلغ
          </label>
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            placeholder="1000.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => onFilterChange({
              status: '',
              paymentStatus: '',
              dateRange: '',
              minAmount: '',
              maxAmount: ''
            })}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            مسح التصفية
          </button>
        </div>
      </div>
    </div>
  );
} 