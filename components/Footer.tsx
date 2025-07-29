
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-responsive py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="ri-store-2-fill text-white text-lg"></i>
              </div>
              <span className="text-lg sm:text-xl font-bold" style={{ fontFamily: "Pacifico, serif" }}>
                متجري
              </span>
            </div>
            <p className="text-gray-400 mb-4 text-responsive">
              متجر إلكتروني متكامل يقدم أفضل المنتجات بأسعار مناسبة وخدمة عملاء مميزة.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer p-2">
                <i className="ri-facebook-fill text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer p-2">
                <i className="ri-twitter-fill text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer p-2">
                <i className="ri-instagram-fill text-lg sm:text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-responsive">روابط سريعة</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                الرئيسية
              </Link>
              <Link href="/products" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                المنتجات
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                من نحن
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                تواصل معنا
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-responsive">خدمة العملاء</h3>
            <div className="space-y-2">
              <Link href="/account" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                حسابي
              </Link>
              <Link href="/cart" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                سلة التسوق
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white whitespace-nowrap text-responsive py-1">
                شروط الاستخدام
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-responsive">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className="ri-phone-fill text-blue-400 text-lg"></i>
                <span className="text-gray-400 text-responsive">+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <i className="ri-mail-fill text-blue-400 text-lg"></i>
                <span className="text-gray-400 text-responsive">info@mystore.com</span>
              </div>
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <i className="ri-map-pin-fill text-blue-400 text-lg mt-1"></i>
                <span className="text-gray-400 text-responsive">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="text-responsive">© 2024 متجري. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
