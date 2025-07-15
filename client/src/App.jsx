import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
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

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';


import { useAppContext } from './context/AppContext';

const App = () => {
  const { showLogin, user } = useAppContext();

  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');
  const isAdminPath = location.pathname.startsWith('/admin');

  // ✅ Redirect logged-in users to their dashboard
  if (user && location.pathname === '/') {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'owner' || user.role === 'user') {
      return <Navigate to="/owner" replace />;
    }
  }

  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && !isAdminPath && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />

        {/* Owner Dashboard Routes */}
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
       
    
        </Route>
      </Routes>

      {!isOwnerPath && !isAdminPath && <Footer />}
    </>
  );
};

export default App;















// import React, { useState } from 'react'
// import Navbar from './components/Navbar'
// import { Route, Routes, useLocation } from 'react-router-dom'
// import Home from './pages/Home'
// import CarDetails from './pages/CarDetails'
// import Cars from './pages/Cars'
// import MyBookings from './pages/MyBookings'
// import Footer from './components/Footer'
// import Layout from './pages/owner/Layout'
// import Dashboard from './pages/owner/Dashboard'
// import AddCar from './pages/owner/AddCar'
// import ManageCars from './pages/owner/ManageCars'
// import ManageBookings from './pages/owner/ManageBookings'
// import Login from './components/Login'
// import { Toaster } from 'react-hot-toast'
// import { useAppContext } from './context/AppContext'

// const App = () => {

//   const {showLogin} = useAppContext()
//   const isOwnerPath = useLocation().pathname.startsWith('/owner')

//   return (
//     <>
//      <Toaster />
//       {showLogin && <Login/>}

//       {!isOwnerPath && <Navbar/>}

//     <Routes>
//       <Route path='/' element={<Home/>}/>
//       <Route path='/car-details/:id' element={<CarDetails/>}/>
//       <Route path='/cars' element={<Cars/>}/>
//       <Route path='/my-bookings' element={<MyBookings/>}/>
//       <Route path='/owner' element={<Layout />}>
//         <Route index element={<Dashboard />}/>
//         <Route path="add-car" element={<AddCar />}/>
//         <Route path="manage-cars" element={<ManageCars />}/>
//         <Route path="manage-bookings" element={<ManageBookings />}/>
//       </Route>
//     </Routes>

//     {!isOwnerPath && <Footer />}
    
//     </>
//   )
// }

// // export default App
