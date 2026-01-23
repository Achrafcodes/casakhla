import { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginWithEmail, loginWithGoogle } from '../store/authSlice';
import brandImage from '/casa.png';

interface LoginPageProps {
  onNavigate?: (page: 'home' | 'collections' | 'login' | 'signup' | 'admin') => void;
}

const getErrorMessage = (error: string): string => {
  if (!error) return '';

  // Firebase error messages mapping
  if (error.includes('auth/invalid-credential')) {
    return 'Incorrect email or password. Please check and try again.';
  }
  if (error.includes('auth/invalid-email')) {
    return 'Invalid email address. Please enter a valid email.';
  }
  if (error.includes('auth/user-not-found')) {
    return 'No account found with this email. Please sign up first.';
  }
  if (error.includes('auth/wrong-password')) {
    return 'Incorrect password. Please try again.';
  }
  if (error.includes('auth/too-many-requests')) {
    return 'Too many failed login attempts. Please try again later.';
  }
  if (error.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support.';
  }
  if (error.includes('Missing or insufficient permissions')) {
    return 'Permission denied. Please check your credentials.';
  }
  if (error.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Generic fallback - strip Firebase prefix if present
  const message = error.replace('Firebase: Error (', '').replace(')', '');
  return message || 'An error occurred during login. Please try again.';
};

export function LoginPage({ onNavigate }: LoginPageProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginWithEmail({ email, password })).unwrap();
      // Navigate to home after successful login
      onNavigate?.('home');
    } catch (err) {
      // Error will be handled by Redux state
      console.error('Login failed:', err);
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
    <div className="min-h-screen relative bg-white flex">
      {/* Back to Home Button */}
      <button
        onClick={() => onNavigate?.('home')}
        className="fixed ml-24  w-24 flex items-center justify-center top-16 left-4 flex items-center text-gray-600 hover:text-black transition-colors z-10 text-lg shadow-md rounded-lg p-2"
      >
        <ArrowLeft className="w-12 h-12 text-black" />
      </button>
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl lg:text-6xl tracking-tighter mb-4">Welcome Back</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Login Failed</p>
                <p>{getErrorMessage(error)}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                placeholder="your@email.com"
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition-colors"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="underline hover:no-underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
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
          {/* Back to Home Button */}




          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              onClick={() => onNavigate?.('signup')}
              className="underline hover:no-underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <img
          src={brandImage}
          alt="CASAKA7LA"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <div className="text-white">
            <h2 className="text-4xl tracking-tighter mb-4">
              Luxury Redefined
            </h2>
            <p className="text-gray-300 tracking-wide max-w-md">
              Join the CASAKA7LA community for exclusive access to limited drops and members-only benefits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}