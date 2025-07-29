
'use client';

export default function Benefits() {
  const benefits = [
    {
      icon: 'ri-truck-line',
      title: 'توصيل مجاني',
      description: 'توصيل مجاني لجميع الطلبات أكثر من 200 ريال',
      color: 'bg-blue-500'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'ضمان الجودة',
      description: 'ضمان على جميع المنتجات لمدة سنة كاملة',
      color: 'bg-green-500'
    },
    {
      icon: 'ri-customer-service-line',
      title: 'دعم 24/7',
      description: 'فريق دعم العملاء متاح على مدار الساعة',
      color: 'bg-purple-500'
    },
    {
      icon: 'ri-refresh-line',
      title: 'إرجاع مجاني',
      description: 'إمكانية الإرجاع والاستبدال خلال 14 يوم',
      color: 'bg-orange-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            لماذا تختار متجرنا؟
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نقدم لك أفضل تجربة تسوق مع مجموعة من المزايا المميزة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <i className={`${benefit.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
