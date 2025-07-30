'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductTypeService } from '../../../../lib/products';

interface CustomField {
  name: string;
  label: {
    ar: string;
    en: string;
  };
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'date' | 'url' | 'email' | 'phone' | 'json';
  required: boolean;
  searchable: boolean;
  filterable: boolean;
  options?: string[];
  default_value?: any;
}

interface ProductTypeFormData {
  name: string;
  display_name: {
    ar: string;
    en: string;
  };
  description: string;
  icon: string;
  color: string;
  is_digital: boolean;
  requires_shipping: boolean;
  track_stock: boolean;
  has_variants: boolean;
  template_name: string;
  display_order: number;
  is_active: boolean;
  custom_fields: CustomField[];
}

export default function CreateProductTypePage() {
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductTypeFormData>({
    name: '',
    display_name: { ar: '', en: '' },
    description: '',
    icon: 'ri-box-line',
    color: '#3B82F6',
    is_digital: false,
    requires_shipping: true,
    track_stock: true,
    has_variants: false,
    template_name: '',
    display_order: 0,
    is_active: true,
    custom_fields: []
  });

  const handleInputChange = (field: string, value: any, lang?: string) => {
    setFormData(prev => {
      if (lang) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof ProductTypeFormData],
            [lang]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const addCustomField = () => {
    const newField: CustomField = {
      name: '',
      label: { ar: '', en: '' },
      type: 'text',
      required: false,
      searchable: false,
      filterable: false,
      options: [],
      default_value: ''
    };
    
    setFormData(prev => ({
      ...prev,
      custom_fields: [...prev.custom_fields, newField]
    }));
  };

  const updateCustomField = (index: number, field: Partial<CustomField>) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.map((f, i) => 
        i === index ? { ...f, ...field } : f
      )
    }));
  };

  const removeCustomField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((_, i) => i !== index)
    }));
  };

  const addOption = (fieldIndex: number) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.map((field, i) => 
        i === fieldIndex 
          ? { ...field, options: [...(field.options || []), ''] }
          : field
      )
    }));
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.map((field, i) => 
        i === fieldIndex 
          ? { 
              ...field, 
              options: field.options?.map((opt, j) => 
                j === optionIndex ? value : opt
              ) || []
            }
          : field
      )
    }));
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.map((field, i) => 
        i === fieldIndex 
          ? { 
              ...field, 
              options: field.options?.filter((_, j) => j !== optionIndex) || []
            }
          : field
      )
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('اسم نوع المنتج مطلوب');
    }

    if (!formData.display_name.ar && !formData.display_name.en) {
      errors.push('يجب إدخال اسم العرض باللغة العربية أو الإنجليزية');
    }

    // التحقق من الحقول المخصصة
    formData.custom_fields.forEach((field, index) => {
      if (!field.name.trim()) {
        errors.push(`اسم الحقل المخصص رقم ${index + 1} مطلوب`);
      }
      if (!field.label.ar && !field.label.en) {
        errors.push(`تسمية الحقل "${field.name}" مطلوبة`);
      }
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        errors.push(`الحقل "${field.name}" من نوع قائمة منسدلة ويحتاج خيارات`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const productTypeData = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        is_digital: formData.is_digital,
        requires_shipping: formData.requires_shipping,
        track_stock: formData.track_stock,
        has_variants: formData.has_variants,
        template_name: formData.template_name,
        display_order: formData.display_order,
        is_active: formData.is_active,
        settings: {
          custom_fields: formData.custom_fields
        }
      };

      const response = await ProductTypeService.createProductType(productTypeData);
      
      if (response?.id) {
        router.push(`/admin/product-types/${response.id}/edit`);
      } else {
        router.push('/admin/product-types');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setError(`فشل في إنشاء نوع المنتج: ${errorMessage}`);
      console.error('Error creating product type:', err);
    } finally {
      setSaving(false);
    }
  };

  const fieldTypes = [
    { value: 'text', label: 'نص' },
    { value: 'number', label: 'رقم' },
    { value: 'boolean', label: 'نعم/لا' },
    { value: 'select', label: 'قائمة منسدلة' },
    { value: 'color', label: 'لون' },
    { value: 'date', label: 'تاريخ' },
    { value: 'url', label: 'رابط' },
    { value: 'email', label: 'بريد إلكتروني' },
    { value: 'phone', label: 'رقم هاتف' },
    { value: 'json', label: 'بيانات JSON' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Link
              href="/admin/product-types"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 rtl:space-x-reverse"
            >
              <i className="ri-arrow-right-line"></i>
              <span>العودة لأنواع المنتجات</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">إضافة نوع منتج جديد</h1>
          <p className="text-gray-600 mt-1">إنشاء نوع منتج جديد مع الحقول المخصصة</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Link
            href="/admin/product-types"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            إلغاء
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-line text-red-400"></i>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-red-800">خطأ في إنشاء نوع المنتج</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم النوع (مفتاح النظام) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثل: book, electronics"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأيقونة
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ri-box-line"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العرض (العربية)
                  </label>
                  <input
                    type="text"
                    value={formData.display_name.ar}
                    onChange={(e) => handleInputChange('display_name', e.target.value, 'ar')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثل: كتاب"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العرض (الإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={formData.display_name.en}
                    onChange={(e) => handleInputChange('display_name', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثل: Book"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="وصف نوع المنتج"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">إعدادات النوع</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="is_digital"
                      checked={formData.is_digital}
                      onChange={(e) => handleInputChange('is_digital', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_digital" className="text-sm font-medium text-gray-700">
                      منتج رقمي
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="requires_shipping"
                      checked={formData.requires_shipping}
                      onChange={(e) => handleInputChange('requires_shipping', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="requires_shipping" className="text-sm font-medium text-gray-700">
                      يتطلب شحن
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="track_stock"
                      checked={formData.track_stock}
                      onChange={(e) => handleInputChange('track_stock', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="track_stock" className="text-sm font-medium text-gray-700">
                      تتبع المخزون
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="has_variants"
                      checked={formData.has_variants}
                      onChange={(e) => handleInputChange('has_variants', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="has_variants" className="text-sm font-medium text-gray-700">
                      يدعم المتغيرات
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قالب العرض
                  </label>
                  <input
                    type="text"
                    value={formData.template_name}
                    onChange={(e) => handleInputChange('template_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم قالب العرض المخصص"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتيب العرض
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">الحقول المخصصة</h2>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <i className="ri-add-line"></i>
                  <span>إضافة حقل</span>
                </button>
              </div>
              
              {formData.custom_fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="ri-settings-3-line text-4xl mb-2"></i>
                  <p>لا توجد حقول مخصصة</p>
                  <p className="text-sm">اضغط على "إضافة حقل" لإنشاء حقول مخصصة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.custom_fields.map((field, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-md font-medium text-gray-900">الحقل {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeCustomField(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اسم الحقل *
                          </label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateCustomField(index, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="مثل: author"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            نوع الحقل
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => updateCustomField(index, { type: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {fieldTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            التسمية (العربية)
                          </label>
                          <input
                            type="text"
                            value={field.label.ar}
                            onChange={(e) => updateCustomField(index, { 
                              label: { ...field.label, ar: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="مثل: المؤلف"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            التسمية (الإنجليزية)
                          </label>
                          <input
                            type="text"
                            value={field.label.en}
                            onChange={(e) => updateCustomField(index, { 
                              label: { ...field.label, en: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="مثل: Author"
                          />
                        </div>
                      </div>

                      {/* Options for select type */}
                      {field.type === 'select' && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              الخيارات
                            </label>
                            <button
                              type="button"
                              onClick={() => addOption(index)}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <i className="ri-add-line"></i> إضافة خيار
                            </button>
                          </div>
                          <div className="space-y-2">
                            {field.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex space-x-2 rtl:space-x-reverse">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="أدخل الخيار"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(index, optionIndex)}
                                  className="text-red-600 hover:text-red-700 px-2"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Field Settings */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input
                            type="checkbox"
                            id={`required_${index}`}
                            checked={field.required}
                            onChange={(e) => updateCustomField(index, { required: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`required_${index}`} className="text-sm text-gray-700">
                            مطلوب
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input
                            type="checkbox"
                            id={`searchable_${index}`}
                            checked={field.searchable}
                            onChange={(e) => updateCustomField(index, { searchable: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`searchable_${index}`} className="text-sm text-gray-700">
                            قابل للبحث
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input
                            type="checkbox"
                            id={`filterable_${index}`}
                            checked={field.filterable}
                            onChange={(e) => updateCustomField(index, { filterable: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`filterable_${index}`} className="text-sm text-gray-700">
                            قابل للفلترة
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h2>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  تفعيل نوع المنتج
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات</h3>
            
            <div className="space-y-3">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    <span>حفظ نوع المنتج</span>
                  </>
                )}
              </button>
              
              <Link
                href="/admin/product-types"
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-close-line"></i>
                <span>إلغاء</span>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">نصائح</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• استخدم أسماء واضحة لنوع المنتج</li>
                <li>• اختر الإعدادات المناسبة لنوع المنتج</li>
                <li>• أضف الحقول المخصصة حسب الحاجة</li>
                <li>• استخدم الحقول القابلة للبحث والفلترة بحكمة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 