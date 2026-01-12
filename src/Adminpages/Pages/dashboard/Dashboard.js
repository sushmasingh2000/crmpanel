import React, { useState } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { Close, PersonPin } from "@mui/icons-material";
import CustomTable from "../../Shared/CustomTable";
import moment from "moment";
import { useFormik } from "formik";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from "@mui/material";
import FollowupList from "../followup/FollowupList";


const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openFollowup, setOpenFollowup] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const userRole = localStorage.getItem("type")

  const { data, isLoading, isError } = useQuery(
    ["dashboard_count"],
    () => axiosInstance.get(API_URLS.dashboard_count),
    { keepPreviousData: true }
  );

  const dashboard = data?.data?.data || {};

  const isLeadVisibleOnDashboard = (lead) => {
    const today = moment().startOf("day");

    const blockedStatuses = ["Rejected", "Deal Success"];
    if (blockedStatuses.includes(lead.current_status)) {
      return false;
    }

    const baseDate = lead.followup_created_at
      ? moment(lead.followup_created_at)
      : moment(lead.crm_created_at);

    const expiryDate = baseDate.clone().add(5, "days").endOf("day");

    return today.isSameOrBefore(expiryDate);
  };

  const fk = useFormik({
    initialValues: {
      search: "",
      start_date: "",
      end_date: "",
      count: 10,
    },
    onSubmit: () => setCurrentPage(1),
  });
  const { data: leads } = useQuery(
    ["dashboar_leads", fk.values.search, fk.values.status, fk.values.start_date, fk.values.end_date, currentPage],
    () => axiosInstance.post(API_URLS.lead_list, {
      search: fk.values.search?.trim(),
      start_date: fk.values.start_date,
      end_date: fk.values.end_date,
      status: fk.values.status,
      page: currentPage,
      count: 10000000,
    }),
    { keepPreviousData: true }
  );

  const followups = leads?.data?.response?.data?.filter(isLeadVisibleOnDashboard) || [];


  const tableHead = [
    "S.No.",
    "Lead Date / Time",
    " Followup Date / Time",
    "FollowUp",
    "Status",
    "Lead Name",
    "Mobile",
  ];

  const tableRow = followups.map((f, idx) => [
   <span className="flex gap-2">
     {idx + 1},
      {userRole !== "admin" &&
        (!f.current_status) && (
          <span className="bg-green-600 text-white text-[10px] px-2  rounded-full">
            NEW
          </span>
        )}
   </span>,

    f.crm_created_at
      ? moment(f.crm_created_at).format("YYYY-MM-DD HH:mm:ss")
      : "--",
    f.followup_created_at
      ? moment(f.followup_created_at).format("YYYY-MM-DD HH:mm:ss")
      : "--",
    <Button
      className="!bg-green-600 !text-white"
      onClick={() => {
        setSelectedLeadId(f.id);
        setOpenFollowup(true);
      }}
    >
      View
    </Button>,
    f.current_status || "--",
    f.crm_lead_name || "--",
    f.crm_mobile || "--",
  ]);

  const { data: statusList } = useQuery(
    ["get_followup_master"],
    () =>
      axiosInstance.post(API_URLS.get_followup_master, {
        count: 100000,
        status: 1,
      }),
    { refetchOnWindowFocus: false }
  );

  const status = statusList?.data?.response || [];
  // Basic fixed cards
  const baseStats = [
    { label: "Total Leads", icon: <PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.total_leads || 0 },
    // { label: "Total Owners", icon: <PersonPin className="!h-[3rem] !w-[3rem] !text-[#2a2785]" />, value: dashboard.total_owners || 0 },
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
        <div className="flex gap-3 mb-4">
          <TextField
            type="date"
            value={fk.values.start_date}
            onChange={(e) => fk.setFieldValue("start_date", e.target.value)}
          />
          <TextField
            type="date"
            value={fk.values.end_date}
            onChange={(e) => fk.setFieldValue("end_date", e.target.value)}
          />
          <TextField
            select
            name="status"
            label="Followup Status"
            value={fk.values.status}
            onChange={fk.handleChange}
            className="lg:w-[300px]"
          >
            {status?.data?.map((item) => (
              <MenuItem
                key={item.followup_status_id}
                value={item.followup_status_name}
              >
                {item.followup_status_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="search"
            placeholder="Search by name or mobile"
            name="search"
            value={fk.values.search}
            onChange={(e) => fk.setFieldValue("search", e.target.value.trimStart())}
          />
        </div>
        <CustomTable
          tablehead={tableHead}
          tablerow={tableRow}
          isLoading={isLoading}
        />
        <Dialog
          open={openFollowup}
          onClose={() => setOpenFollowup(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle className="flex justify-between items-center">
            Follow-up
            <IconButton onClick={() => setOpenFollowup(false)}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              height: "70vh",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            {selectedLeadId && (
              <FollowupList leadId={selectedLeadId} />
            )}
          </DialogContent>
        </Dialog>
      </>
    </div>
  );

};

export default Dashboard;
