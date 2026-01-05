import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading Dashboard Data...</div>;

  const StatCard = ({ title, value, subtitle, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${onClick ? 'cursor-pointer hover:border-emerald-500 transition-all' : ''}`}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500">Real-time platform metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0}
            subtitle="Registered accounts"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard 
            title="Active Listings" 
            value={stats?.activeListings || 0}
            subtitle="Currently visible"
            onClick={() => navigate('/admin/listings')}
          />
          <StatCard 
            title="Blocked Users" 
            value={stats?.blockedUsers || 0}
            subtitle="Access restricted"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard 
            title="Removed Listings" 
            value={stats?.removedListings || 0}
            subtitle="Hidden from feed"
            onClick={() => navigate('/admin/listings')}
          />
        </div>
        
        {/* Placeholder for Activity Logs - Will integrate in Phase 2 */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
           <h2 className="text-lg font-bold mb-4">System Status</h2>
           <div className="flex items-center gap-2 text-emerald-600">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">All systems operational</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;