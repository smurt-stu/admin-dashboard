
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../../lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // تحقق من وجود رمز المصادقة
      const token = AuthService.getToken();
      
      if (!token) {
        console.log('❌ [AUTH] No token found, redirecting to login');
        router.push('/admin/login');
        return;
      }

      // تحقق من صحة الرمز وجلب بيانات المستخدم المحدثة
      const user = await AuthService.getCurrentUser();
      
      if (!user) {
        console.log('❌ [AUTH] Failed to get user data, redirecting to login');
        router.push('/admin/login');
        return;
      }

      // تحقق من أن المستخدم مدير
      if (!user.is_staff) {
        console.log('❌ [AUTH] User is not an admin', { user });
        AuthService.removeTokens();
        router.push('/admin/login');
        return;
      }

      console.log('✅ [AUTH] Authentication successful');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ [AUTH] Authentication check failed:', error);
      AuthService.removeTokens();
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارِ التحقق من صحة الجلسة...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="ri-user-line text-white text-2xl"></i>
            </div>
          </div>
          <p className="text-gray-600">جارِ إعادة توجيهك...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
