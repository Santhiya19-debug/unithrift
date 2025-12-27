import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-off-white border-t border-border-soft mt-auto">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Links */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-6">
            <Link 
              to="/about" 
              className="text-text-secondary hover:text-green-dark text-sm transition-colors duration-card"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-text-secondary hover:text-green-dark text-sm transition-colors duration-card"
            >
              Contact
            </Link>
            <Link 
              to="/report" 
              className="text-text-secondary hover:text-green-dark text-sm transition-colors duration-card"
            >
              Report Issue
            </Link>
            <Link 
              to="/privacy" 
              className="text-text-secondary hover:text-green-dark text-sm transition-colors duration-card"
            >
              Privacy Policy
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} UniThrift. Built for campus communities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;