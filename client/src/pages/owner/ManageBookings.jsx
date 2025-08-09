import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FiSearch } from 'react-icons/fi'

const ManageBookings = () => {
  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  // Filter by search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage)

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      {/* Search & Filters */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-4'>
        {/* Search bar */}
        <div className='relative w-full md:w-1/3'>
          <input
            type="text"
            placeholder="Search by car brand or model..."
            className="w-full py-2 pl-10 pr-4 rounded-md border border-borderColor text-sm outline-none text-gray-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
          <FiSearch className="absolute top-1/2 left-1 -translate-y-1/2 text-gray-500" size={18} />
        </div>

        {/* Status dropdown */}
       <select
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }}
  className="border border-borderColor rounded-md px-3 py-2 text-sm w-48
              text-gray-700
             dark:bg-gray-900 dark:text-white dark:border-gray-600
             dark:[color-scheme:dark]"
>
  <option className="bg-white text-gray-700 dark:bg-gray-900 dark:text-white" value="all">All Status</option>
  <option className="bg-white text-gray-700 dark:bg-gray-900 dark:text-white" value="pending">Pending</option>
  <option className="bg-white text-gray-700 dark:bg-gray-900 dark:text-white" value="confirmed">Confirmed</option>
  <option className="bg-white text-gray-700 dark:bg-gray-900 dark:text-white" value="cancelled">Cancelled</option>
</select>

<select
  value={rowsPerPage}
  onChange={(e) => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }}
  className="border border-borderColor rounded-md px-3 py-2 text-sm w-48
             text-gray-700
             dark:bg-gray-900 dark:text-white dark:border-gray-600
             dark:[color-scheme:dark]"
>
  <option className="bg-white text-gray-700 dark:bg-gray-900 dark:text-white" value={5}>5 rows</option>
  <option className="bg-white text-gray-700 dark:bg-gray-900 dark:text-white" value={10}>10 rows</option>
  <option className="bg-white text-gray-700 dark:bg-gray-900 dark:text-white" value={20}>20 rows</option>
</select>

      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto rounded-md border border-borderColor'>
        <table className='w-full min-w-[900px] border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking, index) => (
                <tr key={index} className='border-t border-borderColor text-gray-500'>
                  <td className='p-3 flex items-center gap-3'>
                    <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                    <p className='font-medium'>{booking.car.brand} {booking.car.model}</p>
                  </td>
                  <td className='p-3'>
                    {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                  </td>
                  <td className='p-3'>{currency}{booking.price}</td>
                  <td className='p-3'>
                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                  </td>
                  <td className='p-3'>
                    {booking.status === 'pending' ? (
                      <select
                        onChange={e => changeBookingStatus(booking._id, e.target.value)}
                        value={booking.status}
                        className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-500'
                        : 'bg-red-100 text-red-500'
                        }`}>
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, filteredBookings.length)} of {filteredBookings.length} bookings
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 border-borderColor"
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50  border-borderColor"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageBookings



// import React, { useEffect, useState } from 'react'
// import Title from '../../components/owner/Title'
// import { useAppContext } from '../../context/AppContext'
// import toast from 'react-hot-toast'

// const ManageBookings = () => {

//   const { currency, axios } = useAppContext()

//   const [bookings, setBookings] = useState([])

//   const fetchOwnerBookings = async ()=>{
//     try {
//       const { data } = await axios.get('/api/bookings/owner')
//       data.success ? setBookings(data.bookings) : toast.error(data.message)
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const changeBookingStatus = async (bookingId, status)=>{
//     try {
//       const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
//       if(data.success){
//         toast.success(data.message)
//         fetchOwnerBookings()
//       }else{
//         toast.error(data.message)
//       }
      
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=>{
//     fetchOwnerBookings()
//   },[])

//   return (
//     <div className='px-4 pt-10 md:px-10 w-full'>
      
//       <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

//       <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

//         <table className='w-full border-collapse text-left text-sm text-gray-600'>
//           <thead className='text-gray-500'>
//             <tr>
//               <th className="p-3 font-medium">Car</th>
//               <th className="p-3 font-medium max-md:hidden">Date Range</th>
//               <th className="p-3 font-medium">Total</th>
//               <th className="p-3 font-medium max-md:hidden">Payment</th>
//               <th className="p-3 font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.map((booking, index)=>(
//               <tr key={index} className='border-t border-borderColor text-gray-500'>

//                 <td className='p-3 flex items-center gap-3'>
//                   <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
//                   <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
//                 </td>

//                 <td className='p-3 max-md:hidden'>
//                   {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
//                 </td>

//                 <td className='p-3'>{currency}{booking.price}</td>

//                 <td className='p-3 max-md:hidden'>
//                   <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
//                 </td>

//                 <td className='p-3'>
//                   {booking.status === 'pending' ? (
//                     <select onChange={e=> changeBookingStatus(booking._id, e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'>
//                       <option value="pending">Pending</option>
//                       <option value="cancelled">Cancelled</option>
//                       <option value="confirmed">Confirmed</option>
//                     </select>
//                   ): (
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>{booking.status}</span>
//                   )}
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>

//       </div>

//     </div>
//   )
// }

// export default ManageBookings





