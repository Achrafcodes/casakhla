import brandImage from 'figma:asset/877531fbc80ee4389c993063c1dd6ca4982ac9d4.png';
import { LazyImage } from './LazyImage';

export function BrandStory() {
  return (
    <section id="story" className="py-32 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="text-gray-500 uppercase tracking-[0.3em] text-xs">
              Our Philosophy
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.1]">
              Crafting Tomorrow's
              <br />
              <span className="italic font-light">Classics</span>
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                Founded on the principles of minimalism and innovation, we believe in creating
                garments that transcend seasonal trends. Each piece is a testament to meticulous
                craftsmanship and timeless design.
              </p>
              <p>
                Our approach combines contemporary aesthetics with traditional techniques,
                resulting in clothing that speaks to the discerning individual who values
                both form and function.
              </p>
            </div>
            <button className="border border-black text-black px-10 py-4 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-300">
              Our Story
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <LazyImage
                src={brandImage}
                alt="Brand story"
                className="w-full h-full object-cover"
                skeletonClassName="w-full h-full"
                animationDuration={400}
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-black/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}