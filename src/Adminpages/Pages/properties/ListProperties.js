import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import CustomTable from "../../Shared/CustomTable";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FilterAlt } from "@mui/icons-material";
import CustomToPagination from "../../Shared/Pagination";
import toast from "react-hot-toast";

const PropertyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ownerid = location?.state?.owner_id;
  const lead_id = location?.state?.lead_id;
  const lead_name = location?.state?.lead_name;
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null); 
  const [openModal, setOpenModal] = useState(false);

  const fk = useFormik({
    initialValues: {
      search: "",
      start_date: "",
      end_date: "",
      count: 10,
      ownerid: ownerid,
    },
    onSubmit: () => {
      setCurrentPage(1);
      refetch();
    },
  });

  const { data, isLoading, refetch } = useQuery(
    ["get_properties", ownerid, fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
    () =>
      axiosInstance.post(API_URLS.get_properties, {
        crm_owner_id: ownerid,
        search: fk.values.search,
        start_date: fk.values.start_date,
        end_date: fk.values.end_date,
        page: currentPage,
        count: 10,
      }),
    {
      keepPreviousData: true,
      enabled: !!ownerid,
    }
  );

  const allData = data?.data?.response || [];

  const assignMutation = useMutation(
    (property_id) =>
      axiosInstance.post(API_URLS.assign_property, {
        lead_id,
        property_id,
      }),
    {
      onSuccess: () => {
        toast.success("Property assigned to lead!");
        navigate('/leads')
        queryClient.invalidateQueries("get_properties");
        setOpenModal(false);
      },
      onError: () => toast.error("Failed to assign property"),
    }
  );

  const tableHead = [
    "S.No.",
    "Project ID",
    "BHK",
    "Property Type",
    "Expected Rent",
    "Tenant Type",
    "Availability",
    lead_id ? "Action" : null,
  ].filter(Boolean);

  const tableRow = allData?.data?.map((p, index) => {
    const row = [
      index + 1 + (currentPage - 1) * fk.values.count,
      p.crm_property_unique_id,
      p.crm_bhk,
      p.crm_property_type,
      p.crm_expected_rent,
      p.crm_tenant_type,
      p.crm_availability,
    ];

    if (lead_id) {
      row.push(
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            setSelectedProperty(p);
            setOpenModal(true); 
          }}
        >
          Assign
        </Button>
      );
    }

    return row;
  });

  return (
    <div className="p-4">
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
          placeholder="Search by .."
          name="search"
          value={fk.values.search}
          onChange={fk.handleChange}
        />
        <Button
          variant="contained"
          startIcon={<FilterAlt />}
          onClick={fk.handleSubmit}
        >
          Filter
        </Button>
      </div>

      <div className="flex justify-between items-center mb-3">
        <p className="text-red-600">
          Owner Name : {allData?.data?.[0]?.crm_owner_name || "--"}
        </p>
     
      </div>

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

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Property to Lead</DialogTitle>
        <DialogContent dividers>
          <p><strong>Lead Name:</strong> {lead_name}</p>
          <p><strong>Owner Name:</strong> {selectedProperty?.crm_owner_name}</p>
          <p><strong>Project ID:</strong> {selectedProperty?.crm_property_unique_id}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={() => assignMutation.mutate(selectedProperty.id)}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PropertyList;

