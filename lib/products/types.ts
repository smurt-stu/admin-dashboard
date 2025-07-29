// Product Types - جميع أنواع البيانات المتعلقة بالمنتجات

// === ProductType Interface ===
export interface ProductType {
  id: string;
  name: string;
  display_name: {
    ar: string;
    en: string;
  };
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_digital: boolean;
  requires_shipping: boolean;
  track_stock: boolean;
  has_variants: boolean;
  template_name?: string;
  settings: {
    size_options?: string[];
    color_options?: string[];
    material_types?: string[];
    brand_options?: string[];
    storage_options?: string[];
    custom_fields?: CustomField[];
  };
  display_order: number;
  products_count: number;
  created_at: string;
  updated_at: string;
}

// === Custom Field Interface ===
export interface CustomField {
  name: string;
  label: {
    ar: string;
    en: string;
  };
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'date';
  required: boolean;
  options?: string[];
  default_value?: any;
}

// === Product Interface ===
export interface Product {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  subtitle?: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  short_description?: {
    ar: string;
    en: string;
  };
  slug: string;
  category: Category;
  product_type: ProductType;
  sku?: string;
  barcode?: string;
  brand?: string;
  model_number?: string;
  author?: string;
  isbn?: string;
  language?: string; // ar, en, fr, es, de, other
  pages_count?: number;
  publication_date?: string;
  price: string;
  compare_price?: string;
  cost_price?: string;
  discount_percentage?: number;
  effective_price: number;
  main_image: string | null;
  cover_image?: string;
  digital_file?: string;
  sample_file?: string;
  stock_quantity?: number;
  min_stock_alert?: number;
  max_order_quantity?: number;
  track_stock: boolean;
  requires_shipping: boolean;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  warranty_period?: number;
  warranty_type?: string;
  condition?: string; // new, refurbished, used, open_box, damaged
  in_stock: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  launch_date?: string;
  tags?: string;
  meta_title?: {
    ar: string;
    en: string;
  };
  meta_description?: {
    ar: string;
    en: string;
  };
  keywords?: {
    ar: string;
    en: string;
  };
  specifications?: Record<string, any>;
  settings?: {
    allow_reviews: boolean;
    allow_ratings: boolean;
    show_stock: boolean;
  };
  variants?: ProductVariant[];
  images?: ProductImage[];
  fields?: ProductField[];
  variants_count: number;
  images_count: number;
  fields_count: number;
  is_low_stock: boolean;
  rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

// === ProductVariant Interface ===
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  options: Record<string, string>;
  price_modifier: string;
  cost_price?: string;
  stock_quantity: number;
  min_stock_alert?: number;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  image?: string;
  settings?: {
    is_active: boolean;
    allow_purchase: boolean;
  };
  display_order: number;
  is_in_stock: boolean;
  is_low_stock: boolean;
  effective_price: string;
  created_at: string;
  updated_at: string;
}

