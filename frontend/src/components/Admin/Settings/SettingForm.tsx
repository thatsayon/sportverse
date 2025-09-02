"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, CirclePlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Validation schemas
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  profileImage: z.any().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const BASE_URL = 'http://127.0.0.1:8000';

export default function SettingForm() {
  const [profileImage, setProfileImage] = useState<string>('/api/placeholder/150/150');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Bradley',
      lastName: 'Lawlor',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

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
      
      // Set the compressed file to form
      profileForm.setValue('profileImage', compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      setProfileMessage({ type: 'error', text: 'Failed to process image' });
    }
  };

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileLoading(true);
    setProfileMessage(null);

    try {
      const formData = new FormData();
      formData.append('full_name', `${data.firstName} ${data.lastName}`);
      
      if (data.profileImage) {
        formData.append('image', data.profileImage);
      }

      const response = await fetch(`${BASE_URL}/update-profile`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
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
      const response = await fetch(`${BASE_URL}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: data.currentPassword,
          new_password: data.newPassword,
        }),
      });

      if (response.ok) {
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
                  <AvatarFallback className="text-lg sm:text-xl">BL</AvatarFallback>
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
                  <Label htmlFor="firstName">Name</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register('firstName')}
                    placeholder="First name"
                    className={profileForm.formState.errors.firstName ? 'border-red-500 h-12' : ' h-12'}
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.firstName.message}</p>
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
                disabled={profileLoading}
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
                <Label htmlFor="currentPassword">Current password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...passwordForm.register('currentPassword')}
                    placeholder="john123#$8"
                    className={passwordForm.formState.errors.currentPassword ? 'border-red-500 h-10' : 'h-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    {...passwordForm.register('newPassword')}
                    placeholder="john123#$8"
                    className={passwordForm.formState.errors.newPassword ? 'border-red-500 h-10' : 'h-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...passwordForm.register('confirmPassword')}
                    placeholder="john123#$8"
                    className={passwordForm.formState.errors.confirmPassword ? 'border-red-500 h-10' : 'h-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
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