import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import heroVideo from '../assets/videos/hero-bg.mp4' 

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`)
  }

  return (
    <div className="relative w-full h-screen  pb-20 overflow-hidden">

      {/* 🔹 Background Video using import */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="https://videos.pexels.com/video-files/1572321/1572321-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Optional Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

      {/* 🔹 Foreground Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 h-full flex flex-col items-center justify-center gap-14 text-white text-center px-4"
      >
    <motion.h1
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="text-4xl md:text-5xl font-semibold drop-shadow-lg text-white"
>
  Luxury cars on Rent
</motion.h1>

<motion.form
  initial={{ scale: 0.95, opacity: 0, y: 50 }}
  animate={{ scale: 1, opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  onSubmit={handleSearch}
  className="w-full max-w-5xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] rounded-xl md:rounded-full p-6 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 mx-auto"
>
  {/* Form Fields */}
  <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center text-center md:text-left">
    {/* Pickup Location */}
    <div className="flex flex-col items-center md:items-start w-full max-w-xs text-black">
      <select
        required
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
        className="w-full px-4 py-2 "
      >
        <option value="">Pickup Location</option>
        {cityList.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <p className="px-1 text-sm text-gray-500 mt-1">
        {pickupLocation ? pickupLocation : "Please select location"}
      </p>
    </div>

    {/* Pickup Date */}
    <div className="flex flex-col items-center md:items-start w-full max-w-xs text-black">
      <label htmlFor="pickup-date" className="text-sm font-medium">Pick-up Date</label>
      <input
        value={pickupDate}
        onChange={(e) => setPickupDate(e.target.value)}
        type="date"
        id="pickup-date"
        min={new Date().toISOString().split("T")[0]}
        className="w-full px-4 py-2  text-sm text-gray-700"
        required
      />
    </div>

    {/* Return Date */}
    <div className="flex flex-col items-center md:items-start w-full max-w-xs text-black">
      <label htmlFor="return-date" className="text-sm font-medium">Return Date</label>
      <input
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
        type="date"
        id="return-date"
        className="w-full px-4 py-2  text-sm text-gray-700"
        required
      />
    </div>
  </div>

  {/* Search Button */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-full"
  >
    <img src={assets.search_icon} alt="search" className="w-4 h-4 brightness-200" />
    Search
  </motion.button>
</motion.form>

      </motion.div>
    </div>
  )
}

export default Hero


 
      