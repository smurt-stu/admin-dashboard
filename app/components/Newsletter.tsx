
'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section 
      className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9)), url('https://readdy.ai/api/search-image?query=modern%20newsletter%20subscription%20background%20with%20clean%20design%2C%20elegant%20email%20marketing%20concept%2C%20contemporary%20communication%20theme%2C%20professional%20digital%20marketing%20atmosphere%2C%20minimalist%20tech%20background%2C%20sophisticated%20business%20communication&width=1200&height=400&seq=newsletter1&orientation=landscape')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            اشترك في نشرتنا الإخبارية
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            احصل على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
            >
              اشترك الآن
            </button>
          </div>
        </form>

        {isSubscribed && (
          <div className="mt-6 bg-green-500 text-white px-6 py-3 rounded-full inline-block">
            <i className="ri-check-line ml-2"></i>
            تم الاشتراك بنجاح! شكراً لك
          </div>
        )}

        <div className="mt-8 flex items-center justify-center space-x-6 rtl:space-x-reverse text-gray-200">
          <div className="flex items-center">
            <i className="ri-mail-line text-xl ml-2"></i>
            <span>+50,000 مشترك</span>
          </div>
          <div className="flex items-center">
            <i className="ri-star-line text-xl ml-2"></i>
            <span>تقييم 4.9/5</span>
          </div>
          <div className="flex items-center">
            <i className="ri-shield-check-line text-xl ml-2"></i>
            <span>آمن 100%</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>
    </section>
  );
}
