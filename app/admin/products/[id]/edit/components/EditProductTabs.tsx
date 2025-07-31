'use client';

import { useState, useEffect } from 'react';

interface EditProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function EditProductTabs({ activeTab, setActiveTab }: EditProductTabsProps) {
  const tabs = [
    { id: 'basic', label: 'المعلومات الأساسية', icon: 'ri-information-line' },
    { id: 'pricing', label: 'التسعير والمخزون', icon: 'ri-money-dollar-circle-line' },
    { id: 'specifications', label: 'المواصفات والحقول المخصصة', icon: 'ri-settings-3-line' },
    { id: 'variants', label: 'المتغيرات', icon: 'ri-git-branch-line' },
    { id: 'media', label: 'الصور والملفات', icon: 'ri-image-line' },
    { id: 'marketing', label: 'التسويق وSEO', icon: 'ri-marketing-line' }
  ];

  // تتبع التغييرات في activeTab
  useEffect(() => {
    console.log('EditProductTabs: activeTab changed to', activeTab);
  }, [activeTab]);

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('EditProductTabs: Tab clicked', { from: activeTab, to: tabId });
    console.log('EditProductTabs: Preventing default behavior');
    setActiveTab(tabId);
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 rtl:space-x-reverse px-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={(e) => handleTabClick(tab.id, e)}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 rtl:space-x-reverse whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
            title={tab.label}
          >
            <i className={`${tab.icon} text-lg`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
      
      {/* مؤشر التبويب النشط */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${tabs.findIndex(tab => tab.id === activeTab) * 100}%)`
          }}
        ></div>
      </div>
    </div>
  );
} 