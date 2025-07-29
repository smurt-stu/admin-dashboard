
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../lib/auth';

export function useAuthGuard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 [AUTH GUARD] Starting authentication check...');
        
        // First check if token exists
        const hasToken = AuthService.isAuthenticated();
        
        if (!hasToken) {
          console.log('❌ [AUTH GUARD] No token found, redirecting to login');
          setIsAuthenticated(false);
          setChecked(true);
          router.push('/admin/login');
          return;
        }

        console.log('✅ [AUTH GUARD] Token exists, verifying validity...');
        
        // Then verify token validity
        const isValidToken = await AuthService.checkAuthStatus();
        
        if (!isValidToken) {
          console.log('❌ [AUTH GUARD] Token validation failed, redirecting to login');
          setIsAuthenticated(false);
          setChecked(true);
          router.push('/admin/login');
          return;
        }

        console.log('✅ [AUTH GUARD] Authentication successful');
        setIsAuthenticated(true);
        setChecked(true);
      } catch (error) {
        console.error('❌ [AUTH GUARD] Auth check failed:', error);
        setIsAuthenticated(false);
        setChecked(true);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, checked };
}
