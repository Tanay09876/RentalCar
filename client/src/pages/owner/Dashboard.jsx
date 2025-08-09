// import React, { useEffect, useState } from 'react'
// import { assets, dummyDashboardData } from '../../assets/assets'
// import Title from '../../components/owner/Title'
// import { useAppContext } from '../../context/AppContext'
// import toast from 'react-hot-toast'

// const Dashboard = () => {

//   const {axios, isOwner, currency} = useAppContext()

//   const [data, setData] = useState({
//     totalCars: 0,
//     totalBookings: 0,
//     pendingBookings: 0,
//     completedBookings: 0,
//     recentBookings: [],
//     monthlyRevenue: 0,
//   })

//   const dashboardCards = [
//     {title: "Total Cars", value: data.totalCars, icon: assets.carIconColored},
//     {title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored},
//     {title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored},
//     {title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored},
//   ]

//   const fetchDashboardData = async ()=>{
//     try {
//        const { data } = await axios.get('/api/owner/dashboard')
//        if (data.success){
//         setData(data.dashboardData)
//        }else{
//         toast.error(data.message)
//        }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=>{
//     if(isOwner){
//       fetchDashboardData()
//     }
//   },[isOwner])

//   return (
//     <div className='px-4 pt-10 md:px-10 flex-1'>
//       <Title title=" Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"/>

//       <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
//         {dashboardCards.map((card, index)=>(
//           <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
//             <div>
//               <h1 className='text-xs text-gray-500'>{card.title}</h1>
//               <p className='text-lg font-semibold'>{card.value}</p>
//             </div>
//             <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
//               <img src={card.icon} alt="" className='h-4 w-4'/>
//             </div>
//           </div>
//         ))}
//       </div>


//       <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
//         {/* recent booking  */}
//         <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
//           <h1 className='text-lg font-medium'>Recent Bookings</h1>
//           <p className='text-gray-500'>Latest customer bookings</p>
//           {data.recentBookings.map((booking, index)=>(
//             <div key={index} className='mt-4 flex items-center justify-between'>

//               <div className='flex items-center gap-2'>
//                 <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
//                   <img src={assets.listIconColored} alt="" className='h-5 w-5'/>
//                 </div>
//                 <div>
//                   <p>{booking.car.brand} {booking.car.model}</p>
//                   <p className='text-sm text-gray-500'>{booking.createdAt.split('T')[0]}</p>
//                 </div>
//               </div>

//               <div className='flex items-center gap-2 font-medium'>
//                 <p className='text-sm text-gray-500'>{currency}{booking.price}</p>
//                 <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm'>{booking.status}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* monthly revenue */}
//         <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
//           <h1 className='text-lg font-medium'>Monthly Revenue</h1>
//           <p className='text-gray-500'>Revenue for current month</p>
//           <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
//         </div>
        
//       </div>


//     </div>
//   )
// }

// export default Dashboard









// import React, { useEffect, useState } from 'react'
// import { assets } from '../../assets/assets'
// import Title from '../../components/owner/Title'
// import { useAppContext } from '../../context/AppContext'
// import toast from 'react-hot-toast'
// import {
//   PieChart, Pie, Cell, Tooltip, Legend,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
// } from 'recharts'

// const Dashboard = () => {
//   const { axios, isOwner, currency } = useAppContext()

//   const [data, setData] = useState({
//     totalCars: 0,
//     totalBookings: 0,
//     pendingBookings: 0,
//     completedBookings: 0,
//     recentBookings: [],
//     monthlyRevenue: 0,
//     revenueByMonth: [], // format: [{ month: 'Jan', revenue: 5000 }, ...]
//   })

//   const [graphType, setGraphType] = useState("status")

//   const COLORS = ['#8884d8', '#82ca9d']

//   const dashboardCards = [
//     { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
//     { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
//     { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
//     { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
//   ]

//   const fetchDashboardData = async () => {
//     try {
//       const res = await axios.get('/api/owner/dashboard')
//       if (res.data.success) {
//         setData(res.data.dashboardData)
//       } else {
//         toast.error(res.data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     if (isOwner) {
//       fetchDashboardData()
//     }
//   }, [isOwner])

//   const bookingStatusData = [
//     { name: 'Pending', value: data.pendingBookings },
//     { name: 'Confirmed', value: data.completedBookings },
//   ]

//   const revenueData = data.revenueByMonth || []

//   return (
//     <div className='px-4 pt-10 md:px-10 flex-1'>
//       <Title title="Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities" />

