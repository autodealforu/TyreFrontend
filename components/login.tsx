'use client';

import type React from 'react';

import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { registerUser } from '@/actions/auth.action';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Forgot password form state
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
  });

  // OTP form state
  const [otpForm, setOtpForm] = useState({
    phone: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email: loginForm.email });

      const result = await signIn('credentials', {
        username: loginForm.email, // Using email as username as per your API
        password: loginForm.password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('Login failed with error:', result.error);
        // Handle specific error messages
        if (result.error === 'CredentialsSignin') {
          toast.error(
            'Invalid credentials. Please check your email and password.'
          );
        } else {
          toast.error(result.error);
        }
        setIsLoading(false);
      } else if (result?.ok) {
        console.log('Login successful, waiting for session...');
        toast.success('Login successful!');

        // Wait a moment for the session to be established
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verify session is set
        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();
        console.log('Session after login:', session);

        if (session && session.user) {
          console.log('Session established, redirecting...');
          // Redirect based on the redirect parameter
          if (redirect === 'checkout') {
            router.push('/checkout');
          } else if (redirect && redirect !== '/') {
            router.push(redirect);
          } else {
            router.push('/');
          }
          // Force page refresh to update session state
          setTimeout(() => {
            router.refresh();
            setIsLoading(false);
          }, 100);
        } else {
          console.error('Session not established after login');
          toast.error(
            'Login succeeded but session not created. Please try again.'
          );
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser({
        name: `${registerForm.firstName} ${registerForm.lastName}`,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
      });

      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      // Registration successful, now auto-login
      console.log('Registration successful, attempting auto-login...');
      toast.success('Registration successful! Logging you in...');

      // Small delay to ensure backend has processed the registration
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Automatically sign in the user after registration
      const signInResult = await signIn('credentials', {
        username: registerForm.email,
        password: registerForm.password,
        redirect: false,
      });

      console.log('Sign in result:', signInResult);

      if (signInResult?.error) {
        console.error('Auto-login failed:', signInResult.error);
        toast.error(
          'Registration successful but login failed. Please login manually.'
        );
        setIsLoading(false);
        // Switch to login tab
        const loginTab = document.querySelector(
          '[data-tab="login"]'
        ) as HTMLElement;
        loginTab?.click();
      } else if (signInResult?.ok) {
        toast.success('Welcome! You are now logged in.');

        // Wait a bit for session to be established
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Redirect based on the redirect parameter
        if (redirect === 'checkout') {
          console.log('Redirecting to checkout...');
          router.push('/checkout');
        } else if (redirect && redirect !== '/') {
          console.log('Redirecting to:', redirect);
          router.push(redirect);
        } else {
          console.log('Redirecting to home...');
          router.push('/');
        }

        // Force page refresh to update session state
        setTimeout(() => {
          router.refresh();
          setIsLoading(false);
        }, 100);
      } else {
        console.error('Unexpected sign in result:', signInResult);
        toast.error('Something went wrong. Please try logging in manually.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Password reset link sent to your email!');
    }, 1500);
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpForm.phone || otpForm.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9042';
      const response = await fetch(`${apiUrl}/api/users/websites/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpForm.phone }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      
      setOtpToken(data.token);
      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpForm.otp || otpForm.otp.length < 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('otp-login', {
        phone: otpForm.phone,
        otp: otpForm.otp,
        token: otpToken,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success('Login successful!');
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        if (redirect === 'checkout') {
          router.push('/checkout');
        } else if (redirect && redirect !== '/') {
          router.push(redirect);
        } else {
          router.push('/');
        }
        setTimeout(() => {
          router.refresh();
          setIsLoading(false);
        }, 100);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  return (
    <Suspense>
      <div className='min-h-screen bg-background'>
        {/* Header */}

        {/* Breadcrumb */}
        <div className='container mx-auto px-4 py-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Login</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='container mx-auto px-4 pb-12'>
          <div className='max-w-md mx-auto'>
            {/* Back to Cart */}
            {redirect === 'checkout' && (
              <Button variant='outline' className='mb-6' asChild>
                <Link href='/cart' className='flex items-center gap-2'>
                  <ArrowLeft className='h-4 w-4' />
                  Back to Cart
                </Link>
              </Button>
            )}

            <Card className='shadow-lg'>
              <CardHeader className='text-center'>
                <div className='h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Lock className='h-8 w-8 text-primary-foreground' />
                </div>
                <CardTitle className='text-2xl'>
                  Welcome to Autodeal4U
                </CardTitle>
                <p className='text-muted-foreground'>
                  {redirect === 'checkout'
                    ? 'Please login to continue with your order'
                    : 'Login to your account'}
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='login' className='w-full'>
                  <TabsList className='grid w-full grid-cols-4 text-xs md:text-sm h-auto p-1'>
                    <TabsTrigger value='login' className='px-1 py-2 text-xs'>Login</TabsTrigger>
                    <TabsTrigger value='otp' className='px-1 py-2 text-xs'>OTP Login</TabsTrigger>
                    <TabsTrigger value='register' className='px-1 py-2 text-xs'>Register</TabsTrigger>
                    <TabsTrigger value='forgot' className='px-1 py-2 text-xs'>Forgot</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value='login' className='space-y-4'>
                    <form onSubmit={handleLogin} className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='login-email'>Email</Label>
                        <Input
                          id='login-email'
                          // type='email'
                          placeholder='Enter your email'
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='login-password'>Password</Label>
                        <div className='relative'>
                          <Input
                            id='login-password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter your password'
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={isLoading}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                    <div className='text-center'>
                      <p className='text-sm text-muted-foreground'>
                        Don't have an account?{' '}
                        <Button
                          variant='link'
                          className='p-0 h-auto'
                          onClick={() => { }}
                        >
                          Register here
                        </Button>
                      </p>
                    </div>
                  </TabsContent>

                  {/* OTP Login Tab */}
                  <TabsContent value='otp' className='space-y-4'>
                    <div id='recaptcha-container'></div>
                    {!otpSent ? (
                      <form onSubmit={handleRequestOTP} className='space-y-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='otp-phone'>Phone Number</Label>
                          <Input
                            id='otp-phone'
                            type='tel'
                            placeholder='Enter your 10-digit phone number'
                            value={otpForm.phone}
                            onChange={(e) =>
                              setOtpForm({
                                ...otpForm,
                                phone: e.target.value.replace(/\D/g, ''),
                              })
                            }
                            required
                          />
                        </div>
                        <Button
                          type='submit'
                          className='w-full'
                          disabled={isLoading || otpForm.phone.length < 10}
                        >
                          {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOTP} className='space-y-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='otp-code'>Enter 4-digit OTP</Label>
                          <Input
                            id='otp-code'
                            type='text'
                            placeholder='Enter the 4-digit OTP sent to your phone'
                            value={otpForm.otp}
                            onChange={(e) =>
                              setOtpForm({
                                ...otpForm,
                                otp: e.target.value.replace(/\D/g, ''),
                              })
                            }
                            required
                            maxLength={4}
                          />
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Sent to +91 {otpForm.phone}
                          </span>
                          <Button
                            type='button'
                            variant='link'
                            className='p-0 h-auto text-xs'
                            onClick={() => {
                              setOtpSent(false);
                              setOtpForm({ ...otpForm, otp: '' });
                            }}
                          >
                            Change Number
                          </Button>
                        </div>
                        <Button
                          type='submit'
                          className='w-full'
                          disabled={isLoading || otpForm.otp.length < 4}
                        >
                          {isLoading ? 'Verifying...' : 'Verify & Login'}
                        </Button>
                      </form>
                    )}
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value='register' className='space-y-4'>
                    <form onSubmit={handleRegister} className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='first-name'>First Name</Label>
                          <Input
                            id='first-name'
                            placeholder='First name'
                            value={registerForm.firstName}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                firstName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='last-name'>Last Name</Label>
                          <Input
                            id='last-name'
                            placeholder='Last name'
                            value={registerForm.lastName}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                lastName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='register-email'>Email</Label>
                        <Input
                          id='register-email'
                          type='email'
                          placeholder='Enter your email'
                          value={registerForm.email}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='phone'>Phone Number</Label>
                        <Input
                          id='phone'
                          type='tel'
                          placeholder='Enter your phone number'
                          value={registerForm.phone}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='register-password'>Password</Label>
                        <div className='relative'>
                          <Input
                            id='register-password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Create a password'
                            value={registerForm.password}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='confirm-password'>
                          Confirm Password
                        </Label>
                        <div className='relative'>
                          <Input
                            id='confirm-password'
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm your password'
                            value={registerForm.confirmPassword}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                    <div className='text-center'>
                      <p className='text-sm text-muted-foreground'>
                        Already have an account?{' '}
                        <Button
                          variant='link'
                          className='p-0 h-auto'
                          onClick={() => { }}
                        >
                          Login here
                        </Button>
                      </p>
                    </div>
                  </TabsContent>

                  {/* Forgot Password Tab */}
                  <TabsContent value='forgot' className='space-y-4'>
                    <form onSubmit={handleForgotPassword} className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='forgot-email'>Email</Label>
                        <Input
                          id='forgot-email'
                          type='email'
                          placeholder='Enter your email'
                          value={forgotPasswordForm.email}
                          onChange={(e) =>
                            setForgotPasswordForm({
                              ...forgotPasswordForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </form>
                    <div className='text-center'>
                      <p className='text-sm text-muted-foreground'>
                        Remember your password?{' '}
                        <Button
                          variant='link'
                          className='p-0 h-auto'
                          onClick={() => { }}
                        >
                          Login here
                        </Button>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Social Login */}
                <div className='mt-6'>
                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                      <span className='bg-background px-2 text-muted-foreground'>
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 mt-4'>
                    <Button variant='outline'>
                      <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                        <path
                          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                          fill='#4285F4'
                        />
                        <path
                          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                          fill='#34A853'
                        />
                        <path
                          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                          fill='#FBBC05'
                        />
                        <path
                          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                          fill='#EA4335'
                        />
                      </svg>
                      Google
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
