import { AuthService } from './auth';

const API_BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  university_id?: string;
  major?: string;
  university?: string;
  college?: string;
  date_of_birth?: string;
  profile_picture?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  user_role: string;
  google_id?: string;
  role_id?: string;
}

export interface CreateUserData {
  full_name: string;
  email: string;
  password: string;
  username: string;
  university?: string;
  college?: string;
  major_name?: string;
  is_active: boolean;
  user_role: string;
}

export interface UpdateUserData {
  full_name?: string;
  email?: string;
  username?: string;
  university?: string;
  college?: string;
  major_name?: string;
  is_active?: boolean;
  user_role?: string;
}

export interface UsersResponse {
  results: User[];
  count: number;
  next?: string;
  previous?: string;
}

export interface BulkActionData {
  user_ids: string[];
  action: 'activate' | 'deactivate' | 'delete';
}

export class UserService {
  static async getUsers(page: number = 1, search?: string): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search })
    });

    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/admin/users/?${params}`
    );

    if (!response.ok) {
      throw new Error('فشل في تحميل قائمة المستخدمين');
    }

    return response.json();
  }

  static async getUserById(userId: string): Promise<User> {
    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/admin/users/${userId}/`
    );

    if (!response.ok) {
      throw new Error('فشل في تحميل بيانات المستخدم');
    }

    const data = await response.json();
    return data.user;
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/admin/users/`,
      {
        method: 'POST',
        body: JSON.stringify(userData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في إنشاء المستخدم');
    }

    return response.json();
  }

  static async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/admin/users/${userId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(userData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في تحديث المستخدم');
    }

    return response.json();
  }

  static async deleteUser(userId: string): Promise<void> {
    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/admin/users/${userId}/`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('فشل في حذف المستخدم');
    }
  }

  static async bulkAction(actionData: BulkActionData): Promise<void> {
    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/admin/bulk-actions/`,
      {
        method: 'POST',
        body: JSON.stringify(actionData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في تنفيذ العملية');
    }
  }

  static async resetPassword(userId: string): Promise<void> {
    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/admin/users/${userId}/reset-password/`,
      {
        method: 'POST'
      }
    );

    if (!response.ok) {
      throw new Error('فشل في إعادة تعيين كلمة المرور');
    }
  }

  static getRoleDisplayName(userRole: string): string {
    const roleMap: { [key: string]: string } = {
      'superuser': 'مدير عام',
      'admin': 'مدير',
      'staff': 'موظف',
      'user': 'مستخدم',
      'moderator': 'مشرف',
      'editor': 'محرر'
    };
    return roleMap[userRole] || userRole;
  }

  static getStatusColor(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  static getStatusText(isActive: boolean): string {
    return isActive ? 'نشط' : 'غير نشط';
  }
}