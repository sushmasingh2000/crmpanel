import { Edit, Lock } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import Swal from "sweetalert2";

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


  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Confirmation popup (without initial loading)
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to upload this Excel file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, upload it!",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    if (result.isConfirmed) {
      // Show loading **after user confirms**
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        await axiosInstance.post(API_URLS.upload_leads_excel, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.close();
        Swal.fire("Uploaded!", "Leads uploaded successfully.", "success");
        queryClient.invalidateQueries("get_leads");
      } catch (error) {
        Swal.close();
        Swal.fire("Error!", "Excel upload failed.", "error");
      }
    }
  };



  const tableHead = [
    "Id",
    "Name",
    "Mobile",
    "Email",
    "Service ",
    "Property ",
    // ...(user_type === "admin" ? ["Seller Name"] : []),
    "Locality",
    "City",
    "BHK",
    "Price",
    "Building",
    "Address",
    // "Project ID",
    "Primary Status",
    "Sec. Status",
    "Created At",
    "FollowUp",
    "Action",

  ];

  // Table row mapping
  const tableRow = allData?.data?.map((lead, index) => {
    const row = [
      index + 1 + (currentPage - 1) * fk.values.count,
      lead.crm_lead_name || "--",
      lead.crm_mobile || "--",
      lead.crm_email || "--",
      lead.crm_service_type || "--",
      lead.crm_property_type || "--",
    ];
    // if (user_type === "admin") {
    //   row.push(
    //     <span className="flex justify-center">
    //       {lead.assigned_employee_name ? (
    //         <span>  {lead?.assigned_employee_name} </span>
    //       ) : (
    //         <Button
    //           size="small"
    //           variant="outlined"
    //           onClick={() => {
    //             setSelectedLead(lead);
    //             setOpenAssignDialog(true);
    //           }}
    //         >
    //           Assign
    //         </Button>
    //       )}
    //     </span>
    //   );
    // }

    row.push(
      lead.crm_locality || "--",
      lead.crm_city || "--",
      lead.crm_bhk || "--",
      lead.crm_price || "--",
      lead.crm_building || "--",
      lead.crm_address || "--",
      // <span>
      //   {lead?.property_id ? (
      //     <span>{lead?.property_id}</span>
      //   ) : (
      //     <Button
      //       size="small"
      //       variant="outlined"
      //       onClick={() => {
      //         navigate("/list-owner", { state: { lead_id: lead.id, lead_name: lead.crm_lead_name } });
      //       }}
      //     >
      //       Select Property
      //     </Button>
      //   )}</span>,
      lead.current_status || "--",
    );
    // Follow-up column
    row.push(
      lead.crm_secondary_status || "--",
      lead.crm_created_at ? moment.utc(lead.crm_created_at).format("DD-MM-YYYY HH:mm:ss") : "--"
    );

    // Edit lead
    row.push(
      <Button
        className="!bg-green-600 !text-white"
        onClick={() =>
          navigate("/follow-up", { state: { lead_id: lead.id } })
        }
      > View </Button>,
      <Button
        className="!bg-blue-600 !text-white"
        onClick={() =>
          navigate("/add-lead", { state: { lead } })
        }
      > Edit </Button>
    );

    return row;
  });


  return (
    <div>
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Leads</p>
        <div className="flex justify-end gap-5">
          <Button variant="outlined" component="label">
            Upload Excel
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={(e) => handleExcelUpload(e)}
            />
          </Button>
          <Button variant="contained" onClick={() => navigate("/add-lead")}>
            + Add Lead
          </Button>
        </div>
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

      <CustomToPagination page={currentPage} setPage={setCurrentPage} data={allData} />
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
