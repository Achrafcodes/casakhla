import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addToCart, openCart } from '../store/cartSlice';
import { ShoppingBag, X } from 'lucide-react';
import { ProductCarousel } from './ui/ProductCarousel';
import SimpleSlider from './ui/slid';
import { LazyImage } from './LazyImage';

interface CollectionsPageProps {
  initialCategory?: string;
}

export function CollectionsPage({ initialCategory }: CollectionsPageProps) {
  const products = useAppSelector((state) => state.products.items);
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    adaptiveHeight: true
  };
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products by category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, size: selectedSize }));
    dispatch(openCart());
  };

  return (
    <div className="min-h-screen relative bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-black text-white">
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6">
            Collections
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto tracking-wide">
            {selectedCategory === 'All' ? 'Explore all products' : selectedCategory}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-black/10 sticky top-16 bg-white z-30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white border border-black/20 hover:border-black'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No products found in this category</p>
              <p className="text-sm text-gray-400">Check back soon for new arrivals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group">
                  {/* Product Image */}
                  <div
                    className="relative overflow-hidden mb-4 bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <div className="aspect-[3/4]">
                      <LazyImage
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        skeletonClassName="w-full h-full"
                        animationDuration={350}
                      />
                    </div>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-white text-black px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="tracking-tight pr-2">{product.title}</h3>
                      <span className="text-sm whitespace-nowrap">{product.price}</span>
                    </div>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative rounded-lg shadow-2xl">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {(() => {
                const product = products.find(p => p.id === selectedProduct);
                if (!product) return null;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
                    {/* Product Carousel */}
                    <div className="w-full  mt-4 max-w-md mx-auto">
                      <SimpleSlider images={product.images} />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col py-4">
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                        {product.category}
                      </p>
                      <h2 className="text-3xl tracking-tighter mb-2">{product.title}</h2>
                      <p className="text-2xl mb-6">{product.price}</p>

                      {product.description && (
                        <p className="text-gray-700 mb-8 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      {/* Size Selection */}
                      <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-wider mb-3">Select Size</h3>
                        <div className="grid grid-cols-5 gap-2">
                          {['M', 'L', 'XL', '2XL'].map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`py-3 text-sm border transition-colors ${selectedSize === size
                                ? 'bg-black text-white border-black'
                                : 'border-black/20 hover:border-black'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add to Bag Button */}
                      <button
                        onClick={() => {
                          handleAddToCart(product);
                          setSelectedProduct(null);
                        }}
                        className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors mb-4"
                      >
                        Add to Bag
                      </button>

                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="w-full border border-black/20 py-4 text-sm uppercase tracking-wider hover:border-black transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}