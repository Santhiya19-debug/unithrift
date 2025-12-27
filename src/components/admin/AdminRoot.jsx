import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './AdminLayout';
import AdminRoute from './AdminRoute';

import Dashboard from '../../pages/admin/Dashboard';
import UserManagement from '../../pages/admin/UserManagement';
import ListingsManagement from '../../pages/admin/ListingsManagement';
import ReportsManagement from '../../pages/admin/ReportsManagement';

const AdminRoot = () => {
  return (
    <Routes>
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="listings" element={<ListingsManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoot;


