interface ProductCardProps {
  image: string;
  title: string;
  category: string;
  price: string;
}

export function ProductCard({ image, title, category, price }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden mb-4 bg-gray-100">
        <div className="aspect-[3/4]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Quick view button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button className="bg-white text-black px-6 py-3 text-xs tracking-wider uppercase hover:bg-black hover:text-white transition-colors">
            Quick View
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-wider text-gray-500">{category}</div>
        <h3 className="text-base tracking-wide">{title}</h3>
        <div className="text-sm">{price}</div>
      </div>
    </div>
  );
}

interface FeaturedProductsProps {
  products: Array<{
    image: string;
    title: string;
    category: string;
    price: string;
  }>;
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto px-4 text-sm sm:text-base">
            Meticulously crafted pieces that define modern luxury
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <button className="border border-black text-black px-8 sm:px-12 py-3 sm:py-4 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-300 w-full sm:w-auto">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}