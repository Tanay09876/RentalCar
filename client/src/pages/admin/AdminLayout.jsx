// import React, { useEffect } from 'react';
// import NavbarAdmin from '../../components/admin/NavbarAdmin';


// import { Outlet } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';

// const AdminLayout = () => {
//   const { user, navigate } = useAppContext();

//   useEffect(() => {
//     if (!user || user.role !== 'admin') {
//       navigate('/');
//     }
//   }, [user]);

//   return (
//     <div className='flex flex-col min-h-screen  dark:bg-gray-900'>
//       <NavbarAdmin />
//       <div className='flex flex-1'>
      
//         <main className='flex-1 p-4 md:p-6'>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../../components/admin/NavbarAdmin';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminLayout = () => {
  const { user, navigate } = useAppContext();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user === null) return; // still loading, don’t redirect yet

    if (user.role !== 'admin') {
      navigate('/');
    } else {
      setChecking(false); // user is admin, allow render
    }
  }, [user, navigate]);

  if (checking) {
    return <div className="text-center p-10">Checking permissions...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <NavbarAdmin />
      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
