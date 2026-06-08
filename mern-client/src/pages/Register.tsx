import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 💡 State to toggle the red input border styles
  const [hasError, setHasError] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Add these states at the top alongside your name/email states
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false); // Reset error state on new registration attempt

    // 1. Symmetrical regex matching your secure login configurations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Strong password configuration (Min 8 chars, 1 uppercase, 1 lowercase, 1 number/symbol)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*()_+}{"':;?/>.<,]).{8,}$/;

    // 2. Validate empty fields
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    // 3. Validate Email Format
    if (!emailRegex.test(email)) {
      setHasError(true);
      toast.error('Please enter a valid email address');
      return;
    }

    // 4. Validate Strong Password Complexity
    if (!strongPasswordRegex.test(password)) {
      setHasError(true);
      toast.error(
        'Password must be at least 8 characters long and contain uppercase, lowercase, and a number or symbol.',
        { duration: 5000 }
      );
      return;
    }

    // 5. Check if Password and Confirmation inputs match exactly
    if (password !== confirmPassword) {
      setHasError(true);
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (error: any) {
      console.log("Error caught!", error);
      
      // 💡 Turn input borders red if email already exists or database throws error
      setHasError(true);
      
      toast.error(error.response?.data?.message || 'Registration failed');
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
            <h1 className="text-2xl font-bold text-surface-100 mb-2">Create Account</h1>
            <p className="text-surface-500">Start tracking expenses with AI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 🛡️ HONEY-POT BLOCK: Invisible fields to trap browser auto-fill caches */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input type="text" name="fake-username-reg" tabIndex={-1} autoComplete="username" />
              <input type="password" name="fake-password-reg" tabIndex={-1} autoComplete="new-password" />
            </div>

            <div>
              <label className="block text-sm text-surface-400 mb-2">Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full pl-11"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-surface-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="email"
                  // 💡 Isolated unique name string breaks cross-site historical fill mapping
                  name="register_user_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  // 💡 Swaps text mask mode dynamically
                  type={showPassword ? 'text' : 'password'}
                  name="register_user_password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Added 'pr-11' padding so the text doesn't run under the eye button icon
                  className={`glass-input w-full pl-11 pr-11 transition-all ${
                    hasError ? '!border-red-500/50 focus:!ring-red-500/30' : ''
                  }`}
                  placeholder="Min 8 characters, uppercase, lowercase & symbol"
                  autoComplete="new-password" 
                />
                <button
                  type="button" // 💡 Prevents accidental form submissions
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-surface-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  // 💡 Swaps text mask mode dynamically
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="register_user_confirm_password" // Fixed name string to match target context uniquely
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`glass-input w-full pl-11 pr-11 transition-all ${
                    hasError ? '!border-red-500/50 focus:!ring-red-500/30' : ''
                  }`}
                  placeholder="Confirm password"
                  autoComplete="new-password" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
