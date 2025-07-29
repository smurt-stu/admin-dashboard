
'use client';

import Link from 'next/link';

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: 'ساعة ذكية عصرية',
      price: 899,
      originalPrice: 1299,
      image: 'https://readdy.ai/api/search-image?query=modern%20smartwatch%20with%20elegant%20design%20on%20clean%20white%20background%2C%20luxury%20wearable%20technology%2C%20contemporary%20watch%20display%2C%20high-end%20smartwatch%2C%20minimalist%20product%20photography%2C%20professional%20tech%20styling&width=300&height=300&seq=prod1&orientation=squarish',
      rating: 4.8,
      reviews: 156,
      badge: 'الأكثر مبيعاً',
      badgeColor: 'bg-red-500'
    },
    {
      id: 2,
      name: 'حقيبة يد جلدية فاخرة',
      price: 1299,
      originalPrice: 1899,
      image: 'https://readdy.ai/api/search-image?query=luxury%20leather%20handbag%20with%20elegant%20design%20on%20clean%20white%20background%2C%20high-end%20fashion%20accessory%2C%20contemporary%20bag%20display%2C%20premium%20leather%20goods%2C%20minimalist%20fashion%20photography%2C%20professional%20styling&width=300&height=300&seq=prod2&orientation=squarish',
      rating: 4.9,
      reviews: 203,
      badge: 'جديد',
      badgeColor: 'bg-green-500'
    },
    {
      id: 3,
      name: 'سماعات لاسلكية متقدمة',
      price: 549,
      originalPrice: 799,
      image: 'https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20with%20modern%20design%20on%20clean%20white%20background%2C%20high-end%20audio%20equipment%2C%20contemporary%20headphone%20display%2C%20luxury%20electronics%2C%20minimalist%20tech%20photography%2C%20professional%20product%20styling&width=300&height=300&seq=prod3&orientation=squarish',
      rating: 4.7,
      reviews: 89,
      badge: 'خصم 31%',
      badgeColor: 'bg-orange-500'
    },
    {
      id: 4,
      name: 'عطر رجالي مميز',
      price: 399,
      originalPrice: 599,
      image: 'https://readdy.ai/api/search-image?query=luxury%20mens%20perfume%20bottle%20with%20elegant%20design%20on%20clean%20white%20background%2C%20premium%20fragrance%20display%2C%20contemporary%20cologne%20bottle%2C%20high-end%20cosmetics%2C%20minimalist%20beauty%20photography%2C%20professional%20product%20styling&width=300&height=300&seq=prod4&orientation=squarish',
      rating: 4.6,
      reviews: 124,
      badge: 'عرض خاص',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'جهاز تابلت عالي الأداء',
      price: 1899,
      originalPrice: 2299,
      image: 'https://readdy.ai/api/search-image?query=modern%20tablet%20device%20with%20sleek%20design%20on%20clean%20white%20background%2C%20high-performance%20electronics%2C%20contemporary%20tech%20display%2C%20premium%20tablet%2C%20minimalist%20technology%20photography%2C%20professional%20product%20styling&width=300&height=300&seq=prod5&orientation=squarish',
      rating: 4.8,
      reviews: 167,
      badge: 'مختارات الموسم',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 6,
      name: 'كاميرا فورية احترافية',
      price: 799,
      originalPrice: 999,
      image: 'https://readdy.ai/api/search-image?query=professional%20instant%20camera%20with%20modern%20design%20on%20clean%20white%20background%2C%20vintage-style%20photography%20equipment%2C%20contemporary%20camera%20display%2C%20high-quality%20imaging%20device%2C%20minimalist%20tech%20photography%2C%20professional%20product%20styling&width=300&height=300&seq=prod6&orientation=squarish',
      rating: 4.7,
      reviews: 95,
      badge: 'اختيار المحرر',
      badgeColor: 'bg-yellow-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            المنتجات المميزة
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف أحدث وأفضل منتجاتنا المختارة بعناية خصيصاً لك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 right-4 ${product.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {product.badge}
                  </div>
                  <button className="absolute bottom-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer">
                    <i className="ri-heart-line text-gray-600 hover:text-red-500"></i>
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-yellow-400 text-sm`}></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 mr-2">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-2xl font-bold text-blue-600">{product.price} ر.س</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice} ر.س</span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                      <i className="ri-shopping-cart-line ml-1"></i>
                      أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors inline-block whitespace-nowrap cursor-pointer">
            عرض جميع المنتجات
          </Link>
        </div>
      </div>
    </section>
  );
}
