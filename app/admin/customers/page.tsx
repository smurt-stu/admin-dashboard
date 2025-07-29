'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService, User, CreateUserData } from '../../../lib/userService';
import CreateUserModal from './components/CreateUserModal';

interface UserFilters {
  page: number;
  search: string;
}

interface BulkAction {
  user_ids: string[];
  action: 'activate' | 'deactivate' | 'delete';
}

export default function CustomersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    search: ''
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers(filters.page, filters.search);
      setUsers(response.results || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل قائمة المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleBulkAction = async (action: BulkAction['action']) => {
    if (selectedUsers.length === 0) {
      setError('يرجى اختيار مستخدمين واحد على الأقل');
      return;
    }

    try {
      await UserService.bulkAction({
        user_ids: selectedUsers,
        action
      });
      
      setSuccess(`تم ${action === 'activate' ? 'تفعيل' : action === 'deactivate' ? 'إلغاء تفعيل' : 'حذف'} المستخدمين المحددين بنجاح`);
      setSelectedUsers([]);
      setShowBulkActions(false);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تنفيذ الإجراء المجمع');
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await UserService.createUser(userData);
      setSuccess('تم إنشاء المستخدم بنجاح');
      loadUsers();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    try {
      await UserService.deleteUser(userId);
      setSuccess('تم حذف المستخدم بنجاح');
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حذف المستخدم');
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm('هل أنت متأكد من إعادة تعيين كلمة مرور هذا المستخدم؟')) return;
    
    try {
      await UserService.resetPassword(userId);
      setSuccess('تم إعادة تعيين كلمة المرور بنجاح');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إعادة تعيين كلمة المرور');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* العنوان والإحصائيات */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">إدارة العملاء</h1>
          <p className="text-gray-600 mt-2 text-responsive">إدارة حسابات المستخدمين والصلاحيات</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className={`btn-responsive border ${
              showBulkActions 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="ri-settings-3-line ml-2"></i>
            إجراءات مجمعة
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-responsive bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
          >
            <i className="ri-add-line ml-2"></i>
            إضافة مستخدم جديد
          </button>
        </div>
      </div>

      {/* رسائل النجاح والخطأ */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <i className="ri-check-line text-green-500"></i>
            <span className="text-green-700 text-responsive">{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
            <i className="ri-close-line"></i>
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <i className="ri-error-warning-line text-red-500"></i>
            <span className="text-red-700 text-responsive">{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <i className="ri-close-line"></i>
          </button>
        </div>
      )}

      {/* الإجراءات المجمعة */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="font-medium text-blue-800 text-responsive">الإجراءات المجمعة</h3>
            <span className="text-sm text-blue-600">
              {selectedUsers.length} مستخدم محدد
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleBulkAction('activate')}
              className="btn-responsive bg-green-600 text-white hover:bg-green-700"
            >
              تفعيل
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="btn-responsive bg-yellow-600 text-white hover:bg-yellow-700"
            >
              إلغاء التفعيل
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="btn-responsive bg-red-600 text-white hover:bg-red-700"
            >
              حذف
            </button>
          </div>
        </div>
      )}

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card-responsive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 text-responsive">إجمالي المستخدمين</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-blue-600 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div className="card-responsive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 text-responsive">المستخدمين النشطين</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{users.filter(u => u.is_active).length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-star-line text-green-600 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div className="card-responsive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 text-responsive">الموظفين</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{users.filter(u => u.is_staff).length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-user-line text-purple-600 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div className="card-responsive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 text-responsive">المديرين العامين</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{users.filter(u => u.is_superuser).length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-star-line text-red-600 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="card-responsive">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="البحث في المستخدمين..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive"
            />
          </div>
          <button
            type="submit"
            className="btn-responsive bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
          >
            <i className="ri-search-line ml-2"></i>
            بحث
          </button>
        </form>
      </div>

      {/* جدول المستخدمين */}
      <div className="card-responsive overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-responsive">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <i className="ri-user-line text-gray-300 text-4xl sm:text-6xl mb-4"></i>
              <p className="text-gray-500 text-lg text-responsive">لا توجد مستخدمين</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 btn-responsive bg-blue-600 text-white hover:bg-blue-700"
              >
                إضافة أول مستخدم
              </button>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-right">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={selectAllUsers}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-right text-sm font-medium text-gray-700 text-responsive">المستخدم</th>
                  <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-right text-sm font-medium text-gray-700 text-responsive">البريد الإلكتروني</th>
                  <th className="hidden lg:table-cell px-2 sm:px-4 py-3 text-right text-sm font-medium text-gray-700 text-responsive">رقم الهاتف</th>
                  <th className="px-2 sm:px-4 py-3 text-right text-sm font-medium text-gray-700 text-responsive">الحالة</th>
                  <th className="hidden md:table-cell px-2 sm:px-4 py-3 text-right text-sm font-medium text-gray-700 text-responsive">الصلاحيات</th>
                  <th className="hidden lg:table-cell px-2 sm:px-4 py-3 text-right text-sm font-medium text-gray-700 text-responsive">تاريخ الانضمام</th>
                  <th className="px-2 sm:px-4 py-3 text-right text-sm font-medium text-gray-700 text-responsive">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          user.is_superuser ? 'bg-red-100' : user.is_staff ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          <i className={`${
                            user.is_superuser ? 'ri-shield-star-fill text-red-600' : 
                            user.is_staff ? 'ri-shield-user-fill text-purple-600' : 
                            'ri-user-fill text-blue-600'
                          } text-sm sm:text-base`}></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-responsive truncate">{user.full_name}</p>
                          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                          <p className="text-sm text-gray-500 truncate sm:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-2 sm:px-4 py-3 text-sm text-gray-900 text-responsive">{user.email}</td>
                    <td className="hidden lg:table-cell px-2 sm:px-4 py-3 text-sm text-gray-900 text-responsive">{user.phone_number || '-'}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-2 sm:px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {user.is_superuser && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            مدير عام
                          </span>
                        )}
                        {user.is_staff && !user.is_superuser && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            موظف
                          </span>
                        )}
                        {!user.is_staff && !user.is_superuser && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            مستخدم
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-2 sm:px-4 py-3 text-sm text-gray-500 text-responsive">
                      {new Date(user.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                        <Link
                          href={`/admin/customers/${user.id}`}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="عرض التفاصيل"
                        >
                          <i className="ri-eye-line text-sm sm:text-base"></i>
                        </Link>
                        <Link
                          href={`/admin/customers/${user.id}/edit`}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="تعديل"
                        >
                          <i className="ri-edit-line text-sm sm:text-base"></i>
                        </Link>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="text-yellow-600 hover:text-yellow-700 p-1"
                          title="إعادة تعيين كلمة المرور"
                        >
                          <i className="ri-lock-password-line text-sm sm:text-base"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="حذف"
                        >
                          <i className="ri-delete-bin-line text-sm sm:text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ترقيم الصفحات */}
      {users.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg gap-4">
          <div className="text-sm text-gray-700 text-responsive">
            عرض {users.length} من النتائج
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page === 1}
              className="btn-responsive border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded">
              {filters.page}
            </span>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={users.length < 10}
              className="btn-responsive border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Modal إنشاء مستخدم جديد */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
} 