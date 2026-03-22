import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'orders'),
      where('user', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 max-w-lg mx-auto"
        >
          <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">No orders yet</h2>
          <p className="text-slate-500 mb-8">You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-all"
          >
            Go to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Order Placed</p>
                  <p className="text-sm font-bold text-slate-700">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total</p>
                  <p className="text-sm font-bold text-slate-700">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Order ID</p>
                  <p className="text-sm font-bold text-slate-700">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200">
                {order.isDelivered ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {order.isDelivered ? 'Delivered' : 'Processing'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {order.orderItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.id}`} className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity} • ${item.price.toFixed(2)} each</p>
                    </div>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      Buy it again
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
