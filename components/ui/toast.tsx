'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// أنواع الرسائل
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// واجهة الرسالة
export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// واجهة سياق الرسائل
interface ToastContextType {
  showToast: (message: Omit<ToastMessage, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

// إنشاء السياق
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook لاستخدام السياق
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// مكون الرسالة الفردية
const ToastItem = ({ message, onHide }: { message: ToastMessage; onHide: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onHide(message.id), 300);
    }, message.duration || 5000);

    return () => clearTimeout(timer);
  }, [message.id, message.duration, onHide]);

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return (
          <div className="flex-shrink-0">
            <i className="ri-check-circle-line text-green-500 text-xl"></i>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0">
            <i className="ri-error-warning-line text-red-500 text-xl"></i>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0">
            <i className="ri-alert-line text-yellow-500 text-xl"></i>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0">
            <i className="ri-information-line text-blue-500 text-xl"></i>
          </div>
        );
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (message.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBackgroundColor()} border rounded-lg p-4 shadow-lg max-w-sm w-full
      `}
    >
      <div className="flex items-start space-x-3 rtl:space-x-reverse">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${getTextColor()}`}>
            {message.title}
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            {message.message}
          </p>
          {message.action && (
            <button
              onClick={message.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {message.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onHide(message.id), 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>
    </div>
  );
};

// مكون الحاوية الرئيسية
const ToastContainer = ({ messages, onHide }: { messages: ToastMessage[]; onHide: (id: string) => void }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message) => (
        <ToastItem key={message.id} message={message} onHide={onHide} />
      ))}
    </div>
  );
};

// مكون المزود
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = (message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newMessage = { ...message, id };
    setMessages(prev => [...prev, newMessage]);
  };

  const hideToast = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const clearToasts = () => {
    setMessages([]);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearToasts }}>
      {children}
      <ToastContainer messages={messages} onHide={hideToast} />
    </ToastContext.Provider>
  );
};

// مكون مساعد لرسائل المنتجات
export const ProductToast = {
  // رسائل النجاح
  productCreated: (productName: string) => ({
    type: 'success' as ToastType,
    title: 'تم إنشاء المنتج بنجاح',
    message: `تم إنشاء المنتج "${productName}" بنجاح وتم حفظه في النظام.`,
    duration: 5000
  }),

  productUpdated: (productName: string) => ({
    type: 'success' as ToastType,
    title: 'تم تحديث المنتج بنجاح',
    message: `تم تحديث المنتج "${productName}" بنجاح وتم حفظ التغييرات.`,
    duration: 5000
  }),

  productDeleted: (productName: string) => ({
    type: 'success' as ToastType,
    title: 'تم حذف المنتج بنجاح',
    message: `تم حذف المنتج "${productName}" بنجاح من النظام.`,
    duration: 5000
  }),

  imageUploaded: (imageName: string) => ({
    type: 'success' as ToastType,
    title: 'تم رفع الصورة بنجاح',
    message: `تم رفع الصورة "${imageName}" بنجاح وتم حفظها.`,
    duration: 4000
  }),

  // رسائل الخطأ
  productCreationFailed: (error: string) => ({
    type: 'error' as ToastType,
    title: 'فشل في إنشاء المنتج',
    message: `حدث خطأ أثناء إنشاء المنتج: ${error}`,
    duration: 7000
  }),

  productUpdateFailed: (error: string) => ({
    type: 'error' as ToastType,
    title: 'فشل في تحديث المنتج',
    message: `حدث خطأ أثناء تحديث المنتج: ${error}`,
    duration: 7000
  }),

  productDeleteFailed: (error: string) => ({
    type: 'error' as ToastType,
    title: 'فشل في حذف المنتج',
    message: `حدث خطأ أثناء حذف المنتج: ${error}`,
    duration: 7000
  }),

  imageUploadFailed: (error: string) => ({
    type: 'error' as ToastType,
    title: 'فشل في رفع الصورة',
    message: `حدث خطأ أثناء رفع الصورة: ${error}`,
    duration: 6000
  }),

  validationFailed: (errors: string[]) => ({
    type: 'error' as ToastType,
    title: 'أخطاء في البيانات',
    message: `يرجى تصحيح الأخطاء التالية:\n${errors.join('\n')}`,
    duration: 8000
  }),

  // رسائل التحذير
  unsavedChanges: () => ({
    type: 'warning' as ToastType,
    title: 'تغييرات غير محفوظة',
    message: 'لديك تغييرات غير محفوظة. تأكد من حفظ التغييرات قبل المغادرة.',
    duration: 6000
  }),

  // رسائل المعلومات
  loadingData: () => ({
    type: 'info' as ToastType,
    title: 'جاري التحميل',
    message: 'جاري تحميل بيانات المنتج، يرجى الانتظار...',
    duration: 3000
  }),

  savingChanges: () => ({
    type: 'info' as ToastType,
    title: 'جاري الحفظ',
    message: 'جاري حفظ التغييرات، يرجى الانتظار...',
    duration: 3000
  })
}; 