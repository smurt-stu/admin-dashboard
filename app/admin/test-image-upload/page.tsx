'use client';

import { useState, useRef } from 'react';
import { ImageService } from '../../../lib/products/imageService';
import { validateImageFile } from '../../../lib/products/utils';

export default function TestImageUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [productId, setProductId] = useState<string>('c11146fe-aba0-4950-91e9-5bb2dbe31639'); // معرف المنتج الافتراضي
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // التحقق من صحة UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      setError('معرف المنتج يجب أن يكون UUID صحيح');
      return;
    }
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // التحقق من صحة الملف
        const validationErrors = validateImageFile(file);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(', '));
        }
        
        // رفع الصورة
        const imageData = {
          product: productId, // معرف المنتج من الحقل
          image: file,
          image_type: i === 0 ? 'main' : 'gallery',
          alt_text: {
            ar: `صورة اختبار ${i + 1}`,
            en: `Test image ${i + 1}`
          },
          sort_order: i + 1
        };
        
        const uploadedImage = await ImageService.uploadProductImage(imageData);
        uploadedImages.push(uploadedImage);
        
        // تحديث التقدم
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      
      setImages([...images, ...uploadedImages]);
      setSuccess(`تم رفع ${uploadedImages.length} صورة بنجاح!`);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطأ في رفع الصور');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = async (imageId: string) => {
    try {
      await ImageService.deleteProductImage(parseInt(imageId));
      setImages(images.filter(img => img.id !== imageId));
      setSuccess('تم حذف الصورة بنجاح!');
    } catch (error) {
      setError('خطأ في حذف الصورة');
    }
  };

  const setMainImage = async (imageId: string) => {
    try {
      await ImageService.setMainImage(parseInt(imageId));
      setImages(images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
      setSuccess('تم تعيين الصورة كرئيسية بنجاح!');
    } catch (error) {
      setError('خطأ في تعيين الصورة الرئيسية');
    }
  };

  const loadProductImages = async () => {
    // التحقق من صحة UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      setError('معرف المنتج يجب أن يكون UUID صحيح');
      return;
    }
    
    try {
      // استخدام UUID مباشرة
      const productImages = await ImageService.getProductImages(productId);
      setImages(productImages);
      setSuccess(`تم تحميل ${productImages.length} صورة للمنتج ${productId}`);
    } catch (error) {
      setError('خطأ في تحميل صور المنتج');
    }
  };

  const validateProduct = async () => {
    // التحقق من صحة UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      setError('معرف المنتج يجب أن يكون UUID صحيح');
      return;
    }
    
    try {
      const exists = await ImageService.validateProductExists(productId);
      if (exists) {
        setSuccess('المنتج موجود ويمكن رفع الصور له');
      } else {
        setError('المنتج غير موجود في قاعدة البيانات');
      }
    } catch (error) {
      setError('خطأ في التحقق من المنتج');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">اختبار نظام رفع الصور</h1>
        <p className="text-gray-600">صفحة اختبار لنظام رفع صور المنتجات حسب التقرير المرفق</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* منطقة رفع الصور */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">رفع الصور</h2>
            
            {/* حقل معرف المنتج */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                معرف المنتج *
              </label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل معرف المنتج (UUID)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                معرف المنتج الذي تريد رفع الصور له (UUID)
              </p>
              <div className="flex space-x-2 rtl:space-x-reverse mt-2">
                <button
                  type="button"
                  onClick={validateProduct}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  التحقق من المنتج
                </button>
                <button
                  type="button"
                  onClick={loadProductImages}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  تحميل صور المنتج
                </button>
              </div>
            </div>
            
            {/* منطقة رفع الصور */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <div className="space-y-4">
                <i className="ri-image-line text-4xl text-gray-400"></i>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    اسحب الصور هنا أو انقر للاختيار
                  </h3>
                  <p className="text-sm text-gray-500">
                    يمكنك رفع عدة صور مرة واحدة
                  </p>
                </div>
                
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? 'جاري الرفع...' : 'اختيار الصور'}
                </button>
              </div>
            </div>
            
            {/* شريط التقدم */}
            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round(uploadProgress)}% مكتمل
                </p>
              </div>
            )}
          </div>

          {/* إرشادات الصور */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">إرشادات الصور</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• الحد الأقصى لحجم الملف: 5MB</li>
              <li>• الأنواع المدعومة: JPG, PNG, WebP</li>
              <li>• الأبعاد المفضلة: 800×600 بكسل</li>
              <li>• الصورة الأولى ستكون الصورة الرئيسية</li>
              <li>• يمكنك إعادة ترتيب الصور لاحقاً</li>
            </ul>
          </div>

          {/* معلومات API */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">معلومات API</h5>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Base URL:</strong> https://smart-ai-api.onrender.com/api/v1/store/products/</p>
              <p><strong>Endpoint:</strong> /images/</p>
              <p><strong>Method:</strong> POST</p>
              <p><strong>Content-Type:</strong> multipart/form-data</p>
            </div>
          </div>
        </div>

        {/* معرض الصور */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">الصور المرفوعة</h2>
            
            {images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="ri-image-line text-4xl mb-2"></i>
                <p>لا توجد صور مرفوعة</p>
                <p className="text-sm">ارفع صوراً لعرضها هنا</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={image.image}
                        alt={image.alt_text?.ar || 'صورة المنتج'}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 rtl:space-x-reverse">
                          {!image.is_primary && (
                            <button
                              onClick={() => setMainImage(image.id)}
                              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                              title="تعيين كصورة رئيسية"
                            >
                              <i className="ri-star-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(image.id)}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            title="حذف الصورة"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      {image.is_primary && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            رئيسية
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.alt_text?.ar || 'بدون وصف'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {image.image_type} • {image.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* إحصائيات */}
          {images.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{images.length}</p>
                  <p className="text-sm text-gray-600">إجمالي الصور</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {images.filter(img => img.is_primary).length}
                  </p>
                  <p className="text-sm text-gray-600">الصور الرئيسية</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* رسائل الحالة */}
      <div className="mt-6 space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <i className="ri-error-warning-line text-red-500 mr-2"></i>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <i className="ri-check-line text-green-500 mr-2"></i>
              <p className="text-green-600">{success}</p>
            </div>
          </div>
        )}
      </div>

      {/* معلومات تقنية */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات تقنية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">الميزات المدعومة</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ رفع ملفات حقيقية</li>
              <li>✅ التحقق من صحة الملفات</li>
              <li>✅ معالجة الأخطاء</li>
              <li>✅ مؤشرات التقدم</li>
              <li>✅ Drag & Drop</li>
              <li>✅ إدارة الصور الرئيسية</li>
              <li>✅ حذف الصور</li>
              <li>✅ دعم متعدد اللغات</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">التحسينات المطلوبة</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>🔄 ربط مع API الفعلي</li>
              <li>🔄 إعادة ترتيب الصور</li>
              <li>🔄 تحرير الصور الأساسي</li>
              <li>🔄 ضغط الصور</li>
              <li>🔄 معاينة أفضل</li>
              <li>🔄 دعم الملفات الكبيرة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 