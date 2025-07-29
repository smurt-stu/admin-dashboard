import { AuthService } from './auth';

const API_BASE_URL = 'https://smart-ai-api.onrender.com/api/v1';

export interface StoreSettings {
  store_name: string;
  store_logo?: string;
  contact_email: string;
  contact_phone: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  default_currency: string;
  vat_percentage: number;
  enable_vat: boolean;
  primary_color: string;
  secondary_color: string;
  maintenance_mode: boolean;
  maintenance_message?: string;
}

export interface UpdateSettingsData {
  store_name?: string;
  store_logo?: File;
  contact_email?: string;
  contact_phone?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  default_currency?: string;
  vat_percentage?: number;
  enable_vat?: boolean;
  primary_color?: string;
  secondary_color?: string;
  maintenance_mode?: boolean;
  maintenance_message?: string;
}

export class SettingsService {
  static async getSettings(): Promise<StoreSettings> {
    const response = await AuthService.makeAuthenticatedRequest(
      `${API_BASE_URL}/site/settings/update/`
    );

    if (!response.ok) {
      throw new Error('فشل في تحميل الإعدادات');
    }

    return response.json();
  }

  static async updateSettings(settingsData: UpdateSettingsData): Promise<StoreSettings> {
    const formData = new FormData();
    
    // إضافة البيانات العادية
    Object.entries(settingsData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'store_logo' && key !== 'social_links') {
        formData.append(key, value.toString());
      }
    });

    // إضافة الشبكات الاجتماعية
    if (settingsData.social_links) {
      formData.append('social_links', JSON.stringify(settingsData.social_links));
    }

    // إضافة ملف الشعار
    if (settingsData.store_logo) {
      formData.append('store_logo', settingsData.store_logo);
    }

    const response = await fetch(`${API_BASE_URL}/site/settings/update/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في تحديث الإعدادات');
    }

    return response.json();
  }

  static getCurrencies(): Array<{ code: string; name: string; symbol: string }> {
    return [
      { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
      { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
      { code: 'EUR', name: 'يورو', symbol: '€' },
      { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' },
      { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك' },
      { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق' },
      { code: 'BHD', name: 'دينار بحريني', symbol: 'د.ب' },
      { code: 'OMR', name: 'ريال عماني', symbol: 'ر.ع' }
    ];
  }

  static validateSettings(settings: UpdateSettingsData): string[] {
    const errors: string[] = [];

    if (settings.store_name && settings.store_name.trim().length < 2) {
      errors.push('اسم المتجر يجب أن يكون أكثر من حرفين');
    }

    if (settings.contact_email && !this.isValidEmail(settings.contact_email)) {
      errors.push('البريد الإلكتروني غير صحيح');
    }

    if (settings.contact_phone && !this.isValidPhone(settings.contact_phone)) {
      errors.push('رقم الهاتف غير صحيح');
    }

    if (settings.vat_percentage !== undefined && (settings.vat_percentage < 0 || settings.vat_percentage > 100)) {
      errors.push('نسبة ضريبة القيمة المضافة يجب أن تكون بين 0 و 100');
    }

    if (settings.primary_color && !this.isValidColor(settings.primary_color)) {
      errors.push('اللون الأساسي غير صحيح');
    }

    if (settings.secondary_color && !this.isValidColor(settings.secondary_color)) {
      errors.push('اللون الثانوي غير صحيح');
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  private static isValidColor(color: string): boolean {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return colorRegex.test(color);
  }

  static formatCurrency(amount: number, currency: string): string {
    const currencyInfo = this.getCurrencies().find(c => c.code === currency);
    return `${amount.toLocaleString('ar-SA')} ${currencyInfo?.symbol || currency}`;
  }
} 