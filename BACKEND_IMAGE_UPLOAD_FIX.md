# إصلاح مشكلة رفع الصور مع إنشاء المنتج

## المشكلة
الموقع يطلب إضافة صورة رئيسية بشكل إجباري، لكن لا يمكن رفع الصور إلا بعد حفظ المنتج. هذا تناقض في التصميم.

## الحل المطبق في Frontend

### 1. تعديل خدمة الصور (`lib/products/imageService.ts`)
- إضافة دالة `uploadImageWithProduct` لرفع الصورة مع إنشاء المنتج في نفس الوقت
- السماح برفع الصورة الرئيسية أثناء إنشاء المنتج

### 2. تعديل صفحة إنشاء المنتج (`app/admin/products/create/page.tsx`)
- إضافة حقل `main_image_file` للنموذج
- تعديل منطق الإنشاء للتعامل مع الصور المرفوعة
- استخدام الطريقة الجديدة إذا كانت هناك صورة مرفوعة

### 3. تعديل مكون MediaTab (`app/admin/products/create/components/MediaTab.tsx`)
- إضافة قسم منفصل لرفع الصورة الرئيسية
- تحسين تجربة المستخدم مع رسائل واضحة
- إضافة معاينة للصورة المرفوعة

### 4. تعديل مكون Sidebar (`app/admin/products/create/components/Sidebar.tsx`)
- تحديث التحقق من الصورة الرئيسية ليشمل الملفات المرفوعة
- تحسين حساب النسبة المكتملة

## التغييرات المطلوبة في Backend

### 1. تعديل ProductCreateUpdateSerializer

```python
# في ملف serializers.py
class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    # إضافة حقل للصورة الرئيسية
    main_image = serializers.ImageField(required=False, allow_null=True)
    
    def create(self, validated_data):
        # استخراج الصورة إذا كانت موجودة
        main_image = validated_data.pop('main_image', None)
        
        # إنشاء المنتج
        product = Product.objects.create(**validated_data)
        
        # إذا كانت هناك صورة، قم برفعها
        if main_image:
            # إنشاء كائن ProductImage للصورة الرئيسية
            ProductImage.objects.create(
                product=product,
                image=main_image,
                image_type='main',
                is_primary=True,
                display_order=1,
                alt_text={
                    'ar': 'الصورة الرئيسية للمنتج',
                    'en': 'Main product image'
                },
                caption={
                    'ar': 'الصورة الرئيسية',
                    'en': 'Main image'
                }
            )
        
        return product
```

### 2. تعديل ProductViewSet

```python
# في ملف views/product_views.py
class ProductViewSet(viewsets.ModelViewSet):
    
    def create(self, request, *args, **kwargs):
        """إنشاء منتج جديد مع دعم رفع الصورة"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            
            # إرجاع البيانات المحدثة
            detail_serializer = ProductDetailSerializer(product)
            return Response(detail_serializer.data, status=201)
        return Response(serializer.errors, status=400)
```

### 3. تعديل ProductImage Model

```python
# في ملف models/product_image.py
class ProductImage(BaseStoreModel):
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('المنتج')
    )
    
    image = models.ImageField(
        _('الصورة'),
        upload_to='products/images/',
        validators=[validate_image_file]
    )
    
    image_type = models.CharField(
        _('نوع الصورة'),
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='gallery'
    )
    
    alt_text = models.JSONField(
        _('النص البديل'),
        default=dict,
        blank=True
    )
    
    caption = models.JSONField(
        _('التعليق'),
        default=dict,
        blank=True
    )
    
    is_primary = models.BooleanField(
        _('صورة رئيسية'),
        default=False
    )
    
    display_order = models.PositiveIntegerField(
        _('ترتيب العرض'),
        default=0
    )
    
    is_active = models.BooleanField(
        _('نشط'),
        default=True
    )
```

### 4. إضافة Validation للصور

```python
# في ملف utils.py أو validators.py
def validate_image_file(value):
    """التحقق من صحة ملف الصورة"""
    import os
    from django.core.exceptions import ValidationError
    
    # التحقق من امتداد الملف
    ext = os.path.splitext(value.name)[1].lower()
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    
    if ext not in valid_extensions:
        raise ValidationError('صيغة الملف غير مدعومة. الصيغ المدعومة: JPG, PNG, GIF, WebP')
    
    # التحقق من حجم الملف (أقل من 2MB)
    if value.size > 2 * 1024 * 1024:
        raise ValidationError('حجم الملف يجب أن يكون أقل من 2MB')
    
    return value
```

## المزايا الجديدة

### 1. رفع الصورة مع إنشاء المنتج
- يمكن رفع الصورة الرئيسية أثناء إنشاء المنتج
- لا حاجة لحفظ المنتج أولاً ثم رفع الصور

### 2. تحسين تجربة المستخدم
- رسائل واضحة وتوجيهات
- معاينة فورية للصورة المرفوعة
- تحسين مؤشر التقدم

### 3. مرونة أكبر
- دعم رفع الصور من الملفات
- دعم إضافة الصور عبر الروابط
- إمكانية رفع صور إضافية بعد الإنشاء

## خطوات التطبيق

1. **تطبيق التغييرات في Backend**
   - تعديل serializers.py
   - تعديل views/product_views.py
   - إضافة validators للصور

2. **اختبار الوظائف**
   - اختبار رفع الصورة مع إنشاء المنتج
   - اختبار رفع الصور الإضافية
   - اختبار التحقق من صحة الملفات

3. **التوثيق**
   - تحديث دليل المستخدم
   - إضافة أمثلة للاستخدام

## ملاحظات مهمة

- تأكد من إعداد media settings في Django
- إضافة validators مناسبة للصور
- اختبار الأداء مع الملفات الكبيرة
- إضافة error handling مناسب 