import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signupWithEmail, loginWithGoogle } from '../store/authSlice';
import brandImage from 'figma:asset/877531fbc80ee4389c993063c1dd6ca4982ac9d4.png';

interface SignupPageProps {
  onNavigate?: (page: 'home' | 'collections' | 'login' | 'signup' | 'admin') => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateForm = (): boolean => {
    // Validate first name
    if (!formData.firstName.trim()) {
      setValidationError('Please enter your first name!');
      return false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      setValidationError('Please enter your last name!');
      return false;
    }

    // Validate email
    if (!formData.email.trim()) {
      setValidationError('Please enter your email address!');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setValidationError('Please enter a valid email address!');
      return false;
    }

    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      setValidationError('Please enter your phone number!');
      return false;
    }

    if (!validatePhone(formData.phoneNumber)) {
      setValidationError('Please enter a valid phone number!');
      return false;
    }

    // Validate password
    if (!formData.password) {
      setValidationError('Please enter a password!');
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long!');
      return false;
    }

    // Validate password match
    if (!formData.confirmPassword) {
      setValidationError('Please confirm your password!');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(signupWithEmail({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber
      })).unwrap();

      // Navigate to home after successful signup
      onNavigate?.('home');
    } catch (err: any) {
      // Handle Firebase errors as user-friendly messages
      const errorMessage = err?.message || 'An error occurred during signup';
      if (errorMessage.includes('email-already-in-use')) {
        setValidationError('This email is already registered!');
      } else if (errorMessage.includes('weak-password')) {
        setValidationError('Password is too weak!');
      } else if (errorMessage.includes('invalid-email')) {
        setValidationError('Please enter a valid email address!');
      } else {
        setValidationError('Signup failed. Please try again!');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await dispatch(loginWithGoogle()).unwrap();
      onNavigate?.('home');
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image */}
      <button
        onClick={() => onNavigate?.('home')}
        className="fixed ml-24 w-24 flex items-center justify-center top-16 left-4 text-gray-600 hover:text-black transition-colors z-10 text-lg shadow-md rounded-lg p-2"
      >
        <ArrowLeft className="w-12 h-12 text-white" />
      </button>
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <img
          src={brandImage}
          alt="CASAKA7LA"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <div className="text-white">
            <h2 className="text-4xl tracking-tighter mb-4">
              Join the Movement
            </h2>
            <p className="text-gray-300 tracking-wide max-w-md">
              Become part of the CASAKA7LA family. Get exclusive early access to new collections and limited edition drops.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl lg:text-6xl tracking-tighter mb-4">Create Account</h1>
            <p className="text-gray-600 tracking-wide">
              Join CASAKA7LA for exclusive access
            </p>
          </div>

          {/* Error Messages */}
          {(validationError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded">
              {validationError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                  placeholder="John"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                  placeholder="Doe"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                placeholder="Minimum 6 characters"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                placeholder="Re-enter password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4 mt-1" required />
              <span className="text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 uppercase tracking-wider">Or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-black/20 py-4 text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign up with Google
          </button>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => onNavigate?.('login')}
              className="underline hover:no-underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}