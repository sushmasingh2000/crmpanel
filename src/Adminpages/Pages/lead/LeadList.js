import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";

const LeadList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user_type = localStorage.getItem("type");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkEmployee, setBulkEmployee] = useState("");

  const fk = useFormik({
    initialValues: { search: "", start_date: "", end_date: "", count: 10 },
    onSubmit: () => setCurrentPage(1),
  });


  const { data: leadsData, isLoading } = useQuery(
    ["get_leads", fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
    () =>
      axiosInstance.post(API_URLS.lead_list, {
        search: fk.values.search,
        start_date: fk.values.start_date,
        end_date: fk.values.end_date,
        page: currentPage,
        count: 10,
      }),
    { keepPreviousData: true }
  );

  const allData = leadsData?.data?.response || [];

  const { data: employeesData } = useQuery(
    ["employees"],
    () =>
      axiosInstance.post(API_URLS.employee_list, { count: 10000 }),
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


  const handleBulkAssign = async () => {
    if (!bulkEmployee || selectedLeads.length === 0) return;
    const employeeName = employee_all.find(emp => emp.id === bulkEmployee)?.name;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Assign ${selectedLeads.length} leads to ${employeeName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, assign",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    if (result.isConfirmed) {
      Swal.fire({ title: "Assigning...", didOpen: () => Swal.showLoading() });
      try {
        await axiosInstance.post(API_URLS.assign_lead, {
          lead_ids: selectedLeads,
          employee_id: bulkEmployee,
          employee_name: employeeName
        });
        Swal.close();
        Swal.fire("Assigned!", "Leads assigned successfully.", "success");
        setSelectedLeads([]);
        setBulkEmployee("");
        queryClient.invalidateQueries("get_leads");
      } catch (error) {
        Swal.close();
        Swal.fire("Error!", "Failed to assign leads.", "error");
      }
    }
  };

  const toggleLeadSelection = (leadId) => {
    setSelectedLeads(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]);
  };

  const tableHead = [
    "Select", "S.No.", "Name", "Mobile", "Email", "Service", "Property",
    "Locality", "City", "BHK", "Price", "Building", "Address",
    "Primary Status", "Sec. Status", "Date / Time", "FollowUp", "Action"
  ];

  const tableRow = allData?.data?.map((lead, index) => [
    <input
      type="checkbox"
      checked={selectedLeads.includes(lead.id)}
      onChange={() => toggleLeadSelection(lead.id)}
    />,
    index + 1 + (currentPage - 1) * fk.values.count,
    lead.crm_lead_name || "--",
    lead.crm_mobile || "--",
    lead.crm_email || "--",
    lead.crm_service_type || "--",
    lead.crm_property_type || "--",
    lead.crm_locality || "--",
    lead.crm_city || "--",
    lead.crm_bhk || "--",
    lead.crm_price || "--",
    lead.crm_building || "--",
    lead.crm_address || "--",
    lead.current_status || "--",
    lead.crm_secondary_status || "--",
    lead.crm_created_at ? moment.utc(lead.crm_created_at).format("DD-MM-YYYY HH:mm:ss") : "--",
    <Button
      className="!bg-green-600 !text-white"
      onClick={() => navigate("/follow-up", { state: { lead_id: lead.id } })}
    >View</Button>,
    <Button
      className="!bg-blue-600 !text-white"
      onClick={() => navigate("/add-lead", { state: { lead } })}
    >Edit</Button>
  ]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Leads</p>
        <div className="flex justify-end gap-5">
          <Button variant="outlined" component="label">
            Upload Excel
            <input type="file" hidden accept=".xlsx,.xls" onChange={handleExcelUpload} />
          </Button>
          <Button variant="contained" onClick={() => navigate("/add-lead")}>+ Add Lead</Button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <TextField type="date" value={fk.values.start_date} onChange={(e) => fk.setFieldValue("start_date", e.target.value)} />
        <TextField type="date" value={fk.values.end_date} onChange={(e) => fk.setFieldValue("end_date", e.target.value)} />
        <TextField type="search" placeholder="Search by name or mobile" name="search" value={fk.values.search} onChange={fk.handleChange} />
      </div>

      {selectedLeads?.length > 0 && (
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
            disabled={!bulkEmployee || selectedLeads.length === 0}
            onClick={handleBulkAssign}
          >
            Assign Selected Leads
          </Button>
        </div>
      )}
      <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
      <CustomToPagination page={currentPage} setPage={setCurrentPage} data={allData} />
    </div>
  );
};

export default LeadList;
