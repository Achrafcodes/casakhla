import { ArrowRight } from 'lucide-react';
import heroImage from 'figma:asset/67015349024f85d37529a44dace6b22274d9ebac.png';

interface HeroProps {
  image?: string;
}

export function Hero({ image = heroImage }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt="Fashion hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
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
              onClick={() => window.location.href = '/collections'}
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white text-white px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300">
              View Lookbook
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="w-[1px] h-16 bg-white/40 animate-pulse" />
      </div>
    </section>
  );
}