// === ProductImage Interface ===
export interface ProductImage {
  id: string;
  image: string;
  image_type: string; // main, gallery, variant, category
  alt_text?: {
    ar: string;
    en: string;
  };
  caption?: {
    ar: string;
    en: string;
  };
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// === ProductField Interface ===
export interface ProductField {
  id: string;
  field_name: string;
  field_label: {
    ar: string;
    en: string;
  };
  field_type: string;
  field_value: {
    ar: string;
    en: string;
  };
  is_searchable: boolean;
  is_filterable: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// === Category Interface ===
export interface Category {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  slug: string;
  description?: {
    ar: string;
    en: string;
  };
  icon?: string;
  image?: string;
  display_order: number;
  is_active: boolean;
  parent?: Category;
  children?: Category[];
  products_count: number;
  meta_title?: {
    ar: string;
    en: string;
  };
  meta_description?: {
    ar: string;
    en: string;
  };
  created_at: string;
  updated_at: string;
}

// === Department Interface ===
export interface Department {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

// === Analytics Interface ===
export interface Analytics {
  id: number;
  product: number;
  views_count: number;
  sales_count: number;
  revenue: number;
  conversion_rate: number;
  date: string;
}

// === API Response Interfaces ===
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// === Form Types ===
export interface ProductFormData {
  title: string;
  title_en?: string;
  subtitle?: string;
  subtitle_en?: string;
  description?: string;
  description_en?: string;
  short_description?: string;
  short_description_en?: string;
  slug: string;
  category: string;
  product_type: string;
  sku?: string;
  barcode?: string;
  author?: string;
  isbn?: string;
  language?: string;
  pages_count?: number;
  publication_date?: string;
  brand?: string;
  model_number?: string;
  price: string;
  compare_price?: string;
  cost_price?: string;
  discount_percentage?: number;
  specifications?: {
    ar: string;
    en: string;
  };
  detailed_specifications?: any[];
  cover_image?: string;
  digital_file?: string;
  sample_file?: string;
  main_image: string;
  stock_quantity?: number;
  min_stock_alert?: number;
  max_order_quantity?: number;
  track_stock?: boolean;
  requires_shipping?: boolean;
  weight?: string;
  dimensions?: any;
  warranty_period?: number;
  warranty_type?: string;
  condition?: string;
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival?: boolean;
  is_on_sale?: boolean;
  launch_date?: string;
  tags?: string;
  meta_title?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_en?: string;
  keywords?: string;
  keywords_en?: string;
}

// === Filter Types ===
export interface ProductFilters {
  search?: string;
  category?: string;
  product_type?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  brand?: string;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_on_sale?: boolean;
  in_stock?: boolean;
  has_variants?: boolean;
  has_images?: boolean;
  tags?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  lang?: string;
}

export interface CategoryFilters {
  search?: string;
  is_active?: boolean;
  parent?: string;
  has_products?: boolean;
  product_type?: string;
  page?: number;
  page_size?: number;
  lang?: string;
}

export interface ProductTypeFilters {
  search?: string;
  has_variants?: boolean;
  is_digital?: boolean;
  requires_shipping?: boolean;
  track_stock?: boolean;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// === Stock Update Types ===
export interface StockUpdateData {
  stock_quantity?: number;
  min_stock_alert?: number;
  max_order_quantity?: number;
  track_stock?: boolean;
  reason?: string;
}

// === Image Upload Types ===
export interface ImageUploadData {
  image: File;
  image_type?: string;
  alt_text?: {
    ar: string;
    en: string;
  };
  caption?: {
    ar: string;
    en: string;
  };
}

// === Bulk Update Types ===
export interface BulkUpdateData {
  product_ids: string[];
  updates: Partial<Product>;
}

// === Variant Types ===
export interface VariantFormData {
  name: string;
  options: Record<string, string>;
  price_modifier: string;
  cost_price?: string;
  stock_quantity: number;
  min_stock_alert?: number;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  settings?: {
    is_active: boolean;
    allow_purchase: boolean;
  };
  display_order?: number;
}

export interface BulkVariantData {
  variants: VariantFormData[];
}

// === Analytics Types ===
export interface AnalyticsFilters {
  product?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface AnalyticsDashboard {
  total_products: number;
  total_views: number;
  total_sales: number;
  total_revenue: number;
  conversion_rate: number;
}

export interface InventoryReport {
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}

// === Statistics Types ===
export interface ProductStatistics {
  total_views: number;
  total_sales: number;
  total_revenue: number;
  average_rating: number;
  reviews_count: number;
  top_variants: Array<{
    id: string;
    name: string;
    sales_count: number;
    revenue: string;
  }>;
  stock_status: {
    total_stock: number;
    available_stock: number;
    reserved_stock: number;
    low_stock_variants: number;
  };
}

export interface CategoryStatistics {
  total_products: number;
  active_products: number;
  total_variants: number;
  total_revenue: string;
  average_price: string;
  top_products: Array<{
    id: string;
    title: {
      ar: string;
      en: string;
    };
    price: string;
    sales_count: number;
  }>;
  price_range: {
    min: string;
    max: string;
    average: string;
  };
  subcategories: Array<{
    id: string;
    name: {
      ar: string;
      en: string;
    };
    products_count: number;
  }>;
}

export interface ProductTypeStatistics {
  total_products: number;
  active_products: number;
  total_variants: number;
  total_revenue: string;
  average_price: string;
  top_categories: Array<{
    category_name: string;
    products_count: number;
  }>;
  top_colors: Array<{
    color: string;
    variants_count: number;
  }>;
  top_sizes: Array<{
    size: string;
    variants_count: number;
  }>;
} 