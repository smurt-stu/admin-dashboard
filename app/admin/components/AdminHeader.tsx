
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../../lib/auth';

export default function AdminHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    AuthService.removeTokens();
    router.push('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">لوحة التحكم</h1>
        
        <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
          <button className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
            <i className="ri-notification-3-line text-lg sm:text-xl"></i>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="ri-user-fill text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium text-responsive hidden sm:block">المدير</span>
              <i className="ri-arrow-down-s-line text-gray-500"></i>
            </button>
            
            {isDropdownOpen && (
              <>
                {/* Mobile overlay */}
                <div 
                  className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                
                <div className="absolute left-0 sm:right-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <Link href="/admin/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer text-responsive">
                    <i className="ri-user-line ml-2"></i>
                    الملف الشخصي
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer text-responsive">
                    <i className="ri-settings-line ml-2"></i>
                    الإعدادات
                  </Link>
                  <hr className="my-1" />
                  <Link href="/" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer text-responsive">
                    <i className="ri-home-line ml-2"></i>
                    العودة للمتجر
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer text-responsive"
                  >
                    <i className="ri-logout-box-line ml-2"></i>
                    تسجيل الخروج
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
