// // src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);

  // 🌙 Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
        setIsAdmin(data.user.role === 'admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
      navigate('/');
    }
  };

  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars');
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
    setIsAdmin(false);
    axios.defaults.headers.common['Authorization'] = '';
    toast.success('You have been logged out');
    navigate('/');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    fetchCars();
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;
      fetchUser();
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        axios, navigate, currency, token, setToken,
        user, setUser, isOwner, setIsOwner, isAdmin, setIsAdmin,
        fetchUser, showLogin, setShowLogin, logout,
        fetchCars, cars, setCars, pickupDate, setPickupDate, returnDate, setReturnDate,
        darkMode, toggleDarkMode, // 🌙 provide dark mode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
