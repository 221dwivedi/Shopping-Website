import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Loader2 } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 max-w-lg mx-auto"
        >
          <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-all"
          >
            Start Shopping
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-2xl p-4 border border-slate-200 flex gap-4 items-center"
              >
                <div className="h-24 w-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`} className="text-slate-900 font-bold hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
                    {item.name}
                  </Link>
                  <p className="text-emerald-600 font-bold text-sm mb-2">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg border border-slate-200 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Items ({totalItems})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Free</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Tax (Estimated)</span>
                <span>$0.00</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-900 font-bold">Total</span>
                <span className="text-2xl font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-widest font-bold">
              Secure Checkout Powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
