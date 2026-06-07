import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import Title from "../../components/owner/Title";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaKey,
  FaShieldAlt,
  FaCalendarAlt,
  FaCamera,
  FaTimes,
  FaEdit
} from "react-icons/fa";

const ProfilePage = () => {
  const { user, fetchUser, axios, logout, navigate } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Profile Image Upload States
  const [imagePreview, setImagePreview] = useState("");

  // Check auth and load user details into form
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access your profile.");
      navigate("/");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
      setImagePreview(user.image || "");
      setLoadingUser(false);
    }
  }, [user, navigate]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload Photo instantly
  const handleUploadPhoto = async (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image file size should be less than 2MB");
    }

    const loadingToast = toast.loading("Uploading profile picture...");
    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append("image", file);
      uploadData.append("name", user.name);
      uploadData.append("email", user.email);

      const { data } = await axios.put(
        "/api/user/update-profile",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Profile picture updated successfully!", { id: loadingToast });
        await fetchUser();
      } else {
        toast.error(data.message || "Failed to update profile picture", { id: loadingToast });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // Handle photo selection
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleUploadPhoto(file);
    }
  };

  // Update profile details
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      return toast.error("Name and email are required.");
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append("name", formData.name.trim());
      uploadData.append("email", formData.email.trim());
      if (formData.password) {
        uploadData.append("password", formData.password);
        uploadData.append("confirmPassword", formData.confirmPassword);
      }

      const { data } = await axios.put(
        "/api/user/update-profile",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully!");
        await fetchUser();
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
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
    setImagePreview(user?.image || "");
  };

  // Format Join Date
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  // Get display role label
  const getRoleBadge = () => {
    const role = user?.role || "user";
    if (role === "admin") {
      return (
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          Admin
        </span>
      );
    } else if (role === "owner") {
      return (
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
          Car Partner
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50">
        Customer
      </span>
    );
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-12 md:mt-16 min-h-[70vh] flex flex-col items-center w-full">
      <div className="max-w-2xl w-full text-black dark:text-white pb-16">
        <Title
          title="My Profile"
          subTitle="Manage your personal details, update profile picture, and maintain account security"
        />

        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSaveProfile}
          className="border border-borderColor rounded-xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6 mt-8 w-full"
        >
          {/* Profile Avatar Upload / Details Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-borderColor/50">
            <div className="relative group cursor-pointer flex-shrink-0">
              <label htmlFor="profile-photo" className="cursor-pointer block relative">
                <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-primary shadow-sm bg-light dark:bg-slate-800 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-extrabold text-primary">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <FaCamera className="text-lg" />
                  <span className="text-[8px] font-semibold uppercase tracking-wider mt-0.5">
                    Change
                  </span>
                </div>
              </label>
              <input
                type="file"
                id="profile-photo"
                accept="image/*"
                hidden
                onChange={handlePhotoChange}
              />
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name || "Anonymous User"}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{user?.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt size={10} /> Joined {joinDate}
                </span>
              </div>
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {getRoleBadge()}
                {user?.role === "owner" && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {user?.carsOwned?.length || 0} Cars Registered
                  </span>
                )}
              </div>
              {/* Dedicated Update Picture Trigger */}
              <div className="pt-2">
                <label
                  htmlFor="profile-photo"
                  className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-borderColor bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition inline-flex items-center gap-1.5"
                >
                  <FaCamera size={11} className="text-primary" /> Update Picture
                </label>
              </div>
            </div>
          </div>

          {/* Text Fields Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Full Name"
                  className="px-3 py-2 border border-borderColor rounded-md outline-none text-black dark:text-white bg-light/30 dark:bg-slate-800/20 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email Address"
                  className="px-3 py-2 border border-borderColor rounded-md outline-none text-black dark:text-white bg-light/30 dark:bg-slate-800/20 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Section (Only shown when editing) */}
            {isEditing && (
              <div className="border-t border-borderColor/40 pt-5 mt-4 space-y-4">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Change Password (Optional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col relative">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      New Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current"
                      className="px-3 py-2 border border-borderColor rounded-md outline-none text-black dark:text-white bg-light/30 dark:bg-slate-800/20 pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 bottom-2.5 text-xs font-semibold text-primary hover:text-primary-dull transition cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-type new password"
                      className="px-3 py-2 border border-borderColor rounded-md outline-none text-black dark:text-white bg-light/30 dark:bg-slate-800/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buttons Section */}
          <div className="pt-4 flex gap-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg font-semibold text-sm disabled:opacity-50 flex-1 flex items-center justify-center"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="cursor-pointer px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-all rounded-lg font-semibold text-sm flex-1"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="flex gap-4 w-full">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg font-semibold text-sm flex-1 flex items-center justify-center gap-1.5"
                >
                  <FaEdit size={12} /> Edit Profile Info
                </button>
              </div>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProfilePage;
