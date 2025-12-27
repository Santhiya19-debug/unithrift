import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-off-white border-b border-border-soft sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-heading font-medium text-text-primary">
              UniThrift
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-text-secondary hover:text-green-dark transition-colors duration-card font-medium"
            >
              Browse
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/sell" 
                className="text-text-secondary hover:text-green-dark transition-colors duration-card font-medium"
              >
                Sell
              </Link>
            )}
            
            {/* Right side icons */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border-soft">
              <Link 
                to="/search" 
                className="text-green-dark hover:text-sage transition-colors duration-card"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to="/wishlist" 
                  className="text-green-dark hover:text-sage transition-colors duration-card"
                  aria-label="Wishlist"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="text-text-secondary hover:text-green-dark transition-colors duration-card font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="text-green-dark hover:text-sage transition-colors duration-card"
                    aria-label="Profile"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-text-secondary hover:text-green-dark transition-colors duration-card font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-green-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border-soft">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-text-secondary hover:text-green-dark font-medium">
                Browse
              </Link>
              {isAuthenticated && (
                <Link to="/sell" className="text-text-secondary hover:text-green-dark font-medium">
                  Sell
                </Link>
              )}
              <Link to="/search" className="text-text-secondary hover:text-green-dark font-medium">
                Search
              </Link>
              {isAuthenticated && (
                <Link to="/wishlist" className="text-text-secondary hover:text-green-dark font-medium">
                  Wishlist
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-text-secondary hover:text-green-dark font-medium">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="text-text-secondary hover:text-green-dark font-medium">
                    Profile
                  </Link>
                </>
              ) : (
                <Link to="/login" className="text-text-secondary hover:text-green-dark font-medium">
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;