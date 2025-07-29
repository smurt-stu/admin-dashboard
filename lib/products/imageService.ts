// Image Service - خدمة صور المنتجات

import { 
  ProductImage, 
  ImageUploadData
} from './types';
import { getAuthHeaders, handleApiError, validateImageFile } from './utils';

const BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export class ImageService {
  // === PRODUCT IMAGES ===
  
  static async getProductImages(productId?: number): Promise<ProductImage[]> {
    const queryParams = productId ? `?product=${productId}` : '';
    const response = await fetch(
      `${BASE_URL}/store/products/images/${queryParams}`,
      { headers: getAuthHeaders() }
    );
    return handleApiError(response);
  }

  static async uploadProductImage(imageData: ImageUploadData): Promise<ProductImage> {
    // Validate image file
    const validationErrors = validateImageFile(imageData.image);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    
    // Add basic data
    formData.append('product', imageData.product.toString());
    formData.append('image', imageData.image);
    formData.append('image_type', imageData.image_type);
    formData.append('alt_text', imageData.alt_text || '');
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
          alt_text: `صورة ${i + 1} للمنتج`,
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