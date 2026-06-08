import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 💡 State to toggle the red input border styles
  const [hasError, setHasError] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false); // Reset error state on new submission attempt

    
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    toast.error('Please fill in all fields');
    return;
  }

  if (!emailRegex.test(email)) {
    setHasError(true);
    toast.error('Please enter a valid email address');
    return;
  }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      console.log("Error caught!", error);
      
      // 💡 Turn input card text borders red
      setHasError(true);
      
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
              <Wallet size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-100 mb-2">Welcome Back</h1>
            <p className="text-surface-500">Sign in to continue tracking expenses</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 🛡️ HONEY-POT BLOCK: Invisible fields to trick the browser's scanner */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input type="text" name="fake-username" tabIndex={-1} autoComplete="username" />
              <input type="password" name="fake-password" tabIndex={-1} autoComplete="current-password" />
            </div>
            <div>
              <label className="block text-sm text-surface-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="email"
                  name="login_email_address" // 💡 Dynamic name breaks cross-site cache chains
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // 💡 Applies red border styles dynamically when hasError is active
                  className={`glass-input w-full pl-11 transition-all ${
                    hasError ? '!border-red-500/50 focus:!ring-red-500/30' : ''
                  }`}
                  placeholder="you@example.com"
                  autoComplete="email" 
                />
              </div>
            </div>

                        <div>
              <label className="block text-sm text-surface-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  // 💡 Dynamically toggles between standard password mask and readable text string
                  type={showPassword ? 'text' : 'password'}
                  name="login_password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Added 'pr-11' padding so the typed text layout never overlaps the eye icon button
                  className={`glass-input w-full pl-11 pr-11 transition-all ${
                    hasError ? '!border-red-500/50 focus:!ring-red-500/30' : ''
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password" 
                />
                <button
                  type="button" // 💡 Keeps button action from triggering native form submission loops
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
