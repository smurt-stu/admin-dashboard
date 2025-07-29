'use client';

import { useState } from 'react';

interface OrderSearchProps {
  onSearch: (query: string) => void;
}

export function OrderSearch({ onSearch }: OrderSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">البحث في الطلبات</h3>
      
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="ri-search-line text-gray-400"></i>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث برقم الطلب، اسم العميل، البريد الإلكتروني..."
            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-search-line ml-2"></i>
            بحث
          </button>
          
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              مسح
            </button>
          )}
        </div>
      </form>

      <div className="text-sm text-gray-600">
        <p className="mb-2">يمكنك البحث بـ:</p>
        <ul className="space-y-1 text-xs">
          <li>• رقم الطلب (مثال: ORD-2024-0001)</li>
          <li>• اسم العميل</li>
          <li>• البريد الإلكتروني</li>
          <li>• رقم الهاتف</li>
        </ul>
      </div>
    </div>
  );
} 