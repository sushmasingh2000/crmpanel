import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import moment from "moment";
import CustomTable from "../../Shared/CustomTable";
import { Edit, FilterAlt, RemoveRedEye } from "@mui/icons-material";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import CustomToPagination from "../../../Shared/Pagination";

const LeadList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // number type

  const fk = useFormik({
    initialValues: {
      search: "",
      start_date: "",
      end_date: "",
      count: 10,
    },
    onSubmit: () => {
      setCurrentPage(1); // Filter lagate hi page 1 pe set ho
      refetch();
    },
  });

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
    {
      keepPreviousData: true,
    }
  );

  const allData = leadsData?.data?.response || [];


  const tableHead = [
    "Id",
    "Name",
    "Mobile",
    "Email",
    "Service Type",
    "Property Type",
    "Locality",
    "City",
    "FollowUp",
    "Lead Date",
    "Created At",
  ];

  const tableRow = allData?.data?.map((lead, index) => [
    index + 1 + (currentPage - 1) * fk.values.count, // show correct serial number
    lead.crm_lead_name,
    lead.crm_mobile,
    lead.crm_email,
    lead.crm_service_type,
    lead.crm_property_type,
    lead.crm_locality,
    lead.crm_city,
    <span className="flex justify-center items-center">
      <Edit className="!text-green-600" onClick={() => navigate('/follow-up', {
      state: {
        lead_id: lead?.id
      }
    })} />  </span>,
    lead.crm_lead_date ? moment(lead.crm_lead_date).format("YYYY-MM-DD") : "--",
    lead.crm_created_at ? moment(lead.crm_created_at).format("YYYY-MM-DD") : "--",
  ]);

  return (
    <div className="">
      <div className="flex justify-between">
           <p className="font-bold text-xl">Leads</p>
        <Button
          variant="contained"
          onClick={() => navigate("/add-lead")}
        >
          + Add Lead
        </Button>
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

      <CustomTable
        tablehead={tableHead}
        tablerow={tableRow}
        isLoading={isLoading}
      />

      <CustomToPagination
        page={currentPage}
        setPage={setCurrentPage}
        totalPage={allData}
      />
    </div>
  );
};

export default LeadList;
