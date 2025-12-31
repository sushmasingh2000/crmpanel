import React from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { PersonPin } from "@mui/icons-material";
import CustomTable from "../../Shared/CustomTable";
import moment from "moment";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery(
    ["dashboard_count"],
    () => axiosInstance.get(API_URLS.dashboard_count),
    { keepPreviousData: true }
  );

  const dashboard = data?.data?.data || {};

  const { data: leads } = useQuery(
    ["dashboard_followups"],
    () => axiosInstance.post(API_URLS.dashbaord_main),
    { keepPreviousData: true }
  );

  const followups = leads?.data?.response || [];

  const tableHead = [
    "S.No.",
    "Lead Name",
    "Mobile",
    "Status",
    "Next Follow-up Date",
  ];

  const tableRow = followups?.data?.map((f, idx) => [
    idx + 1,
    f.crm_lead_name,
    f.crm_mobile,
    f.crm_status || "--",
    f.crm_next_followup_date ? moment(f.crm_next_followup_date).format("YYYY-MM-DD") : "--",
  ]);

  // Basic fixed cards
  const baseStats = [
    { label: "Total Leads", icon: <PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.total_leads || 0 },
    { label: "Total Owners", icon: <PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.total_owners || 0 },
    { label: "Total Follow-ups", icon: <PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.leads_with_followup || 0 },
  ];

  const statusStats = dashboard.status_wise_followup?.map((item) => ({
    label: item.crm_status,
    value: item.total,
    icon: <PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />,
  })) || [];

  const stats = [...baseStats, ...statusStats];
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;
  return (
    <div className="h-screen overflow-y-auto px-4">
      <>
        <div className="grid lg:grid-cols-5 sm:grid-cols-1 gap-4 mt-3">
          {stats.map((i, index) => (
            <div
              key={index}
              className="text-center bg-white bg-opacity-65 rounded-lg py-1 cursor-pointer hover:shadow-lg transition duration-200"
            >
              <div className="text pt-1 font-bold">{i.icon}</div>
              <p className="font-bold text-sm">{i.label}</p>
              <p className="font-extrabold text-blue-700 text-lg">{i.value}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-bold mb-4">
          Upcoming Follow-ups
        </h2>

        <CustomTable
          tablehead={tableHead}
          tablerow={tableRow}
          isLoading={isLoading}
        />
      </>
    </div>
  );

};

export default Dashboard;
