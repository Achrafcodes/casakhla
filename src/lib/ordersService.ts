import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../store/ordersSlice';

const ORDERS_COLLECTION = 'orders';

// Get all orders (admin only)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Create new order
export const createOrder = async (
  orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Order> => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      ...orderData,
      createdAt: Timestamp.now(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  status: Order['status']
): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};
