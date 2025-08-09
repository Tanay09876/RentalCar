import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const ProfilePage = () => {
  const { user, axios, fetchUser } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      return toast.error("Name and email are required.");
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      if (image) {
        const imgForm = new FormData();
        imgForm.append("image", image);
        const { data: imgRes } = await axios.post("/api/user/update-image", imgForm);
        if (!imgRes.success) return toast.error("Image upload failed.");
        toast.success("Avatar updated");
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };

      const { data } = await axios.put("/api/user/update-profile", payload);
      if (data.success) {
        toast.success(data.message);
        fetchUser();
        setIsEditing(false);
        setImage(null);
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImage(null);
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

      <div className="flex justify-center">
        <label htmlFor="avatar-upload" className="relative group cursor-pointer">
          <img
            src={
              image ? URL.createObjectURL(image) : user?.image || assets.default_avatar
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />
          {isEditing && (
            <>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:flex hidden items-center justify-center rounded-full">
                <img src={assets.edit_icon} alt="edit" className="w-6 h-6" />
              </div>
            </>
          )}
        </label>
      </div>

      <div className="space-y-5">
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
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
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