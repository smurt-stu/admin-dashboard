// خدمة إدارة صور المنتجات حسب API المطور
export class ProductImageService {
  private static API_BASE_URL = 'https://smart-ai-api.onrender.com/api/v1/store/products/';
  
  // الحصول على token من localStorage
  private static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // التحقق من صحة الملفات
  static validateImageFile(file: File): string[] {
    const errors: string[] = [];
    
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, GIF, WEBP');
    }
    
    // التحقق من حجم الملف (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('حجم الملف كبير جداً. الحد الأقصى: 5MB');
    }
    
    return errors;
  }

  // رفع صورة جديدة
  static async uploadImage(productId: string, file: File, options: {
    imageType?: 'main' | 'gallery' | 'thumbnail' | 'variant';
    altText?: { ar: string; en: string };
    caption?: { ar: string; en: string };
    displayOrder?: number;
    isPrimary?: boolean;
  } = {}): Promise<any> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('غير مصرح لك برفع الصور - يرجى تسجيل الدخول كمدير');
    }

    // التحقق من صحة الملف
    const validationErrors = this.validateImageFile(file);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join('\n'));
    }

    const formData = new FormData();
    
    // الحقول المطلوبة
    formData.append('product', productId);
    formData.append('image', file);
    
    // الحقول الاختيارية
    if (options.imageType) {
      formData.append('image_type', options.imageType);
    } else {
      formData.append('image_type', 'gallery');
    }
    
    if (options.altText) {
      formData.append('alt_text', JSON.stringify(options.altText));
    } else {
      formData.append('alt_text', JSON.stringify({
        ar: file.name.replace(/\.[^/.]+$/, ''),
        en: file.name.replace(/\.[^/.]+$/, '')
      }));
    }
    
    if (options.caption) {
      formData.append('caption', JSON.stringify(options.caption));
    } else {
      formData.append('caption', JSON.stringify({
        ar: file.name.replace(/\.[^/.]+$/, ''),
        en: file.name.replace(/\.[^/.]+$/, '')
      }));
    }
    
    if (options.displayOrder !== undefined) {
      formData.append('display_order', options.displayOrder.toString());
    } else {
      formData.append('display_order', '1');
    }
    
    if (options.isPrimary !== undefined) {
      formData.append('is_primary', options.isPrimary.toString());
    } else {
      formData.append('is_primary', 'false');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}images/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في رفع الصورة');
      }

      return await response.json();
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      throw error;
    }
  }

  // جلب جميع صور المنتج
  static async getProductImages(productId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}images/?product=${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        return data.results || [];
      } else {
        throw new Error(data.message || 'خطأ في جلب الصور');
      }
    } catch (error) {
      console.error('خطأ في جلب الصور:', error);
      throw error;
    }
  }

  // جلب صورة محددة
  static async getImageDetails(imageId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}images/${imageId}/`);
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'خطأ في جلب تفاصيل الصورة');
      }
    } catch (error) {
      console.error('خطأ في جلب تفاصيل الصورة:', error);
      throw error;
    }
  }

  // تعيين صورة كرئيسية
  static async setMainImage(imageId: string): Promise<any> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('غير مصرح لك بتعيين الصورة الرئيسية - يرجى تسجيل الدخول كمدير');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}images/${imageId}/set-main/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return result;
      } else {
        throw new Error(result.message || 'خطأ في تعيين الصورة الرئيسية');
      }
    } catch (error) {
      console.error('خطأ في تعيين الصورة الرئيسية:', error);
      throw error;
    }
  }

  // تحديث معلومات الصورة
  static async updateImage(imageId: string, updateData: {
    altText?: { ar: string; en: string };
    caption?: { ar: string; en: string };
    displayOrder?: number;
    imageType?: string;
  }): Promise<any> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('غير مصرح لك بتحديث الصورة - يرجى تسجيل الدخول كمدير');
    }

    try {
      const formData = new FormData();
      
      if (updateData.altText) {
        formData.append('alt_text', JSON.stringify(updateData.altText));
      }
      if (updateData.caption) {
        formData.append('caption', JSON.stringify(updateData.caption));
      }
      if (updateData.displayOrder !== undefined) {
        formData.append('display_order', updateData.displayOrder.toString());
      }
      if (updateData.imageType) {
        formData.append('image_type', updateData.imageType);
      }
      
      const response = await fetch(`${this.API_BASE_URL}images/${imageId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return result;
      } else {
        throw new Error(result.message || 'خطأ في تحديث الصورة');
      }
    } catch (error) {
      console.error('خطأ في تحديث الصورة:', error);
      throw error;
    }
  }

  // حذف صورة
  static async deleteImage(imageId: string): Promise<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('غير مصرح لك بحذف الصورة - يرجى تسجيل الدخول كمدير');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}images/${imageId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطأ في حذف الصورة');
      }
    } catch (error) {
      console.error('خطأ في حذف الصورة:', error);
      throw error;
    }
  }

  // إعادة ترتيب الصور
  static async reorderImages(imageOrders: Array<{ id: number; order: number }>): Promise<any> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('غير مصرح لك بإعادة ترتيب الصور - يرجى تسجيل الدخول كمدير');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}images/reorder/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orders: imageOrders
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return result;
      } else {
        throw new Error(result.message || 'خطأ في إعادة ترتيب الصور');
      }
    } catch (error) {
      console.error('خطأ في إعادة ترتيب الصور:', error);
      throw error;
    }
  }

  // معالجة الأخطاء
  static handleError(error: any): string {
    let errorMessage = 'حدث خطأ غير متوقع';
    
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 400:
          errorMessage = 'بيانات غير صحيحة - تأكد من صحة الملف';
          break;
        case 401:
          errorMessage = 'غير مصرح لك برفع الصور - يرجى تسجيل الدخول كمدير';
          break;
        case 403:
          errorMessage = 'ليس لديك صلاحية لرفع الصور';
          break;
        case 404:
          errorMessage = 'المنتج غير موجود';
          break;
        case 413:
          errorMessage = 'حجم الملف كبير جداً - الحد الأقصى 5MB';
          break;
        case 415:
          errorMessage = 'نوع الملف غير مدعوم - يرجى استخدام JPG, PNG, GIF, WEBP';
          break;
        case 500:
          errorMessage = 'خطأ في الخادم - يرجى المحاولة لاحقاً';
          break;
        default:
          errorMessage = `خطأ في الخادم (${status})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return errorMessage;
  }
} 