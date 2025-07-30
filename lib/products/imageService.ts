// Image Service - خدمة صور المنتجات

import { 
  ProductImage, 
  ImageUploadData
} from './types';
import { getAuthHeaders, handleApiError, validateImageFile } from './utils';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export class ImageService {
  // === PRODUCT IMAGES ===
  
  static async getProductImages(productId?: number | string): Promise<ProductImage[]> {
    const queryParams = productId ? `?product=${productId}` : '';
    const response = await fetch(
      `${BASE_URL}/store/products/images/${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  // التحقق من وجود المنتج قبل رفع الصور
  static async validateProductExists(productId: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/store/products/products/${productId}/`, {
        headers: getAuthHeaders()
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // رفع صورة مع إنشاء المنتج في نفس الوقت
  static async uploadImageWithProduct(productData: any, imageFile?: File): Promise<{ product: any, image?: ProductImage }> {
    const token = localStorage.getItem('access_token');
    
    // إنشاء FormData للمنتج والصورة
    const formData = new FormData();
    
    // إضافة بيانات المنتج
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (typeof productData[key] === 'object') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key].toString());
        }
      }
    });
    
    // إضافة الصورة إذا كانت موجودة
    if (imageFile) {
      // التحقق من صحة الملف
      const validationErrors = validateImageFile(imageFile);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      
      formData.append('main_image', imageFile);
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/products/`,
      {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      }
    );
    
    const result = await handleApiError(response);
    
    // إذا تم رفع صورة مع المنتج، قم بإنشاء كائن الصورة
    let image: ProductImage | undefined;
    if (imageFile && result.id) {
      image = {
        id: Date.now().toString(), // معرف مؤقت
        image: URL.createObjectURL(imageFile),
        image_type: 'main',
        alt_text: {
          ar: 'الصورة الرئيسية للمنتج',
          en: 'Main product image'
        },
        caption: {
          ar: 'الصورة الرئيسية',
          en: 'Main image'
        },
        is_primary: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    return { product: result, image };
  }

  static async uploadProductImage(imageData: ImageUploadData): Promise<ProductImage> {
    // Validate image file
    const validationErrors = validateImageFile(imageData.image);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // Validate product ID
    if (!imageData.product) {
      throw new Error('معرف المنتج مطلوب');
    }

    // التحقق من وجود المنتج
    const productExists = await this.validateProductExists(imageData.product);
    if (!productExists) {
      throw new Error(`المنتج غير موجود: ${imageData.product}`);
    }

    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    
    // Add basic data
    formData.append('product', imageData.product.toString());
    formData.append('image', imageData.image);
    formData.append('image_type', imageData.image_type || 'gallery');
    
    // Add alt_text as JSON if provided
    if (imageData.alt_text) {
      formData.append('alt_text', JSON.stringify(imageData.alt_text));
    }
    
    // Add caption as JSON if provided
    if (imageData.caption) {
      formData.append('caption', JSON.stringify(imageData.caption));
    }
    
    formData.append('sort_order', (imageData.sort_order || 0).toString());
    formData.append('is_active', (imageData.is_active !== false).toString());
    formData.append('is_preview', (imageData.is_preview || false).toString());
    
    if (imageData.page_number) {
      formData.append('page_number', imageData.page_number.toString());
    }
    
    const response = await fetch(
      `${BASE_URL}/store/products/images/`,
      {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      }
    );
    return handleApiError(response);
  }

  static async updateProductImage(id: number, data: Partial<ProductImage>): Promise<ProductImage> {
    const response = await fetch(
      `${BASE_URL}/store/products/images/${id}/`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    return handleApiError(response);
  }

  static async deleteProductImage(id: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/images/${id}/`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
    if (!response.ok) {
      throw new Error('فشل في حذف الصورة');
    }
  }

  static async setMainImage(id: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/images/${id}/set-main/`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    );
    if (!response.ok) {
      throw new Error('فشل في تعيين الصورة الرئيسية');
    }
  }

  static async reorderImages(orders: { id: number; order: number }[]): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/store/products/images/reorder/`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orders })
      }
    );
    if (!response.ok) {
      throw new Error('فشل في إعادة ترتيب الصور');
    }
  }

  // === BATCH IMAGE OPERATIONS ===
  
  static async uploadMultipleImages(productId: number, images: File[], imageType: string = 'gallery'): Promise<ProductImage[]> {
    const uploadedImages: ProductImage[] = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        const imageData: ImageUploadData = {
          product: productId,
          image: images[i],
          image_type: i === 0 ? 'main' : imageType,
          alt_text: {
            ar: `صورة ${i + 1} للمنتج`,
            en: `Product image ${i + 1}`
          },
          sort_order: i + 1
        };
        
        const uploadedImage = await this.uploadProductImage(imageData);
        uploadedImages.push(uploadedImage);
      } catch (error) {
        console.error(`فشل في رفع الصورة ${i + 1}:`, error);
        throw error;
      }
    }
    
    return uploadedImages;
  }

  static async deleteMultipleImages(imageIds: number[]): Promise<void> {
    const deletePromises = imageIds.map(id => this.deleteProductImage(id));
    await Promise.all(deletePromises);
  }

  // === IMAGE VALIDATION ===
  
  static validateImageFile(file: File): string[] {
    return validateImageFile(file);
  }

  static validateImageFiles(files: File[]): string[] {
    const errors: string[] = [];
    
    files.forEach((file, index) => {
      const fileErrors = validateImageFile(file);
      if (fileErrors.length > 0) {
        errors.push(`الصورة ${index + 1}: ${fileErrors.join(', ')}`);
      }
    });
    
    return errors;
  }
} 