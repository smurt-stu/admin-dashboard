'use client';

import { useEffect } from 'react';
import { ProductType } from '../../../../../../lib/products';
import DynamicFieldsTab from '../../../create/components/DynamicFieldsTab';

interface SpecificationsTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  selectedProductTypeWithSettings: ProductType | null;
}

export default function SpecificationsTab({
  formData,
  handleInputChange,
  selectedProductTypeWithSettings
}: SpecificationsTabProps) {
  
  // تتبع التغييرات في المكون
  useEffect(() => {
    console.log('SpecificationsTab: Component mounted/updated', {
      hasSelectedProductType: !!selectedProductTypeWithSettings,
      productTypeId: selectedProductTypeWithSettings?.id,
      customFieldsData: formData.custom_fields_data
    });
  }, [selectedProductTypeWithSettings, formData.custom_fields_data]);

  const handleSpecificationsChange = (field: 'ar' | 'en', value: string) => {
    console.log('SpecificationsTab: Specifications changed', { field, value });
    handleInputChange('specifications', {
      ...(formData.specifications || {}),
      [field]: value
    });
  };

  const handleCustomFieldsChange = (data: any) => {
    console.log('SpecificationsTab: Custom fields changed', { data });
    // تحديث البيانات مع الحفاظ على الحقول الأخرى
    Object.keys(data).forEach(key => {
      if (key === 'custom_fields_data') {
        handleInputChange('custom_fields_data', data[key]);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المواصفات الأساسية</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المواصفات بالعربية
            </label>
            <textarea
              value={formData.specifications?.ar || ''}
              onChange={(e) => handleSpecificationsChange('ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="المواصفات باللغة العربية"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المواصفات بالإنجليزية
            </label>
            <textarea
              value={formData.specifications?.en || ''}
              onChange={(e) => handleSpecificationsChange('en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="المواصفات باللغة الإنجليزية"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الحقول المخصصة</h3>
        {selectedProductTypeWithSettings ? (
          <DynamicFieldsTab
            formData={formData}
            setFormData={handleCustomFieldsChange}
            selectedProductType={selectedProductTypeWithSettings}
            isEditMode={true}
          />
        ) : (
          <p className="text-gray-500">جاري تحميل إعدادات نوع المنتج...</p>
        )}
      </div>
    </div>
  );
} 