// import React, { useEffect, useState } from 'react'
// import { assets} from '../assets/assets'
// import Title from '../components/Title'
// import { useAppContext } from '../context/AppContext'
// import toast from 'react-hot-toast'
// import { motion } from 'motion/react'

// const MyBookings = () => {

//   const { axios, user, currency } = useAppContext()

//   const [bookings, setBookings] = useState([])

//   const fetchMyBookings = async ()=>{
//     try {
//       const { data } = await axios.get('/api/bookings/user')
//       if (data.success){
//         setBookings(data.bookings)
//       }else{
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=>{
//     user && fetchMyBookings()
//   },[user])

//   return (
//     <motion.div 
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6 }}
    
//     className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>

//       <Title title='My Bookings'
//        subTitle='View and manage your all car bookings'
//        align="left"/>

//        <div>
//         {bookings.map((booking, index)=>(
//           <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.1, duration: 0.4 }}
          
//           key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
//             {/* Car Image + Info */}

//             <div className='md:col-span-1'>
//               <div className='rounded-md overflow-hidden mb-3'>
//                 <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
//               </div>
//               <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>

//               <p className='text-gray-500'>{booking.car.year} • {booking.car.category} • {booking.car.location}</p>
//             </div>

//             {/* Booking Info */}
//             <div className='md:col-span-2'>
//               <div className='flex items-center gap-2'>
//                 <p className='px-3 py-1.5 bg-light rounded'>Booking #{index+1}</p>
//                 <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
//               </div>

//               <div className='flex items-start gap-2 mt-3'>
//                 <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
//                 <div>
//                   <p className='text-gray-500'>Rental Period</p>
//                   <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
//                 </div>
//               </div>

//               <div className='flex items-start gap-2 mt-3'>
//                 <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
//                 <div>
//                   <p className='text-gray-500'>Pick-up Location</p>
//                   <p>{booking.car.location}</p>
//                 </div>
//               </div>
//             </div>

//            {/* Price */}
//            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
//               <div className='text-sm text-gray-500 text-right'>
//                 <p>Total Price</p>
//                 <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
//                 <p>Booked on {booking.createdAt.split('T')[0]}</p>
//               </div>
//            </div>


//           </motion.div>
//         ))}
//        </div>
      
//     </motion.div>
//   )
// }

// export default MyBookings



import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {
  const { axios, user, currency, fetchCars } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Cancel booking
  const handleCancelBooking = async (id) => {
    try {
      const { data } = await axios.put(`/api/bookings/${id}/cancel`)
      if (data.success) {
        toast.success('Booking cancelled successfully')
        fetchMyBookings()
        fetchCars() // Update global cars listing instantly
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage your all car bookings"
        align="left"
      />

      <div className="space-y-6">
        {bookings.map((booking, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor dark:border-slate-800 rounded-lg mt-5 first:mt-12 bg-white dark:bg-slate-900 shadow-sm"
          >
            {/* Car Image + Info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking.car?.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300"}
                  alt=""
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100">
                {booking.car ? `${booking.car.brand} ${booking.car.model}` : "Car Removed"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {booking.car ? `${booking.car.year} • ${booking.car.category} • ${booking.car.location}` : "Unavailable"}
              </p>
            </div>

            {/* Booking Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded font-medium">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                  }`}
                >
                  {booking.status}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-4">
                <img
                  src={assets.calendar_icon_colored}
                  alt=""
                  className="w-4.5 h-4.5 mt-0.5"
                />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Rental Period</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {booking.pickupDate.split('T')[0]} To{' '}
                    {booking.returnDate.split('T')[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  alt=""
                  className="w-4.5 h-4.5 mt-0.5"
                />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Pick-up Location</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{booking.car?.location || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Price + Cancel Button */}
            <div className="md:col-span-1 flex flex-col justify-between items-end gap-6 text-right w-full">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="text-xs">Total Price</p>
                <h1 className="text-2xl font-bold text-primary dark:text-blue-400 mt-0.5">
                  {currency}
                  {booking.price}
                </h1>
                <p className="text-[11px] text-gray-400 mt-1">Booked on {booking.createdAt.split('T')[0]}</p>
              </div>

              {(booking.status === 'confirmed' || booking.status === 'pending') && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="w-full md:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md shadow-sm hover:shadow transition-all duration-200"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default MyBookings
