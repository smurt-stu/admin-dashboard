'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderDetails } from './components/OrderDetails';
import { OrderItems } from './components/OrderItems';
import { OrderTimeline } from './components/OrderTimeline';
import { OrderActions } from './components/OrderActions';

interface Order {
  id: string;
  order_number: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
  paid_at: string;
  shipped_at: string;
  delivered_at: string;
  shipping_address: {
    street_address: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
  };
  items: Array<{
    id: string;
    product_title: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    purchase_type: string;
    download_count?: number;
    download_limit?: number;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        console.error('Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = () => {
    fetchOrder();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <i className="ri-error-warning-line text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">لم يتم العثور على الطلب</h3>
        <p className="text-gray-500 mb-4">الطلب المطلوب غير موجود أو تم حذفه</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          العودة للقائمة
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'تفاصيل الطلب', icon: 'ri-file-text-line' },
    { id: 'items', label: 'المنتجات', icon: 'ri-box-line' },
    { id: 'timeline', label: 'التسلسل الزمني', icon: 'ri-time-line' },
    { id: 'actions', label: 'الإجراءات', icon: 'ri-settings-line' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="ri-arrow-right-line text-xl"></i>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              طلب #{order.order_number}
            </h1>
          </div>
          <p className="text-gray-600">
            تم إنشاؤه في {new Date(order.created_at).toLocaleDateString('ar-SA')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i className="ri-printer-line ml-2"></i>
            طباعة
          </button>
          <button
            onClick={() => router.push(`/admin/orders/${order.id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-edit-line ml-2"></i>
            تعديل
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 rtl:space-x-reverse">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={`${tab.icon} ml-2`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'details' && (
          <OrderDetails order={order} onUpdate={handleOrderUpdate} />
        )}
        {activeTab === 'items' && (
          <OrderItems items={order.items} />
        )}
        {activeTab === 'timeline' && (
          <OrderTimeline order={order} />
        )}
        {activeTab === 'actions' && (
          <OrderActions order={order} onUpdate={handleOrderUpdate} />
        )}
      </div>
    </div>
  );
} 