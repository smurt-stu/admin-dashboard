'use client';

import { useState } from 'react';
import { ExportOptions } from './components/ExportOptions';
import { ExportFilters } from './components/ExportFilters';
import { ExportPreview } from './components/ExportPreview';

export default function OrderExportPage() {
  const [exportConfig, setExportConfig] = useState({
    format: 'excel',
    dateRange: 'month',
    status: '',
    includeItems: true,
    includeCustomerInfo: true,
    includeAddress: true
  });
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: ''
  });
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: exportConfig,
          filters
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-export-${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders/export/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: exportConfig,
          filters
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewData(data);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تصدير الطلبات</h1>
          <p className="text-gray-600 mt-1">تصدير بيانات الطلبات بصيغ مختلفة</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreview}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <i className="ri-eye-line ml-2"></i>
            معاينة
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <i className="ri-loader-4-line animate-spin ml-2"></i>
                جاري التصدير...
              </span>
            ) : (
              <>
                <i className="ri-download-line ml-2"></i>
                تصدير
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Options */}
        <div className="space-y-6">
          <ExportOptions 
            config={exportConfig} 
            onConfigChange={setExportConfig} 
          />
          
          <ExportFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        </div>

        {/* Preview */}
        <div>
          <ExportPreview data={previewData} />
        </div>
      </div>
    </div>
  );
} 