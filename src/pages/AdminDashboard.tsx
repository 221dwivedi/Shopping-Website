import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Package, Users, ShoppingCart, Loader2, X, Save, DollarSign, Tag, Image as ImageIcon, Box, ShieldCheck } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

const AdminDashboard = () => {
  const { role } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    countInStock: 0,
    brand: ''
  });

  useEffect(() => {
    if (role !== 'admin') return;

    const qProducts = query(collection(db, 'products'), orderBy('name'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [role]);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  const handleToggleDelivery = async (orderId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        isDelivered: !currentStatus,
        deliveredAt: !currentStatus ? new Date().toISOString() : null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), formData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          rating: 0,
          numReviews: 0
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', price: 0, description: '', category: '', image: '', countInStock: 0, brand: '' });
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, editingProduct ? `products/${editingProduct.id}` : 'products');
    }
  };

  if (role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-bold">Access Denied. Admin only.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Orders
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({ name: '', price: 0, description: '', category: '', image: '', countInStock: 0, brand: '' });
                setIsModalOpen(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} className="h-10 w-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.countInStock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {product.countInStock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setFormData({
                                name: product.name,
                                price: product.price,
                                description: product.description,
                                category: product.category,
                                image: product.image,
                                countInStock: product.countInStock,
                                brand: product.brand
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</p>
                  <p className="text-sm font-bold text-slate-900">#{order.id.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => handleToggleDelivery(order.id, order.isDelivered)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.isDelivered ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}
                >
                  {order.isDelivered ? 'Mark as Processing' : 'Mark as Delivered'}
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Customer</h3>
                  <p className="text-sm font-bold text-slate-900">{order.user}</p>
                  <p className="text-xs text-slate-500 mt-1">Total: ${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Shipping</h3>
                  <p className="text-sm text-slate-600">{order.shippingAddress.street}</p>
                  <p className="text-sm text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Items</h3>
                  <div className="space-y-2">
                    {order.orderItems.map((item: any) => (
                      <p key={item.id} className="text-xs text-slate-600 line-clamp-1">
                        {item.name} x {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="e.g. Echo Dot"
                      />
                      <Box className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Price ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                      <DollarSign className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Stock Count</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={formData.countInStock}
                        onChange={(e) => setFormData({ ...formData, countInStock: parseInt(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                      <Package className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="Electronics"
                      />
                      <Tag className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Brand</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="Amazon"
                      />
                      <ShieldCheck className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Image URL</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                      <ImageIcon className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                      placeholder="Product details..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
