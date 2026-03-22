import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: name,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2">Join AmazeCart today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                placeholder="John Doe"
              />
              <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                placeholder="name@example.com"
              />
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
