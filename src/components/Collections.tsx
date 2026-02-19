import whiteHoodie from 'figma:asset/877531fbc80ee4389c993063c1dd6ca4982ac9d4.png';
import blackHoodie from 'figma:asset/260c21762636574db191d400b7bf3ac3faee81ce.png';
import { LazyImage } from './LazyImage';

interface CollectionCardProps {
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

function CollectionCard({ image, title, description, onClick }: CollectionCardProps) {
  return (
    <div onClick={onClick} className="group cursor-pointer relative overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden">
        <LazyImage
          src={image}
          alt={title}
          className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
          skeletonClassName="w-full h-full grayscale"
          animationDuration={400}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
        <h3 className="text-white text-3xl md:text-4xl tracking-tighter mb-2">{title}</h3>
        <p className="text-white/80 text-sm mb-4">{description}</p>
        <button className="text-white text-xs tracking-wider uppercase self-start hover:opacity-60 transition-opacity">
          Discover →
        </button>
      </div>
    </div>
  );
}

interface CollectionsProps {
  onNavigate?: (page: 'collections', category?: string) => void;
}

export function Collections({ onNavigate }: CollectionsProps) {
  const collections = [
    {
      image: whiteHoodie,
      title: 'Essentials',
      description: 'Timeless wardrobe fundamentals',
      category: 'Essentials',
    },
    {
      image: blackHoodie,
      title: 'Streetwear',
      description: 'Bold statements and experimental forms',
      category: 'Streetwear',
    },
  ];

  const handleCollectionClick = (category: string) => {
    if (onNavigate) {
      // Pass category as a parameter
      (onNavigate as any)('collections', category);
    }
  };

  return (
    <section id="collections" className="py-24 bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <div className="text-white/60 uppercase tracking-[0.3em] mb-4 text-xs">
            Explore
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter">
            Our Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection, index) => (
            <CollectionCard
              key={index}
              {...collection}
              onClick={() => handleCollectionClick(collection.category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}