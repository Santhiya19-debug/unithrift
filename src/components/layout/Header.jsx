import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <h1 className="text-2xl font-heading font-bold text-sage italic group-hover:scale-105 transition-transform">
              UniThrift
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-sage transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>

            <Link
              to="/browse"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-sage transition-colors"
            >
              Browse
            </Link>

            <Link
              to="/about"
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-sage transition-colors"
            >
              About
            </Link>

            {isAuthenticated && (
              <Link
                to="/sell"
                className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-sage transition-colors"
              >
                Sell
              </Link>
            )}

            {/* Icons Section */}
            <div className="flex items-center gap-5 ml-4 pl-8 border-l border-gray-100">
              
              <button 
                onClick={() => navigate('/browse')} 
                className="text-gray-400 hover:text-sage transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {isAuthenticated && (
                <Link to="/wishlist" className="text-gray-400 hover:text-sage transition-colors" aria-label="Wishlist">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
              )}

              {/* Profile / Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center gap-5">
                  
                  {/* ADMIN DASHBOARD LINK - Visible only to Admins */}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-[10px] uppercase tracking-widest font-bold text-sage border border-sage/30 px-3 py-1.5 rounded-full hover:bg-sage hover:text-white transition-all shadow-sm"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link to="/profile" className="text-gray-400 hover:text-sage transition-colors" aria-label="Profile">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-sage text-white px-6 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-green-dark transition-all shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-sage p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t border-gray-50 bg-white animate-fadeIn">
            <div className="flex flex-col gap-5 px-4">
              <Link to="/" className="text-xs font-bold uppercase tracking-widest text-sage" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/browse" className="text-xs font-bold uppercase tracking-widest text-gray-500" onClick={() => setMobileMenuOpen(false)}>Browse</Link>
              <Link to="/about" className="text-xs font-bold uppercase tracking-widest text-gray-500" onClick={() => setMobileMenuOpen(false)}>About</Link>
              {isAuthenticated && <Link to="/sell" className="text-xs font-bold uppercase tracking-widest text-gray-500" onClick={() => setMobileMenuOpen(false)}>Sell</Link>}
              
              <div className="pt-4 border-t border-gray-50 flex flex-col gap-5">
                {isAuthenticated ? (
                  <>
                    {/* Admin Link for Mobile */}
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="text-xs font-bold uppercase tracking-widest text-sage underline" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
                    )}
                    <Link to="/profile" className="text-xs font-bold uppercase tracking-widest text-gray-500" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                    <button onClick={logout} className="text-left text-xs font-bold uppercase tracking-widest text-red-400">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-sage" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
