import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  IconButton,
  Tooltip
} from '@mui/material';
import { InfoOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "forgot") {
        const { data } = await axios.post('/api/user/send-otp', { email });
        toast.success(data.message);
        setState('otp');
      } else if (state === "otp") {
        const { data } = await axios.post('/api/user/verify-otp', { email, otp, newPassword });
        toast.success(data.message);
        setState('login');
      } else {
        if (state === "register") {
          if (!name || !email || !password) {
            toast.error("Please fill in all the fields");
            return;
          }
          if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
          }
        }

        const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

        if (data.success) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          setShowLogin(false);

          // Important: Pass token explicitly to fetch role
          const userRes = await axios.get('/api/user/data', {
            headers: { Authorization: `Bearer ${data.token}` }
          });

          const userRole = userRes?.data?.user?.role;

          if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/owner');
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Auth error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-100 flex items-center justify-center text-sm text-gray-600 bg-black/50 px-4"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 w-[90%] max-w-sm items-start p-6 sm:p-8 py-10 sm:py-12 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-xl sm:text-2xl font-medium m-auto">
          {state === "register" && <><span className="text-primary">User</span> Sign Up</>}
          {state === "login" && <><span className="text-primary">User</span> Login</>}
          {state === "forgot" && <>Forgot <span className="text-primary">Password</span></>}
          {state === "otp" && <>Verify <span className="text-primary">OTP</span></>}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <div className="relative">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 pr-10 outline-primary"
              type="email"
              required
            />
            <Tooltip title="Use valid email for login & OTP." arrow placement="top">
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', zIndex: 10 }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {(state === "login" || state === "register") && (
          <div className="w-full">
            <p>Password</p>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 pr-10 outline-primary"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
              />
              <IconButton
                size="small"
                onClick={() => setShowPassword((prev) => !prev)}
                sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', zIndex: 10 }}
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </div>
          </div>
        )}

        {state === "otp" && (
          <>
            <div className="w-full">
              <p>OTP</p>
              <input
                onChange={(e) => setOTP(e.target.value)}
                value={otp}
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                required
              />
            </div>
            <div className="w-full">
              <p>New Password</p>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                type="password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                required
              />
            </div>
          </>
        )}

        {state === "register" && (
          <p>Already have account? <span className="text-primary cursor-pointer" onClick={() => setState("login")}>Login</span></p>
        )}
        {state === "login" && (
          <div className="w-full flex justify-between text-sm">
            <span>New user? <span className="text-primary cursor-pointer" onClick={() => setState("register")}>Sign Up</span></span>
            <span className="text-primary cursor-pointer" onClick={() => setState("forgot")}>Forgot Password?</span>
          </div>
        )}
        {(state === "forgot" || state === "otp") && (
          <p className="text-primary cursor-pointer" onClick={() => setState("login")}>Back to Login</p>
        )}

        <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {{
            login: "Login",
            register: "Create Account",
            forgot: "Send OTP",
            otp: "Reset Password"
          }[state]}
        </button>
      </form>
    </div>
  );
};

export default Login;
