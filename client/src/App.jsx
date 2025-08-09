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


import React, { useEffect, useRef } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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

import { useAppContext } from './context/AppContext';

const App = () => {
  const { showLogin, user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isOwnerPath = location.pathname.startsWith('/owner');
  const isAdminPath = location.pathname.startsWith('/admin');

  const wasJustLoggedIn = useRef(false);

  // ✅ Track login event
  useEffect(() => {
    if (user) {
      wasJustLoggedIn.current = true;
    }
  }, [user]);

  // ✅ Redirect only once after login
  useEffect(() => {
    if (user && wasJustLoggedIn.current) {
      const isOnDashboard =
        location.pathname.startsWith('/owner') ||
        location.pathname.startsWith('/admin');

      if (!isOnDashboard) {
        wasJustLoggedIn.current = false; // prevent future redirects

        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (user.role === 'owner') {
          navigate('/owner', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }
  }, [user, navigate, location.pathname]);

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











// const App = () => {
//   const { showLogin, user, loading } = useAppContext();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isOwnerPath = location.pathname.startsWith('/owner');
//   const isAdminPath = location.pathname.startsWith('/admin');

//   useEffect(() => {
//     if (!loading && user) {
//       const currentPath = location.pathname;

//       if (currentPath === '/' || currentPath === '/login') {
//         if (user.role === 'admin') {
//           navigate('/admin', { replace: true });
//         } else if (user.role === 'owner') {
//           navigate('/owner', { replace: true });
//         } else {
//           navigate('/', { replace: true });
//         }
//       }
//     }
//   }, [user, loading, location.pathname, navigate]);

//   // ⛔ Prevent rendering before user is restored
//   if (loading) return null; // or a loading spinner

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

//         {/* Owner Dashboard */}
//         <Route path="/owner" element={<Layout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="add-car" element={<AddCar />} />
//           <Route path="manage-cars" element={<ManageCars />} />
//           <Route path="manage-bookings" element={<ManageBookings />} />
//           <Route path="profile" element={<ProfilePage />} />
//         </Route>

//         {/* Admin Dashboard */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<AdminDashboard />} />
//         </Route>
//       </Routes>

//       {!isOwnerPath && !isAdminPath && <Footer />}
//     </>
//   );
// };

// export default App;
