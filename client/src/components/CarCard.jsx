import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`)
        scrollTo(0, 0)
      }}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer bg-white dark:bg-gray-900 text-black dark:text-white"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt="Car Image"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {car.isAvaliable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-sm text-white/80"> / day</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="w-full">
            <h3 className="text-lg font-medium flex items-center justify-between gap-2">
              <span>{car.brand} {car.model}</span>
              {car.rating > 0 && (
                <span className="flex items-center text-xs font-semibold text-yellow-500 gap-0.5 bg-yellow-400/10 px-2 py-0.5 rounded-full shrink-0">
                  <FaStar size={10} /> {car.rating.toFixed(1)}
                </span>
              )}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{car.category} • {car.year}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600 dark:text-gray-300">
          <div className="flex items-center text-sm">
            <img src={assets.users_icon} alt="" className="h-4 mr-2 invert dark:invert-0" />
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className="flex items-center text-sm">
            <img src={assets.fuel_icon} alt="" className="h-4 mr-2 invert dark:invert-0" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center text-sm">
            <img src={assets.car_icon} alt="" className="h-4 mr-2 invert dark:invert-0" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center text-sm">
            <img src={assets.location_icon} alt="" className="h-4 mr-2 invert dark:invert-0" />
            <span>{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
