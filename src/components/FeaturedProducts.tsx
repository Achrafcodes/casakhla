import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, openCart } from '../store/cartSlice';
import { ShoppingBag, X } from 'lucide-react';
import SimpleSlider from './ui/slid';
import { LazyImage } from './LazyImage';

interface Product {
  id: string;
  image: string;
  images: string[];
  title: string;
  category: string;
  price: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div
        className="relative overflow-hidden mb-4 bg-gray-100"
        onClick={onClick}
      >
        <div className="aspect-[3/4]">
          <LazyImage
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            skeletonClassName="w-full h-full"
            animationDuration={350}
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
        <div className="text-xs uppercase tracking-wider text-gray-500">{product.category}</div>
        <h3 className="text-base tracking-wide">{product.title}</h3>
        <div className="text-sm">{product.price}</div>
      </div>
    </div>
  );
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const storeProducts = useAppSelector((state) => state.products.items);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, size: selectedSize }));
    dispatch(openCart());
  };

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
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product.id)}
            />
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <button
            onClick={() => navigate('/collections')}
            className="border border-black text-black px-8 sm:px-12 py-3 sm:py-4 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-300 w-full sm:w-auto">
            View All Products
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
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
                    <div className="w-full mt-4 max-w-md mx-auto">
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
                        <div className="flex flex-row gap-2">
                          {['M', 'L', 'XL', '2XL'].map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`py-6 px-6 text-base font-semibold border transition-colors ${selectedSize === size
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
                        className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors mb-4 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
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
    </section>
  );
}