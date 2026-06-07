import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const COLORS = ["#eab308", "#22c55e", "#ef4444"];
const CATEGORY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const Dashboard = () => {
  const { axios, isAdmin } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
    revenueChartData: [],
    statusChartData: [],
    userStatsChartData: [],
    carCategoryChartData: []
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
      const { data } = await axios.get("/api/admin/dashboard");
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
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* Summary cards */}
      <div className="my-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
        {/* User Stats Bar Chart */}
        <div className="lg:col-span-2 p-6 border border-borderColor rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">User & Partner Activity</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Overview of customer bookings and rental partners</p>
          <div className="h-72">
            {data.userStatsChartData && data.userStatsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.userStatsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-borderColor)" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-borderColor)', color: 'var(--color-text)' }} itemStyle={{ color: 'var(--color-text)' }} labelStyle={{ color: 'var(--color-text)' }} />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">Loading user data...</div>
            )}
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

      {/* Row 2: Car Categories */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="p-6 border border-borderColor rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Registered Vehicle Types</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Distribution of registered rental cars by category</p>
          <div className="flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="h-56 w-full md:w-1/2 flex items-center justify-center">
              {data.carCategoryChartData && data.carCategoryChartData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.carCategoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.carCategoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-borderColor)', color: 'var(--color-text)' }} itemStyle={{ color: 'var(--color-text)' }} labelStyle={{ color: 'var(--color-text)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400">No car category statistics yet</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
              {data.carCategoryChartData && data.carCategoryChartData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 rounded-md flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}></span>
                  <span className="font-medium">{item.name}:</span>
                  <span className="text-gray-500">{item.value} cars</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
