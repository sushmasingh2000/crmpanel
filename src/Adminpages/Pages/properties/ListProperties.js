import React, { useState } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import CustomTable from "../../Shared/CustomTable";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FilterAlt } from "@mui/icons-material";
import CustomToPagination from "../../Shared/Pagination";

const PropertyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ownerid = location?.state?.owner_id;
  const [currentPage, setCurrentPage] = useState(1);

  const fk = useFormik({
    initialValues: {
      search: "",
      start_date: "",
      end_date: "",
      count: 10,
      ownerid: ""
    },
    onSubmit: () => {
      setCurrentPage(1);
      refetch();
    },
  });

  const { data, isLoading, refetch } = useQuery(
    ["get_properties", ownerid, fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
    () => axiosInstance.post(API_URLS.get_properties, {
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

  const tableHead = [
    "S.No.",
    "Owner",
    "Mobile",
    "BHK",
    "Property Type",
    "Expected Rent",
    "Tenant Type",
    "Availability"
  ];

  const tableRow = allData?.data?.map((p, index) => [
    index + 1,
    p.crm_owner_name,
    p.crm_mobile,
    p.crm_bhk,
    p.crm_property_type,
    p.crm_expected_rent,
    p.crm_tenant_type,
    p.crm_availability,

  ]);

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
      <div className="flex justify-end mb-3">
        <Button
          variant="contained"
          onClick={() => navigate("/create-property", {
            state: {
              owner_id: ownerid
            }
          })}
        >
          + Add Property
        </Button>
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
    </div>
  );
};

export default PropertyList;
