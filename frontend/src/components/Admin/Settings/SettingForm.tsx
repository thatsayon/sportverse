"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CirclePlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAdminProfileQuery, useUpdatePasswordMutation } from '@/store/Slices/apiSlices/adminApiSlice';
import { getCookie } from '@/hooks/cookie';

// Admin response interface
export interface AdminResponse {
  id: string;
  full_name: string;
  profile_pic: string | null;
}

// Validation schemas
const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  profileImage: z.any().optional(),
});

const passwordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const BASE_URL = 'https://stingray-intimate-sincerely.ngrok-free.app';

export default function SettingForm() {
  const [profileImage, setProfileImage] = useState<string>('/api/placeholder/150/150');
  const [originalProfileImage, setOriginalProfileImage] = useState<string>('/api/placeholder/150/150');
  const [showold_password, setShowold_password] = useState(false);
  const [shownew_password, setShownew_password] = useState(false);
  const [showconfirm_password, setShowconfirm_password] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [originalFullName, setOriginalFullName] = useState('');
  const [hasImageChanged, setHasImageChanged] = useState(false);
  
  const { data } = useGetAdminProfileQuery();
  const [updatePassword] = useUpdatePasswordMutation()
  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  // Watch form values to detect changes
  const watchedFullName = profileForm.watch('full_name');

  // Load admin data when available
  useEffect(() => {
    if (data) {
      const fullName = data.full_name || '';
      const profilePic = data.profile_pic || '/api/placeholder/150/150';
      
      profileForm.setValue('full_name', fullName);
      setOriginalFullName(fullName);
      setProfileImage(profilePic);
      setOriginalProfileImage(profilePic);
    }
  }, [data, profileForm]);

  // Check for changes in form data
  useEffect(() => {
    const hasNameChanged = watchedFullName !== originalFullName;
    const hasChanges = hasNameChanged || hasImageChanged;
    setHasProfileChanges(hasChanges);
  }, [watchedFullName, originalFullName, hasImageChanged]);

  // Handle image upload and compression
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Compression options
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(compressedFile);
      setProfileImage(previewUrl);
      setHasImageChanged(true);
      
      // Set the compressed file to form
      profileForm.setValue('profileImage', compressedFile);
    } catch (error) {
      //console.error('Error compressing image:', error);
      setProfileMessage({ type: 'error', text: 'Failed to process image' });
    }
  };

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileLoading(true);
    setProfileMessage(null);

    try {
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      
      if (data.profileImage && hasImageChanged) {
        formData.append('image', data.profileImage);
      }

      const token = getCookie("access_token")

      const response = await fetch(`${BASE_URL}/control/profile/`, {
        method: 'PATCH',
        headers: {
    Authorization: `Bearer ${token}`, // ✅ add your token here
  },
        body: formData,
      });

      if (response.ok) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update original values to reflect the new saved state
        setOriginalFullName(data.full_name);
        setOriginalProfileImage(profileImage);
        setHasImageChanged(false);
        setHasProfileChanges(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password update
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      // const response = await fetch(`${BASE_URL}/update-password`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     old_password: data.old_password,
      //     new_password: data.new_password,
      //   }),
      // });

      const response = await updatePassword(data).unwrap()

      if (response) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        passwordForm.reset();
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AD';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <Card className='border-none shadow-none'>
          <CardHeader>
            <CardTitle className="text-center text-xl">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="text-lg sm:text-xl">
                    {getInitials(data?.full_name || '')}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:bg-[#F15A24] hover:bg-[#F15A24] transition-colors duration-200 rounded-full p-2"
                >
                  <CirclePlus stroke="white" size={40} className="w-10 h-10 group-hover:text-[#F15A24] transition-colors duration-200" />
                </button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-4 text-center">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...profileForm.register('full_name')}
                    placeholder="Enter your full name"
                    className={profileForm.formState.errors.full_name ? 'border-red-500 h-12' : ' h-12'}
                  />
                  {profileForm.formState.errors.full_name && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.full_name.message}</p>
                  )}
                </div>
              </div>

              {profileMessage && (
                <Alert className={profileMessage.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
                  <AlertDescription className={profileMessage.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                    {profileMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={profileForm.handleSubmit(onProfileSubmit)}
                className=""
                disabled={profileLoading || !hasProfileChanges}
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card className='border-none shadow-none'>
          <CardHeader>
            <CardTitle className="text-center text-xl">Password and security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              {/* Current Password */}
              <div className="space-y-2 text-center">
                <Label htmlFor="old_password">Current password</Label>
                <div className="relative">
                  <Input
                    id="old_password"
                    type={showold_password ? 'text' : 'password'}
                    {...passwordForm.register('old_password')}
                    placeholder="john123#$8"
                    className={passwordForm.formState.errors.old_password ? 'border-red-500 h-10' : 'h-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowold_password(!showold_password)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showold_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.old_password && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.old_password.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new_password">New password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={shownew_password ? 'text' : 'password'}
                    {...passwordForm.register('new_password')}
                    placeholder="john123#$8"
                    className={passwordForm.formState.errors.new_password ? 'border-red-500 h-10' : 'h-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShownew_password(!shownew_password)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {shownew_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.new_password && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.new_password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showconfirm_password ? 'text' : 'password'}
                    {...passwordForm.register('confirm_password')}
                    placeholder="john123#$8"
                    className={passwordForm.formState.errors.confirm_password ? 'border-red-500 h-10' : 'h-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowconfirm_password(!showconfirm_password)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showconfirm_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirm_password && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.confirm_password.message}</p>
                )}
              </div>

              {passwordMessage && (
                <Alert className={passwordMessage.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
                  <AlertDescription className={passwordMessage.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                    {passwordMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={passwordForm.handleSubmit(onPasswordSubmit)}
                className=""
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}