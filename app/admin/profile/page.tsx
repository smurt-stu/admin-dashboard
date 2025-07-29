'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  phone_verified: boolean;
  university_id: string;
  major: string | null;
  university: string | null;
  college: string | null;
  date_of_birth: string | null;
  profile_picture: string | null;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

interface ProfileResponse {
  message: string;
  profile: UserProfile;
}

// Simple UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: string; className?: string }) => {
  const variantClasses = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-600 text-white",
    outline: "border border-gray-300 text-gray-900"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt = "" }: { src?: string; alt?: string }) => (
  <img className="aspect-square h-full w-full" src={src} alt={alt} />
);

const AvatarFallback = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "default", className = "", ...props }: { children: React.ReactNode; variant?: string; className?: string; [key: string]: any }) => {
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`shrink-0 bg-gray-200 h-[1px] w-full ${className}`} />
);

// Icons
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GraduationCapIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
const BuildingIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const SaveIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l3 3m0 0l-3 3m3-3H9" /></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null); // إزالة أي خطأ سابق
      const user = await AuthService.getCurrentUser();
      console.log('USER PROFILE:', user);
      
      // التأكد من أن البيانات صحيحة قبل عرضها
      if (user && user.id) {
        setProfile(user as UserProfile);
        setEditForm(user as UserProfile);
      } else {
        throw new Error('بيانات المستخدم غير صحيحة');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في جلب بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile || {});
  };

  const handleSave = async () => {
    try {
      // Here you would typically make a PUT/PATCH request to update the profile
      // For now, we'll just simulate the update
      setProfile({ ...profile, ...editForm } as UserProfile);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <Button onClick={fetchProfile} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No profile data available</p>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'غير محدد';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">معلومات المستخدم</h1>
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <EditIcon />
              تعديل المعلومات
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <SaveIcon />
                حفظ
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <XIcon />
                إلغاء
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture and Basic Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profile_picture || ''} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{profile.full_name}</h3>
                  <p className="text-gray-600">@{profile.username}</p>
                  <div className="flex gap-2 mt-2 justify-center">
                    {profile.is_superuser && (
                      <Badge variant="destructive">مدير النظام</Badge>
                    )}
                    {profile.is_staff && (
                      <Badge variant="secondary">موظف</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MailIcon />
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">البريد الإلكتروني</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.email || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{profile.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneIcon />
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">رقم الهاتف</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.phone_number || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone_number', e.target.value)}
                        className="mt-1"
                        placeholder="أدخل رقم الهاتف"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {profile.phone_number || 'غير محدد'}
                        </p>
                        {profile.phone_verified && (
                          <Badge variant="outline" className="text-green-600">
                            ✓ مؤكد
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarIcon />
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">تاريخ الميلاد</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editForm.date_of_birth || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('date_of_birth', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{profile.date_of_birth ? formatDate(profile.date_of_birth) : 'غير محدد'}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCapIcon />
                المعلومات الأكاديمية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">الرقم الجامعي</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.university_id || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('university_id', e.target.value)}
                        className="mt-1"
                        placeholder="أدخل الرقم الجامعي"
                      />
                    ) : (
                      <p className="font-medium mt-1">
                        {profile.university_id || 'غير محدد'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600">التخصص</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.major || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('major', e.target.value)}
                        className="mt-1"
                        placeholder="أدخل التخصص"
                      />
                    ) : (
                      <p className="font-medium mt-1">
                        {profile.major || 'غير محدد'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">الجامعة</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.university || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('university', e.target.value)}
                        className="mt-1"
                        placeholder="أدخل اسم الجامعة"
                      />
                    ) : (
                      <p className="font-medium mt-1">
                        {profile.university || 'غير محدد'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600">الكلية</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.college || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('college', e.target.value)}
                        className="mt-1"
                        placeholder="أدخل اسم الكلية"
                      />
                    ) : (
                      <p className="font-medium mt-1">
                        {profile.college || 'غير محدد'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Information */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <BuildingIcon />
                  معلومات الحساب
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">تاريخ الإنشاء</Label>
                    <p className="font-medium mt-1">{formatDate(profile.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">آخر تحديث</Label>
                    <p className="font-medium mt-1">{formatDate(profile.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 