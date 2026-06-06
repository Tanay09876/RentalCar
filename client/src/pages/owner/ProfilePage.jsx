import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { FaUser, FaEnvelope, FaLock, FaKey, FaShieldAlt } from "react-icons/fa";

const ProfilePage = () => {
  const { user, fetchUser, axios } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load user details into form
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  }, [user]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleSaveProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      return toast.error("Name and email are required.");
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);
      const { name, email, password, confirmPassword } = formData;

      const { data } = await axios.put(
        "/api/user/update-profile",
        { name, email, password, confirmPassword }
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
  };

  // Get display role
  const getRoleBadge = () => {
    const role = user?.role || "customer";
    if (role === "admin") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          Admin
        </span>
      );
    } else if (role === "owner") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
          Owner
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900/50">
        Customer
      </span>
    );
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Banner Section */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
          <div className="absolute right-6 top-6 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs text-white font-medium border border-white/25">
            Manage Account
          </div>
        </div>

        {/* Profile Info Overlay Header */}
        <div className="px-6 md:px-10 pb-8 pt-4 relative border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20 sm:-mt-16">
            {/* Initial Avatar */}
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg border-4 border-white dark:border-slate-900">
              {userInitial}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.name || "Anonymous User"}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </span>
                {getRoleBadge()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-10">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaShieldAlt className="text-blue-500" />
              Account Credentials & Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-100 transition duration-200"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-200 font-medium">
                    {user?.name || "Not set"}
                  </div>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Email Address
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-100 transition duration-200"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-200 font-medium">
                    {user?.email || "Not set"}
                  </div>
                )}
              </div>
            </div>

            {/* Password Section */}
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-4 border-t border-gray-100 dark:border-slate-800/60 space-y-4"
              >
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Change Password (Optional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Leave blank to keep current"
                        className="w-full pl-11 pr-16 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-100 transition duration-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-500 hover:text-blue-600 transition"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-type new password"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-100 transition duration-200 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  Password
                </label>
                <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-400 dark:text-gray-500 font-medium">
                  ••••••••
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t border-gray-100 dark:border-slate-800/60">
              {isEditing ? (
                <>
                  <button
                    disabled={loading}
                    onClick={handleSaveProfile}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    disabled={loading}
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
