
'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section 
      className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8)), url('https://readdy.ai/api/search-image?query=modern%20elegant%20e-commerce%20shopping%20experience%20with%20clean%20white%20background%2C%20minimalist%20design%2C%20luxury%20retail%20atmosphere%2C%20professional%20lighting%2C%20contemporary%20interior%20with%20subtle%20product%20displays%2C%20sleek%20modern%20architecture%2C%20sophisticated%20shopping%20environment%2C%20high-end%20retail%20space&width=1200&height=600&seq=hero1&orientation=landscape')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '600px'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              اكتشف أفضل المنتجات
              <span className="block text-yellow-400">بأسعار مناسبة</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl">
              متجر إلكتروني متكامل يقدم مجموعة واسعة من المنتجات عالية الجودة 
              مع خدمة عملاء مميزة وتوصيل سريع لجميع أنحاء المملكة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products" className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer">
                تسوق الآن
              </Link>
              <Link href="/about" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
                تعرف علينا
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <i className="ri-truck-line text-4xl mb-2 text-yellow-400"></i>
                    <p className="text-sm font-medium">توصيل مجاني</p>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <i className="ri-shield-check-line text-4xl mb-2 text-green-400"></i>
                    <p className="text-sm font-medium">ضمان الجودة</p>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <i className="ri-customer-service-line text-4xl mb-2 text-blue-400"></i>
                    <p className="text-sm font-medium">دعم 24/7</p>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <i className="ri-refresh-line text-4xl mb-2 text-purple-400"></i>
                    <p className="text-sm font-medium">إرجاع مجاني</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path d="M0,120 L1440,120 L1440,0 C1200,60 960,60 720,30 C480,0 240,0 0,30 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
