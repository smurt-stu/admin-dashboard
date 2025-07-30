'use client';

import { useState, useRef } from 'react';
import { validateImageFile } from '../../../lib/products/utils';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

export default function FileUpload({ 
  onUpload, 
  multiple = true, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  className = ""
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file, index) => {
      if (file.size > maxSize) {
        errors.push(`الملف ${index + 1}: حجم الملف كبير جداً (الحد الأقصى: ${Math.round(maxSize / 1024 / 1024)}MB)`);
        return;
      }

      if (accept.includes('image/*') && !file.type.startsWith('image/')) {
        errors.push(`الملف ${index + 1}: نوع الملف غير مدعوم`);
        return;
      }

      // التحقق من نوع الملف للصور
      if (accept.includes('image/*')) {
        const imageErrors = validateImageFile(file);
        if (imageErrors.length > 0) {
          errors.push(`الملف ${index + 1}: ${imageErrors.join(', ')}`);
          return;
        }
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return [];
    }

    setError(null);
    return validFiles;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const getAcceptText = () => {
    if (accept.includes('image/*')) {
      return 'الصور المدعومة: JPG, PNG, WebP';
    }
    return 'جميع أنواع الملفات';
  };

  const getIcon = () => {
    if (accept.includes('image/*')) {
      return 'ri-image-line';
    }
    return 'ri-file-line';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-4">
          <i className={`${getIcon()} text-4xl text-gray-400`}></i>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              اسحب الملفات هنا أو انقر للاختيار
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {getAcceptText()}
            </p>
            <p className="text-sm text-gray-500">
              الحد الأقصى: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
          
          {!disabled && (
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              {multiple ? 'اختيار الملفات' : 'اختيار ملف'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <i className="ri-error-warning-line text-red-500 mr-2 mt-0.5"></i>
            <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 