'use client';

import { useState, useCallback } from 'react';
// خدمة إدارة صور المنتجات حسب API المطور
class ProductImageService {
  private static API_BASE_URL = 'https://smart-ai-api.onrender.com/api/v1/store/products/';
  
  // الحصول على token من localStorage
  private static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // التحقق من صحة الملفات
  static validateImageFile(file: File): string[] {
    const errors: string[] = [];
    
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, GIF, WEBP');
    }
    
    // التحقق من حجم الملف (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('حجم الملف كبير جداً. الحد الأقصى: 5MB');
    }
    
    return errors;
  }

  // رفع صورة جديدة
  static async uploadImage(productId: string, file: File, options: {
    imageType?: 'main' | 'gallery' | 'thumbnail' | 'variant';
    altText?: { ar: string; en: string };
    caption?: { ar: string; en: string };
    displayOrder?: number;
    isPrimary?: boolean;
  } = {}): Promise<any> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('غير مصرح لك برفع الصور - يرجى تسجيل الدخول كمدير');
    }

    // التحقق من صحة الملف
    const validationErrors = this.validateImageFile(file);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join('\n'));
    }

    const formData = new FormData();
    
    // الحقول المطلوبة
    formData.append('product', productId);
    formData.append('image', file);
    
    // الحقول الاختيارية
    if (options.imageType) {
      formData.append('image_type', options.imageType);
    } else {
      formData.append('image_type', 'gallery');
    }
    
    if (options.altText) {
      formData.append('alt_text', JSON.stringify(options.altText));
    } else {
      formData.append('alt_text', JSON.stringify({
        ar: file.name.replace(/\.[^/.]+$/, ''),
        en: file.name.replace(/\.[^/.]+$/, '')
      }));
    }
    
    if (options.caption) {
      formData.append('caption', JSON.stringify(options.caption));
    } else {
      formData.append('caption', JSON.stringify({
        ar: file.name.replace(/\.[^/.]+$/, ''),
        en: file.name.replace(/\.[^/.]+$/, '')
      }));
    }
    
    if (options.displayOrder !== undefined) {
      formData.append('display_order', options.displayOrder.toString());
    } else {
      formData.append('display_order', '1');
    }
    
    if (options.isPrimary !== undefined) {
      formData.append('is_primary', options.isPrimary.toString());
    } else {
      formData.append('is_primary', 'false');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}images/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في رفع الصورة');
      }

      return await response.json();
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      throw error;
    }
  }

  // معالجة الأخطاء
  static handleError(error: any): string {
    let errorMessage = 'حدث خطأ غير متوقع';
    
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 400:
          errorMessage = 'بيانات غير صحيحة - تأكد من صحة الملف';
          break;
        case 401:
          errorMessage = 'غير مصرح لك برفع الصور - يرجى تسجيل الدخول كمدير';
          break;
        case 403:
          errorMessage = 'ليس لديك صلاحية لرفع الصور';
          break;
        case 404:
          errorMessage = 'المنتج غير موجود';
          break;
        case 413:
          errorMessage = 'حجم الملف كبير جداً - الحد الأقصى 5MB';
          break;
        case 415:
          errorMessage = 'نوع الملف غير مدعوم - يرجى استخدام JPG, PNG, GIF, WEBP';
          break;
        case 500:
          errorMessage = 'خطأ في الخادم - يرجى المحاولة لاحقاً';
          break;
        default:
          errorMessage = `خطأ في الخادم (${status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return errorMessage;
  }
}

interface MediaTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

export default function MediaTab({ formData, handleInputChange }: MediaTabProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const addNewImage = () => {
    if (newImageUrl.trim()) {
      const newImage = {
        image_url: newImageUrl.trim(),
        caption: newImageCaption.trim() || 'صورة المنتج',
        is_primary: false
      };

      const updatedImages = [...(formData.images || []), newImage];
      handleInputChange('images', updatedImages);
      
      // إعادة تعيين الحقول
      setNewImageUrl('');
      setNewImageCaption('');
      setIsAddingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages.splice(index, 1);
    handleInputChange('images', updatedImages);
  };

  const setPrimaryImage = (index: number) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages.forEach((img, i) => {
      img.is_primary = i === index;
    });
    handleInputChange('images', updatedImages);
  };

  // معالجة رفع الملفات باستخدام ProductImageService
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileArray = Array.from(files);
      const totalFiles = fileArray.length;
      let uploadedCount = 0;

      for (const file of fileArray) {
        try {
          // استخدام ProductImageService لرفع الصورة
          const result = await ProductImageService.uploadImage(
            formData.id || 'new',
            file,
            {
              imageType: 'gallery',
              altText: {
                ar: file.name.replace(/\.[^/.]+$/, ''),
                en: file.name.replace(/\.[^/.]+$/, '')
              },
              caption: {
                ar: file.name.replace(/\.[^/.]+$/, ''),
                en: file.name.replace(/\.[^/.]+$/, '')
              },
              displayOrder: 1,
              isPrimary: false
            }
          );
          
          const newImage = {
            id: result.id,
            image_url: result.image_url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            is_primary: false,
            original_name: file.name,
            image_type: 'gallery',
            alt_text: result.alt_text,
            display_order: result.display_order
          };

          const updatedImages = [...(formData.images || []), newImage];
          handleInputChange('images', updatedImages);
          
          uploadedCount++;
          setUploadProgress((uploadedCount / totalFiles) * 100);
        } catch (error) {
          const errorMessage = ProductImageService.handleError(error);
          alert(`فشل في رفع ${file.name}: ${errorMessage}`);
        }
      }

      if (uploadedCount > 0) {
        alert(`تم رفع ${uploadedCount} من ${totalFiles} صورة بنجاح`);
      }
    } catch (error) {
      const errorMessage = ProductImageService.handleError(error);
      alert(`حدث خطأ أثناء رفع الصور: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // معالجة السحب والإفلات
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  // معالجة اختيار الملفات
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* الصورة الرئيسية */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الصورة الرئيسية</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رابط الصورة الرئيسية
          </label>
          <input
            type="url"
            value={formData.main_image}
            onChange={(e) => handleInputChange('main_image', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {formData.main_image && (
            <div className="mt-3">
              <img
                src={formData.main_image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* رفع الصور */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">رفع الصور</h3>
        
        {/* منطقة السحب والإفلات */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <i className="ri-upload-cloud-line text-4xl text-gray-400"></i>
            <div>
              <p className="text-lg font-medium text-gray-900">
                اسحب الصور هنا أو انقر للاختيار
              </p>
              <p className="text-sm text-gray-500 mt-1">
                يدعم JPG, PNG, GIF, WEBP. الحد الأقصى 5MB لكل صورة
              </p>
            </div>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <i className="ri-folder-open-line mr-2"></i>
              اختيار الصور
            </label>
          </div>
        </div>

        {/* مؤشر التقدم */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>جاري رفع الصور...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* إضافة صورة جديدة (بالرابط) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">إضافة صورة بالرابط</h3>
          <button
            type="button"
            onClick={() => setIsAddingImage(!isAddingImage)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <i className="ri-link"></i>
            {isAddingImage ? 'إلغاء' : 'إضافة رابط'}
          </button>
        </div>

        {isAddingImage && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط الصورة
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف الصورة (اختياري)
              </label>
              <input
                type="text"
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="وصف الصورة"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addNewImage}
                disabled={!newImageUrl.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i className="ri-check-line"></i>
                إضافة الصورة
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingImage(false);
                  setNewImageUrl('');
                  setNewImageCaption('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <i className="ri-close-line"></i>
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      {/* معرض الصور */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معرض الصور</h3>
        {formData.images && Array.isArray(formData.images) && formData.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.images.map((image: any, index: number) => (
              <div key={index} className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={image.image_url || image.image}
                    alt={image.caption || 'صورة المنتج'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => setPrimaryImage(index)}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                        title="تعيين كصورة رئيسية"
                      >
                        <i className="ri-star-line"></i>
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                        title="حذف الصورة"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  {image.is_primary && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                      <i className="ri-star-fill"></i>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.caption || 'بدون وصف'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {image.original_name || image.image_url || image.image}
                  </p>
                  {image.image_type && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">
                      {image.image_type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-image-line text-4xl mb-2"></i>
            <p>لا توجد صور في المعرض</p>
            <p className="text-sm">اسحب الصور أو انقر على "اختيار الصور" لإضافة صور للمنتج</p>
          </div>
        )}
      </div>

      {/* الملفات الرقمية */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الملفات الرقمية</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الملف الرقمي الرئيسي
            </label>
            <input
              type="url"
              value={formData.digital_file || ''}
              onChange={(e) => handleInputChange('digital_file', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/file.pdf"
            />
            <p className="text-xs text-gray-500 mt-1">
              رابط الملف الرقمي الذي سيتم بيعه
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              ملف العينة
            </label>
            <input
              type="url"
              value={formData.sample_file || ''}
              onChange={(e) => handleInputChange('sample_file', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/sample.pdf"
            />
            <p className="text-xs text-gray-500 mt-1">
              ملف عينة مجاني للعملاء (اختياري)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 