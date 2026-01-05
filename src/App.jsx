import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import VerificationBanner from './components/auth/VerificationBanner';

// Public pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Browse from './pages/Browse';
import About from './pages/About';    // ADDED
import Contact from './pages/Contact'; // ADDED
import Privacy from './pages/Privacy'; // ADDED

// Auth pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmailPending from './pages/auth/VerifyEmailPending';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import BlockedAccount from './pages/auth/BlockedAccount';

// Protected pages
import Wishlist from './pages/Wishlist';
import SellProduct from './pages/SellProduct';
import Profile from './pages/Profile';
import EditProduct from './pages/EditProduct'; 

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ListingsManagement from './pages/admin/ListingsManagement';
import ReportsManagement from './pages/admin/ReportsManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes - Separate Layout */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="listings" element={<ListingsManagement />} />
            <Route path="reports" element={<ReportsManagement />} />
          </Route>

          {/* Auth Routes - No Header/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/blocked" element={<BlockedAccount />} />

          {/* Public + Protected Routes - Standard Layout */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <VerificationBanner />
              <Header />
              
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/about" element={<About />} />       {/* ADDED */}
                  <Route path="/contact" element={<Contact />} />   {/* ADDED */}
                  <Route path="/report" element={<Contact />} />    {/* ADDED - Reuses Contact UI */}
                  <Route path="/privacy" element={<Privacy />} />   {/* ADDED */}
                  
                  {/* Protected Routes */}
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/sell" element={
                    <ProtectedRoute>
                      <SellProduct />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/edit/:id" element={
                    <ProtectedRoute>
                      <EditProduct />
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Fallback - 404 Page */}
                  <Route path="*" element={
                    <div className="min-h-screen bg-off-white flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="font-heading text-6xl font-medium text-text-primary mb-4">404</h1>
                        <p className="text-text-secondary mb-6">Page not found</p>
                        <a href="/" className="btn-primary inline-block">
                          Go Home
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </main>
              
              <Footer />
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;