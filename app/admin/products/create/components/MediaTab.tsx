'use client';

import { useState, useRef } from 'react';
import { ImageService } from '../../../../../lib/products';
import { validateImageFile } from '../../../../../lib/products/utils';
import FileUpload from '../../../components/FileUpload';
import ImagePreview from '../../../components/ImagePreview';

interface MediaTabProps {
  formData: any;
  setFormData: (data: any) => void;
  productType: string;
}

export default function MediaTab({ formData, setFormData, productType }: MediaTabProps) {
  const [activeTab, setActiveTab] = useState<'images' | 'files'>('images');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // رفع الصورة الرئيسية أثناء إنشاء المنتج
  const handleMainImageUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // التحقق من صحة الملف
    const validationErrors = validateImageFile(file);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    // حفظ الصورة في formData
    handleInputChange('main_image_file', file);
    handleInputChange('main_image', URL.createObjectURL(file));
    
    setSuccess('تم اختيار الصورة الرئيسية بنجاح!');
    setError(null);
  };

  // رفع الصور للمنتج
  const handleImageUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    // التحقق من وجود معرف المنتج
    if (!formData.id) {
      setError('يجب حفظ المنتج أولاً قبل رفع الصور الإضافية');
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

        const imageData = {
          product: formData.id,
          image: file,
          image_type: i === 0 ? 'main' : 'gallery',
          alt_text: {
            ar: `صورة ${i + 1} للمنتج`,
            en: `Product image ${i + 1}`
          },
          sort_order: i + 1
        };

        const uploadedImage = await ImageService.uploadProductImage(imageData);
        uploadedImages.push(uploadedImage);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      setProductImages([...productImages, ...uploadedImages]);
      setSuccess(`تم رفع ${uploadedImages.length} صورة بنجاح!`);
      
      // تحديث الصورة الرئيسية في النموذج
      if (uploadedImages.length > 0) {
        const mainImage = uploadedImages.find(img => img.image_type === 'main');
        if (mainImage) {
          handleInputChange('main_image', mainImage.image);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطأ في رفع الصور');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // حذف صورة
  const handleDeleteImage = async (imageId: number) => {
    try {
      await ImageService.deleteProductImage(imageId);
      setProductImages(prev => prev.filter(img => img.id !== imageId));
      setSuccess('تم حذف الصورة بنجاح');
    } catch (error) {
      setError('خطأ في حذف الصورة');
    }
  };

  // تعيين صورة كرئيسية
  const handleSetMainImage = async (imageId: number) => {
    try {
      await ImageService.setMainImage(imageId);
      setProductImages(prev => prev.map(img => ({
        ...img,
        image_type: img.id === imageId ? 'main' : 'gallery'
      })));
      setSuccess('تم تعيين الصورة الرئيسية بنجاح');
    } catch (error) {
      setError('خطأ في تعيين الصورة الرئيسية');
    }
  };

  // تحميل صور المنتج
  const loadProductImages = async () => {
    if (!formData.id) return;
    
    try {
      const images = await ImageService.getProductImages(formData.id);
      setProductImages(images);
    } catch (error) {
      console.error('خطأ في تحميل صور المنتج:', error);
    }
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    
    const newImage = {
      id: Date.now().toString(),
      image_url: newImageUrl.trim(),
      caption: newImageCaption.trim(),
      alt_text: newImageCaption.trim(),
      image_type: 'gallery',
      is_primary: false
    };

    setFormData((prev: any) => ({
      ...prev,
      images: [...(prev.images || []), newImage]
    }));

    setNewImageUrl('');
    setNewImageCaption('');
  };

  const removeImage = (imageId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images?.filter((img: any) => img.id !== imageId) || []
    }));
  };

  const setPrimaryImage = (imageId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images?.map((img: any) => ({
        ...img,
        is_primary: img.id === imageId
      })) || []
    }));
  };

  const getDigitalFilesSection = () => {
    if (productType !== 'digital') return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">الملفات الرقمية</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الملف الرقمي الرئيسي *
            </label>
            <input
              type="url"
              value={formData.digital_file || ''}
              onChange={(e) => handleInputChange('digital_file', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/file.pdf"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              رابط الملف الرقمي الذي سيتم بيعه (PDF, EPUB, MP4, etc.)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab('images')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'images'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الصور
          </button>
          {productType === 'digital' && (
            <button
              onClick={() => setActiveTab('files')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الملفات الرقمية
            </button>
          )}
        </nav>
      </div>

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          {/* الصورة الرئيسية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">الصورة الرئيسية</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رفع الصورة الرئيسية *
                </label>
                <FileUpload
                  onUpload={handleMainImageUpload}
                  multiple={false}
                  accept="image/*"
                  disabled={uploading}
                  className="mb-4"
                />
                <p className="text-xs text-gray-500">
                  الصورة الرئيسية ستظهر في صفحة المنتج والقوائم
                </p>
              </div>
              
              {formData.main_image && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">معاينة الصورة الرئيسية</label>
                  <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={formData.main_image}
                      alt="الصورة الرئيسية"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}
            </div>
          </div>

          {/* رفع الصور الإضافية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">رفع الصور الإضافية</h4>
            
            {!formData.id ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  يمكنك رفع الصور الإضافية بعد حفظ المنتج
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <FileUpload
                  onUpload={handleImageUpload}
                  multiple={true}
                  accept="image/*"
                  disabled={uploading}
                  className="mb-4"
                />
                
                {uploading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-blue-800 text-sm">جاري رفع الصور... {uploadProgress.toFixed(0)}%</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={loadProductImages}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  تحميل صور المنتج
                </button>
              </div>
            )}
          </div>

          {/* معرض الصور */}
          {productImages.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">معرض الصور ({productImages.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productImages.map((image) => (
                  <ImagePreview
                    key={image.id}
                    image={image}
                    onDelete={() => handleDeleteImage(image.id)}
                    onSetMain={() => handleSetMainImage(image.id)}
                    isMain={image.image_type === 'main'}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* الصورة الرئيسية (للتوافق مع النظام القديم) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">الصورة الرئيسية (رابط خارجي)</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رابط الصورة الرئيسية (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.main_image || ''}
                  onChange={(e) => handleInputChange('main_image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  يمكنك إضافة رابط صورة خارجية أو رفع الصور أعلاه
                </p>
                {formData.main_image && (
                  <div className="mt-3">
                    <img
                      src={formData.main_image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">معرض الصور</h4>
            
            {/* Add New Image */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h5 className="font-medium text-gray-900 mb-3">إضافة صورة جديدة</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    وصف الصورة
                  </label>
                  <input
                    type="text"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وصف الصورة"
                  />
                </div>
              </div>
              <button
                onClick={addImage}
                disabled={!newImageUrl.trim()}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
              >
                <i className="ri-add-line"></i>
                <span>إضافة صورة</span>
              </button>
            </div>

            {/* Gallery Grid */}
            {formData.images && formData.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.images.map((image: any) => (
                  <div key={image.id} className="relative group">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={image.image_url}
                        alt={image.caption || 'صورة المنتج'}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => setPrimaryImage(image.id)}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                            title="تعيين كصورة رئيسية"
                          >
                            <i className="ri-star-line"></i>
                          </button>
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
                        {image.caption || 'بدون وصف'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {image.image_url}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="ri-image-line text-4xl mb-2"></i>
                <p>لا توجد صور في المعرض</p>
                <p className="text-sm">أضف صوراً لعرضها في معرض المنتج</p>
              </div>
            )}
          </div>

          {/* Image Guidelines */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">إرشادات الصور</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• استخدم صور عالية الجودة (أقل من 2MB)</li>
              <li>• الأبعاد المفضلة: 800×600 بكسل</li>
              <li>• الصيغ المدعومة: JPG, PNG, WebP</li>
              <li>• تأكد من أن الصورة واضحة ومضيئة</li>
              <li>• يمكنك إضافة عدة صور لمعرض المنتج</li>
              <li>• الصورة الأولى ستكون الصورة الرئيسية</li>
            </ul>
          </div>
        </div>
      )}

      {/* Digital Files Tab */}
      {activeTab === 'files' && getDigitalFilesSection()}
    </div>
  );
} 