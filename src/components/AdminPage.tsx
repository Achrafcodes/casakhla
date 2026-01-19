import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Package, ShoppingCart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addProduct, updateProduct, deleteProduct } from '../store/productsSlice';
import { fetchOrders, updateOrderStatus } from '../store/ordersSlice';
import type { Product } from '../store/productsSlice';

export function AdminPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const orders = useAppSelector((state) => state.orders.items);
  const { isAdmin, user } = useAppSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    images: [''],
  });

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        category: product.category,
        price: product.price,
        description: product.description || '',
        images: product.images,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        category: '',
        price: '',
        description: '',
        images: [''],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const validImages = formData.images.filter(img => img.trim() !== '');
    
    if (validImages.length === 0) {
      alert('Please add at least one image URL');
      return;
    }
    
    if (editingProduct) {
      dispatch(updateProduct({ ...formData, images: validImages, id: editingProduct.id }));
    } else {
      dispatch(addProduct({ ...formData, images: validImages }));
    }
    
    handleCloseModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleOrderStatusChange = (orderId: string, status: any) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const categories = ['Essentials', 'Streetwear', 'Outerwear', 'Limited Edition'];

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl tracking-tighter mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500">Tip: Login with an email containing "admin" to get access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl tracking-tighter mb-4">Admin Dashboard</h1>
          <p className="text-gray-400 tracking-wide">
            Manage CASAKA7LA products and orders • Logged in as {user?.email}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'products' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 border border-black/10">
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Total Products</div>
                <div className="text-4xl tracking-tight">{products.length}</div>
              </div>
              <div className="bg-white p-6 border border-black/10">
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Categories</div>
                <div className="text-4xl tracking-tight">{categories.length}</div>
              </div>
              <div className="bg-white p-6 border border-black/10">
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Orders</div>
                <div className="text-4xl tracking-tight">{orders.length}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl tracking-tighter">Products</h2>
              <button
                onClick={() => handleOpenModal()}
                className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-black/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-black/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Product</th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Category</th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Price</th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Images</th>
                      <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="tracking-tight">{product.title}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500 mt-1">{product.description.substring(0, 50)}...</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{product.category}</td>
                        <td className="px-6 py-4 text-sm">{product.price}</td>
                        <td className="px-6 py-4 text-sm">{product.images.length} image(s)</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(product)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {products.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No products yet. Add your first product to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Orders */}
            <h2 className="text-2xl tracking-tighter mb-8">Orders</h2>
            
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-black/10 p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Customer Info</h3>
                      <p className="mb-1"><strong>{order.customerName}</strong></p>
                      <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Order Details</h3>
                      <p className="text-sm mb-1">Order ID: <span className="text-gray-600">{order.id.substring(0, 8)}</span></p>
                      <p className="text-sm mb-1">Total: <strong>{order.totalAmount}</strong></p>
                      <p className="text-sm mb-1">Items: {order.items.length}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.title} {item.selectedSize && `(${item.selectedSize})`} x{item.quantity}</span>
                          <span>{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/10">
                    <div>
                      <span className="text-sm uppercase tracking-wider text-gray-500 mr-2">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        className="px-3 py-1 border border-black/20 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="bg-white border border-black/10 p-16 text-center text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCloseModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl tracking-tighter">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button onClick={handleCloseModal} className="hover:bg-gray-100 p-2 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Price *</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="$195"
                      className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">Image URLs *</label>
                    <div className="space-y-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 px-4 py-3 border border-black/20 focus:border-black outline-none"
                            required={index === 0}
                          />
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="px-4 py-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addImageField}
                        className="w-full px-4 py-3 border border-black/20 hover:border-black transition-colors text-sm uppercase tracking-wider"
                      >
                        + Add Another Image
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 border border-black/20 py-4 text-sm uppercase tracking-wider hover:border-black transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
