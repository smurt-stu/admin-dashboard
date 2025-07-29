
'use client';

import Link from 'next/link';

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: 'أزياء وموضة',
      icon: 'ri-shirt-line',
      image: 'https://readdy.ai/api/search-image?query=elegant%20fashion%20clothing%20collection%20with%20modern%20minimalist%20white%20background%2C%20luxury%20fashion%20items%2C%20contemporary%20clothing%20display%2C%20high-end%20fashion%20retail%2C%20clean%20professional%20styling%2C%20sophisticated%20fashion%20photography&width=300&height=200&seq=cat1&orientation=landscape',
      productCount: 245,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 2,
      name: 'إلكترونيات',
      icon: 'ri-smartphone-line',
      image: 'https://readdy.ai/api/search-image?query=modern%20electronic%20devices%20and%20gadgets%20with%20clean%20white%20background%2C%20sleek%20technology%20products%2C%20contemporary%20electronics%20display%2C%20high-tech%20gadgets%2C%20minimalist%20tech%20styling%2C%20professional%20electronics%20photography&width=300&height=200&seq=cat2&orientation=landscape',
      productCount: 189,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 3,
      name: 'منزل وحديقة',
      icon: 'ri-home-line',
      image: 'https://readdy.ai/api/search-image?query=modern%20home%20and%20garden%20products%20with%20clean%20white%20background%2C%20contemporary%20home%20decor%20items%2C%20elegant%20interior%20design%20elements%2C%20luxury%20home%20accessories%2C%20minimalist%20home%20styling%2C%20professional%20home%20photography&width=300&height=200&seq=cat3&orientation=landscape',
      productCount: 156,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      name: 'صحة وجمال',
      icon: 'ri-heart-line',
      image: 'https://readdy.ai/api/search-image?query=elegant%20health%20and%20beauty%20products%20with%20clean%20white%20background%2C%20luxury%20cosmetics%20and%20wellness%20items%2C%20contemporary%20beauty%20display%2C%20high-end%20skincare%20products%2C%20minimalist%20beauty%20styling%2C%20professional%20beauty%20photography&width=300&height=200&seq=cat4&orientation=landscape',
      productCount: 98,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 5,
      name: 'رياضة وترفيه',
      icon: 'ri-football-line',
      image: 'https://readdy.ai/api/search-image?query=modern%20sports%20and%20recreation%20equipment%20with%20clean%20white%20background%2C%20athletic%20gear%20and%20fitness%20products%2C%20contemporary%20sports%20display%2C%20high-quality%20sports%20equipment%2C%20minimalist%20sports%20styling%2C%20professional%20sports%20photography&width=300&height=200&seq=cat5&orientation=landscape',
      productCount: 134,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 6,
      name: 'كتب ومكتبة',
      icon: 'ri-book-line',
      image: 'https://readdy.ai/api/search-image?query=modern%20books%20and%20stationery%20products%20with%20clean%20white%20background%2C%20elegant%20book%20collection%2C%20contemporary%20library%20display%2C%20educational%20materials%2C%20minimalist%20book%20styling%2C%20professional%20library%20photography&width=300&height=200&seq=cat6&orientation=landscape',
      productCount: 87,
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تصفح حسب الفئة
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من المنتجات المصنفة بعناية لتسهيل عملية البحث والتسوق
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className="absolute top-4 right-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                      <i className={`${category.icon} text-white text-xl`}></i>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.productCount} منتج متوفر
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold group-hover:text-blue-700 whitespace-nowrap">
                      تسوق الآن
                    </span>
                    <i className="ri-arrow-left-line text-blue-600 group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
