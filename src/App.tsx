import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, ShieldCheck } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider, useCart } from './CartContext';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

const Navbar = () => {
  const { user, role } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-emerald-400">AmazeCart</Link>
            <div className="hidden md:block flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}
            <Link to="/orders" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              <Package className="h-5 w-5" />
              <span className="text-sm font-medium">Orders</span>
            </Link>
            <Link to="/cart" className="relative flex items-center gap-2 hover:text-emerald-400 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="text-sm font-medium">Cart</span>
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium truncate max-w-[100px]">{user.displayName || user.email}</span>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800 border-t border-slate-700 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-slate-900 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <Link to="/orders" className="block text-sm font-medium py-2">Orders</Link>
              <Link to="/cart" className="block text-sm font-medium py-2">Cart ({totalItems})</Link>
              {role === 'admin' && <Link to="/admin" className="block text-sm font-medium py-2 text-emerald-400">Admin Dashboard</Link>}
              {user ? (
                <button onClick={handleLogout} className="w-full text-left text-sm font-medium py-2 text-red-400">Logout</button>
              ) : (
                <Link to="/login" className="block text-sm font-medium py-2 text-emerald-400">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">About AmazeCart</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Make Money with Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Sell on AmazeCart</a></li>
            <li><a href="#" className="hover:underline">Affiliate Program</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Payment Products</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Business Card</a></li>
            <li><a href="#" className="hover:underline">Shop with Points</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Let Us Help You</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Your Account</a></li>
            <li><a href="#" className="hover:underline">Your Orders</a></li>
            <li><a href="#" className="hover:underline">Help Center</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        <p>&copy; 2026 AmazeCart. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
