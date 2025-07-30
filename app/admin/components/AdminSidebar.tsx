
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // إغلاق السايد بار عند تغيير الصفحة في وضع الموبايل
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // فتح القوائم الفرعية تلقائياً للعناصر النشطة
  useEffect(() => {
    const activeItems = menuItems.filter(item => 
      item.subItems && hasActiveSubItem(item.subItems)
    );
    setExpandedItems(activeItems.map(item => item.href));
  }, [pathname]);

  // منع التمرير في الخلفية عندما يكون السايد بار مفتوحاً
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // تنظيف عند إلغاء المكون
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // التعامل مع مفتاح Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { href: '/admin', icon: 'ri-dashboard-fill', label: 'لوحة القيادة' },
    { 
      href: '/admin/products', 
      icon: 'ri-box-3-fill', 
      label: 'إدارة المنتجات',
      subItems: [
        { href: '/admin/products', icon: 'ri-list-check', label: 'قائمة المنتجات' },
        { href: '/admin/products/create', icon: 'ri-add-line', label: 'إضافة منتج جديد' },
        { href: '/admin/categories', icon: 'ri-folder-line', label: 'إدارة الفئات' },
        { href: '/admin/product-types', icon: 'ri-settings-3-line', label: 'أنواع المنتجات' },
      ]
    },
    { href: '/admin/orders', icon: 'ri-shopping-bag-fill', label: 'إدارة الطلبات' },
    { href: '/admin/customers', icon: 'ri-user-fill', label: 'إدارة العملاء' },
    { href: '/admin/reviews', icon: 'ri-star-fill', label: 'إدارة المراجعات' },
    { href: '/admin/marketing', icon: 'ri-megaphone-fill', label: 'إدارة التسويق' },
    { href: '/admin/settings', icon: 'ri-settings-fill', label: 'الإعدادات' },
  ];

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSubMenu = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const hasActiveSubItem = (subItems: any[]) => {
    return subItems?.some(item => isActive(item.href));
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={handleMenuToggle}
        aria-label="Toggle sidebar"
        aria-expanded={isMobileMenuOpen}
      >
        <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-lg border-l border-gray-200 transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:visible lg:pointer-events-auto
          ${isMobileMenuOpen 
            ? 'translate-x-0 visible pointer-events-auto' 
            : 'translate-x-full invisible pointer-events-none lg:translate-x-0 lg:visible lg:pointer-events-auto'
          }
        `}
      >
        <div className="p-4 sm:p-6 h-full flex flex-col">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <i className="ri-store-2-fill text-white text-lg"></i>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800" style={{ fontFamily: "Pacifico, serif" }}>
              متجري
            </span>
          </div>
          
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <div key={item.href}>
                {item.subItems ? (
                  // عنصر مع قائمة فرعية
                  <div>
                    <button
                      onClick={() => toggleSubMenu(item.href)}
                      className={`w-full flex items-center justify-between space-x-3 rtl:space-x-reverse px-3 sm:px-4 py-3 rounded-lg transition-colors whitespace-nowrap cursor-pointer text-responsive ${
                        isActive(item.href) || hasActiveSubItem(item.subItems)
                          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <i className={`${item.icon} text-lg sm:text-xl`}></i>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <i className={`ri-arrow-down-s-line transition-transform ${
                        expandedItems.includes(item.href) ? 'rotate-180' : ''
                      }`}></i>
                    </button>
                    
                    {expandedItems.includes(item.href) && (
                      <div className="mr-4 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 rtl:space-x-reverse px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer text-sm ${
                              isActive(subItem.href)
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <i className={`${subItem.icon} text-base`}></i>
                            <span className="font-medium">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // عنصر عادي بدون قائمة فرعية
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 rtl:space-x-reverse px-3 sm:px-4 py-3 rounded-lg transition-colors whitespace-nowrap cursor-pointer text-responsive ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${item.icon} text-lg sm:text-xl`}></i>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOverlayClick}
        ></div>
      )}
    </>
  );
}
