
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';

import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';

import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import ProfilePage from './pages/owner/ProfilePage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserPage from './pages/admin/UserPage';
import ManageCarsAdmin from "./pages/admin/ManageCarsAdmin";

import { useAppContext } from './context/AppContext';

const App = () => {
  const { showLogin, user } = useAppContext();
  const location = useLocation();

  const isOwnerPath = location.pathname.startsWith('/owner');
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {/* Navbar only on public pages */}
      {!isOwnerPath && !isAdminPath && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Owner Dashboard Routes */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserPage />} />
          <Route path="add-car" element={<AddCar />} />
           
<Route path="manage-cars" element={<ManageCarsAdmin />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>

      {/* Footer only on public pages */}
      {!isOwnerPath && !isAdminPath && <Footer />}
    </>
  );
};

export default App;














