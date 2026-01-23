import {
  X,
  Plus,
  Minus,
  ShoppingBag as ShoppingBagIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  closeCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/cartSlice';
import { auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function ShoppingBag() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  /* -------------------- HELPERS -------------------- */
  const calculateTotal = () =>
    items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price * item.quantity;
    }, 0);

  const handleQuantityChange = (
    id: string,
    size: string | undefined,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart({ id, size }));
    } else {
      dispatch(updateQuantity({ id, size, quantity: newQuantity }));
    }
  };

  /* -------------------- CHECKOUT -------------------- */
  const handleCheckout = async () => {
    const user = auth.currentUser;

    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (items.length === 0) return;

    setIsProcessing(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      const orderData = {
        userId: user.uid,
        customerEmail: user.email || '',
        customerName:
          user.displayName ||
          `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
          'N/A',
        customerPhone: userData.phoneNumber || 'N/A',
        items: items.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.images[0],
          category: item.category,
        })),
        totalAmount: `$${calculateTotal().toFixed(2)}`,
        status: 'pending',
        paymentMethod: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      setOrderId(docRef.id.substring(0, 8).toUpperCase());
      setShowSuccessModal(true);
      dispatch(clearCart());
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  /* -------------------- AUTO CLOSE SUCCESS MODAL -------------------- */
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        dispatch(closeCart());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, dispatch]);

  if (!isOpen) return null;

  return (
    <div className='h-screen relative'>
      {/* Cart Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(closeCart())}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5" />
            <h2 className="text-xl">Shopping Bag</h2>
            <span className="text-sm text-gray-500">({items.length})</span>
          </div>
          <button onClick={() => dispatch(closeCart())}>
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Your bag is empty</p>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4 border-b pb-6"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-24 h-24 object-cover bg-gray-100"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3>{item.title}</h3>
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              id: item.id,
                              size: item.selectedSize,
                            })
                          )
                        }
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedSize && (
                      <p className="text-sm">Size: {item.selectedSize}</p>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedSize,
                              item.quantity - 1
                            )
                          }
                          className="px-3"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                          className="px-3"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span>{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-black text-white py-4 disabled:bg-gray-400"
            >
              {isProcessing ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-auto max-w-sm">
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>

              <h2 className="text-base sm:text-lg md:text-xl font-semibold">Login Required</h2>

              <p className="text-xs sm:text-sm text-gray-600">
                Please log in to your account to place an order. It only takes a moment!
              </p>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => {
                    navigate('/login');
                    setShowLoginModal(false);
                    dispatch(closeCart());
                  }}
                  className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors rounded"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full border border-black/20 py-3 text-sm uppercase tracking-wider hover:border-black transition-colors rounded"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-auto max-w-sm animate-scaleIn">
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>

              <h2 className="text-base sm:text-lg md:text-xl font-bonld font-semibold">Order confirmed we will contact you as soon as possible</h2>

              <p className="text-xs sm:text-sm text-gray-600">
                Order ID:
                <span className="ml-1 font-mono">{orderId}</span>
              </p>
            </div>
          </div>
        </div>
      )}


    </div >
  );
}
