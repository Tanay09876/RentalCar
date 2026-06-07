import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FiSearch } from 'react-icons/fi'
import { FaTimes, FaIdCard, FaFileAlt, FaPhoneAlt, FaUser } from 'react-icons/fa'

const ManageBookings = () => {
  const { currency, axios, user } = useAppContext() // Include user from context

  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedBooking])

  const fetchBookings = async () => {
    if (!user) return
    try {
      const endpoint = user.role === "admin" ? "/api/bookings/admin" : "/api/bookings/owner";
      const { data } = await axios.get(endpoint);
      data.success ? setBookings(data.bookings) : toast.error(data.message);
      setLoading(false)
    } catch (error) {
      toast.error(error.message);
      setLoading(false)
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
      if (data.success) {
        toast.success(data.message)
        fetchBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [user])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.model?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage)

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      {/* Search & Filters */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-4'>
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
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="border border-borderColor rounded-md px-3 py-2 text-sm w-full md:w-48
             text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="border border-borderColor rounded-md px-3 py-2 text-sm w-full md:w-48
             text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
        </select>
      </div>

      {/* Table */}
      <div className='hidden md:block w-full overflow-x-auto rounded-md border border-borderColor'>
        <table className='w-full min-w-[900px] border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Verification</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking, index) => (
                <tr key={index} className='border-t border-borderColor text-gray-500'>
                  <td className='p-3 flex items-center gap-3'>
                    <img
                      src={booking.car?.image || booking.car?.images?.[0]}
                      alt={booking.car?.brand + ' ' + booking.car?.model}
                      className='h-12 w-12 rounded-md object-cover'
                    />
                    <p className='font-medium'>{booking.car?.brand} {booking.car?.model}</p>
                  </td>
                  <td className='p-3'>
                    {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                  </td>
                  <td className='p-3'>{currency}{booking.price}</td>
                  <td className='p-3'>
                    <span className='bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 border border-borderColor/30'>offline</span>
                  </td>
                  <td className='p-3'>
                    {booking.licenseNumber ? (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold rounded-md transition cursor-pointer"
                      >
                        View Details
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium">No Info</span>
                    )}
                  </td>
                  <td className='p-3'>
                    {booking.status === 'pending' ? (
                      <select
                        onChange={e => changeBookingStatus(booking._id, e.target.value)}
                        value={booking.status}
                        className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none bg-white dark:bg-slate-900 text-gray-800 dark:text-white'
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                        ? 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/40'
                        : 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40'
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentBookings.map((booking, index) => (
          <div key={index} className="border border-borderColor rounded-lg p-4 space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <img src={booking.car?.image || booking.car?.images?.[0]} alt="" className='h-14 w-14 rounded-md object-cover' />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{booking.car?.brand} {booking.car?.model}</p>
                <p className="text-xs text-gray-500">{booking.pickupDate.split('T')[0]} - {booking.returnDate.split('T')[0]}</p>
              </div>
            </div>
            <p className="text-sm"><strong>Total:</strong> {currency}{booking.price}</p>
            <p className="text-sm"><strong>Status:</strong> {booking.status}</p>
            {booking.licenseNumber && (
              <button
                onClick={() => setSelectedBooking(booking)}
                className="mt-2 w-full text-center py-1.5 border border-primary/20 text-primary text-xs font-semibold rounded-md hover:bg-primary/5 transition cursor-pointer"
              >
                View Verification Info
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
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
            className="px-3 py-1 border rounded-md disabled:opacity-50 border-borderColor"
          >
            Next
          </button>
        </div>
      </div>
      {selectedBooking && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-borderColor dark:border-slate-800 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl relative text-gray-800 dark:text-gray-100 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setSelectedBooking(null)}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-150 cursor-pointer z-10"
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="p-6 pb-4 border-b border-borderColor/40 dark:border-slate-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaIdCard className="text-primary" /> Customer Verification Details
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Booking ID: {selectedBooking._id}
            </p>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* Customer Account */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Customer Profile</h3>
              <div className="flex items-center gap-3 bg-light/50 dark:bg-slate-800/40 p-3 rounded-xl border border-borderColor/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  <FaUser size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBooking.user?.name || "N/A"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedBooking.user?.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <hr className="border-borderColor/30" />

            {/* Driving License */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Driving License</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">License Number</span>
                  <p className="text-sm font-semibold mt-0.5">{selectedBooking.licenseNumber || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Expiry Date</span>
                  <p className="text-sm font-semibold mt-0.5">
                    {selectedBooking.licenseExpiry
                      ? new Date(selectedBooking.licenseExpiry).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={selectedBooking.licenseDocument}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold rounded-lg transition"
                >
                  <FaFileAlt size={12} /> View License Document
                </a>
              </div>
            </div>

            <hr className="border-borderColor/30" />

            {/* Government ID */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Government ID</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">ID Type</span>
                  <p className="text-sm font-semibold mt-0.5">{selectedBooking.govtIdType || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">ID Number</span>
                  <p className="text-sm font-semibold mt-0.5">{selectedBooking.govtIdNumber || "N/A"}</p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={selectedBooking.govtIdDocument}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold rounded-lg transition"
                >
                  <FaFileAlt size={12} /> View ID Document
                </a>
              </div>
            </div>

            <hr className="border-borderColor/30" />

            {/* Emergency Contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Contact Name</span>
                  <p className="text-sm font-semibold mt-0.5">{selectedBooking.emergencyContactName || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Contact Phone</span>
                  <p className="text-sm font-semibold mt-0.5 flex items-center gap-1.5">
                    <FaPhoneAlt size={10} className="text-gray-400" /> {selectedBooking.emergencyContactPhone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-borderColor/40 dark:border-slate-800 flex bg-gray-50/50 dark:bg-slate-900/40">
            <button
              onClick={() => setSelectedBooking(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-lg text-sm transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}

export default ManageBookings
