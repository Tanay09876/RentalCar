import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#eab308", "#22c55e", "#ef4444"];

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
    revenueChartData: [],
    statusChartData: []
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
              className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor shadow-sm"
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

      {/* 📊 Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 p-6 border border-borderColor rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Revenue Performance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Total earnings from bookings throughout the year</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-borderColor)" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={55} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-borderColor)', color: 'var(--color-text)' }} itemStyle={{ color: 'var(--color-text)' }} labelStyle={{ color: 'var(--color-text)' }} />
                <Area type="monotone" dataKey="Revenue" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Pie Chart */}
        <div className="p-6 border border-borderColor rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Booking Status</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Distribution of reservations</p>
          </div>
          <div className="h-48 relative flex items-center justify-center">
            {data.statusChartData && data.statusChartData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-borderColor)', color: 'var(--color-text)' }} itemStyle={{ color: 'var(--color-text)' }} labelStyle={{ color: 'var(--color-text)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">No booking statistics yet</p>
            )}
          </div>
          <div className="flex justify-around mt-4">
            {data.statusChartData && data.statusChartData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
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
