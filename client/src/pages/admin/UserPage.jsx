
// // src/pages/admin/UsersPage.jsx
// import React, { useEffect, useState } from "react";
// import Title from "../../components/owner/Title";
// import { useAppContext } from "../../context/AppContext";
// import toast from "react-hot-toast";
// import { FiSearch } from "react-icons/fi";

// const UsersPage = () => {
//   const { axios } = useAppContext();

//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // For mail modal
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");

//   const fetchUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/admin/users");
//       data.success ? setUsers(data.users) : toast.error(data.message);
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Filter by search + role
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(search.toLowerCase()) ||
//       user.email.toLowerCase().includes(search.toLowerCase());
//     const matchesRole = roleFilter === "all" || user.role === roleFilter;
//     return matchesSearch && matchesRole;
//   });

//   // Pagination
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);
//   const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

//   const handleOpenMailModal = (user) => {
//     setSelectedUser(user);
//     setSubject("");
//     setMessage("");
//     setOpenModal(true);
//   };

// const handleSendMail = async () => {
//     if (!subject || !message) {
//       toast.error("Please enter subject and message");
//       return;
//     }

//     try {
//       await axios.post("/api/admin/send-mail", {
//         email: selectedUser?.email,
//         subject,
//         message,
//       });
//       toast.success("Mail sent successfully!");
//       setOpenModal(false);
//       setSubject("");
//       setMessage("");
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };
//   return (
//     <div className="px-4 pt-10 md:px-10 w-full">
//       <Title
//         title="Manage Users"
//         subTitle="View and manage all registered users, filter by role, and send them emails directly."
//       />

//       {/* Search & Filters */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-4">
//         {/* Search bar */}
//         <div className="relative w-full md:w-1/3">
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             className="w-full py-2 pl-10 pr-4 rounded-md border border-borderColor text-sm outline-none text-gray-500"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//           <FiSearch
//             className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
//             size={18}
//           />
//         </div>

      
//         {/* Rows per page */}
//         <select
//           value={rowsPerPage}
//           onChange={(e) => {
//             setRowsPerPage(Number(e.target.value));
//             setCurrentPage(1);
//           }}
//           className="border border-borderColor rounded-md px-3 py-2 text-sm w-full md:w-48
//             text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
//         >
//           <option value={5}>5 rows</option>
//           <option value={10}>10 rows</option>
//           <option value={20}>20 rows</option>
//         </select>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden md:block w-full overflow-x-auto rounded-md border border-borderColor">
//         <table className="w-full min-w-[700px] border-collapse text-left text-sm text-gray-600">
//           <thead className="text-gray-500">
//             <tr>
//               <th className="p-3 font-medium">Name</th>
//               <th className="p-3 font-medium">Email</th>
//               <th className="p-3 font-medium">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentUsers.length === 0 ? (
//               <tr>
//                 <td colSpan={3} className="text-center py-6 text-gray-400">
//                   No users found.
//                 </td>
//               </tr>
//             ) : (
//               currentUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-t border-borderColor text-gray-500"
//                 >
//                   <td className="p-3">{user.name}</td>
//                   <td className="p-3">{user.email}</td>
//                   <td className="p-3">
//                     <button
//                       onClick={() => handleOpenMailModal(user)}
//                       className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//                     >
//                       Send Mail
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className="md:hidden space-y-4">
//         {currentUsers.length === 0 ? (
//           <p className="text-center text-gray-400">No users found.</p>
//         ) : (
//           currentUsers.map((user) => (
//             <div
//               key={user._id}
//               className="border border-borderColor rounded-lg p-4 space-y-2"
//             >
//               <p>
//                 <strong>Name:</strong> {user.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {user.email}
//               </p>
//               <button
//                 onClick={() => handleOpenMailModal(user)}
//                 className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//               >
//                 Send Mail
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
//           <p className="text-sm text-gray-500">
//             Showing {indexOfFirstRow + 1}-
//             {Math.min(indexOfLastRow, filteredUsers.length)} of{" "}
//             {filteredUsers.length} users
//           </p>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1 border rounded-md disabled:opacity-50 border-borderColor"
//             >
//               Prev
//             </button>
//             <span className="px-3 py-1">
//               {currentPage} / {totalPages}
//             </span>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 border rounded-md disabled:opacity-50 border-borderColor"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Mail Modal */}
//       {openModal && (
//         <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50">
//           <div className=" dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Send Mail to {selectedUser?.name}
//             </h3>
//             <input
//               type="text"
//               placeholder="Subject"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 text-black"
//             />
//             <textarea
//               placeholder="Message..."
//               rows="5"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 text-black"
//             ></textarea>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setOpenModal(false)}
//                 className="px-3 py-1 bg-gray-400 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSendMail}
//                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersPage;

// src/pages/admin/UsersPage.jsx
import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

const UsersPage = () => {
  const { axios } = useAppContext();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // For mail modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // For edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users");
      data.success ? setUsers(data.users) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter by search + role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // === MAIL ===
  const handleOpenMailModal = (user) => {
    setSelectedUser(user);
    setSubject("");
    setMessage("");
    setOpenModal(true);
  };

  const handleSendMail = async () => {
    if (!subject || !message) {
      toast.error("Please enter subject and message");
      return;
    }

    try {
      await axios.post("/api/admin/send-mail", {
        email: selectedUser?.email,
        subject,
        message,
      });
      toast.success("Mail sent successfully!");
      setOpenModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // === EDIT ===
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditData({ name: user.name, email: user.email, role: user.role });
    setOpenEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const { data } = await axios.put(`/api/admin/users/${selectedUser._id}`, editData);
      if (data.success) {
        toast.success("User updated successfully");
        setOpenEditModal(false);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // === DELETE ===
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const { data } = await axios.delete(`/api/admin/users/${userId}`);
      if (data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Users"
        subTitle="View and manage all registered users, filter by role, and send them emails directly."
      />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-4">
        {/* Search bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full py-2 pl-10 pr-4 rounded-md border border-borderColor text-sm outline-none text-gray-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <FiSearch
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>

        {/* Rows per page */}
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-borderColor rounded-md px-3 py-2 text-sm w-full md:w-48
            text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-md border border-borderColor">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-borderColor text-gray-500"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleOpenMailModal(user)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Mail
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mail Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50">
          <div className="dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Send Mail to {selectedUser?.name}
            </h3>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 text-black"
            />
            <textarea
              placeholder="Message..."
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 text-black"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenModal(false)}
                className="px-3 py-1 bg-gray-400 rounded-md dark:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMail}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {openEditModal && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50">
          <div className="dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Edit User {selectedUser?.name}
            </h3>
            <input
              type="text"
              placeholder="Name"
              value={editData.name}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 text-black"
            />
            <select
              value={editData.role}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 text-black"
            >
              
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenEditModal(false)}
                className="px-3 py-1 bg-gray-400 rounded-md dark:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
