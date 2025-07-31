
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductService, CategoryService, Product, Category, PaginatedResponse } from '../../../lib/products';

interface ProductFilters {
  search: string;
  category: string;
  is_featured: string;
  is_bestseller: string;
  ordering: string;
  page: number;
}

type ViewMode = 'table' | 'cards';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    is_featured: '',
    is_bestseller: '',
    ordering: '-created_at',
    page: 1
  });

  // تحميل البيانات
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: filters.page,
        page_size: 20,
        ordering: filters.ordering
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.is_featured) params.is_featured = filters.is_featured === 'true';
      if (filters.is_bestseller) params.is_bestseller = filters.is_bestseller === 'true';

      const response: PaginatedResponse<Product> = await ProductService.getProducts(params);
      setProducts(response?.results || []);
      setTotalCount(response?.pagination?.total_count || 0);
      setError(null);
    } catch (err) {
      setError('فشل في تحميل المنتجات');
      setProducts([]);
      setTotalCount(0);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await CategoryService.getCategories({ is_active: true });
      setCategories(response?.results || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  };

  const handleFilterChange = (key: keyof ProductFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : (typeof value === 'string' ? parseInt(value) : value)
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const productsArray = products || [];
    const selectedArray = selectedProducts || [];
    
    if (selectedArray.length === productsArray.length && productsArray.length > 0) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(productsArray.map(p => p.id));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await ProductService.deleteProduct(productId);
        loadProducts();
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      } catch (err) {
        alert('فشل في حذف المنتج');
      }
    }
  };

  const handleBulkDelete = async () => {
    const selectedArray = selectedProducts || [];
    if (selectedArray.length === 0) return;
    
    if (confirm(`هل أنت متأكد من حذف ${selectedArray.length} منتج؟`)) {
      try {
        await Promise.all(selectedArray.map(id => ProductService.deleteProduct(id)));
        loadProducts();
        setSelectedProducts([]);
      } catch (err) {
        alert('فشل في حذف المنتجات');
      }
    }
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseFloat(price);
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'JOD'
    }).format(numericPrice);
  };

  const getStockStatus = (inStock: boolean) => {
    if (!inStock) {
      return { color: 'bg-red-100 text-red-800', text: 'نفد المخزون' };
    } else {
      return { color: 'bg-green-100 text-green-800', text: 'متوفر' };
    }
  };

  const getProductTitle = (title: any) => {
    if (typeof title === 'string') {
      return title || 'بدون عنوان';
    }
    return title?.ar || title?.en || 'بدون عنوان';
  };

  const getCategoryName = (categoryName: any) => {
    if (typeof categoryName === 'string') {
      return categoryName || 'فئة عامة';
    }
    return categoryName?.ar || categoryName?.en || 'فئة عامة';
  };

  const getCategoryDisplayName = (category: Category) => {
    if (typeof category.name === 'string') {
      return category.name;
    }
    return category.name?.ar || category.name?.en || 'بدون اسم';
  };

  const totalPages = Math.ceil(totalCount / 20);
  const productsArray = products || [];
  const categoriesArray = categories || [];
  const selectedArray = selectedProducts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">إدارة المنتجات</h1>
          <p className="text-gray-600 mt-1">({totalCount} منتج)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/create"
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer transition-colors text-sm"
          >
            <i className="ri-add-line"></i>
            <span>إضافة منتج جديد</span>
          </Link>
          
          <Link
            href="/admin/categories"
            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer transition-colors text-sm"
          >
            <i className="ri-folder-line"></i>
            <span>إدارة الفئات</span>
          </Link>
          
          <Link
            href="/admin/product-types"
            className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 cursor-pointer transition-colors text-sm"
          >
            <i className="ri-settings-3-line"></i>
            <span>أنواع المنتجات</span>
          </Link>
          
          {selectedArray.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-sm"
            >
              <i className="ri-delete-bin-line"></i>
              <span>حذف المحدد ({selectedArray.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="ri-box-3-fill text-blue-600 text-xl"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">متوفر</p>
              <p className="text-2xl font-bold text-gray-900">
                {productsArray.filter(p => p.in_stock).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="ri-star-fill text-blue-600 text-xl"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">مميز</p>
              <p className="text-2xl font-bold text-gray-900">
                {productsArray.filter(p => p.is_featured).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="ri-fire-fill text-purple-600 text-xl"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">مبيعات عالية</p>
              <p className="text-2xl font-bold text-gray-900">
                {productsArray.filter(p => p.is_bestseller).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* البحث */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البحث
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="البحث في المنتجات..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* التصنيف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التصنيف
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع التصنيفات</option>
                {categoriesArray.map(category => (
                  <option key={category.id} value={category.id}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
            </div>

            {/* الحالة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة
              </label>
              <select
                value={filters.is_featured}
                onChange={(e) => handleFilterChange('is_featured', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الحالات</option>
                <option value="true">مميز</option>
                <option value="false">غير مميز</option>
              </select>
            </div>

            {/* الترتيب */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الترتيب حسب
              </label>
              <select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="-created_at">الأحدث</option>
                <option value="created_at">الأقدم</option>
                <option value="title">الاسم (أ - ي)</option>
                <option value="-title">الاسم (ي - أ)</option>
                <option value="price">السعر (الأقل)</option>
                <option value="-price">السعر (الأعلى)</option>
                <option value="-views_count">الأكثر مشاهدة</option>
                <option value="-sales_count">الأكثر مبيعاً</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <i className="ri-search-line"></i>
                <span>بحث</span>
              </button>
              <button
                type="button"
                onClick={() => setFilters({
                  search: '',
                  category: '',
                  is_featured: '',
                  is_bestseller: '',
                  ordering: '-created_at',
                  page: 1
                })}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                إعادة تعيين
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">عرض:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <i className="ri-table-line ml-1"></i>
                  جدول
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <i className="ri-grid-line ml-1"></i>
                  بطاقات
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جارِ التحميل...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <i className="ri-error-warning-line text-4xl mb-2"></i>
            <p>{error}</p>
            <button
              onClick={loadProducts}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : productsArray.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <i className="ri-package-line text-4xl mb-2"></i>
            <p>لا توجد منتجات</p>
          </div>
        ) : viewMode === 'table' ? (
          <TableView 
            products={productsArray}
            selectedProducts={selectedArray}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onDeleteProduct={handleDeleteProduct}
            getProductTitle={getProductTitle}
            getCategoryName={getCategoryName}
            formatPrice={formatPrice}
            getStockStatus={getStockStatus}
          />
        ) : (
          <CardsView 
            products={productsArray}
            selectedProducts={selectedArray}
            onSelectProduct={handleSelectProduct}
            onDeleteProduct={handleDeleteProduct}
            getProductTitle={getProductTitle}
            getCategoryName={getCategoryName}
            formatPrice={formatPrice}
            getStockStatus={getStockStatus}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                disabled={filters.page <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <button
                onClick={() => handleFilterChange('page', Math.min(totalPages, filters.page + 1))}
                disabled={filters.page >= totalPages}
                className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  عرض{' '}
                  <span className="font-medium">{(filters.page - 1) * 20 + 1}</span>
                  {' '}إلى{' '}
                  <span className="font-medium">
                    {Math.min(filters.page * 20, totalCount)}
                  </span>
                  {' '}من{' '}
                  <span className="font-medium">{totalCount}</span>
                  {' '}نتيجة
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px rtl:space-x-reverse" aria-label="Pagination">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                    disabled={filters.page <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handleFilterChange('page', pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          filters.page === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handleFilterChange('page', Math.min(totalPages, filters.page + 1))}
                    disabled={filters.page >= totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Table View Component - Improved Responsive Design
function TableView({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll, 
  onDeleteProduct,
  getProductTitle,
  getCategoryName,
  formatPrice,
  getStockStatus
}: {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (id: string) => void;
  onSelectAll: () => void;
  onDeleteProduct: (id: string) => void;
  getProductTitle: (title: any) => string;
  getCategoryName: (categoryName: any) => string;
  formatPrice: (price: string) => string;
  getStockStatus: (inStock: boolean) => { color: string; text: string };
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتج
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التصنيف
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المخزون
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="hidden 2xl:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الإنشاء
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العمليات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.in_stock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => onSelectProduct(product.id)}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                          {product.main_image ? (
                            <img
                              className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover border border-gray-200"
                              src={product.main_image}
                              alt={getProductTitle(product.title)}
                            />
                          ) : (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                              <i className="ri-image-line text-gray-400 text-sm sm:text-base"></i>
                            </div>
                          )}
                        </div>
                        <div className="mr-3 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {getProductTitle(product.title)}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            ID: {product.id.slice(0, 8)}...
                          </div>
                          {/* Mobile-only info */}
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-600">
                                {formatPrice(product.price)}
                              </span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                {stockStatus.text}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        <i className={`ri-${stockStatus.text === 'متوفر' ? 'check' : 'close'}-line ml-1`}></i>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            <i className="ri-star-fill ml-1"></i>
                            مميز
                          </span>
                        )}
                        {product.is_bestseller && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            <i className="ri-fire-fill ml-1"></i>
                            مبيعات عالية
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden 2xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-700 p-1 sm:p-2 rounded hover:bg-blue-50 transition-colors"
                          title="عرض"
                        >
                          <i className="ri-eye-line text-sm sm:text-base"></i>
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-green-600 hover:text-green-700 p-1 sm:p-2 rounded hover:bg-green-50 transition-colors"
                          title="تعديل"
                        >
                          <i className="ri-edit-line text-sm sm:text-base"></i>
                        </Link>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 p-1 sm:p-2 rounded hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <i className="ri-delete-bin-line text-sm sm:text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Cards View Component - Improved Responsive Design
function CardsView({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onDeleteProduct,
  getProductTitle,
  getCategoryName,
  formatPrice,
  getStockStatus
}: {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  getProductTitle: (title: any) => string;
  getCategoryName: (categoryName: any) => string;
  formatPrice: (price: string) => string;
  getStockStatus: (inStock: boolean) => { color: string; text: string };
}) {
  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.in_stock);
          return (
            <div key={product.id} className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  {product.main_image ? (
                    <img
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      src={product.main_image}
                      alt={getProductTitle(product.title)}
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
                      <i className="ri-image-line text-gray-400 text-3xl sm:text-4xl"></i>
                    </div>
                  )}
                  
                  {/* Checkbox */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => onSelectProduct(product.id)}
                      className="rounded border-gray-300 bg-white shadow-sm focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
                    {product.is_featured && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 shadow-sm">
                        <i className="ri-star-fill ml-1"></i>
                        مميز
                      </span>
                    )}
                    {product.is_bestseller && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 shadow-sm">
                        <i className="ri-fire-fill ml-1"></i>
                        مبيعات عالية
                      </span>
                    )}
                  </div>
                  
                  {/* Stock Status Overlay */}
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color} shadow-sm`}>
                      {stockStatus.text}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {getProductTitle(product.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                      {getCategoryName(product.category)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg sm:text-xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    <div className="text-xs text-gray-400">
                      ID: {product.id.slice(0, 8)}...
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-1 sm:gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-700 p-1.5 sm:p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="عرض"
                      >
                        <i className="ri-eye-line text-sm sm:text-base"></i>
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-green-600 hover:text-green-700 p-1.5 sm:p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="تعديل"
                      >
                        <i className="ri-edit-line text-sm sm:text-base"></i>
                      </Link>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 p-1.5 sm:p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="حذف"
                      >
                        <i className="ri-delete-bin-line text-sm sm:text-base"></i>
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {new Date(product.created_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
