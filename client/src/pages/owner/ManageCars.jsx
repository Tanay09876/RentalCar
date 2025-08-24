

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchOwnerCars = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/owner/cars');
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch cars.');
    }
  }, [axios]);

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update availability.');
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this car?');
      if (!confirmed) return;

      const { data } = await axios.post('/api/owner/delete-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete car.');
    }
  };

  useEffect(() => {
    if (isOwner) fetchOwnerCars();
  }, [isOwner, fetchOwnerCars]);

  // Filtering & Sorting
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) =>
        `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((car) =>
        statusFilter === 'all'
          ? true
          : statusFilter === 'available'
          ? car.isAvaliable
          : !car.isAvaliable
      )
      .sort((a, b) =>
        sortOrder === 'asc' ? a.pricePerDay - b.pricePerDay : b.pricePerDay - a.pricePerDay
      );
  }, [cars, searchTerm, statusFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
        <input
          type="text"
          placeholder="Search by brand or model..."
          className="w-full md:w-1/3 px-3 py-2 border border-borderColor rounded-md"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
      
           className="border border-borderColor rounded-md px-3 py-2 text-sm w-full md:w-48
             text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <select
                className="border border-borderColor rounded-md px-3 py-2 text-sm w-full md:w-48
             text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
            
          }}
          
        >
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>

        <select
            className="border border-borderColor rounded-md px-3 py-2 text-sm w-full md:w-48
             text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
              Show {num}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto mt-6 rounded-md border border-borderColor">
        <table className="min-w-[900px] w-full border-collapse text-left text-sm text-text">
          <thead className="bg-bgSecondary">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCars.length > 0 ? (
              paginatedCars.map((car) => (
                <tr key={car._id} className="border-t border-borderColor">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="max-md:hidden">
                      <p className="font-medium">{car.brand} {car.model}</p>
                      <p className="text-xs text-gray-500">
                        {car.seating_capacity} • {car.transmission}
                      </p>
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">{car.category}</td>
                  <td className="p-3">{currency}{car.pricePerDay}/day</td>
                  <td className="p-3 max-md:hidden">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        car.isAvaliable
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {car.isAvaliable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="flex items-center p-3 gap-2">
                    <img
                      onClick={() => toggleAvailability(car._id)}
                      src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon}
                      alt="Toggle Availability"
                      className="cursor-pointer"
                    />
                    <img
                      onClick={() => deleteCar(car._id)}
                      src={assets.delete_icon}
                      alt="Delete Car"
                      className="cursor-pointer"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No cars found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {filteredCars.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, filteredCars.length)} of {filteredCars.length} cars
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 border-borderColor"
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded-md disabled:opacity-50 border-borderColor"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCars;
