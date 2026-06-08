import { Link, useNavigate } from 'react-router-dom';
import { Wallet, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface-900/90 backdrop-blur-lg border-b border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         <Link to="/" className="flex items-center gap-2.5 group">
  <div className="w-20 h-20 flex items-center justify-center">
    <img 
      src="/logo3D.png" 
      alt="SpendWise AI Logo" 
      className="object-contain"
    />
  </div>
  <span className="text-lg font-semibold text-surface-100 group-hover:text-white transition-colors">
    
  </span>
</Link>




          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-200 transition-colors px-3 py-2 rounded-lg hover:bg-surface-800"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-3 border-l border-surface-700">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
                      <User size={16} className="text-surface-400" />
                    </div>
                    <span className="text-surface-300">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-surface-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-surface-400 hover:text-surface-200 transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
