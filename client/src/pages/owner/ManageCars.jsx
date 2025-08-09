import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Tooltip, Avatar, Typography, Box } from "@mui/material";
import { Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this car?")) return;
      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) fetchOwnerCars();
  }, [isOwner]);

  const columns = [
    {
      field: "car",
      headerName: "Car",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            src={params.row.image}
            alt="car"
            variant="rounded"
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography className="font-medium">
              {params.row.brand} {params.row.model}
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              {params.row.seating_capacity} • {params.row.transmission}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "pricePerDay",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => `${currency}${params.value}/day`,
    },
    {
      field: "isAvaliable",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium 
            ${params.value
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            }`}
        >
          {params.value ? "Available" : "Unavailable"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1} alignItems="center" height="100%">
          <Tooltip title={params.row.isAvaliable ? "Mark Unavailable" : "Mark Available"}>
            <IconButton onClick={() => toggleAvailability(params.row._id)}>
              {params.row.isAvaliable ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Car">
            <IconButton onClick={() => deleteCar(params.row._id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <Box
        mt={6}
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
        sx={{
          height: 600,
          width: "100%",
        }}
      >
<DataGrid
  rows={cars}
  columns={columns}
  getRowId={(row) => row._id}
  pageSize={pageSize}
  page={page}
  onPageChange={(newPage) => setPage(newPage)}
  onPageSizeChange={(newSize) => {
    setPageSize(newSize);
    setPage(0);
  }}
  pagination
  rowsPerPageOptions={[5, 10, 20, 50, 100]}
  disableRowSelectionOnClick
  rowHeight={85}
  
/>


      </Box>
    </div>
  );
};

export default ManageCars;






// import React, { useEffect, useState } from 'react'
// import { assets} from '../../assets/assets'
// import Title from '../../components/owner/Title'
// import { useAppContext } from '../../context/AppContext'
// import toast from 'react-hot-toast'

// const ManageCars = () => {

//   const {isOwner, axios, currency} = useAppContext()

//   const [cars, setCars] = useState([])

//   const fetchOwnerCars = async ()=>{
//     try {
//       const {data} = await axios.get('/api/owner/cars')
//       if(data.success){
//         setCars(data.cars)
//       }else{
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const toggleAvailability = async (carId)=>{
//     try {
//       const {data} = await axios.post('/api/owner/toggle-car', {carId})
//       if(data.success){
//         toast.success(data.message)
//         fetchOwnerCars()
//       }else{
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const deleteCar = async (carId)=>{
//     try {

//       const confirm = window.confirm('Are you sure you want to delete this car?')

//       if(!confirm) return null

//       const {data} = await axios.post('/api/owner/delete-car', {carId})
//       if(data.success){
//         toast.success(data.message)
//         fetchOwnerCars()
//       }else{
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=>{
//     isOwner && fetchOwnerCars()
//   },[isOwner])

//   return (
//     <div className='px-4 pt-10 md:px-10 w-full'>
      
//       <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform."/>

//       <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

//         <table className='w-full border-collapse text-left text-sm text-gray-600'>
//           <thead className='text-gray-500'>
//             <tr>
//               <th className="p-3 font-medium">Car</th>
//               <th className="p-3 font-medium max-md:hidden">Category</th>
//               <th className="p-3 font-medium">Price</th>
//               <th className="p-3 font-medium max-md:hidden">Status</th>
//               <th className="p-3 font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cars.map((car, index)=>(
//               <tr key={index} className='border-t border-borderColor'>

//                 <td className='p-3 flex items-center gap-3'>
//                   <img src={car.image} alt="" className="h-12 w-12 aspect-square rounded-md object-cover"/>
//                   <div className='max-md:hidden'>
//                     <p className='font-medium'>{car.brand} {car.model}</p>
//                     <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission}</p>
//                   </div>
//                 </td>

//                 <td className='p-3 max-md:hidden'>{car.category}</td>
//                 <td className='p-3'>{currency}{car.pricePerDay}/day</td>

//                 <td className='p-3 max-md:hidden'>
//                   <span className={`px-3 py-1 rounded-full text-xs ${car.isAvaliable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
//                     {car.isAvaliable ? "Available" : "Unavailable" }
//                   </span>
//                 </td>

//                 <td className='flex items-center p-3'>

//                   <img onClick={()=> toggleAvailability(car._id)} src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer'/>

//                   <img onClick={()=> deleteCar(car._id)} src={assets.delete_icon} alt="" className='cursor-pointer'/>
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>

//       </div>

//     </div>
//   )
// }