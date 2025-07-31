'use client';

import Link from 'next/link';

interface EditProductSidebarProps {
  productId: string;
  formData: any;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditProductSidebar({ productId, formData, saving, onSubmit }: EditProductSidebarProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Save button clicked - submitting form');
    onSubmit(e as any);
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={saving}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-save-line"></i>
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
          </button>
          
          <Link
            href={`/admin/products/${productId}`}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <i className="ri-close-line"></i>
            <span>إلغاء</span>
          </Link>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة سريعة</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <p className="text-sm text-gray-900">
              {formData.title || 'غير محدد'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
            <p className="text-sm font-semibold text-blue-600">
              {formData.price ? `${formData.price} د.ك` : 'غير محدد'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                formData.in_stock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.in_stock ? 'متوفر' : 'نفد المخزون'}
              </span>
              {formData.is_featured && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  مميز
                </span>
              )}
              {formData.is_bestseller && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  مبيعات عالية
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 