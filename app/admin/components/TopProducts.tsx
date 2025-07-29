
'use client';

export default function TopProducts() {
  const products = [
    {
      id: 1,
      name: 'سماعات لاسلكية',
      sales: 1247,
      revenue: '24,580 ريال',
      image: 'https://readdy.ai/api/search-image?query=wireless%20headphones%20product%20shot%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20modern%20design&width=60&height=60&seq=1&orientation=squarish'
    },
    {
      id: 2,
      name: 'هاتف ذكي',
      sales: 856,
      revenue: '85,600 ريال',
      image: 'https://readdy.ai/api/search-image?query=smartphone%20product%20shot%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20modern%20design&width=60&height=60&seq=2&orientation=squarish'
    },
    {
      id: 3,
      name: 'ساعة ذكية',
      sales: 642,
      revenue: '32,100 ريال',
      image: 'https://readdy.ai/api/search-image?query=smartwatch%20product%20shot%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20modern%20design&width=60&height=60&seq=3&orientation=squarish'
    },
    {
      id: 4,
      name: 'حقيبة يد',
      sales: 523,
      revenue: '15,690 ريال',
      image: 'https://readdy.ai/api/search-image?query=handbag%20product%20shot%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20modern%20design&width=60&height=60&seq=4&orientation=squarish'
    },
    {
      id: 5,
      name: 'كمبيوتر محمول',
      sales: 387,
      revenue: '77,400 ريال',
      image: 'https://readdy.ai/api/search-image?query=laptop%20computer%20product%20shot%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20modern%20design&width=60&height=60&seq=5&orientation=squarish'
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">أفضل المنتجات مبيعاً</h3>
      
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-medium text-gray-800">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.sales} مبيع</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">{product.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
