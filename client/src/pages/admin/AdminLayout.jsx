import React, { useEffect } from 'react';
import NavbarAdmin from '../../components/admin/NavbarAdmin';
import SidebarAdmin from '../../components/admin/SidebarAdmin'; // ✅ Now correct

import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminLayout = () => {
  const { user, navigate } = useAppContext();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user]);

  return (
    <div className='flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900'>
      <NavbarAdmin />
      <div className='flex flex-1'>
        <SidebarAdmin />
        <main className='flex-1 p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
