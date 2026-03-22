import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../CartContext';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Loader2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to products</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl overflow-hidden border border-slate-200 aspect-square"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
              ))}
              <span className="ml-2 text-sm font-bold text-slate-900">{product.rating}</span>
            </div>
            <span className="text-slate-400 text-sm">|</span>
            <span className="text-sm text-slate-500 font-medium">{product.numReviews} verified reviews</span>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-slate-700">Quantity</span>
              <div className="flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-700">Status</span>
              <span className={`text-sm font-bold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>

            <button
              onClick={() => addToCart({ ...product, quantity })}
              disabled={product.countInStock === 0}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
              <Truck className="h-5 w-5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Free Delivery</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
              <RotateCcw className="h-5 w-5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Secure Payment</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
