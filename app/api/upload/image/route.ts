import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const productId = formData.get('product_id') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم توفير ملف' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'الملف يجب أن يكون صورة' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'حجم الملف يجب أن يكون أقل من 5MB' },
        { status: 400 }
      );
    }

    // إنشاء مجلد الصور إذا لم يكن موجوداً
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${productId}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // تحويل الملف إلى buffer وحفظه
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // إرجاع رابط الصورة
    const imageUrl = `/uploads/products/${fileName}`;

    return NextResponse.json({
      success: true,
      image_url: imageUrl,
      file_name: fileName
    });

  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'طريقة GET غير مدعومة' },
    { status: 405 }
  );
} 