//       {/* Top cards */}
//       <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
//         {dashboardCards.map((card, index) => (
//           <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
//             <div>
//               <h1 className='text-xs text-gray-500'>{card.title}</h1>
//               <p className='text-lg font-semibold'>{card.value}</p>
//             </div>
//             <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
//               <img src={card.icon} alt="" className='h-4 w-4' />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Bookings + Revenue Box */}
//       <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
//         {/* Recent bookings */}
//         <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
//           <h1 className='text-lg font-medium'>Recent Bookings</h1>
//           <p className='text-gray-500'>Latest customer bookings</p>
//           {data.recentBookings.map((booking, index) => (
//             <div key={index} className='mt-4 flex items-center justify-between'>
//               <div className='flex items-center gap-2'>
//                 <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
//                   <img src={assets.listIconColored} alt="" className='h-5 w-5' />
//                 </div>
//                 <div>
//                   <p>{booking.car.brand} {booking.car.model}</p>
//                   <p className='text-sm text-gray-500'>{booking.createdAt.split('T')[0]}</p>
//                 </div>
//               </div>
//               <div className='flex items-center gap-2 font-medium'>
//                 <p className='text-sm text-gray-500'>{currency}{booking.price}</p>
//                 <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm'>{booking.status}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Monthly Revenue */}
//         <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
//           <h1 className='text-lg font-medium'>Monthly Revenue</h1>
//           <p className='text-gray-500'>Revenue for current month</p>
//           <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
//         </div>
//       </div>

//       {/* Graph Section */}
//       <div className='w-full border border-borderColor rounded-md p-4'>
//         <div className='flex items-center justify-between mb-4'>
//           <h2 className='text-lg font-semibold'>Visual Analytics</h2>
//           <select
//             value={graphType}
//             onChange={(e) => setGraphType(e.target.value)}
//             className='border border-gray-300 rounded px-2 py-1 text-sm'
//           >
//             <option value="status">Booking Status</option>
//             <option value="revenue">Monthly Revenue</option>
//           </select>
//         </div>

//         <div className='w-full h-80'>
//           <ResponsiveContainer width="100%" height="100%">
//             {graphType === 'status' ? (
//               <PieChart>
//                 <Pie
//                   data={bookingStatusData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {bookingStatusData.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             ) : (
//               <BarChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
//               </BarChart>
//             )}
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard


import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line
} from 'recharts'

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
    revenueByMonth: [],
    bookingsByCategory: [],
  })

  const [selectedGraphType, setSelectedGraphType] = useState("bar")
  const [selectedDataType, setSelectedDataType] = useState("status")

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1']

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ]

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('/api/owner/dashboard')
      if (res.data.success) {
        setData(res.data.dashboardData)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData()
    }
  }, [isOwner])

  const bookingStatusData = [
    { name: 'Pending', value: data.pendingBookings },
    { name: 'Confirmed', value: data.completedBookings },
  ]

  const revenueData = data.revenueByMonth || []

  const categoryBookingData = ['Sedan', 'Van', 'SUV'].map(cat => {
    const match = data.bookingsByCategory?.find(item => item.category === cat)
    return {
      name: cat,
      value: match ? match.count : 0
    }
  })

  const getCurrentChartData = () => {
    if (selectedDataType === "status") return bookingStatusData
    if (selectedDataType === "revenue") return revenueData
    if (selectedDataType === "category") return categoryBookingData
    return []
  }

  const currentData = getCurrentChartData()

  const renderChart = () => {
    if (currentData.every(item => item.value === 0 || item.revenue === 0)) {
      return <div className="text-center text-gray-500 py-10">No data available</div>
    }

    const isRevenue = selectedDataType === "revenue"
    const dataKey = isRevenue ? "revenue" : "value"

    switch (selectedGraphType) {
      case "pie":
        return (
          <PieChart>
            <Pie
              data={currentData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              dataKey={dataKey}
            >
              {currentData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )
      case "line":
        return (
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" name={selectedDataType} />
          </LineChart>
        )
      case "bar":
      default:
        return (
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#ffc658" name={selectedDataType} />
          </BarChart>
        )
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title="Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities" />

      {/* Top Cards */}
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
              <img src={card.icon} alt="" className='h-4 w-4' />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings + Revenue */}
      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'>Latest customer bookings</p>
          {data.recentBookings.map((booking, index) => (
            <div key={index} className='mt-4 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                  <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                </div>
                <div>
                  <p>{booking.car.brand} {booking.car.model}</p>
                  <p className='text-sm text-gray-500'>{booking.createdAt.split('T')[0]}</p>
                </div>
              </div>
              <div className='flex items-center gap-2 font-medium'>
                <p className='text-sm text-gray-500'>{currency}{booking.price}</p>
                <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm'>{booking.status}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
        </div>
      </div>

      {/* Graph Section */}
      <div className='w-full border border-borderColor rounded-md p-4'>
        <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
          <h2 className='text-lg font-semibold'>Visual Analytics</h2>
          <div className='flex gap-4'>
            <div>
              <label className="text-sm mr-2">Chart Type:</label>
              <select
                value={selectedGraphType}
                onChange={(e) => setSelectedGraphType(e.target.value)}
                className='border border-gray-300 rounded px-2 py-1 text-sm'
              >
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
                <option value="line">Line</option>
              </select>
            </div>
            <div>
              <label className="text-sm mr-2">Data Type:</label>
              <select
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value)}
                className='border border-gray-300 rounded px-2 py-1 text-sm'
              >
                <option value="status">Booking Status</option>
                <option value="revenue">Monthly Revenue</option>
                <option value="category">Most Booked Categories</option>
              </select>
            </div>
          </div>
        </div>

        <div className='w-full h-80'>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
