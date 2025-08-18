// import React, { useEffect } from 'react';
// import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Login from './components/Login';

// import Home from './pages/Home';
// import CarDetails from './pages/CarDetails';
// import Cars from './pages/Cars';
// import MyBookings from './pages/MyBookings';

// import Layout from './pages/owner/Layout';
// import Dashboard from './pages/owner/Dashboard';
// import AddCar from './pages/owner/AddCar';
// import ManageCars from './pages/owner/ManageCars';
// import ManageBookings from './pages/owner/ManageBookings';
// import ProfilePage from './pages/owner/ProfilePage';

// import AdminLayout from './pages/admin/AdminLayout';
// import AdminDashboard from './pages/admin/AdminDashboard';

// import { useAppContext } from './context/AppContext';

// const App = () => {
//   const { showLogin, user } = useAppContext();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isOwnerPath = location.pathname.startsWith('/owner');
//   const isAdminPath = location.pathname.startsWith('/admin');

//   useEffect(() => {
//     if (user) {
//       const isOnDashboard =
//         location.pathname.startsWith('/owner') ||
//         location.pathname.startsWith('/admin');

//       if (!isOnDashboard) {
//         if (user.role === 'admin') {
//           navigate('/admin', { replace: true });
//         } else if (user.role === 'owner') {
//           navigate('/owner', { replace: true });
//         } else {
//           navigate('/', { replace: true });
//         }
//       }
//     }
//   }, [user, navigate, location.pathname]);

//   return (
//     <>
//       <Toaster />
//       {showLogin && <Login />}
//       {!isOwnerPath && !isAdminPath && <Navbar />}

//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/car-details/:id" element={<CarDetails />} />
//         <Route path="/cars" element={<Cars />} />
//         <Route path="/my-bookings" element={<MyBookings />} />

//         {/* Owner/User Dashboard Routes */}
//         <Route path="/owner" element={<Layout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="add-car" element={<AddCar />} />
//           <Route path="manage-cars" element={<ManageCars />} />
//           <Route path="manage-bookings" element={<ManageBookings />} />
//           <Route path="profile" element={<ProfilePage />} />
//         </Route>

//         {/* Admin Dashboard Routes */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<AdminDashboard />} />
//         </Route>
//       </Routes>

//       {!isOwnerPath && !isAdminPath && <Footer />}
//     </>
//   );
// };

// export default App;


import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

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

import { useAppContext } from './context/AppContext';
import UserPage from './pages/admin/UserPage';

const App = () => {
  const { showLogin, setUser, user } = useAppContext();
  const [loadingUser, setLoadingUser] = useState(true); // new state for user fetch
  const location = useLocation();
  const navigate = useNavigate();

  const isOwnerPath = location.pathname.startsWith('/owner');
  const isAdminPath = location.pathname.startsWith('/admin');

  // Fetch user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('/api/user/data')
        .then(res => {
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('token');
        })
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [setUser]);

  // Redirect based on role after user is loaded
  useEffect(() => {
    if (!loadingUser && user) {
      const isOnDashboard =
        location.pathname.startsWith('/owner') ||
        location.pathname.startsWith('/admin');

      if (!isOnDashboard) {
        if (user.role === 'admin') navigate('/admin', { replace: true });
        else if (user.role === 'owner') navigate('/owner', { replace: true });
        else navigate('/', { replace: true });
      }
    }
  }, [user, loadingUser, navigate, location.pathname]);

  if (loadingUser) return null; // optional: or a spinner while user loads

  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && !isAdminPath && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Owner/User Dashboard Routes */}
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
  <Route path="manage-cars" element={<ManageCars />} />
  <Route path="manage-bookings" element={<ManageBookings />} />
</Route>

      </Routes>

      {!isOwnerPath && !isAdminPath && <Footer />}
    </>
  );
};

export default App;











