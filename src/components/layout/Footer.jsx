import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
          
          {/* Logo / Brand Accent */}
          <div className="md:w-1/4">
             <h3 className="font-heading text-xl text-sage italic font-bold">UniThrift</h3>
          </div>

          {/* Links - Micro-tightened Typography */}
          <nav className="flex flex-wrap justify-center gap-8 md:gap-10">
            <Link 
              to="/about" 
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-sage transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-sage transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/report" 
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-sage transition-colors"
            >
              Report Issue
            </Link>
            <Link 
              to="/privacy" 
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-sage transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>

          {/* Copyright Section */}
          <div className="md:w-1/4 text-center md:text-right">
            <p className="text-[9px] text-gray-300 tracking-[0.4em] uppercase leading-relaxed">
              © {new Date().getFullYear()} UniThrift Marketplace <br />
              <span className="opacity-50 font-light italic">Campus Sustainable Commerce</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;