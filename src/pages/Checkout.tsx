import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip: '',
    country: 'USA'
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        user: user.uid,
        orderItems: cart,
        shippingAddress: address,
        paymentMethod: 'Stripe',
        totalPrice: totalPrice,
        isPaid: true,
        paidAt: new Date().toISOString(),
        isDelivered: false,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-emerald-100"
        >
          <div className="bg-emerald-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Order Placed!</h2>
          <p className="text-slate-500 mb-8">Thank you for your purchase. Redirecting to your orders...</p>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="h-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to cart</span>
      </button>

      <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Section */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shipping Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ZIP / Postal Code</label>
                <input
                  type="text"
                  required
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm opacity-50 pointer-events-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payment Method</h2>
            </div>
            <p className="text-sm text-slate-500 italic">Demo Mode: Payment is pre-configured for this prototype.</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-500 line-clamp-1 flex-1 pr-4">{item.name} x {item.quantity}</span>
                  <span className="text-slate-900 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-900 font-bold">Total</span>
                <span className="text-2xl font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
