import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-[#00081E]/95 backdrop-blur-md px-6 py-4 md:px-[5%] flex justify-between items-center border-b border-white/5 shadow-sm shadow-[#07A5C9]/5">
      <Link to="/" className="flex items-center gap-2.5 no-underline z-50">
        <img src="/emr-logo-1.png" alt="East Man Resource" className="h-8 w-auto" />
        <div className="font-bold text-[14px] uppercase leading-[1.2] text-white tracking-wide">
          East Man Resource<br />
          <span className="text-[#07A5C9] text-[12px]">Sdn Bhd</span>
        </div>
      </Link>
      
      {/* Desktop Navigation (Home removed) */}
      <ul className="hidden md:flex list-none gap-8 m-0 p-0 items-center">
        {navLinks.map((link) => (
          <li key={link.path}>
            <NavLink 
              to={link.path} 
              className={({isActive}) => `text-[14px] no-underline transition-colors duration-300 font-medium tracking-wide ${isActive ? 'text-[#07A5C9]' : 'text-white hover:text-[#07A5C9]'}`}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-1.5 bg-[#07A5C9]/15 hover:bg-[#07A5C9]/25 text-[#07A5C9] border border-[#07A5C9]/30 px-3.5 py-2 rounded-full font-semibold text-xs tracking-wide transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin CMS ({user?.role === 'superadmin' ? 'SuperAdmin' : 'Marketing'})</span>
          </Link>
        ) : (
          <Link
            to="/admin/login"
            title="Admin Login Portal"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-full font-medium transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-[#07A5C9]" />
            <span>Admin</span>
          </Link>
        )}

        <Link 
          to="/book" 
          className="bg-[#07A5C9] text-white px-5 py-2 rounded-full font-bold text-xs md:text-sm no-underline hover:bg-[#066F8B] transition-all duration-300 shadow-[0_0_15px_rgba(7,165,201,0.2)] hover:shadow-[0_0_25px_rgba(7,165,201,0.4)]"
        >
          Book Session
        </Link>
      </div>

      {/* Mobile Hamburger Toggle */}
      <button
        id="mobile-menu-toggle"
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden z-50 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-[#07A5C9]" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-[72px] left-0 right-0 bg-[#00081E]/98 border-b border-white/10 shadow-2xl p-6 z-40 md:hidden flex flex-col gap-5"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({isActive}) => `text-lg py-3 px-4 rounded-xl font-medium transition-all ${
                      isActive 
                        ? 'bg-[#07A5C9]/15 text-[#07A5C9] font-bold' 
                        : 'text-gray-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                ))}

                <Link
                  to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm py-2.5 px-4 rounded-xl text-gray-400 hover:text-white bg-white/5 flex items-center gap-2 mt-2"
                >
                  <Shield className="w-4 h-4 text-[#07A5C9]" />
                  <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
                </Link>
              </nav>

              <div className="pt-3 border-t border-white/10">
                <Link
                  to="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center bg-[#07A5C9] text-white py-3.5 px-6 rounded-xl font-bold hover:bg-[#066F8B] transition-colors shadow-[0_0_20px_rgba(7,165,201,0.3)]"
                >
                  Book Session
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}


