'use client';

interface ExportPreviewProps {
  data: any;
}

export function ExportPreview({ data }: ExportPreviewProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">معاينة التصدير</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <i className="ri-eye-line text-4xl mb-4"></i>
            <p>اضغط على "معاينة" لعرض البيانات</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">معاينة التصدير</h3>
      
      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">ملخص التصدير</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">عدد الطلبات:</span>
              <span className="font-medium text-blue-900 mr-2"> {data.total_orders || 0}</span>
            </div>
            <div>
              <span className="text-blue-700">إجمالي الإيرادات:</span>
              <span className="font-medium text-blue-900 mr-2"> {data.total_revenue || 0} د.أ</span>
            </div>
            <div>
              <span className="text-blue-700">صيغة الملف:</span>
              <span className="font-medium text-blue-900 mr-2"> {data.format || 'Excel'}</span>
            </div>
            <div>
              <span className="text-blue-700">حجم الملف:</span>
              <span className="font-medium text-blue-900 mr-2"> {data.file_size || '~2MB'}</span>
            </div>
          </div>
        </div>

        {/* Sample Data */}
        {data.sample_data && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">عينة من البيانات</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-right text-gray-700">رقم الطلب</th>
                    <th className="px-3 py-2 text-right text-gray-700">العميل</th>
                    <th className="px-3 py-2 text-right text-gray-700">الحالة</th>
                    <th className="px-3 py-2 text-right text-gray-700">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.sample_data.slice(0, 5).map((order: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-900">{order.order_number}</td>
                      <td className="px-3 py-2 text-gray-900">{order.customer_name}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'delivered' ? 'تم التسليم' :
                           order.status === 'shipped' ? 'مشحون' :
                           order.status === 'confirmed' ? 'مؤكد' : 'في الانتظار'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-900">{order.total_amount} د.أ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Columns Preview */}
        {data.columns && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">الأعمدة المطلوبة</h4>
            <div className="flex flex-wrap gap-2">
              {data.columns.map((column: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {column}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Export Info */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">معلومات التصدير</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• سيتم تصدير {data.total_orders || 0} طلب</li>
            <li>• صيغة الملف: {data.format || 'Excel'}</li>
            <li>• الوقت المقدر: {data.estimated_time || '30 ثانية'}</li>
            <li>• حجم الملف المقدر: {data.estimated_size || '~2MB'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 