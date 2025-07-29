'use client';

import { useState } from 'react';
import { CreateUserData } from '../../../../lib/userService';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => Promise<void>;
}

export default function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    full_name: '',
    email: '',
    username: '',
    password: '',
    university: '',
    college: '',
    major_name: '',
    is_active: true,
    user_role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // التحقق من صحة البيانات
    if (!formData.full_name.trim()) {
      setError('الاسم الكامل مطلوب');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      setLoading(false);
      return;
    }

    if (!formData.username.trim()) {
      setError('اسم المستخدم مطلوب');
      setLoading(false);
      return;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        full_name: '',
        email: '',
        username: '',
        password: '',
        university: '',
        college: '',
        major_name: '',
        is_active: true,
        user_role: 'user'
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إنشاء المستخدم');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">إضافة مستخدم جديد</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 rtl:space-x-reverse">
            <i className="ri-error-warning-fill text-red-500"></i>
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم الكامل */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            {/* اسم المستخدم */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم المستخدم"
              />
            </div>

            {/* كلمة المرور */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل كلمة المرور"
              />
            </div>

            {/* الجامعة */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                الجامعة
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم الجامعة"
              />
            </div>

            {/* الكلية */}
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
                الكلية
              </label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم الكلية"
              />
            </div>

            {/* التخصص */}
            <div>
              <label htmlFor="major_name" className="block text-sm font-medium text-gray-700 mb-2">
                التخصص
              </label>
              <input
                type="text"
                id="major_name"
                name="major_name"
                value={formData.major_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل التخصص"
              />
            </div>

            {/* الدور */}
            <div>
              <label htmlFor="user_role" className="block text-sm font-medium text-gray-700 mb-2">
                الدور
              </label>
              <select
                id="user_role"
                name="user_role"
                value={formData.user_role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">مستخدم</option>
                <option value="staff">موظف</option>
                <option value="admin">مدير</option>
                <option value="moderator">مشرف</option>
                <option value="editor">محرر</option>
              </select>
            </div>
          </div>

          {/* الخيارات المتقدمة */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">الصلاحيات</h3>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                حساب نشط
              </label>
            </div>


          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>{loading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 