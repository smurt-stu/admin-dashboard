
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '../../../lib/auth';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await AuthService.login(formData.email, formData.password);
      
      // التوجيه إلى لوحة التحكم (الـ tokens يتم حفظها في AuthService.login)
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <i className="ri-shield-user-fill text-white text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">تسجيل دخول المسؤول</h2>
            <p className="text-gray-600">أدخل بياناتك للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="admin@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <i className="ri-mail-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <i className="ri-lock-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 rtl:space-x-reverse">
                <i className="ri-error-warning-fill text-red-500"></i>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري تسجيل الدخول...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <i className="ri-login-box-line"></i>
                    <span>تسجيل الدخول</span>
                  </div>
                )}
              </button>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer">
                العودة إلى المتجر
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            محمي بواسطة نظام الأمان المتقدم
          </p>
        </div>
      </div>
    </div>
  );
}
