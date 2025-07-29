
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <i className="ri-store-2-fill text-white text-lg"></i>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800" style={{ fontFamily: "Pacifico, serif" }}>
              متجري
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-blue-600 whitespace-nowrap text-responsive">
              الرئيسية
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 whitespace-nowrap text-responsive">
              المنتجات
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 whitespace-nowrap text-responsive">
              من نحن
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 whitespace-nowrap text-responsive">
              تواصل معنا
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 cursor-pointer">
              <i className="ri-shopping-cart-line text-lg sm:text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>
            <Link href="/admin/login" className="hidden sm:block text-gray-700 hover:text-blue-600 whitespace-nowrap cursor-pointer text-responsive">
              تسجيل الدخول
            </Link>
            <Link href="/admin" className="hidden sm:block bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap cursor-pointer text-responsive">
              لوحة التحكم
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 whitespace-nowrap text-responsive"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 whitespace-nowrap text-responsive"
                onClick={() => setIsMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 whitespace-nowrap text-responsive"
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 whitespace-nowrap text-responsive"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصل معنا
              </Link>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link 
                  href="/admin/login" 
                  className="block text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 whitespace-nowrap text-responsive"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/admin" 
                  className="block bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 whitespace-nowrap text-responsive mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
