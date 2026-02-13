import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import FollowupList from "../followup/FollowupList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Lock } from "@mui/icons-material";
import toast from "react-hot-toast";


const LeadList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkEmployee, setBulkEmployee] = useState("");
  const [assignAll, setAssignAll] = useState(false);

  const [openFollowup, setOpenFollowup] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [dateSort, setDateSort] = useState("desc");
  const userRole = localStorage.getItem("type")
  const location = useLocation()
  const searchMobileFromState = location.state?.searchMobile || "";



  const fk = useFormik({
    initialValues: {
      search: searchMobileFromState || "",
      start_date: "",
      end_date: "",
      count: 10,
      status: ""
    },
    onSubmit: () => setCurrentPage(1),
  });

  const { data: leadsData, isLoading } = useQuery(
    ["get_leads", fk.values.search, fk.values.start_date, fk.values.end_date, currentPage, fk.values.status, dateSort],
    () =>
      axiosInstance.post(API_URLS.lead_list, {
        search: fk.values.search?.trim(),
        start_date: fk.values.start_date,
        end_date: fk.values.end_date,
        page: currentPage,
        count: 50,
        status: fk.values.status,
        sort_order: dateSort
      }),
    { keepPreviousData: true }
  );

  const allData = leadsData?.data?.response || [];

  const { data: employeesData } = useQuery(
    ["employees"],
    () => axiosInstance.post(API_URLS.employee_list, { count: 10000 }),
    { keepPreviousData: true }
  );

  const employee_all = employeesData?.data?.data || [];

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to upload this Excel file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, upload it!",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Uploading...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    try {
      const res = await axiosInstance.post(
        API_URLS.upload_leads_excel,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Swal.close();

      if (!res.data.success) {
        Swal.fire("Error!", res.data.message, "error");
        return;
      }

      Swal.fire("Uploaded!", res.data.message, "success");
      queryClient.invalidateQueries("get_leads");

    } catch (error) {
      Swal.close();

      const errorMsg =
        error?.response?.data?.message ||
        "Something went wrong while uploading Excel";

      Swal.fire("Error!", errorMsg, "error");
    }
  };

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

  const handleBulkAssign = async () => {
    if (!bulkEmployee) return;

    if (!assignAll && selectedLeads.length === 0) {
      Swal.fire("Please select leads", "", "warning");
      return;
    }

    const employeeName =
      employee_all.find(emp => emp.id === bulkEmployee)?.name;

    const text = assignAll
      ? "Assign ALL unassigned leads?"
      : `Assign ${selectedLeads.length} leads to ${employeeName}?`;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, assign",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Assigning...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false
    });

    try {
      await axiosInstance.post(API_URLS.assign_lead, {
        assign_all: assignAll,
        lead_ids: assignAll ? [] : selectedLeads,
        employee_id: bulkEmployee,
        employee_name: employeeName
      });

      Swal.close();
      Swal.fire("Assigned!", "Leads assigned successfully.", "success");

      // reset
      setSelectedLeads([]);
      setAssignAll(false);
      setBulkEmployee("");

      queryClient.invalidateQueries("get_leads");
    } catch (error) {
      Swal.close();
      Swal.fire("Error!", "Failed to assign leads.", "error");
    }
  };


  const toggleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const tableHead = [
    "S.No.",
    <span className="flex gap-2 items-center">
      {userRole === "admin" &&
        <input
          type="checkbox"
          checked={assignAll}
          onChange={(e) => {
            setAssignAll(e.target.checked);
            setSelectedLeads([]);
          }}
          className="h-5 w-5"
        />}
      Assign</span>,
    <span
      className="flex items-center gap-1 cursor-pointer select-none"
      onClick={() =>
        setDateSort(prev => (prev === "asc" ? "desc" : "asc"))
      }
    >
      Lead Date / Time
      {dateSort === "asc" ? (
        <ArrowUpwardIcon className="!text-red-800" fontSize="small" />
      ) : (
        <ArrowDownwardIcon className="!text-blue-800" fontSize="small" />
      )}
    </span>,

    "FollowUp",
    "Action",
    "Name",
    "Mobile",
    "Alternate Mobile",
    "Remark",
    " Status",
    "Email",
    "Service",
    "Property",
    "Locality",
    "City",
    "BHK",
    "Price",
    "Building",
    "Address"
  ];


  const tableRow = allData?.data?.map((lead, index) => [
    <div className="flex gap-2">
      {index + 1 + (currentPage - 1) * 50}
      {userRole !== "admin" &&
        (!lead.current_status) && (
          <span className="bg-green-600 text-white text-[10px] px-2  rounded-full">
            NEW
          </span>
        )}
    </div>,

    <span key={lead.id}>
      {lead?.assigned_employee_name ? (
        lead.assigned_employee_name
      ) : (
        <input
          type="checkbox"
          disabled={assignAll}
          checked={assignAll || selectedLeads.includes(lead.id)}
          onChange={() => toggleLeadSelection(lead.id)}
          className="h-5 w-5"
        />
      )}
    </span>,
    lead.crm_created_at
      ? moment.utc(lead.crm_created_at).format("DD-MM-YYYY HH:mm:ss")
      : "--",

    <Button
      className="!bg-green-600 !text-white"
      onClick={() => {
        setSelectedLeadId(lead.id);
        setOpenFollowup(true);
      }}
    >
      View
    </Button>,
    <span>{userRole === "admin" ? <Button
      className="!bg-blue-600 !text-white"
      onClick={() => navigate("/add-lead", { state: { lead } })}
    >
      Edit
    </Button> : <Lock />}</span>
    ,

    lead.crm_lead_name || "--",
    lead.crm_mobile || "--",
    lead.crm_alternate_mobile || "--",
    lead.crm_secondary_status || "--",
    lead.current_status || "--",
    lead.crm_email || "--",
    lead.crm_service_type || "--",
    lead.crm_property_type || "--",
    lead.crm_locality || "--",
    lead.crm_city || "--",
    lead.crm_bhk || "--",
    lead.crm_price || "--",
    lead.crm_building || "--",
    lead.crm_address || "--",

  ]);

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Leads</p>
        <div className="flex justify-end gap-5">
          <Button
            variant="contained"
            onClick={() => window.open("/lead_sample_excel.xlsx", "_blank")}
          >
            View Sample Excel
          </Button>

          <Button variant="outlined" component="label">
            Upload Excel
            <input type="file" hidden accept=".xlsx,.xls" onChange={handleExcelUpload} />
          </Button>
          <Button variant="contained" onClick={() => navigate("/add-lead")}>+ Add Lead</Button>
        </div>
      </div>

      {/* 🔹 Filters */}
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
          value={fk.values.status || "ALL"}
          onChange={(e) => {
            const value = e.target.value;
            fk.setFieldValue("status", value === "ALL" ? "" : value);
          }}
          className="lg:w-[300px]"
        >
          <MenuItem value="ALL">All</MenuItem>

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
        <Button
          variant="contained"
          color="success"
          onClick={async () => {
            try {
              const res = await axiosInstance.post(
                API_URLS.download_leads_excel,
                {
                  start_date: fk.values.start_date,
                  end_date: fk.values.end_date,
                  status: fk.values.status,
                  search: fk.values.search?.trim()
                },
                { responseType: "blob" } // 👈 Important
              );

              // Create blob link for download
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `Leads_${Date.now()}.xlsx`);
              document.body.appendChild(link);
              toast.success("Excel downloaded successfully");
              link.click();
              link.remove();
            } catch (error) {
              Swal.fire("Error", "Failed to download Excel", "error");
            }
          }}
        >
          Download Excel
        </Button>

      </div>
      {(selectedLeads.length > 0 || assignAll) && (
        <div className="flex items-center justify-end gap-3 mb-4">
          <FormControl size="small">
            <InputLabel id="bulk-employee-label">Select Employee</InputLabel>
            <Select
              labelId="bulk-employee-label"
              value={bulkEmployee}
              onChange={(e) => setBulkEmployee(e.target.value)}
              style={{ width: 200 }}
            >
              {employee_all?.filter(emp => emp.role === "employee").map(emp => (
                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={!bulkEmployee}
            onClick={handleBulkAssign}
          >
            Assign Leads
          </Button>
        </div>
      )}
      {/* 🔹 Table */}
      <CustomTable
        tablehead={tableHead}
        tablerow={tableRow}
        isLoading={isLoading}
      />

      <CustomToPagination
        page={currentPage}
        setPage={setCurrentPage}
        data={allData}
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
            <CloseIcon />
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

    </div>
  );
};

export default LeadList;
