
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart() {
  const data = [
    { name: 'يناير', sales: 12000 },
    { name: 'فبراير', sales: 19000 },
    { name: 'مارس', sales: 15000 },
    { name: 'أبريل', sales: 25000 },
    { name: 'مايو', sales: 22000 },
    { name: 'يونيو', sales: 30000 },
    { name: 'يوليو', sales: 28000 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">إحصائيات المبيعات</h3>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">شهري</button>
          <button className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full cursor-pointer">أسبوعي</button>
          <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">يومي</button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
