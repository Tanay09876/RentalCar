import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
    { title: "Cancelled", value: data.cancelledBookings, icon: assets.cancel },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* Summary cards */}
      <div className="my-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor bg-white dark:bg-darkSecondary shadow-sm"
            >
              <div>
                <h1 className="text-xs text-gray-500">{card.title}</h1>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <img src={card.icon} alt="" className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6 mb-8 w-full">
        {/* recent bookings */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full lg:flex-1">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>
          {data.recentBookings.length > 0 ? (
            data.recentBookings.map((booking, index) => (
              <div key={index} className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-borderColor pb-2">
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                  </div>
                  <div>
                    <p>
                      {booking?.car
                        ? `${booking.car.brand} ${booking.car.model}`
                        : "Car removed"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking?.createdAt ? booking.createdAt.split("T")[0] : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-500">
                    {currency}
                    {booking?.price ?? 0}
                  </p>
                  <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">
                    {booking?.status ?? "N/A"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 mt-4">No recent bookings</p>
          )}
        </div>

        {/* monthly revenue */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full lg:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
