// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../../context/AppContext";
// import toast from "react-hot-toast";

// const ProfilePage = () => {
//   const { user, axios, fetchUser, token, logout } = useAppContext(); // add logout for after delete

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   // 🔹 READ: load user details into form
//   useEffect(() => {
//     setFormData({
//       name: user?.name || "",
//       email: user?.email || "",
//       password: "",
//       confirmPassword: "",
//     });
//   }, [user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🔹 UPDATE profile
//   const handleSaveProfile = async () => {
//     if (!formData.name || !formData.email) {
//       return toast.error("Name and email are required.");
//     }

//     if (formData.password && formData.password !== formData.confirmPassword) {
//       return toast.error("Passwords do not match.");
//     }

//     try {
//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         ...(formData.password && { password: formData.password }),
//         ...(formData.confirmPassword && { confirmPassword: formData.confirmPassword }),
//       };

//       const { data } = await axios.put(
//         "http://localhost:5000/api/user/update-profile",
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         fetchUser(); // refresh details
//         setIsEditing(false);
//         setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setFormData({
//       name: user?.name || "",
//       email: user?.email || "",
//       password: "",
//       confirmPassword: "",
//     });
//   };

//   // 🔹 DELETE profile
//   const handleDeleteProfile = async () => {
//     if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
//       return;
//     }
//     try {
//       const { data } = await axios.delete(
//         "http://localhost:5000/api/user/delete-profile",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success("Account deleted successfully.");
//         logout(); // clear token + redirect to login
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto px-4 py-10">
//       <h2 className="text-3xl font-semibold text-center mb-6">
//         {isEditing ? "Edit Profile" : "Your Profile"}
//       </h2>

//       <div className="space-y-5">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Name</label>
//           {isEditing ? (
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 rounded border"
//             />
//           ) : (
//             <p>{user?.name || "Not set"}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           {isEditing ? (
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 rounded border"
//             />
//           ) : (
//             <p>{user?.email || "Not set"}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Password</label>
//           {isEditing ? (
//             <>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter new password"
//                   className="w-full px-4 py-2 pr-16 rounded border"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//               <div className="mt-3">
//                 <label className="block text-sm font-medium mb-1">Confirm Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   placeholder="Confirm new password"
//                   className="w-full px-4 py-2 rounded border"
//                 />
//               </div>
//             </>
//           ) : (
//             <p>********</p>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="pt-4 flex gap-4">
//           <button
//             onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
//             className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             {isEditing ? "Update Profile" : "Edit Profile"}
//           </button>
//           {isEditing && (
//             <button
//               onClick={handleCancel}
//               className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           )}
//         </div>

    

    
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ import axios directly
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, fetchUser, logout } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Load user details into form
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  }, [user]);

  // 🔹 Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Update profile
  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      return toast.error("Name and email are required.");
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const { name, email, password, confirmPassword } = formData;

      const token = localStorage.getItem("token");

      if (!token) {
        return toast.error("Not authorized. Please log in again.");
      }

      const { data } = await axios.put(
        "http://localhost:3000/api/user/update-profile",
        { name, email, password, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Must start with Bearer
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully!");
        fetchUser();
        setIsEditing(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // 🔹 Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-center mb-6">
        {isEditing ? "Edit Profile" : "Your Profile"}
      </h2>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded border"
            />
          ) : (
            <p>{user?.name || "Not set"}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded border"
            />
          ) : (
            <p>{user?.email || "Not set"}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          {isEditing ? (
            <>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 pr-16 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 rounded border"
                />
              </div>
            </>
          ) : (
            <p>********</p>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-4 flex gap-4">
          <button
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? "Update Profile" : "Edit Profile"}
          </button>
          {isEditing && (
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
