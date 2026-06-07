import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa'

const CarDetails = () => {
  const { id } = useParams()
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, token, fetchCars, user } = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY
  
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [licenseNumber, setLicenseNumber] = useState("")
  const [licenseExpiry, setLicenseExpiry] = useState("")
  const [licenseFile, setLicenseFile] = useState(null)
  const [govtIdType, setGovtIdType] = useState("Aadhar")
  const [govtIdNumber, setGovtIdNumber] = useState("")
  const [govtIdFile, setGovtIdFile] = useState(null)
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateFields = () => {
    const tempErrors = {}
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

    // 1. License Number
    const cleanLicense = licenseNumber.trim()
    if (!cleanLicense) {
      tempErrors.licenseNumber = "License number is required."
    } else if (cleanLicense.length < 5 || cleanLicense.length > 30 || !/^[A-Za-z0-9\-\s]+$/.test(cleanLicense)) {
      tempErrors.licenseNumber = "License number must be 5-30 characters (alphanumeric, spaces, or hyphens)."
    }

    // 2. License Expiry
    if (!licenseExpiry) {
      tempErrors.licenseExpiry = "License expiry date is required."
    } else {
      const expiryDateObj = new Date(licenseExpiry)
      const returnDateObj = new Date(returnDate)
      if (expiryDateObj < returnDateObj) {
        tempErrors.licenseExpiry = "Driving license must be valid until at least the return date."
      }
    }

    // 3. License File
    if (!licenseFile) {
      tempErrors.licenseFile = "Driving license document file copy is required."
    } else {
      if (!validTypes.includes(licenseFile.type)) {
        tempErrors.licenseFile = "Format must be an image (JPEG/PNG/WEBP) or a PDF."
      } else if (licenseFile.size > 5 * 1024 * 1024) {
        tempErrors.licenseFile = "File copy size must be less than 5MB."
      }
    }

    // 4. Government ID Number
    const cleanGovtIdNum = govtIdNumber.trim()
    if (!cleanGovtIdNum) {
      tempErrors.govtIdNumber = "Government ID number is required."
    } else {
      if (govtIdType === "Aadhar" && !/^\d{12}$/.test(cleanGovtIdNum)) {
        tempErrors.govtIdNumber = "Aadhar Card number must be exactly 12 digits."
      } else if (govtIdType === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(cleanGovtIdNum)) {
        tempErrors.govtIdNumber = "PAN Card number must be in standard format (e.g., ABCDE1234F)."
      } else if (govtIdType === "Passport" && !/^[A-Z][0-9]{7,8}$/i.test(cleanGovtIdNum)) {
        tempErrors.govtIdNumber = "Passport number must start with a letter followed by 7 or 8 digits."
      } else if (govtIdType === "Voter ID" && !/^[A-Z0-9]{10}$/i.test(cleanGovtIdNum)) {
        tempErrors.govtIdNumber = "Voter ID number must be exactly 10 alphanumeric characters."
      } else if (cleanGovtIdNum.length < 4 || cleanGovtIdNum.length > 25 || !/^[A-Z0-9\-\s]+$/i.test(cleanGovtIdNum)) {
        tempErrors.govtIdNumber = "Government ID number must be between 4 and 25 characters."
      }
    }

    // 5. Govt ID File
    if (!govtIdFile) {
      tempErrors.govtIdFile = "Government ID document file copy is required."
    } else {
      if (!validTypes.includes(govtIdFile.type)) {
        tempErrors.govtIdFile = "Format must be an image (JPEG/PNG/WEBP) or a PDF."
      } else if (govtIdFile.size > 5 * 1024 * 1024) {
        tempErrors.govtIdFile = "File copy size must be less than 5MB."
      }
    }

    // 6. Emergency Name
    const cleanEmergencyName = emergencyName.trim()
    if (!cleanEmergencyName) {
      tempErrors.emergencyName = "Emergency contact name is required."
    } else if (cleanEmergencyName.length < 2 || cleanEmergencyName.length > 50 || !/^[A-Za-z\s\.]+$/.test(cleanEmergencyName)) {
      tempErrors.emergencyName = "Name must be 2-50 characters and contain only letters."
    } else if (user && cleanEmergencyName.toLowerCase() === user.name.toLowerCase()) {
      tempErrors.emergencyName = "Emergency contact name cannot be your own name."
    }

    // 7. Emergency Phone
    const cleanEmergencyPhone = emergencyPhone.trim()
    const numericPhone = cleanEmergencyPhone.replace(/[\s\-\(\)\+]/g, "")
    if (!cleanEmergencyPhone) {
      tempErrors.emergencyPhone = "Emergency contact phone number is required."
    } else if (numericPhone.length !== 10 || !/^\d+$/.test(numericPhone)) {
      tempErrors.emergencyPhone = "Phone number must be exactly 10 digits."
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const submitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment")
      return
    }
    try {
      const { data } = await axios.post(`/api/user/cars/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      })
      if (data.success) {
        toast.success(data.message)
        setReviewComment("")
        setReviewRating(5)
        fetchCars() // Refresh local car reviews
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error("Please log in to book a car")
      return
    }
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates")
      return
    }
    if (new Date(returnDate) < new Date(pickupDate)) {
      toast.error("Return date must be at or after pickup date")
      return
    }
    setErrors({}) // Clear past error states
    setShowModal(true)
  }

  const handleConfirmBooking = async (e) => {
    e.preventDefault()

    const isValid = validateFields()
    if (!isValid) {
      return
    }

    try {
      setBookingLoading(true)
      const fd = new FormData()
      fd.append('bookingData', JSON.stringify({
        car: id,
        pickupDate,
        returnDate,
        licenseNumber,
        licenseExpiry,
        govtIdType,
        govtIdNumber,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone
      }))
      fd.append('licenseDocument', licenseFile)
      fd.append('govtIdDocument', govtIdFile)

      const { data } = await axios.post('/api/bookings/create', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        toast.success(data.message || "Booking Created Successfully!")
        setShowModal(false)
        navigate('/my-bookings')
      } else {
        toast.error(data.message || "Booking creation failed")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setBookingLoading(false)
    }
  }

  useEffect(() => {
    setCar(cars.find((car) => car._id === id))
  }, [cars, id])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-black dark:text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 dark:text-gray-400 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car Image & Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <motion.img
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={car.image}
            alt=""
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl font-bold car-title flex flex-wrap items-center gap-3">
                {car.brand} {car.model}
                {car.rating > 0 && (
                  <span className="flex items-center text-sm font-semibold text-yellow-500 gap-0.5 bg-yellow-400/10 px-2 py-0.5 rounded-full mt-1 sm:mt-0">
                    <FaStar size={13} /> {car.rating.toFixed(1)}
                  </span>
                )}
              </h1>

              <p className="text-gray-500 dark:text-gray-400 text-lg">{car.category} • {car.year}</p>
            </div>
            <hr className="border-borderColor dark:border-gray-600 my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={text}
                  className="flex flex-col items-center bg-light dark:bg-gray-800 p-4 rounded-lg text-black dark:text-white"
                >
                  <img src={icon} alt="" className="h-5 mb-2 invert dark:invert-0" />
                  {text}
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className="text-xl font-medium mb-3 car-description">Description</h1>
              <p className="text-gray-500 dark:text-gray-400">{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className="text-xl font-medium mb-3 car-feature">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500 dark:text-gray-400">
                    <img src={assets.check_icon} className="h-4 mr-2 invert dark:invert-0" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-borderColor dark:border-gray-600 pt-6 space-y-6">
              <h2 className="text-xl font-medium car-feature flex items-center gap-2">
                Reviews ({car.reviews?.length || 0})
                {car.rating > 0 && (
                  <span className="flex items-center text-sm font-semibold text-yellow-500 gap-0.5 ml-2">
                    <FaStar /> {car.rating.toFixed(1)}
                  </span>
                )}
              </h2>

              {/* Review Form */}
              {token ? (
                <div className="p-4 bg-light dark:bg-gray-800/80 rounded-xl space-y-4">
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Leave a Review</h3>
                  
                  {/* Star Rating Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-lg text-yellow-500 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                        >
                          {star <= reviewRating ? <FaStar /> : <FaRegStar />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment input */}
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience renting this car..."
                    className="w-full px-3 py-2 border border-borderColor dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm outline-none focus:ring-1 focus:ring-primary"
                  />

                  <button
                    type="button"
                    onClick={submitReview}
                    className="px-4 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Please log in to submit a review.</p>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {car.reviews && car.reviews.length > 0 ? (
                  car.reviews.map((rev, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl space-y-2 border border-gray-100 dark:border-slate-800">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                            {rev.userName ? rev.userName.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">{rev.userName}</p>
                            <p className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-semibold bg-yellow-400/10 px-2 py-0.5 rounded-full">
                          <FaStar size={11} /> {rev.rating}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 pl-10">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 dark:text-white font-semibold">
            {currency}{car.pricePerDay}
            <span className="text-base text-gray-400 dark:text-gray-400 font-normal">per day</span>
          </p>

          <hr className="border-borderColor dark:border-gray-600 my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pickup Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="border border-borderColor dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white dark:accent-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              required
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className="border border-borderColor dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white dark:accent-white"
            />
          </div>

          <button className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer">
            Book Now
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 border border-borderColor dark:border-slate-800 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl relative text-gray-800 dark:text-gray-100 overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-150 cursor-pointer z-10"
            >
              <FaTimes size={18} />
            </button>

            {/* Header (Static) */}
            <div className="p-6 pb-4 border-b border-borderColor/40 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Details</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Provide your verification details and copy of documents to complete your booking.
              </p>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleConfirmBooking} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
                {/* Driving License Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Driving License Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="licenseNumber">
                        License Number
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        value={licenseNumber}
                        onChange={(e) => {
                          setLicenseNumber(e.target.value);
                          setErrors(prev => ({ ...prev, licenseNumber: "" }));
                        }}
                        placeholder="DL-XXXXXXXXXXXX"
                        className={`w-full px-3 py-2 text-sm border ${errors.licenseNumber ? 'border-red-500 focus:ring-red-500' : 'border-borderColor dark:border-slate-700/80 focus:ring-primary'} rounded-lg bg-light dark:bg-slate-800 text-black dark:text-white outline-none focus:ring-1`}
                      />
                      {errors.licenseNumber && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.licenseNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="licenseExpiry">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        id="licenseExpiry"
                        min={new Date().toISOString().split('T')[0]}
                        value={licenseExpiry}
                        onChange={(e) => {
                          setLicenseExpiry(e.target.value);
                          setErrors(prev => ({ ...prev, licenseExpiry: "" }));
                        }}
                        className={`w-full px-3 py-2 text-sm border ${errors.licenseExpiry ? 'border-red-500 focus:ring-red-500' : 'border-borderColor dark:border-slate-700/80 focus:ring-primary'} rounded-lg bg-light dark:bg-slate-800 text-black dark:text-white outline-none focus:ring-1`}
                      />
                      {errors.licenseExpiry && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.licenseExpiry}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="licenseFile">
                      License Document Copy (Image/PDF)
                    </label>
                    <input
                      type="file"
                      id="licenseFile"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        setLicenseFile(e.target.files[0]);
                        setErrors(prev => ({ ...prev, licenseFile: "" }));
                      }}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {errors.licenseFile && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.licenseFile}</p>
                    )}
                  </div>
                </div>

                <hr className="border-borderColor dark:border-slate-800" />

                {/* Govt ID Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Government ID Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="govtIdType">
                        ID Type
                      </label>
                      <select
                        id="govtIdType"
                        value={govtIdType}
                        onChange={(e) => {
                          setGovtIdType(e.target.value);
                          setGovtIdNumber("");
                          setErrors(prev => ({ ...prev, govtIdNumber: "", govtIdType: "" }));
                        }}
                        className="w-full px-3 py-2 text-sm border border-borderColor dark:border-slate-700/80 rounded-lg bg-light dark:bg-slate-800 text-black dark:text-white outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Aadhar">Aadhar Card</option>
                        <option value="Passport">Passport</option>
                        <option value="PAN">PAN Card</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="govtIdNumber">
                        ID Number
                      </label>
                      <input
                        type="text"
                        id="govtIdNumber"
                        value={govtIdNumber}
                        onChange={(e) => {
                          setGovtIdNumber(e.target.value);
                          setErrors(prev => ({ ...prev, govtIdNumber: "" }));
                        }}
                        placeholder="Enter ID Number"
                        className={`w-full px-3 py-2 text-sm border ${errors.govtIdNumber ? 'border-red-500 focus:ring-red-500' : 'border-borderColor dark:border-slate-700/80 focus:ring-primary'} rounded-lg bg-light dark:bg-slate-800 text-black dark:text-white outline-none focus:ring-1`}
                      />
                      {errors.govtIdNumber && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.govtIdNumber}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="govtIdFile">
                      ID Document Copy (Image/PDF)
                    </label>
                    <input
                      type="file"
                      id="govtIdFile"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        setGovtIdFile(e.target.files[0]);
                        setErrors(prev => ({ ...prev, govtIdFile: "" }));
                      }}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {errors.govtIdFile && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.govtIdFile}</p>
                    )}
                  </div>
                </div>

                <hr className="border-borderColor dark:border-slate-800" />

                {/* Emergency Contact */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="emergencyName">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        id="emergencyName"
                        value={emergencyName}
                        onChange={(e) => {
                          setEmergencyName(e.target.value);
                          setErrors(prev => ({ ...prev, emergencyName: "" }));
                        }}
                        placeholder="Contact Name"
                        className={`w-full px-3 py-2 text-sm border ${errors.emergencyName ? 'border-red-500 focus:ring-red-500' : 'border-borderColor dark:border-slate-700/80 focus:ring-primary'} rounded-lg bg-light dark:bg-slate-800 text-black dark:text-white outline-none focus:ring-1`}
                      />
                      {errors.emergencyName && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.emergencyName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="emergencyPhone">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        id="emergencyPhone"
                        value={emergencyPhone}
                        onChange={(e) => {
                          setEmergencyPhone(e.target.value);
                          setErrors(prev => ({ ...prev, emergencyPhone: "" }));
                        }}
                        placeholder="Contact Phone"
                        className={`w-full px-3 py-2 text-sm border ${errors.emergencyPhone ? 'border-red-500 focus:ring-red-500' : 'border-borderColor dark:border-slate-700/80 focus:ring-primary'} rounded-lg bg-light dark:bg-slate-800 text-black dark:text-white outline-none focus:ring-1`}
                      />
                      {errors.emergencyPhone && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.emergencyPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="p-6 pt-4 border-t border-borderColor/40 dark:border-slate-800 flex gap-4 bg-gray-50/50 dark:bg-slate-900/40">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 bg-primary hover:bg-primary-dull text-white font-medium py-2.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer font-semibold"
                >
                  {bookingLoading ? "Verifying..." : "Confirm & Book"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={bookingLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  ) : (
    <Loader />
  )
}

export default CarDetails
