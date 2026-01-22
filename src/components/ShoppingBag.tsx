import { X, Plus, Minus, ShoppingBag as BagIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeCart, removeFromCart, updateQuantity } from '../store/cartSlice';
export function ShoppingBag() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price * item.quantity;
    }, 0);
  };
  // hel
  const handleQuantityChange = (id: string, size: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart({ id, size }));
    } else {
      dispatch(updateQuantity({ id, size, quantity: newQuantity }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(closeCart())}
      />

      {/* Shopping Bag Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-2">
            <BagIcon className="w-5 h-5" />
            <h2 className="text-xl tracking-tighter">Shopping Bag</h2>
            <span className="text-sm text-gray-500">({items.length})</span>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <BagIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">Your bag is empty</p>
              <p className="text-sm text-gray-400">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4 border-b border-black/5 pb-6"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between mb-1">
                      <h3 className="tracking-tight">{item.title}</h3>
                      <button
                        onClick={() => dispatch(removeFromCart({ id: item.id, size: item.selectedSize }))}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>

                    {item.selectedSize && (
                      <p className="text-sm text-gray-600 mb-2">Size: {item.selectedSize}</p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 border border-black/20">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-sm">{item.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-black/10 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between text-lg">
              <span className="tracking-tight">Subtotal</span>
              <span className="tracking-tight">${calculateTotal().toFixed(2)}</span>
            </div>

            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <button className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors">
              Proceed to Checkout
            </button>

            <button
              onClick={() => dispatch(closeCart())}
              className="w-full border border-black/20 py-4 text-sm uppercase tracking-wider hover:border-black transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
