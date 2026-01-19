import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../store/productsSlice';

const PRODUCTS_COLLECTION = 'products';

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to fetch products');
  }
};

// Get single product
export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Product;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw new Error('Failed to fetch product');
  }
};

// Add new product
export const addProduct = async (
  productData: Omit<Product, 'id'>
): Promise<Product> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      ...productData
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// Update product
export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, 'id'>>
): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};
