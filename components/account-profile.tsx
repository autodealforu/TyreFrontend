'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Mail, Phone, MapPin, Save } from 'lucide-react';
import AccountLayout from './account-layout';
import { getUserProfile, updateUserProfile } from '@/actions/auth.action';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Array<{
    _id: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    pin: string;
    landmark: string;
  }>;
  username: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export default function AccountProfile() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      pin: '',
      landmark: '',
    },
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.accessToken) return;

      try {
        setIsLoading(true);
        const result = await getUserProfile(session.accessToken);

        console.log('Profile load result:', result);

        if (result.data) {
          setProfile(result.data);
          const primaryAddress = result.data.address && result.data.address.length > 0 
            ? result.data.address[0] 
            : {
                address_1: '',
                address_2: '',
                city: '',
                state: '',
                pin: '',
                landmark: '',
              };
          
          setFormData({
            name: result.data.name || '',
            email: result.data.email || '',
            phone: result.data.phone || '',
            address: primaryAddress,
          });
        } else if (result.error) {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('Failed to load profile');
        console.error('Profile load error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [session?.accessToken]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!session?.accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsSaving(true);

      const result = await updateUserProfile(session.accessToken, formData);

      if (result.data) {
        setProfile(result.data);
        toast.success('Profile updated successfully');

        // Update session with new user data
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address.address_1}, ${formData.address.city}, ${formData.address.state} ${formData.address.pin}`,
          },
        });
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = profile && (
    formData.name !== profile.name ||
    formData.email !== profile.email ||
    formData.phone !== profile.phone ||
    JSON.stringify(formData.address) !== JSON.stringify(profile.address[0] || {})
  );

  if (isLoading) {
    return (
      <AccountLayout
        title='My Profile'
        description='Manage your personal information and account settings'
      >
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title='My Profile'
      description='Manage your personal information and account settings'
    >
      <div className='space-y-6'>
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Name */}
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='Enter your full name'
                />
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder='Enter your email'
                    className='pl-10'
                  />
                </div>
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number</Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='Enter your phone number'
                    className='pl-10'
                  />
                </div>
              </div>

              {/* Username (Read-only) */}
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  value={profile?.username || ''}
                  disabled
                  className='bg-muted'
                />
              </div>
            </div>

            {/* Address */}
            <div className='space-y-4'>
              <Label className='text-base font-medium'>Address Information</Label>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Address Line 1 */}
                <div className='space-y-2'>
                  <Label htmlFor='address_1'>Address Line 1</Label>
                  <Input
                    id='address_1'
                    value={formData.address.address_1}
                    onChange={(e) => handleInputChange('address.address_1', e.target.value)}
                    placeholder='House/Flat no, Building name'
                  />
                </div>

                {/* Address Line 2 */}
                <div className='space-y-2'>
                  <Label htmlFor='address_2'>Address Line 2</Label>
                  <Input
                    id='address_2'
                    value={formData.address.address_2}
                    onChange={(e) => handleInputChange('address.address_2', e.target.value)}
                    placeholder='Area, Locality'
                  />
                </div>

                {/* City */}
                <div className='space-y-2'>
                  <Label htmlFor='city'>City</Label>
                  <Input
                    id='city'
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder='Enter city'
                  />
                </div>

                {/* State */}
                <div className='space-y-2'>
                  <Label htmlFor='state'>State</Label>
                  <Input
                    id='state'
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder='Enter state'
                  />
                </div>

                {/* PIN */}
                <div className='space-y-2'>
                  <Label htmlFor='pin'>PIN Code</Label>
                  <Input
                    id='pin'
                    value={formData.address.pin}
                    onChange={(e) => handleInputChange('address.pin', e.target.value)}
                    placeholder='Enter PIN code'
                  />
                </div>

                {/* Landmark */}
                <div className='space-y-2'>
                  <Label htmlFor='landmark'>Landmark (Optional)</Label>
                  <Input
                    id='landmark'
                    value={formData.address.landmark}
                    onChange={(e) => handleInputChange('address.landmark', e.target.value)}
                    placeholder='Enter landmark'
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Save Button */}
            <div className='flex justify-end'>
              <Button
                onClick={handleSaveProfile}
                disabled={!hasChanges || isSaving}
                className='min-w-[120px]'
              >
                {isSaving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Read-only account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label>Account ID</Label>
                <Input
                  value={profile?.id || ''}
                  disabled
                  className='bg-muted font-mono text-sm'
                />
              </div>

              <div className='space-y-2'>
                <Label>Account Role</Label>
                <Input
                  value={profile?.role || ''}
                  disabled
                  className='bg-muted capitalize'
                />
              </div>

              {profile?.created_at && (
                <div className='space-y-2'>
                  <Label>Member Since</Label>
                  <Input
                    value={new Date(profile.created_at).toLocaleDateString(
                      'en-IN',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                    disabled
                    className='bg-muted'
                  />
                </div>
              )}

              {profile?.updated_at && (
                <div className='space-y-2'>
                  <Label>Last Updated</Label>
                  <Input
                    value={new Date(profile.updated_at).toLocaleDateString(
                      'en-IN',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                    disabled
                    className='bg-muted'
                  />
                </div>
              )}
            </div>

            {/* Addresses Display */}
            {profile?.address && profile.address.length > 0 && (
              <>
                <Separator className='my-4' />
                <div className='space-y-4'>
                  <Label className='text-base font-medium'>Saved Addresses</Label>
                  {profile.address.map((addr, index) => (
                    <div key={addr._id || index} className='p-4 border rounded-lg bg-gray-50'>
                      <div className='text-sm space-y-1'>
                        <p className='font-medium'>Address {index + 1}</p>
                        <p>{addr.address_1}</p>
                        {addr.address_2 && <p>{addr.address_2}</p>}
                        <p>{addr.city}, {addr.state} {addr.pin}</p>
                        {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
}
