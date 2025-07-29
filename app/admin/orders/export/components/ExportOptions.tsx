'use client';

interface ExportConfig {
  format: string;
  dateRange: string;
  status: string;
  includeItems: boolean;
  includeCustomerInfo: boolean;
  includeAddress: boolean;
}

interface ExportOptionsProps {
  config: ExportConfig;
  onConfigChange: (config: ExportConfig) => void;
}

export function ExportOptions({ config, onConfigChange }: ExportOptionsProps) {
  const handleConfigChange = (key: string, value: any) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: 'ri-file-excel-line' },
    { value: 'csv', label: 'CSV (.csv)', icon: 'ri-file-text-line' },
    { value: 'pdf', label: 'PDF (.pdf)', icon: 'ri-file-pdf-line' },
    { value: 'json', label: 'JSON (.json)', icon: 'ri-code-line' }
  ];

  const dateRangeOptions = [
    { value: 'week', label: 'آخر أسبوع' },
    { value: 'month', label: 'آخر شهر' },
    { value: 'quarter', label: 'آخر 3 أشهر' },
    { value: 'year', label: 'آخر سنة' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  const statusOptions = [
    { value: '', label: 'جميع الحالات' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'shipped', label: 'مشحون' },
    { value: 'delivered', label: 'تم التسليم' },
    { value: 'cancelled', label: 'ملغي' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">خيارات التصدير</h3>
      
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">صيغة الملف</label>
          <div className="grid grid-cols-2 gap-3">
            {formatOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  config.format === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={option.value}
                  checked={config.format === option.value}
                  onChange={(e) => handleConfigChange('format', e.target.value)}
                  className="sr-only"
                />
                <i className={`${option.icon} text-lg ml-2 ${
                  config.format === option.value ? 'text-blue-600' : 'text-gray-400'
                }`}></i>
                <span className={`text-sm ${
                  config.format === option.value ? 'text-blue-900' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الفترة الزمنية</label>
          <select
            value={config.dateRange}
            onChange={(e) => handleConfigChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">حالة الطلب</label>
          <select
            value={config.status}
            onChange={(e) => handleConfigChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Include Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">البيانات المطلوبة</label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.includeItems}
                onChange={(e) => handleConfigChange('includeItems', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 mr-2">تضمين تفاصيل المنتجات</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.includeCustomerInfo}
                onChange={(e) => handleConfigChange('includeCustomerInfo', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 mr-2">تضمين معلومات العميل</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.includeAddress}
                onChange={(e) => handleConfigChange('includeAddress', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 mr-2">تضمين عنوان الشحن</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 