import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuthState());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleNavigate = (page: string, category?: string) => {
    if (page === 'collections' && category) {
      navigate(`/collections?category=${category}`);
    } else {
      navigate(`/${page !== 'home' ? page : ''}`);
    }
    window.scrollTo(0, 0);
  };

  const featuredProducts = products.length > 0 ? products.slice(0, 4).map(p => ({
    ...p,
    image: p.images[0]
  })) : [
    {
      id: '1',
      image: whiteHoodie,
      images: [whiteHoodie],
      title: 'Signature Oversized Hoodie',
      category: 'Essentials',
      price: 'DH185',
    },
    {
      id: '2',
      image: blackHoodie,
      images: [blackHoodie],
      title: 'Graphic Print Hoodie',
      category: 'Streetwear',
      price: 'DH195',
    },
    {
      id: '3',
      image: blackHoodieClose,
      images: [blackHoodieClose],
      title: 'Premium Pullover',
      category: 'Outerwear',
      price: 'DH205',
    },
    {
      id: '4',
      image: whiteHoodie,
      images: [whiteHoodie],
      title: 'Limited Edition Drop',
      category: 'Limited Edition',
      price: 'DH225',
    },
  ];

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

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onNavigate={handleNavigate} />} />
      <Route path="/signup" element={<SignupPage onNavigate={handleNavigate} />} />

      <Route
        path="/admin"
        element={
          <>
            <Header onNavigate={handleNavigate} currentPage="admin" />
            <ShoppingBag />
            <main className="pt-16">
              <AdminPage />
            </main>
          </>
        }
      />

      <Route
        path="/collections"
        element={
          <>
            <Header onNavigate={handleNavigate} currentPage="collections" />
            <ShoppingBag />
            <main className="pt-16">
              <CollectionsPage />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/about"
        element={
          <>
            <Header onNavigate={handleNavigate} currentPage="about" />
            <ShoppingBag />
            <main className="pt-16">
              <About />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/contact"
        element={
          <>
            <Header onNavigate={handleNavigate} currentPage="contact" />
            <ShoppingBag />
            <main className="pt-16">
              <Contact />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/"
        element={
          <div className="min-h-screen bg-white">
            <Header onNavigate={handleNavigate} currentPage="home" />
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
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}