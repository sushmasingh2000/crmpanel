import React from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { PersonPin } from "@mui/icons-material";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery(
    ["dashboard_count"],
    () => axiosInstance.get(API_URLS.dashboard_count),
    { keepPreviousData: true }
  );

  const dashboard = data?.data?.data || {};

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  // Basic fixed cards
  const baseStats = [
    { label: "Total Leads", icon:<PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.total_leads || 0 },
    { label: "Total Owners", icon:<PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.total_owners || 0 },
    { label: "Total Follow-ups", icon:<PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.leads_with_followup || 0 },
  ];

  const statusStats = dashboard.status_wise_followup?.map((item) => ({
    label: item.crm_status,
    value: item.total,
    icon:<PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />,
  })) || [];

  const stats = [...baseStats, ...statusStats];

  return (
    <div className="grid lg:grid-cols-3  sm:grid-cols-1 gap-4 mt-8 ">
        {stats.map((i) => (
          <div
            key={i.id}
            className="text-center bg-gray-300 rounded-lg py-3  cursor-pointer hover:shadow-lg transition duration-200"
          >
            <div className="text-lg pt-1 font-bold">{i.icon}</div>
            <p className="font-bold text-sm">{i.label}</p>
            <p className="font-extrabold text-blue-700 text-lg">{i.value}</p>
          </div>
        ))}
      </div>
  );
};

export default Dashboard;
