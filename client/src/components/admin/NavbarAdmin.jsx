
import React, { useState, useEffect } from "react";
import { assets, adminMenuLinks } from "../../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { Avatar, Drawer, IconButton } from "@mui/material";

const NavbarAdmin = () => {
  const { user, logout, axios, fetchUser } = useAppContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [image, setImage] = useState("");
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data } = await axios.post("/api/admin/update-image", formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Insert Users into Menu Links (after Dashboard)
  const updatedLinks = [...adminMenuLinks];
  const dashboardIndex = updatedLinks.findIndex((l) => l.name === "Dashboard");
  updatedLinks.splice(dashboardIndex + 1, 0, {
    name: "Users",
    path: "/admin/users",
    icon: <FaUserCircle size={18} />,
    coloredIcon: <FaUserCircle size={18} color="var(--color-primary)" />
  });



  const drawerContent = (
    <div
      className="flex flex-col min-h-screen w-full px-4 py-6 text-sm border-l"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        borderColor: "var(--color-borderColor)",
      }}
    >
      <div className="group relative w-fit mx-auto text-center">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"
            }
            alt="user"
            className="h-14 w-14 rounded-full mx-auto cursor-pointer"
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/10 rounded-full cursor-pointer">
            <img src={assets.edit_icon} alt="edit" />
          </div>
        </label>
      </div>
      <div className="group relative w-fit mx-auto text-center">
        <p className="mt-2 text-sm font-medium" style={{ color: "var(--color-text)" }}>
          {user?.username || user?.name || "Owner"}
        </p>
      </div>

      {image && (
        <div
          onClick={updateImage}
          className="flex justify-center mt-2 text-xs gap-1 items-center px-2 py-1 rounded cursor-pointer"
          style={{
            backgroundColor: "var(--color-primary-dull)",
            color: "white",
          }}
        >
          Save <img src={assets.check_icon} width={13} alt="check" />
        </div>
      )}

      <div className="w-full mt-6 space-y-1">
        {updatedLinks.map((link, index) => {
          const isActive = link.path === location.pathname;
          return (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
              className={`relative flex items-center gap-3 w-full py-3 pl-4 first:mt-6 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {/* Use icon element directly for Profile, or image for others */}
              {typeof link.icon === "string" ? (
                <img src={isActive ? link.coloredIcon : link.icon} alt="icon" />
              ) : (
                <span>{isActive ? link.coloredIcon : link.icon}</span>
              )}
              <span>{link.name}</span>
              {isActive && (
                <div className="bg-primary w-1.5 h-8 rounded-l absolute right-0"></div>
              )}
            </NavLink>
          );
        })}

        <div
          onClick={() => {
            logout();
            setDrawerOpen(false);
          }}
          className="flex items-center gap-3 w-full py-3 pl-4 cursor-pointer mt-6"
          style={{ color: "var(--color-text)" }}
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="flex items-center justify-between px-6 md:px-10 py-4 border-b relative transition-all"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-borderColor)",
        }}
      >
        <Link to="/">
          <img src={assets.logo} alt="logo" className="h-7" />
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md border bg-transparent"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-borderColor)",
            }}
            aria-label="Toggle Theme"
          >
            {darkMode ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>

          <IconButton onClick={() => setDrawerOpen(true)} size="small">
            <Avatar
              alt="User"
              src={user?.image || undefined}
              sx={{
                width: 32,
                height: 32,
                bgcolor: !user?.image ? "primary.main" : "transparent",
                color: !user?.image ? "white" : undefined,
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {!user?.image &&
                (user?.username?.[0]?.toUpperCase() ||
                  user?.name?.[0]?.toUpperCase() ||
                  "U")}
            </Avatar>
          </IconButton>
        </div>
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
export default NavbarAdmin;
