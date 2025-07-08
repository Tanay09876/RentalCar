import React, { useState, useEffect } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { FaSun, FaMoon } from 'react-icons/fa'

const Navbar = () => {
  const { setShowLogin, user, isOwner, axios, setIsOwner } = useAppContext()
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const navigate = useNavigate()

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [darkMode])

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role')
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='navbar flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-borderColor bg-white dark:bg-bg transition-all relative z-50'
    >
      {/* Logo */}
      <Link to='/'>
        <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt='logo' className='h-8' />
      </Link>

      {/* Desktop Menu */}
      <div className='hidden sm:flex items-center gap-6'>
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className='font-medium hover:text-primary dark:hover:text-primary transition '
          >
            {link.name}
          </Link>
        ))}

        {/* Owner / Dashboard */}
        <button
          onClick={() => (isOwner ? navigate('/owner') : changeRole())}
          className='font-medium hover:text-primary dark:hover:text-primary transition '
        >
          {isOwner ? 'Dashboard' : 'List cars'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label='Toggle Theme'
          className='p-2 rounded-md border border-borderColor bg-transparent text-primary'
        >
          {darkMode ? <FaMoon size={18} /> : <FaSun size={18} />}
        </button>

        {/* Login */}
        {!user && (
          <button
            onClick={() => setShowLogin(true)}
            className='cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Theme Toggle & Menu Icon */}
      <div className='sm:hidden flex items-center gap-3 z-[60]'>
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label='Toggle Theme'
          className='p-2 rounded-md border border-borderColor text-primary'
        >
          {darkMode ? <FaMoon size={18} /> : <FaSun size={18} />}
        </button>

        {/* Mobile Menu Toggle using single img */}
        <button
          className='sm:hidden cursor-pointer'
          aria-label='Menu'
          onClick={() => setOpen(!open)}
        >
          <img
            src={open ? assets.close_icon : assets.menu_icon}
            alt='menu'
            className='w-6 h-6 object-contain'
          />
        </button>
      </div>

      {/* Mobile Slide-In Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-[80%] p-6 z-50 duration-300 ease-in-out 
        flex flex-col gap-6 border-l border-borderColor
        bg-white dark:bg-black text-black dark:text-white transition-colors
        ${open ? 'translate-x-0' : 'translate-x-full'} sm:hidden`}
      >
        <div className='pt-20 flex flex-col gap-6'>
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className='font-medium hover:text-primary dark:hover:text-primary transition'
            >
              {link.name}
            </Link>
          ))}

          {/* Owner / Dashboard */}
          <button
            onClick={() => {
              setOpen(false)
              isOwner ? navigate('/owner') : changeRole()
            }}
            className='font-medium hover:text-primary dark:hover:text-primary transition text-start'
          >
            {isOwner ? 'Dashboard' : 'List cars'}
          </button>

          {/* Login */}
          {!user && (
            <button
              onClick={() => {
                setShowLogin(true)
                setOpen(false)
              }}
              className='cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'
            >
              Login
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Navbar
