'use client';

interface ImagePreviewProps {
  image: any;
  onDelete?: () => void;
  onSetMain?: () => void;
  onEdit?: () => void;
  isMain?: boolean;
  showActions?: boolean;
  className?: string;
}

export default function ImagePreview({ 
  image, 
  onDelete, 
  onSetMain, 
  onEdit,
  isMain = false, 
  showActions = true,
  className = ""
}: ImagePreviewProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <img
          src={image.image}
          alt={image.alt_text?.ar || image.alt_text?.en || 'صورة المنتج'}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        
        {/* Fallback للصور التي فشل تحميلها */}
        <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <i className="ri-image-line text-4xl mb-2"></i>
            <p className="text-sm">فشل تحميل الصورة</p>
          </div>
        </div>
        
        {/* Overlay للأزرار */}
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 rtl:space-x-reverse">
              {!isMain && onSetMain && (
                <button
                  onClick={onSetMain}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  title="تعيين كصورة رئيسية"
                >
                  <i className="ri-star-line"></i>
                </button>
              )}
              
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-colors"
                  title="تعديل الصورة"
                >
                  <i className="ri-edit-line"></i>
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  title="حذف الصورة"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Badge للصورة الرئيسية */}
        {isMain && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              رئيسية
            </span>
          </div>
        )}
        
        {/* Badge لنوع الصورة */}
        <div className="absolute top-2 left-2">
          <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
            {image.image_type === 'main' ? 'رئيسية' : 
             image.image_type === 'gallery' ? 'معرض' :
             image.image_type === 'thumbnail' ? 'مصغرة' :
             image.image_type === 'variant' ? 'متغير' : image.image_type}
          </span>
        </div>
      </div>
      
      {/* معلومات الصورة */}
      <div className="mt-2 space-y-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {image.alt_text?.ar || image.alt_text?.en || 'بدون وصف'}
        </p>
        
        {image.caption && (
          <p className="text-xs text-gray-500 truncate">
            {image.caption.ar || image.caption.en || image.caption}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>ID: {image.id}</span>
          <span>ترتيب: {image.display_order || image.sort_order || 0}</span>
        </div>
        
        {/* معلومات إضافية */}
        <div className="text-xs text-gray-400">
          {image.created_at && (
            <span>تاريخ الإنشاء: {new Date(image.created_at).toLocaleDateString('ar-SA')}</span>
          )}
        </div>
      </div>
    </div>
  );
} 