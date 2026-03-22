import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    numReviews: number;
    brand: string;
    countInStock: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-200 group flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{product.brand}</span>
        </div>
        <Link to={`/product/${product.id}`} className="text-slate-900 font-semibold text-sm hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
          {product.name}
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart({ ...product, quantity: 1 })}
            disabled={product.countInStock === 0}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-600"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
