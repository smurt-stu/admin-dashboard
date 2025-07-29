'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';
import { UserService, User } from '../../../../lib/userService';

interface UserDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailsPage({ params }: UserDetailsPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUser();
  }, [resolvedParams.id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getUserById(resolvedParams.id);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    try {
      await UserService.deleteUser(resolvedParams.id);
      router.push('/admin/customers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حذف المستخدم');
    }
  };

  const handleResetPassword = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين كلمة مرور هذا المستخدم؟')) return;
    
    try {
      await UserService.resetPassword(resolvedParams.id);
      alert('تم إعادة تعيين كلمة المرور بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إعادة تعيين كلمة المرور');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <i className="ri-user-line text-gray-300 text-6xl mb-4"></i>
        <p className="text-gray-500 text-lg">المستخدم غير موجود</p>
        <Link 
          href="/admin/customers" 
          className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
        >
          العودة للقائمة
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان وأزرار الإجراءات */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">تفاصيل المستخدم</h1>
          <p className="text-gray-600 mt-2">عرض معلومات المستخدم والصلاحيات</p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link
            href={`/admin/customers/${resolvedParams.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <i className="ri-edit-line ml-2"></i>
            تعديل
          </Link>
          <button
            onClick={handleResetPassword}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
          >
            <i className="ri-lock-password-line ml-2"></i>
            إعادة تعيين كلمة المرور
          </button>
          <button
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
          >
            <i className="ri-delete-bin-line ml-2"></i>
            حذف
          </button>
          <Link
            href="/admin/customers"
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            العودة للقائمة
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 rtl:space-x-reverse">
          <i className="ri-error-warning-fill text-red-500"></i>
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* بطاقة معلومات المستخدم */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-6 rtl:space-x-reverse">
          {/* صورة المستخدم */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl ${
            user.user_role === 'superuser' ? 'bg-red-100 text-red-600' : 
            user.user_role === 'staff' ? 'bg-purple-100 text-purple-600' : 
            'bg-blue-100 text-blue-600'
          }`}>
            <i className={`${
              user.user_role === 'superuser' ? 'ri-shield-star-fill' : 
              user.user_role === 'staff' ? 'ri-shield-user-fill' : 
              'ri-user-fill'
            }`}></i>
          </div>

          {/* معلومات المستخدم الأساسية */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">اسم المستخدم</p>
                <p className="font-medium">@{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-medium">{user.phone_number || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الجامعة</p>
                <p className="font-medium">{user.university || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الكلية</p>
                <p className="font-medium">{user.college || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">التخصص</p>
                <p className="font-medium">{user.major || 'غير محدد'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات الصلاحيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">الصلاحيات</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">الدور</span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {UserService.getRoleDisplayName(user.user_role)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مدير عام</span>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                user.is_superuser 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.is_superuser ? 'نعم' : 'لا'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">موظف</span>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                user.is_staff 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.is_staff ? 'نعم' : 'لا'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">حالة الحساب</span>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                user.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">حالة التحقق</span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                {user.email_verified ? 'محقق' : 'غير محقق'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">معلومات الحساب</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">تاريخ الانضمام</span>
              <span className="text-sm font-medium">
                {new Date(user.created_at).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">آخر تسجيل دخول</span>
              <span className="text-sm font-medium">
                {user.last_login 
                  ? new Date(user.last_login).toLocaleDateString('ar-SA')
                  : 'لم يسجل دخول بعد'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">معرف المستخدم</span>
              <span className="text-sm font-medium text-gray-500">#{user.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات النشاط */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">إحصائيات النشاط</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">الطلبات</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">المنتجات المشتراة</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">التقييمات</div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">معلومات إضافية</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">معرف المستخدم</span>
              <span className="text-sm font-medium text-gray-500">#{user.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">نوع الحساب</span>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                user.is_superuser ? 'bg-red-100 text-red-800' : 
                user.is_staff ? 'bg-purple-100 text-purple-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {user.is_superuser ? 'مدير عام' : user.is_staff ? 'موظف' : 'مستخدم عادي'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">حالة التحقق</span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                محقق
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">سجل النشاط</h3>
          <div className="text-center py-8 text-gray-500">
            <i className="ri-time-line text-4xl mb-2"></i>
            <p>لا توجد أنشطة مسجلة بعد</p>
          </div>
        </div>
      </div>
    </div>
  );
} 