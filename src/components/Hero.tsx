import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LazyImage } from './LazyImage';

const HERO_IMAGE = 'https://pixabay.com/get/g228af343d23f3dd410e5a1320a3c96c6953566ec0301b0ac0ea98f4eaae60617ac8973fdf74bbcadf944d10017b2856c63c249955a36f2102d4894112bed50e2b9aea8b6f3d821d8353ade0e6e90762d_1920.jpg';

interface HeroProps {
  image?: string;
}

export function Hero({ image = HERO_IMAGE }: HeroProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes revealFromBottom {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-content {
          animation: revealFromBottom 0.8s ease-out forwards;
        }
        .hero-image {
          animation: revealFromBottom 1s ease-out forwards;
        }
      `}</style>
      {/* Background dfd Image */}
      <div className="absolute inset-0 z-0 hero-image overflow-hidden">
        <LazyImage
          src={image}
          alt="Fashion hero"
          className="w-full h-full object-cover object-center block"
          skeletonClassName="w-full h-full"
          animationDuration={500}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 w-full hero-content">
        <div className="max-w-3xl">
          {/* <div className="text-white/80 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 text-xs sm:text-sm">
            Spring / Summer 2026
          </div> */}
          <h1 className="text-white mb-6 sm:mb-8 leading-[0.95]">
            <span className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter">
              Identify
            </span>
            <span className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter mt-2">
              Yourself
            </span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-xl font-light leading-relaxed">
            to find all your Casablanca's experiences in one spot, you must first gather the courage to know who you are

          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
              onClick={() => {
                navigate('/collections');
                window.scrollTo(0, 0);
              }}
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {/* <button className="border border-white text-white px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300">
              View Lookbook
            </button> */}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block ">
        <div className="w-[1px] h-16 bg-white/40 animate-pulse" />
      </div>
    </section>
  );
}