'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
  onSave?: () => Promise<void>;
  saveButtonText?: string;
  cancelButtonText?: string;
  warningMessage?: string;
}

export default function UnsavedChangesWarning({
  hasUnsavedChanges,
  onSave,
  saveButtonText = 'حفظ التغييرات',
  cancelButtonText = 'إلغاء',
  warningMessage = 'لديك تغييرات غير محفوظة. هل تريد حفظها قبل المغادرة؟'
}: UnsavedChangesWarningProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showWarning, setShowWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // مراقبة التغييرات غير المحفوظة
  useEffect(() => {
    if (hasUnsavedChanges) {
      showToast({
        type: 'warning',
        title: 'تغييرات غير محفوظة',
        message: 'لديك تغييرات غير محفوظة. تأكد من حفظ التغييرات قبل المغادرة.',
        duration: 4000
      });
    }
  }, [hasUnsavedChanges, showToast]);

  // التحذير عند محاولة مغادرة الصفحة
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = warningMessage;
        return warningMessage;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        setShowWarning(true);
        setPendingNavigation(window.location.pathname);
        return false;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, warningMessage]);

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      await onSave();
      setShowWarning(false);
      setPendingNavigation(null);
      
      // إذا كان هناك انتقال معلق، قم به الآن
      if (pendingNavigation) {
        router.push(pendingNavigation);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setShowWarning(false);
    setPendingNavigation(null);
    
    // إذا كان هناك انتقال معلق، قم به الآن
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleCancel = () => {
    setShowWarning(false);
    setPendingNavigation(null);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-start space-x-3 rtl:space-x-reverse mb-4">
          <div className="flex-shrink-0">
            <i className="ri-alert-line text-yellow-500 text-xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              تغييرات غير محفوظة
            </h3>
            <p className="text-sm text-gray-600">
              {warningMessage}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 rtl:space-x-reverse justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelButtonText}
          </button>
          
          <button
            onClick={handleDiscard}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
          >
            تجاهل التغييرات
          </button>
          
          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center space-x-2 rtl:space-x-reverse"
            >
              {isSaving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isSaving ? 'جاري الحفظ...' : saveButtonText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook لاستخدام التحذير من التغييرات غير المحفوظة
export function useUnsavedChanges(hasUnsavedChanges: boolean) {
  const { showToast } = useToast();

  useEffect(() => {
    if (hasUnsavedChanges) {
      showToast({
        type: 'warning',
        title: 'تغييرات غير محفوظة',
        message: 'لديك تغييرات غير محفوظة. تأكد من حفظ التغييرات قبل المغادرة.',
        duration: 4000
      });
    }
  }, [hasUnsavedChanges, showToast]);

  return {
    hasUnsavedChanges
  };
} 