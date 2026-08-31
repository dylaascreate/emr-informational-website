import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, quickDemoLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleManualLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const res = await login(username, password);
    setIsSubmitting(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleDemoClick = async (type: 'superadmin' | 'marketing' | 'sales') => {
    setError(null);
    setIsSubmitting(true);
    const res = await quickDemoLogin(type);
    setIsSubmitting(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Failed to authenticate demo account');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Top return link */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#07A5C9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Website
          </Link>
          <span className="text-xs font-semibold text-[#07A5C9] bg-[#07A5C9]/10 px-3 py-1 rounded-full border border-[#07A5C9]/20">
            EMR Content Management System
          </span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#07A5C9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#07A5C9]/15 border border-[#07A5C9]/30 flex items-center justify-center mx-auto mb-4 text-[#07A5C9]">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to manage and update live website content</p>
          </div>

          {/* Quick Demo Login Cards */}
          <div className="mb-8 p-5 bg-[#00081E]/60 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#FFB800]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Quick Demo Access (3 Accounts)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoClick('superadmin')}
                disabled={isSubmitting}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-[#07A5C9]/20 border border-white/10 hover:border-[#07A5C9]/50 text-left transition-all group flex flex-col justify-between focus:outline-none"
              >
                <div className="flex flex-col gap-1.5 mb-1.5">
                  <span className="text-sm font-bold text-white group-hover:text-[#07A5C9] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#07A5C9]" /> Super Admin
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 w-max">
                    Full CRUD
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-1">
                  User: <strong className="text-gray-200">superadmin</strong><br/>Pass: <strong className="text-gray-200">admin123</strong>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('marketing')}
                disabled={isSubmitting}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-[#07A5C9]/20 border border-white/10 hover:border-[#07A5C9]/50 text-left transition-all group flex flex-col justify-between focus:outline-none"
              >
                <div className="flex flex-col gap-1.5 mb-1.5">
                  <span className="text-sm font-bold text-white group-hover:text-[#07A5C9] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#FFB800]" /> Marketing
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 w-max">
                    Content Editor
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-1">
                  User: <strong className="text-gray-200">marketing</strong><br/>Pass: <strong className="text-gray-200">marketing123</strong>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('sales')}
                disabled={isSubmitting}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-[#07A5C9]/20 border border-white/10 hover:border-[#07A5C9]/50 text-left transition-all group flex flex-col justify-between focus:outline-none"
              >
                <div className="flex flex-col gap-1.5 mb-1.5">
                  <span className="text-sm font-bold text-white group-hover:text-[#07A5C9] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#C907A5]" /> Sales
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 w-max">
                    Leads & Submissions
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-1">
                  User: <strong className="text-gray-200">sales</strong><br/>Pass: <strong className="text-gray-200">sales123</strong>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase tracking-widest">Or enter credentials</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. superadmin"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#07A5C9] focus:ring-1 focus:ring-[#07A5C9] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#07A5C9] focus:ring-1 focus:ring-[#07A5C9] transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#07A5C9] hover:bg-[#066F8B] text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(7,165,201,0.3)] hover:shadow-[0_0_30px_rgba(7,165,201,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
