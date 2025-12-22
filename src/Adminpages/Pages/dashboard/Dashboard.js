import React from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery(
    ["dashboard_count"],
    () => axiosInstance.get(API_URLS?.dashboard_count),
    { keepPreviousData: true }
  );

  const dashboard = data?.data?.data || {};

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  const stats = [
    { label: "Total Leads", value: dashboard?.total_leads || 0 },
    { label: "Total Owners", value: dashboard?.total_owners || 0 },
    // { label: "Total Follow-ups", value: dashboard?.total_followups || 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white/80 rounded-lg shadow-md p-4 border border-gray-300 backdrop-blur-sm"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <h3 className="text-lg font-bold text-blue-900">{item.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
