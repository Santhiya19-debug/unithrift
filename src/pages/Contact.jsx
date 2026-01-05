import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Accessing your existing Auth state

const Contact = () => {
  const { user } = useAuth(); // Destructuring the logged-in user
  const location = useLocation();
  const isReport = location.pathname === '/report';
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', // Initialized empty to handle loading states
    subject: '', 
    message: '' 
  });

  const [status, setStatus] = useState({ type: '', msg: '' });

  // Automatically sync the email field with the logged-in user's data
  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email // Defaulting to the logged-in email
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Submitting...' });

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isReport })
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus({ type: 'success', msg: data.message });
        // Reset name and message but keep the verified email
        setFormData(prev => ({ ...prev, name: '', subject: '', message: '' }));
      } else {
        setStatus({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Connection to server failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7] py-16 px-4">
      <div className="container-custom max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-heading font-medium mb-2">
          {isReport ? 'Report an Issue' : 'Get in Touch'}
        </h1>
        
        {status.msg && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest ${
            status.type === 'success' ? 'bg-sage/10 text-sage' : 'bg-red-50 text-red-400'
          }`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input 
              required
              type="text" 
              placeholder="Your Name"
              className="w-full bg-[#F7F9F7] border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-sage/50"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {/* EMAIL FIELD: Auto-populated and Read-Only for logged-in users */}
            <div className="relative">
              <input 
                required
                type="email" 
                placeholder="Campus Email"
                className="w-full bg-[#F7F9F7] border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-sage/50 opacity-60 cursor-not-allowed"
                value={formData.email}
                readOnly
              />
              <span className="absolute right-4 top-3 text-[8px] font-bold text-sage uppercase tracking-widest">Verified</span>
            </div>
          </div>
          
          <input 
            required
            type="text" 
            placeholder={isReport ? "What is the issue?" : "Subject"}
            className="w-full bg-[#F7F9F7] border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-sage/50"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
          
          <textarea 
            required
            rows="5" 
            placeholder="Provide as much detail as possible..."
            className="w-full bg-[#F7F9F7] border-none rounded-[2rem] px-5 py-4 focus:ring-2 focus:ring-sage/50"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
          
          <button 
            type="submit"
            className="w-full bg-sage text-white font-bold py-4 rounded-full hover:bg-green-dark transition-all shadow-lg active:scale-95"
          >
            {isReport ? 'Submit Secure Report' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;