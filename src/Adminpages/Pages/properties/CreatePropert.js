import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CreateProperty = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const ownerid = location?.state?.owner_id;

  const fk = useFormik({
    initialValues: {
      crm_owner_id: ownerid || "",
      crm_bhk: "",
      crm_property_type: "",
      crm_expected_rent: "",
      crm_address: "",
      crm_tenant_type: "",
      crm_availability: "Available",
    },
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post(
          API_URLS.create_properties,
          values
        );
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/list_properties");
        }
      } catch (err) {
        toast.error("Failed to create property");
      }
    },
    enableReinitialize: true,
  });

  return (
    <div className="p-6 mt-6 bg-white bg-opacity-35">
      <p className="text-xl text-center font-bold mb-4">Create Property</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextField
          label="BHK"
          name="crm_bhk"
          value={fk.values.crm_bhk}
          onChange={fk.handleChange}
          fullWidth
        />

        {/* ✅ ENUM → SELECT */}
        <TextField
          select
          label="Property Type"
          name="crm_property_type"
          value={fk.values.crm_property_type}
          onChange={fk.handleChange}
          fullWidth
        >
          <MenuItem value="Apartment">Apartment</MenuItem>
          <MenuItem value="Independent House">Independent House</MenuItem>
          <MenuItem value="Independent Floor">Independent Floor</MenuItem>
        </TextField>

        {/* ✅ number */}
        <TextField
          type="number"
          label="Expected Rent"
          name="crm_expected_rent"
          value={fk.values.crm_expected_rent}
          onChange={fk.handleChange}
          fullWidth
        />

        <TextField
          label="Address"
          name="crm_address"
          value={fk.values.crm_address}
          onChange={fk.handleChange}
          fullWidth
        />

        {/* ✅ ENUM → SELECT */}
        <TextField
          select
          label="Tenant Type"
          name="crm_tenant_type"
          value={fk.values.crm_tenant_type}
          onChange={fk.handleChange}
          fullWidth
        >
          <MenuItem value="Family">Family</MenuItem>
          <MenuItem value="Bachelor">Bachelor</MenuItem>
          <MenuItem value="Both">Both</MenuItem>
        </TextField>

        <TextField
          select
          label="Availability"
          name="crm_availability"
          value={fk.values.crm_availability}
          onChange={fk.handleChange}
          fullWidth
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Rented">Rented</MenuItem>
        </TextField>
      </div>

      <div className="flex justify-end mt-5 gap-3">
        <Button variant="outlined" onClick={() => fk.resetForm()}>
          Clear
        </Button>
        <Button variant="contained" onClick={fk.handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateProperty;
