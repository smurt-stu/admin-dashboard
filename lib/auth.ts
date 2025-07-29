
const API_BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export interface LoginResponse {
  message: string;
  access: string;
  refresh: string;
  user_id: string;
  email: string;
  full_name: string;
  is_staff: boolean;
  email_verified: boolean;
  phone_verified: boolean;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  full_name: string;
  phone_number?: string;
  is_staff: boolean;
  is_superuser?: boolean;
  email_verified?: boolean;
  phone_verified: boolean;
  university_id?: string;
  university?: any;
  college?: any;
  major?: any;
  date_of_birth?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export class AuthService {
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  static removeTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.is_staff || false;
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // معالجة الأخطاء المختلفة من الـ API
      let errorMessage = 'فشل في تسجيل الدخول';
      
      if (errorData.non_field_errors) {
        errorMessage = errorData.non_field_errors[0];
      } else if (errorData.email) {
        errorMessage = `خطأ في البريد الإلكتروني: ${errorData.email[0]}`;
      } else if (errorData.password) {
        errorMessage = `خطأ في كلمة المرور: ${errorData.password[0]}`;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();
    
    // حفظ التوكنز والمستخدم
    this.setTokens(data.access, data.refresh);
    this.setUser({
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      is_staff: data.is_staff,
      email_verified: data.email_verified,
      phone_verified: data.phone_verified,
    });

    return data;
  }

  static async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    this.removeTokens();
  }

  static async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('لا يوجد رمز تجديد');
    }

    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      this.removeTokens();
      throw new Error('انتهت صلاحية الجلسة');
    }

    const data = await response.json();
    this.setTokens(data.access, refreshToken);
    return data.access;
  }

  static async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let token = this.getToken();

    if (!token) {
      throw new Error('المستخدم غير مسجل الدخول');
    }

    // محاولة الطلب الأولى
    let response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    // إذا كان الرمز منتهي الصلاحية، جرب تجديده
    if (response.status === 401) {
      try {
        token = await this.refreshAccessToken();
        response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
          },
        });
      } catch (error) {
        this.removeTokens();
        window.location.href = '/admin/login';
        throw error;
      }
    }

    return response;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await this.makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile/`);
    
    if (!response.ok) {
      throw new Error('فشل في الحصول على بيانات المستخدم');
    }

    const responseData = await response.json();
    // البيانات ترجع في profile مباشرة
    const user = responseData.profile || responseData;
    this.setUser(user);
    return user;
  }

  static async checkAuthStatus(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      this.removeTokens();
      return false;
    }
  }
}
