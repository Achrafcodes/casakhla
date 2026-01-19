import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Collections } from './components/Collections';
import { BrandStory } from './components/BrandStory';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CollectionsPage } from './components/CollectionsPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AdminPage } from './components/AdminPage';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { ShoppingBag } from './components/ShoppingBag';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuthState } from './store/authSlice';
import { fetchProducts } from './store/productsSlice';

import whiteHoodie from 'figma:asset/877531fbc80ee4389c993063c1dd6ca4982ac9d4.png';
import blackHoodie from 'figma:asset/67015349024f85d37529a44dace6b22274d9ebac.png';
import blackHoodieClose from 'figma:asset/260c21762636574db191d400b7bf3ac3faee81ce.png';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'collections' | 'login' | 'signup' | 'admin' | 'about' | 'contact'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const authLoading = useAppSelector((state) => state.auth.loading);
  
  // Initialize Firebase auth state and products on mount
  useEffect(() => {
    // Check authentication state
    dispatch(checkAuthState());
    
    // Fetch products from Firebase
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleNavigate = (page: any, category?: string) => {
    setCurrentPage(page);
    if (page === 'collections' && category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(undefined);
    }
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Display featured products or fallback to default images
  const featuredProducts = products.length > 0 ? products.slice(0, 4).map(p => ({
    ...p,
    image: p.images[0] // Use first image for featured display
  })) : [
    {
      id: '1',
      image: whiteHoodie,
      images: [whiteHoodie],
      title: 'Signature Oversized Hoodie',
      category: 'Essentials',
      price: '$185',
    },
    {
      id: '2',
      image: blackHoodie,
      images: [blackHoodie],
      title: 'Graphic Print Hoodie',
      category: 'Streetwear',
      price: '$195',
    },
    {
      id: '3',
      image: blackHoodieClose,
      images: [blackHoodieClose],
      title: 'Premium Pullover',
      category: 'Outerwear',
      price: '$205',
    },
    {
      id: '4',
      image: whiteHoodie,
      images: [whiteHoodie],
      title: 'Limited Edition Drop',
      category: 'Limited Edition',
      price: '$225',
    },
  ];

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl tracking-tighter mb-2">CASAKA7LA</div>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Admin page
  if (currentPage === 'admin') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <ShoppingBag />
        <main className="pt-16">
          <AdminPage />
        </main>
      </>
    );
  }

  // Login and Signup pages (no header/footer)
  if (currentPage === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onNavigate={handleNavigate} />;
  }

  // Collections page
  if (currentPage === 'collections') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <ShoppingBag />
        <main className="pt-16">
          <CollectionsPage initialCategory={selectedCategory} />
        </main>
        <Footer />
      </>
    );
  }

  // About page
  if (currentPage === 'about') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <ShoppingBag />
        <main className="pt-16">
          <About />
        </main>
        <Footer />
      </>
    );
  }

  // Contact page
  if (currentPage === 'contact') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <ShoppingBag />
        <main className="pt-16">
          <Contact />
        </main>
        <Footer />
      </>
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <ShoppingBag />
      <main className="pt-16">
        <Hero />
        <FeaturedProducts products={featuredProducts} />
        <Collections onNavigate={handleNavigate} />
        <BrandStory />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}