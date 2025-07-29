'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService, User, UpdateUserData } from '../../../../../lib/userService';

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getUserById(userId);
      setUser(userData);
      setFormData({
        full_name: userData.full_name,
        email: userData.email,
        username: userData.username,
        university: userData.university,
        college: userData.college,
        major_name: userData.major,
        is_active: userData.is_active,
        user_role: userData.user_role
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // التحقق من صحة البيانات
    if (!formData.full_name?.trim()) {
      setError('الاسم الكامل مطلوب');
      setSaving(false);
      return;
    }

    if (!formData.email?.trim()) {
      setError('البريد الإلكتروني مطلوب');
      setSaving(false);
      return;
    }

    if (!formData.username?.trim()) {
      setError('اسم المستخدم مطلوب');
      setSaving(false);
      return;
    }

    try {
      await UserService.updateUser(userId, formData);
      router.push('/admin/customers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث المستخدم');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-responsive">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <i className="ri-user-line text-gray-300 text-4xl sm:text-6xl mb-4"></i>
        <p className="text-gray-500 text-lg text-responsive">المستخدم غير موجود</p>
        <Link 
          href="/admin/customers" 
          className="text-blue-600 hover:text-blue-700 mt-4 inline-block text-responsive"
        >
          العودة للقائمة
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">تعديل بيانات المستخدم</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <Link 
            href={`/admin/customers/${userId}`}
            className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 rtl:space-x-reverse text-responsive"
          >
            <i className="ri-eye-line"></i>
            <span>عرض التفاصيل</span>
          </Link>
          <Link 
            href="/admin/customers" 
            className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 rtl:space-x-reverse text-responsive"
          >
            <i className="ri-arrow-right-line"></i>
            <span>العودة للقائمة</span>
          </Link>
        </div>
      </div>

      {/* معلومات المستخدم الحالية */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
            user.user_role === 'superuser' ? 'bg-red-100' : user.user_role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            <i className={`${
              user.user_role === 'superuser' ? 'ri-shield-star-fill text-red-600' : 
              user.user_role === 'admin' ? 'ri-shield-user-fill text-purple-600' : 
              'ri-user-fill text-blue-600'
            } text-lg sm:text-xl`}></i>
          </div>
          <div>
            <p className="font-medium text-gray-800 text-responsive">{user.full_name}</p>
            <p className="text-sm text-gray-600 text-responsive">{user.email}</p>
            <p className="text-xs text-gray-500 text-responsive">انضم في: {new Date(user.created_at).toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 rtl:space-x-reverse">
          <i className="ri-error-warning-fill text-red-500"></i>
          <span className="text-red-700 text-responsive">{error}</span>
        </div>
      )}

      <div className="card-responsive">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم الكامل */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2 text-responsive">
                الاسم الكامل
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-responsive">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            {/* اسم المستخدم */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 text-responsive">
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
                placeholder="أدخل اسم المستخدم"
              />
            </div>

            {/* الجامعة */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2 text-responsive">
                الجامعة
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
                placeholder="أدخل اسم الجامعة"
              />
            </div>

            {/* الكلية */}
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2 text-responsive">
                الكلية
              </label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
                placeholder="أدخل اسم الكلية"
              />
            </div>

            {/* التخصص */}
            <div>
              <label htmlFor="major_name" className="block text-sm font-medium text-gray-700 mb-2 text-responsive">
                التخصص
              </label>
              <input
                type="text"
                id="major_name"
                name="major_name"
                value={formData.major_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
                placeholder="أدخل التخصص"
              />
            </div>

            {/* الدور */}
            <div>
              <label htmlFor="user_role" className="block text-sm font-medium text-gray-700 mb-2 text-responsive">
                الدور
              </label>
              <select
                id="user_role"
                name="user_role"
                value={formData.user_role || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
              >
                <option value="user">مستخدم</option>
                <option value="staff">موظف</option>
                <option value="admin">مدير</option>
                <option value="superuser">مدير عام</option>
                <option value="moderator">مشرف</option>
                <option value="editor">محرر</option>
              </select>
            </div>
          </div>

          {/* الخيارات المتقدمة */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 text-responsive">الصلاحيات</h3>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active || false}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700 text-responsive">
                حساب نشط
              </label>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <Link
              href="/admin/customers"
              className="btn-responsive text-gray-600 border border-gray-300 hover:bg-gray-50 text-center"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-responsive bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 