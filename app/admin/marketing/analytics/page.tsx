'use client';

import { useState } from 'react';

export default function MarketingAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  const analyticsData = {
    overview: {
      total_coupons: 25,
      active_coupons: 15,
      total_promotions: 10,
      active_promotions: 5,
      total_usage: 1250,
      total_discount: "15000.00",
      conversion_rate: 12.5,
      revenue_impact: "45000.00"
    },
    monthlyStats: [
      { month: "يناير", coupons_usage: 150, promotions_orders: 200, total_revenue: "15000" },
      { month: "فبراير", coupons_usage: 180, promotions_orders: 220, total_revenue: "18000" },
      { month: "مارس", coupons_usage: 200, promotions_orders: 250, total_revenue: "22000" },
      { month: "أبريل", coupons_usage: 220, promotions_orders: 280, total_revenue: "25000" },
      { month: "مايو", coupons_usage: 250, promotions_orders: 300, total_revenue: "28000" },
      { month: "يونيو", coupons_usage: 280, promotions_orders: 320, total_revenue: "32000" }
    ],
    topCoupons: [
      { code: "SAVE20", title: "خصم 20% على كل شيء", usage: 150, revenue: "1500", conversion: 15.2 },
      { code: "NEWUSER50", title: "خصم 50% للمستخدمين الجدد", usage: 100, revenue: "2500", conversion: 22.5 },
      { code: "FREESHIP", title: "شحن مجاني", usage: 75, revenue: "750", conversion: 8.3 },
      { code: "WELCOME10", title: "خصم 10% للترحيب", usage: 60, revenue: "600", conversion: 12.1 }
    ],
    topPromotions: [
      { name: "تخفيضات الصيف", type: "sale", orders: 150, revenue: "15000", conversion: 18.5 },
      { name: "عرض خاطف - 50% خصم", type: "flash_sale", orders: 80, revenue: "8000", conversion: 25.3 },
      { name: "اشتر 2 واحصل على 1 مجاناً", type: "buy_x_get_y", orders: 120, revenue: "12000", conversion: 16.8 }
    ],
    performanceMetrics: {
      average_order_value: "120.50",
      customer_acquisition_cost: "25.30",
      customer_lifetime_value: "450.00",
      repeat_customer_rate: 35.2
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">التحليلات والإحصائيات</h2>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">آخر 7 أيام</option>
            <option value="30">آخر 30 يوم</option>
            <option value="90">آخر 90 يوم</option>
            <option value="365">آخر سنة</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse">
            <i className="ri-download-line"></i>
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الكوبونات</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.total_coupons}</p>
              <p className="text-sm text-green-600">+{analyticsData.overview.active_coupons} نشط</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-coupon-fill text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العروض</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.total_promotions}</p>
              <p className="text-sm text-green-600">+{analyticsData.overview.active_promotions} نشط</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-megaphone-fill text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الاستخدامات</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.total_usage}</p>
              <p className="text-sm text-green-600">+12% من الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-fill text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الخصومات</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData.overview.total_discount}</p>
              <p className="text-sm text-green-600">+8% من الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-fill text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">مقاييس الأداء</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">متوسط قيمة الطلب</span>
              <span className="text-lg font-bold text-green-600">${analyticsData.performanceMetrics.average_order_value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">تكلفة اكتساب العميل</span>
              <span className="text-lg font-bold text-blue-600">${analyticsData.performanceMetrics.customer_acquisition_cost}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">قيمة العميل مدى الحياة</span>
              <span className="text-lg font-bold text-purple-600">${analyticsData.performanceMetrics.customer_lifetime_value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">معدل العملاء المتكررين</span>
              <span className="text-lg font-bold text-orange-600">{analyticsData.performanceMetrics.repeat_customer_rate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معدل التحويل</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{analyticsData.overview.conversion_rate}%</div>
            <p className="text-sm text-gray-600">معدل التحويل الإجمالي</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full" 
                style={{ width: `${analyticsData.overview.conversion_rate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الاتجاهات الشهرية</h3>
          <div className="space-y-4">
            {analyticsData.monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{stat.month}</span>
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm">
                  <span className="text-blue-600">{stat.coupons_usage} كوبون</span>
                  <span className="text-green-600">{stat.promotions_orders} طلب</span>
                  <span className="text-purple-600">${stat.total_revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أفضل الأداء</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">أفضل الكوبونات</h4>
              <div className="space-y-2">
                {analyticsData.topCoupons.slice(0, 3).map((coupon, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{coupon.title}</p>
                      <p className="text-xs text-gray-600">{coupon.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{coupon.usage} استخدام</p>
                      <p className="text-xs text-gray-600">{coupon.conversion}% تحويل</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">أفضل العروض</h4>
              <div className="space-y-2">
                {analyticsData.topPromotions.slice(0, 2).map((promotion, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{promotion.name}</p>
                      <p className="text-xs text-gray-600">{promotion.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{promotion.orders} طلب</p>
                      <p className="text-xs text-gray-600">{promotion.conversion}% تحويل</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Impact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تأثير الإيرادات</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">${analyticsData.overview.revenue_impact}</div>
            <p className="text-sm text-gray-600">إجمالي الإيرادات من التسويق</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">${analyticsData.overview.total_discount}</div>
            <p className="text-sm text-gray-600">إجمالي الخصومات المقدمة</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">${(parseFloat(analyticsData.overview.revenue_impact) - parseFloat(analyticsData.overview.total_discount)).toFixed(2)}</div>
            <p className="text-sm text-gray-600">صافي الربح من التسويق</p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coupon Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء الكوبونات</h3>
          <div className="space-y-3">
            {analyticsData.topCoupons.map((coupon, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{coupon.title}</p>
                  <p className="text-sm text-gray-600">{coupon.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{coupon.usage}</p>
                  <p className="text-xs text-gray-600">استخدام</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">${coupon.revenue}</p>
                  <p className="text-xs text-gray-600">إيرادات</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{coupon.conversion}%</p>
                  <p className="text-xs text-gray-600">تحويل</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء العروض الترويجية</h3>
          <div className="space-y-3">
            {analyticsData.topPromotions.map((promotion, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{promotion.name}</p>
                  <p className="text-sm text-gray-600">{promotion.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{promotion.orders}</p>
                  <p className="text-xs text-gray-600">طلب</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">${promotion.revenue}</p>
                  <p className="text-xs text-gray-600">إيرادات</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{promotion.conversion}%</p>
                  <p className="text-xs text-gray-600">تحويل</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 