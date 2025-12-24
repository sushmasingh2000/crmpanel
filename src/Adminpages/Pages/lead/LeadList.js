import React, { useState } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import moment from "moment";
import CustomTable from "../../Shared/CustomTable";
import { Edit, Lock } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import CustomToPagination from "../../Shared/Pagination";
import toast from "react-hot-toast";

const LeadList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user_type = localStorage.getItem("type");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog state
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const fk = useFormik({
    initialValues: { search: "", start_date: "", end_date: "", count: 10 },
    onSubmit: () => setCurrentPage(1),
  });

  // Fetch leads
  const { data: leadsData, isLoading, refetch } = useQuery(
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
      axiosInstance.post(API_URLS.employee_list, {
        count: 10000,
      }),
    { keepPreviousData: true }
  );

  const employee_all = employeesData?.data?.data || [];


  const assignLeadMutation = useMutation(
    () =>
      axiosInstance.post(API_URLS.assign_lead, {
        lead_id: selectedLead?.id,
        employee_id: selectedEmployee,
        employee_name: employee_all.find(emp => emp.id === selectedEmployee)?.name
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get_leads");
        setOpenAssignDialog(false);
        setSelectedEmployee("");
        toast("Lead assigned successfully");
      },
    }
  );

  const tableHead = [
    "Id",
    "Name",
    "Mobile",
    "Email",
    "Service Type",
    "Property Type",
    ...(user_type === "admin" ? ["Employee Name"] : []),
    "Locality",
    "City",
    "Status",
    ...(user_type === "admin" ? ["Action"] : []),
    "FollowUp",
    "Lead Date",
    "Created At",
    "Action",
  ];
 
  // Table row mapping
  const tableRow = allData?.data?.map((lead, index) => {
    const row = [
      index + 1 + (currentPage - 1) * fk.values.count,
      lead.crm_lead_name,
      lead.crm_mobile,
      lead.crm_email,
      lead.crm_service_type,
      lead.crm_property_type,
    ];

    if (user_type === "admin") {
      row.push(lead.assigned_employee_name || "--");
    }

    row.push(
      lead.crm_locality,
      lead.crm_city,
      lead.current_status || "--"
    );

    if (user_type === "admin") {
      row.push(
        <span className="flex justify-center">
          {lead.assigned_employee_name ? (
            <Lock />
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setSelectedLead(lead);
                setOpenAssignDialog(true);
              }}
            >
              Assign
            </Button>
          )}
        </span>
      );
    }

    // Follow-up and lead info
    row.push(
      <Edit
        className="!text-green-600"
        onClick={() =>
          navigate("/follow-up", { state: { lead_id: lead.id } })
        }
      />,
      lead.crm_lead_date ? moment?.utc(lead.crm_lead_date).format("DD-MM-YYYY") : "--",
      lead.crm_created_at ? moment?.utc(lead.crm_created_at).format("DD-MM-YYYY") : "--"
    );

    // Edit lead (pass the lead object via state)
    row.push(
      <Edit
        className="!text-blue-600"
        onClick={() =>
          navigate("/add-lead", { state: { lead } }) // pass the current lead
        }
      />
    );

    return row;
  });



  return (
    <div>
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Leads</p>
        {user_type === "admin" && (
          <Button variant="contained" onClick={() => navigate("/add-lead")}>
            + Add Lead
          </Button>
        )}
      </div>

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
          type="search"
          placeholder="Search by name or mobile"
          name="search"
          value={fk.values.search}
          onChange={fk.handleChange}
        />
      </div>

      <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />

      <CustomToPagination page={currentPage} setPage={setCurrentPage} totalPage={allData} />
      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }} className="!text-center">
          Assign Lead
        </DialogTitle>

        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth size="small">
            <div className="">Lead Name</div>

            <TextField
              value={selectedLead?.crm_lead_name}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="employee-select-label">Select Employee</InputLabel>
            <Select
              labelId="employee-select-label"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Employee"
            >
              {employee_all
                ?.filter((emp) => emp.role === "employee")
                .map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenAssignDialog(false)}
            color="inherit"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => assignLeadMutation.mutate()}
            disabled={!selectedEmployee}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default LeadList;
