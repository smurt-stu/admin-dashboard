'use client';

import { useState, useEffect } from 'react';
import { ProductType, CustomField } from '../../../../../lib/products/types';

interface DynamicFieldsTabProps {
  formData: any;
  setFormData: (data: any) => void;
  selectedProductType: ProductType | null;
  isEditMode?: boolean;
}

interface FieldSchema {
  basic_fields: string[];
  custom_fields: CustomField[];
}

export default function DynamicFieldsTab({ formData, setFormData, selectedProductType, isEditMode = false }: DynamicFieldsTabProps) {
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [fieldSchema, setFieldSchema] = useState<FieldSchema | null>(null);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: '',
    label: { ar: '', en: '' },
    type: 'text',
    required: false
  });
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldGroups, setFieldGroups] = useState<Record<string, CustomField[]>>({});

  // جلب مخطط الحقول من الباكند عند تغيير نوع المنتج
  useEffect(() => {
    if (selectedProductType) {
      console.log('Loading field schema for product type:', selectedProductType.id);
      console.log('Selected product type:', selectedProductType);
      console.log('Product type settings:', selectedProductType.settings);
      console.log('Custom fields in settings:', selectedProductType.settings?.custom_fields);
      console.log('Custom fields count:', selectedProductType.settings?.custom_fields?.length || 0);
      
      // إذا كان نوع المنتج يحتوي على حقول مخصصة، قم بتحميلها
      if (selectedProductType.settings?.custom_fields && selectedProductType.settings.custom_fields.length > 0) {
        console.log('Found custom fields, loading schema...');
        loadFieldSchema(selectedProductType.id);
      } else {
        console.log('No custom fields found in product type');
        setFieldSchema(null);
        setCustomFields({});
        setErrors({});
        setGeneralError(null);
        setFieldGroups({});
      }
    } else {
      setFieldSchema(null);
      setCustomFields({});
      setErrors({});
      setGeneralError(null);
      setFieldGroups({});
    }
  }, [selectedProductType]);

  // تحميل البيانات في وضع التعديل
  useEffect(() => {
    if (isEditMode) {
      // تحميل البيانات الموجودة في وضع التعديل
    }
  }, [isEditMode, formData, selectedProductType]);

  const loadFieldSchema = async (productTypeId: string) => {
    try {
      setLoadingSchema(true);
      setGeneralError(null);
      
      console.log('Loading field schema for product type:', productTypeId);
      console.log('Selected product type:', selectedProductType);
      
      // استخدام البيانات المحلية من selectedProductType
      const schema: FieldSchema = {
        basic_fields: ['title', 'description', 'price', 'category'],
        custom_fields: selectedProductType?.settings?.custom_fields || []
      };
      
      console.log('Using local schema:', schema);
      setFieldSchema(schema);
      
      // تنظيم الحقول في مجموعات
      organizeFieldsIntoGroups(schema.custom_fields);
      
      // تهيئة الحقول المخصصة
      let initialFields: Record<string, any> = {};
      
      if (isEditMode && formData.custom_fields_data) {
        // في وضع التعديل، استخدم القيم الموجودة في المنتج
        initialFields = { ...formData.custom_fields_data };
      } else {
        // في وضع الإنشاء، استخدم القيم الافتراضية
        schema.custom_fields.forEach((field: CustomField) => {
          initialFields[field.name] = getDefaultValueForField(field);
        });
      }
      
      console.log('Initial fields:', initialFields);
      setCustomFields(initialFields);
      
      // تحديث formData مع الحقول المخصصة
      updateFormDataWithCustomFields(initialFields);
      
      // محاولة طلب البيانات من الـ API في الخلفية (اختياري)
      try {
        const response = await fetch(`/api/product-types/${productTypeId}/field-schema/`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const apiSchema = await response.json();
          console.log('API schema received:', apiSchema);
          
          // تحديث البيانات إذا كانت مختلفة
          if (JSON.stringify(apiSchema) !== JSON.stringify(schema)) {
            setFieldSchema(apiSchema);
            organizeFieldsIntoGroups(apiSchema.custom_fields || []);
          }
        }
      } catch (apiError) {
        console.log('API not available, using local data:', apiError);
      }
      
    } catch (error) {
      console.error('Error loading field schema:', error);
      setGeneralError('فشل في تحميل مخطط الحقول المخصصة');
    } finally {
      setLoadingSchema(false);
    }
  };

  const organizeFieldsIntoGroups = (fields: CustomField[]) => {
    const groups: Record<string, CustomField[]> = {
      'basic': [],
      'specifications': [],
      'dimensions': [],
      'publishing': [],
      'other': []
    };

    fields.forEach(field => {
      const fieldName = field.name.toLowerCase();
      const fieldLabel = typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name;
      
      if (fieldName.includes('author') || fieldName.includes('publisher') || fieldName.includes('isbn')) {
        groups.publishing.push(field);
      } else if (fieldName.includes('weight') || fieldName.includes('dimension') || fieldName.includes('size')) {
        groups.dimensions.push(field);
      } else if (fieldName.includes('spec') || fieldName.includes('feature') || fieldName.includes('detail')) {
        groups.specifications.push(field);
      } else if (fieldName.includes('title') || fieldName.includes('name') || fieldName.includes('description')) {
        groups.basic.push(field);
      } else {
        groups.other.push(field);
      }
    });

    // إزالة المجموعات الفارغة
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    setFieldGroups(groups);
  };

  const getDefaultValueForField = (field: CustomField): any => {
    switch (field.type) {
      case 'boolean':
        return false;
      case 'number':
        return 0;
      case 'select':
        return field.options && field.options.length > 0 ? field.options[0] : '';
      case 'multilingual':
        return { ar: '', en: '' };
      case 'json':
        return {};
      default:
        return field.default_value || '';
    }
  };

  const updateFormDataWithCustomFields = (fields: Record<string, any>) => {
    setFormData((prev: any) => ({
      ...prev,
      custom_fields_data: fields
    }));
  };

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    const newFields = {
      ...customFields,
      [fieldName]: value
    };
    
    setCustomFields(newFields);
    updateFormDataWithCustomFields(newFields);
    
    // إزالة خطأ الحقل إذا تم ملؤه
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const addCustomField = () => {
    if (!newField.name || !newField.label?.ar) {
      setErrors(prev => ({ ...prev, newField: 'اسم الحقل والتسمية العربية مطلوبة' }));
      return;
    }

    const field: CustomField = {
      name: newField.name,
      label: { ar: newField.label.ar, en: newField.label.en || newField.label.ar },
      type: newField.type || 'text',
      required: newField.required || false,
      options: newField.options || [],
      description: newField.description,
      searchable: newField.searchable || false,
      filterable: newField.filterable || false,
      display_order: fieldSchema?.custom_fields.length || 0
    };

    // إضافة الحقل الجديد إلى المخطط
    if (fieldSchema) {
      const updatedSchema = {
        ...fieldSchema,
        custom_fields: [...fieldSchema.custom_fields, field]
      };
      setFieldSchema(updatedSchema);
      organizeFieldsIntoGroups(updatedSchema.custom_fields);
    }

    // إضافة الحقل إلى البيانات
    const newFields = {
      ...customFields,
      [field.name]: getDefaultValueForField(field)
    };
    setCustomFields(newFields);
    updateFormDataWithCustomFields(newFields);

    // إعادة تعيين نموذج الحقل الجديد
    setNewField({
      name: '',
      label: { ar: '', en: '' },
      type: 'text',
      required: false
    });
    setShowAddField(false);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.newField;
      return newErrors;
    });
  };

  const removeCustomField = (fieldName: string) => {
    const newFields = { ...customFields };
    delete newFields[fieldName];
    setCustomFields(newFields);
    updateFormDataWithCustomFields(newFields);

    // إزالة الحقل من المخطط
    if (fieldSchema) {
      const updatedSchema = {
        ...fieldSchema,
        custom_fields: fieldSchema.custom_fields.filter(f => f.name !== fieldName)
      };
      setFieldSchema(updatedSchema);
      organizeFieldsIntoGroups(updatedSchema.custom_fields);
    }
  };

  const validateAllCustomFields = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!fieldSchema) return newErrors;
    
    fieldSchema.custom_fields.forEach((field: CustomField) => {
      const value = customFields[field.name];
      const error = validateCustomField(field, value);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    return newErrors;
  };

  const validateCustomField = (field: CustomField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      const fieldLabel = typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name;
      return `${fieldLabel} مطلوب`;
    }
    
    if (field.type === 'number' && value && isNaN(Number(value))) {
      const fieldLabel = typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name;
      return `${fieldLabel} يجب أن يكون رقماً`;
    }
    
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      const fieldLabel = typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name;
      return `${fieldLabel} يجب أن يكون بريد إلكتروني صحيح`;
    }
    
    if (field.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
      const fieldLabel = typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name;
      return `${fieldLabel} يجب أن يكون رابط صحيح`;
    }
    
    if (field.type === 'multilingual') {
      const multilingualValue = value as { ar?: string; en?: string };
      if (field.required && (!multilingualValue?.ar || multilingualValue.ar === '')) {
        const fieldLabel = typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name;
        return `${fieldLabel} مطلوب باللغة العربية`;
      }
    }
    
    return null;
  };

  const renderCustomField = (field: CustomField) => {
    const value = customFields[field.name] || '';
    const error = errors[field.name];
    
    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const errorClasses = error ? "border-red-500" : "border-gray-300";

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            rows={3}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, parseFloat(e.target.value) || 0)}
            className={`${baseClasses} ${errorClasses}`}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
            step="any"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          >
            <option value="">اختر {typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="mr-2 text-sm font-medium text-gray-700">{typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}</span>
          </label>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          />
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
              className={`flex-1 ${baseClasses} ${errorClasses}`}
              placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
              required={field.required}
            />
          </div>
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        );

      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleCustomFieldChange(field.name, parsed);
              } catch {
                handleCustomFieldChange(field.name, e.target.value);
              }
            }}
            className={`${baseClasses} ${errorClasses} font-mono text-sm`}
            rows={4}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        );
    }
  };

  const renderMultilingualField = (field: CustomField) => {
    const value = customFields[field.name] || { ar: '', en: '' };
    const error = errors[field.name];
    
    const handleLanguageChange = (lang: 'ar' | 'en', langValue: string) => {
      const newValue = {
        ...value,
        [lang]: langValue
      };
      handleCustomFieldChange(field.name, newValue);
    };

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name} (العربية)
            {field.required && <span className="text-red-500 mr-1">*</span>}
          </label>
          <input
            type="text"
            value={value.ar || ''}
            onChange={(e) => handleLanguageChange('ar', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={typeof field.label === 'string' ? field.label : field.label?.ar || field.label?.en || field.name}
            required={field.required}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {typeof field.label === 'object' ? field.label?.en || field.label?.ar : field.label} (English)
            {field.required && <span className="text-red-500 mr-1">*</span>}
          </label>
          <input
            type="text"
            value={value.en || ''}
            onChange={(e) => handleLanguageChange('en', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={typeof field.label === 'object' ? field.label?.en || field.label?.ar : field.label}
            required={field.required}
          />
        </div>
      </div>
    );
  };

  const renderFieldGroup = (groupName: string, fields: CustomField[]) => {
    const groupTitles: Record<string, string> = {
      'basic': 'المعلومات الأساسية',
      'specifications': 'المواصفات',
      'dimensions': 'الأبعاد والقياسات',
      'publishing': 'معلومات النشر',
      'other': 'معلومات إضافية'
    };

    const groupIcons: Record<string, string> = {
      'basic': 'ri-file-text-line',
      'specifications': 'ri-settings-3-line',
      'dimensions': 'ri-ruler-line',
      'publishing': 'ri-book-line',
      'other': 'ri-information-line'
    };

    const groupColors: Record<string, string> = {
      'basic': 'bg-blue-50 border-blue-200',
      'specifications': 'bg-green-50 border-green-200',
      'dimensions': 'bg-purple-50 border-purple-200',
      'publishing': 'bg-orange-50 border-orange-200',
      'other': 'bg-gray-50 border-gray-200'
    };

    return (
      <div key={groupName} className={`p-6 rounded-lg border ${groupColors[groupName]}`}>
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            groupName === 'basic' ? 'bg-blue-100' :
            groupName === 'specifications' ? 'bg-green-100' :
            groupName === 'dimensions' ? 'bg-purple-100' :
            groupName === 'publishing' ? 'bg-orange-100' :
            'bg-gray-100'
          }`}>
            <i className={`${groupIcons[groupName]} text-xl ${
              groupName === 'basic' ? 'text-blue-600' :
              groupName === 'specifications' ? 'text-green-600' :
              groupName === 'dimensions' ? 'text-purple-600' :
              groupName === 'publishing' ? 'text-orange-600' :
              'text-gray-600'
            }`}></i>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{groupTitles[groupName]}</h4>
            <p className="text-sm text-gray-600">{fields.length} حقل</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field: CustomField) => (
            <div key={field.name} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  {typeof field.label === 'string' 
                    ? field.label 
                    : field.label?.ar || field.label?.en || field.name
                  }
                  {field.required && <span className="text-red-500 mr-1">*</span>}
                  {typeof field.label === 'object' && field.label?.en && field.label.en !== field.label.ar && (
                    <span className="text-xs text-gray-500 mr-2">({field.label.en})</span>
                  )}
                </label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {field.required && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      مطلوب
                    </span>
                  )}
                  {!isEditMode && (
                    <button
                      onClick={() => removeCustomField(field.name)}
                      className="text-red-600 hover:text-red-800 text-sm p-1"
                      title="حذف الحقل"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Render field based on whether it's multilingual or not */}
              {field.type === 'multilingual' ? renderMultilingualField(field) : renderCustomField(field)}
              
              {/* Error message */}
              {errors[field.name] && (
                <p className="text-sm text-red-600 mt-2">{errors[field.name]}</p>
              )}
              
              {/* Field description */}
              {field.description && (
                <p className="text-xs text-gray-500 mt-2">{field.description}</p>
              )}
              
              {/* Field metadata */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500">
                  <span className="flex items-center space-x-1 rtl:space-x-reverse">
                    <i className="ri-settings-3-line"></i>
                    <span>{field.type}</span>
                  </span>
                  {field.searchable && (
                    <span className="flex items-center space-x-1 rtl:space-x-reverse">
                      <i className="ri-search-line"></i>
                      <span>قابل للبحث</span>
                    </span>
                  )}
                  {field.filterable && (
                    <span className="flex items-center space-x-1 rtl:space-x-reverse">
                      <i className="ri-filter-line"></i>
                      <span>قابل للفلترة</span>
                    </span>
                  )}
                  {field.required && (
                    <span className="flex items-center space-x-1 rtl:space-x-reverse text-red-600">
                      <i className="ri-error-warning-line"></i>
                      <span>مطلوب</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAddFieldForm = () => {
    if (!showAddField) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">إضافة حقل مخصص جديد</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحقل</label>
            <input
              type="text"
              value={newField.name}
              onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="اسم الحقل (مثل: author)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحقل</label>
            <select
              value={newField.type}
              onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="text">نص</option>
              <option value="textarea">نص طويل</option>
              <option value="number">رقم</option>
              <option value="select">قائمة منسدلة</option>
              <option value="boolean">نعم/لا</option>
              <option value="date">تاريخ</option>
              <option value="color">لون</option>
              <option value="email">بريد إلكتروني</option>
              <option value="phone">رقم هاتف</option>
              <option value="url">رابط</option>
              <option value="json">بيانات JSON</option>
              <option value="multilingual">متعدد اللغات</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التسمية (العربية)</label>
            <input
              type="text"
              value={newField.label?.ar || ''}
              onChange={(e) => setNewField(prev => ({ 
                ...prev, 
                label: { ar: e.target.value, en: prev.label?.en || '' } 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="التسمية بالعربية"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التسمية (الإنجليزية)</label>
            <input
              type="text"
              value={newField.label?.en || ''}
              onChange={(e) => setNewField(prev => ({ 
                ...prev, 
                label: { ar: prev.label?.ar || '', en: e.target.value } 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="التسمية بالإنجليزية"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse mt-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="mr-2 text-sm font-medium text-gray-700">مطلوب</span>
          </label>
        </div>
        {errors.newField && (
          <p className="text-sm text-red-600 mt-2">{errors.newField}</p>
        )}
        <div className="flex space-x-2 rtl:space-x-reverse mt-4">
          <button
            onClick={addCustomField}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إضافة الحقل
          </button>
          <button
            onClick={() => setShowAddField(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  };

  if (!selectedProductType) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <div className="flex items-center">
          <i className="ri-information-line text-2xl text-yellow-600 ml-3"></i>
          <div>
            <h4 className="text-lg font-semibold text-yellow-800">اختر نوع المنتج أولاً</h4>
            <p className="text-yellow-700">يرجى اختيار نوع المنتج لعرض الحقول المخصصة</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingSchema) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">جارِ تحميل الحقول المخصصة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Error Message */}
      {generalError && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center">
            <i className="ri-error-warning-line text-2xl text-red-600 ml-3"></i>
            <div>
              <h4 className="text-lg font-semibold text-red-800">خطأ في تحميل البيانات</h4>
              <p className="text-red-700">{generalError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Type Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className="ri-settings-3-line text-2xl text-blue-600"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-blue-900">
              {typeof selectedProductType.display_name === 'string' 
                ? selectedProductType.display_name 
                : selectedProductType.display_name?.ar || selectedProductType.display_name?.en || selectedProductType.name
              }
            </h4>
            <p className="text-blue-700">{selectedProductType.description}</p>
            
            {/* Custom Fields Summary */}
            {selectedProductType.settings?.custom_fields && selectedProductType.settings.custom_fields.length > 0 ? (
              <div className="mt-2 flex items-center space-x-4 rtl:space-x-reverse text-sm">
                <span className="flex items-center space-x-1 rtl:space-x-reverse text-green-600">
                  <i className="ri-check-line"></i>
                  <span>{selectedProductType.settings.custom_fields.length} حقل مخصص متاح</span>
                </span>
                <span className="text-blue-600">
                  سيتم عرضها أدناه
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-center space-x-4 rtl:space-x-reverse text-sm">
                <span className="flex items-center space-x-1 rtl:space-x-reverse text-yellow-600">
                  <i className="ri-information-line"></i>
                  <span>لا توجد حقول مخصصة محددة مسبقاً</span>
                </span>
                <span className="text-blue-600">
                  يمكنك إضافة حقول مخصصة جديدة
                </span>
              </div>
            )}
            
            {/* Debug Info */}
            <div className="mt-2 text-xs text-gray-500">
              <p>ID: {selectedProductType.id}</p>
              <p>Custom Fields Count: {selectedProductType.settings?.custom_fields?.length || 0}</p>
              {selectedProductType.settings?.custom_fields && selectedProductType.settings.custom_fields.length > 0 && (
                <div className="mt-1">
                  <p className="font-medium">الحقول المتاحة:</p>
                  <ul className="text-xs">
                    {selectedProductType.settings.custom_fields.map((field: any, index: number) => (
                      <li key={index}>• {field.name} ({field.type})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {fieldSchema && fieldSchema.custom_fields && fieldSchema.custom_fields.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">تقدم ملء الحقول المخصصة</span>
            <span className="text-sm text-gray-500">
              {Object.keys(customFields).filter(key => customFields[key] && customFields[key] !== '').length} / {fieldSchema.custom_fields.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.keys(customFields).filter(key => customFields[key] && customFields[key] !== '').length / fieldSchema.custom_fields.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Add Field Button */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">الحقول المخصصة</h4>
        <button
          onClick={() => setShowAddField(!showAddField)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <i className="ri-add-line"></i>
          <span>إضافة حقل مخصص</span>
        </button>
      </div>

      {/* Add Field Form */}
      {renderAddFieldForm()}

      {/* Custom Fields Groups */}
      {(() => {
        // في وضع التعديل، اعرض الحقول الموجودة في المنتج حتى لو لم تكن في مخطط نوع المنتج
        let fieldsToShow: CustomField[] = [];
        
        console.log('Rendering custom fields...');
        console.log('fieldSchema:', fieldSchema);
        console.log('fieldGroups:', fieldGroups);
        console.log('customFields:', customFields);
        console.log('selectedProductType:', selectedProductType);
        
        if (isEditMode && formData.custom_fields_data && Object.keys(formData.custom_fields_data).length > 0) {
          // تحويل البيانات من المنتج إلى تنسيق CustomField
          fieldsToShow = Object.entries(formData.custom_fields_data).map(([fieldName, fieldValue]) => ({
            name: fieldName,
            label: { ar: fieldName, en: fieldName }, // استخدام اسم الحقل كتسمية مؤقتة
            type: typeof fieldValue === 'object' && fieldValue !== null ? 'multilingual' : 'text',
            required: false,
            options: [],
            description: '',
            searchable: false,
            filterable: false,
            display_order: 0
          }));
          
          console.log('Edit mode fields:', fieldsToShow);
        } else if (fieldSchema && fieldSchema.custom_fields && fieldSchema.custom_fields.length > 0) {
          fieldsToShow = fieldSchema.custom_fields;
          console.log('Schema fields:', fieldsToShow);
        } else if (Object.keys(fieldGroups).length > 0) {
          // استخدام الحقول من المجموعات إذا كانت متاحة
          Object.values(fieldGroups).forEach(groupFields => {
            fieldsToShow.push(...groupFields);
          });
          console.log('Group fields:', fieldsToShow);
        } else if (selectedProductType?.settings?.custom_fields && selectedProductType.settings.custom_fields.length > 0) {
          // استخدام الحقول مباشرة من نوع المنتج إذا لم تكن في المجموعات
          fieldsToShow = selectedProductType.settings.custom_fields;
          console.log('Direct product type fields:', fieldsToShow);
          
          // تنظيم الحقول في مجموعات إذا لم تكن منظمة
          if (Object.keys(fieldGroups).length === 0) {
            organizeFieldsIntoGroups(fieldsToShow);
          }
        }
        
        console.log('Final fields to show:', fieldsToShow);
        
        return fieldsToShow.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(fieldGroups).map(([groupName, fields]) => 
              renderFieldGroup(groupName, fields)
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="text-center">
              <i className="ri-settings-3-line text-4xl text-gray-400 mb-4"></i>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">لا توجد حقول مخصصة</h4>
              <p className="text-gray-600 mb-4">
                {selectedProductType?.settings?.custom_fields && selectedProductType.settings.custom_fields.length > 0 
                  ? 'يبدو أن نوع المنتج المحدد لا يحتوي على حقول مخصصة محددة مسبقاً'
                  : 'نوع المنتج المحدد لا يحتوي على حقول مخصصة'
                }
              </p>
              <p className="text-sm text-gray-500 mb-4">
                يمكنك إضافة حقول مخصصة حسب احتياجاتك باستخدام الزر أدناه
              </p>
              <div className="text-sm text-gray-500 bg-white p-3 rounded border">
                <p className="font-medium mb-2">معلومات التصحيح:</p>
                <p>نوع المنتج: {selectedProductType?.name || 'غير محدد'}</p>
                <p>الحقول المخصصة في النوع: {selectedProductType?.settings?.custom_fields?.length || 0}</p>
                <p>Field Schema: {fieldSchema ? 'محمل' : 'غير محمل'}</p>
                <p>Field Groups: {Object.keys(fieldGroups).length} مجموعة</p>
                <p>Custom Fields: {Object.keys(customFields).length} حقل</p>
                {selectedProductType?.settings?.custom_fields && selectedProductType.settings.custom_fields.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">الحقول المخصصة في النوع:</p>
                    <ul className="text-xs">
                      {selectedProductType.settings.custom_fields.map((field: any, index: number) => (
                        <li key={index}>- {field.name}: {field.type}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedProductType?.settings?.custom_fields && selectedProductType.settings.custom_fields.length === 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-red-600">تحذير: لا توجد حقول مخصصة في نوع المنتج!</p>
                    <p className="text-xs">يجب إضافة حقول مخصصة لنوع المنتج من صفحة إدارة أنواع المنتجات</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Product Type Settings */}
      {selectedProductType.settings && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">إعدادات نوع المنتج</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${selectedProductType.is_digital ? 'file-text-line' : 'box-line'} text-blue-600`}></i>
                <span className="text-sm font-medium text-gray-700">
                  {selectedProductType.is_digital ? 'منتج رقمي' : 'منتج مادي'}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${selectedProductType.requires_shipping ? 'truck-line' : 'download-line'} text-green-600`}></i>
                <span className="text-sm font-medium text-gray-700">
                  {selectedProductType.requires_shipping ? 'يتطلب شحن' : 'لا يتطلب شحن'}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${selectedProductType.track_stock ? 'bar-chart-line' : 'eye-off-line'} text-purple-600`}></i>
                <span className="text-sm font-medium text-gray-700">
                  {selectedProductType.track_stock ? 'تتبع المخزون' : 'لا يتتبع المخزون'}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className={`ri-${selectedProductType.has_variants ? 'git-branch-line' : 'git-commit-line'} text-orange-600`}></i>
                <span className="text-sm font-medium text-gray-700">
                  {selectedProductType.has_variants ? 'يدعم المتغيرات' : 'لا يدعم المتغيرات'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 