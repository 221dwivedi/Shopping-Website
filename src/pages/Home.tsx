import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import { seedDatabase } from '../seed';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDatabase();
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-slate-900 aspect-[21/9] md:aspect-[3/1]">
        <img
          src="https://picsum.photos/seed/tech/1200/400"
          alt="Hero"
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-4 block">New Season Arrival</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              The Future of <br /> <span className="text-emerald-400">Technology</span> is Here.
            </h1>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 group">
              Shop Now
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Categories (Mini) */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-12 no-scrollbar">
        {['Electronics', 'Accessories', 'Home', 'Fashion', 'Books', 'Beauty'].map((cat) => (
          <button
            key={cat}
            className="px-6 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium whitespace-nowrap hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Products</h2>
        <Link to="/products" className="text-emerald-600 text-sm font-bold hover:underline">View All</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import { Link } from 'react-router-dom';
export default Home;
