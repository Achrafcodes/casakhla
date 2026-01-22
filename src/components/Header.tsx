import { Menu, Search, ShoppingBag, User, Shield, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { openCart } from '../store/cartSlice';
import brand from '/logo.png'

interface HeaderProps {
  onNavigate?: (page: 'home' | 'collections' | 'login' | 'signup' | 'admin' | 'about' | 'contact') => void;
  currentPage?: 'home' | 'collections' | 'login' | 'signup' | 'admin' | 'about' | 'contact';
}

export function Header({ onNavigate, currentPage = 'home' }: HeaderProps) {
  const { isAuthenticated, user, isAdmin } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    onNavigate?.('home');
  };

  const handleNavigate = (page: 'home' | 'collections' | 'login' | 'signup' | 'admin' | 'about' | 'contact') => {
    onNavigate?.(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={brand} alt="CASAKA7LA" className="h-16 w-32 object-contain" />

          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm tracking-wider uppercase">
            <button
              onClick={() => handleNavigate('collections')}
              className={`hover:opacity-60 transition-opacity ${currentPage === 'collections' ? 'border-b-2 border-black' : ''}`}
            >
              Collections
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className={`hover:opacity-60 transition-opacity ${currentPage === 'about' ? 'border-b-2 border-black' : ''}`}
            >
              About
            </button>
            <button
              onClick={() => handleNavigate('contact')}
              className={`hover:opacity-60 transition-opacity ${currentPage === 'contact' ? 'border-b-2 border-black' : ''}`}
            >
              Contact
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <button className="hover:opacity-60 transition-opacity" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => dispatch(openCart())}
              className="hover:opacity-60 transition-opacity relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Hi, {user?.firstName || user?.email}</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleNavigate('admin')}
                    className={`hover:opacity-60 transition-opacity ${currentPage === 'admin' ? 'text-black' : 'text-gray-400'}`}
                    aria-label="Admin"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:opacity-60 transition-opacity"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate('login')}
                className="hover:opacity-60 transition-opacity"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden hover:opacity-60 transition-opacity"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 md:hidden">
          <div className="h-full overflow-y-auto">
            <nav className="flex flex-col p-6 space-y-6">
              <button
                onClick={() => handleNavigate('collections')}
                className="text-left text-2xl tracking-tighter hover:opacity-60 transition-opacity"
              >
                Collections
              </button>
              <button
                onClick={() => handleNavigate('about')}
                className="text-left text-2xl tracking-tighter hover:opacity-60 transition-opacity"
              >
                About
              </button>
              <button
                onClick={() => handleNavigate('contact')}
                className="text-left text-2xl tracking-tighter hover:opacity-60 transition-opacity"
              >
                Contact
              </button>

              <div className="border-t border-black/10 pt-6 space-y-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    dispatch(openCart());
                  }}
                  className="flex items-center gap-3 hover:opacity-60 transition-opacity"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shopping Bag ({cartItemCount})</span>
                </button>

                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5" />
                      <span>{user?.firstName || user?.email}</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleNavigate('admin')}
                        className="flex items-center gap-3 hover:opacity-60 transition-opacity"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 hover:opacity-60 transition-opacity"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigate('login')}
                    className="flex items-center gap-3 hover:opacity-60 transition-opacity"
                  >
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}