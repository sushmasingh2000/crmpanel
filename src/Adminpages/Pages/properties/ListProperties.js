import React from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import CustomTable from "../../Shared/CustomTable";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const PropertyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ownerid = location?.state?.owner_id;

  const { data, isLoading } = useQuery(
    ["get_properties"],
    () => axiosInstance.post(API_URLS.get_properties)
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

  const tableRow = allData.map((p , index) => [
     index+1,
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
      <div className="flex justify-end mb-3">
        <Button
          variant="contained"
          onClick={() => navigate("/create-property", {
            state : {
              owner_id : ownerid
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
    </div>
  );
};

export default PropertyList;
