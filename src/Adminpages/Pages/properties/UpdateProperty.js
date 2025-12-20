import { Button, MenuItem, TextField, Paper } from "@mui/material";
import { useFormik } from "formik";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const EditProperty = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const property = state?.property;

  const fk = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: property?.id,
      crm_bhk: property?.crm_bhk,
      crm_property_type: property?.crm_property_type,
      crm_expected_rent: property?.crm_expected_rent,
      crm_address: property?.crm_address,
      crm_tenant_type: property?.crm_tenant_type,
      crm_availability: property?.crm_availability,
    },
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post(
          API_URLS.update_properties,
          values
        );
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/properties");
        }
      } catch {
        toast.error("Update failed");
      }
    },
  });

  return (
    <Paper className="p-6 max-w-xl mx-auto mt-6">
      <p className="text-lg font-bold mb-4">Edit Property</p>

      <div className="grid gap-4">
        <TextField
          label="BHK"
          name="crm_bhk"
          value={fk.values.crm_bhk}
          onChange={fk.handleChange}
        />

        <TextField
          label="Property Type"
          name="crm_property_type"
          value={fk.values.crm_property_type}
          onChange={fk.handleChange}
        />

        <TextField
          label="Expected Rent"
          name="crm_expected_rent"
          value={fk.values.crm_expected_rent}
          onChange={fk.handleChange}
        />

        <TextField
          label="Address"
          name="crm_address"
          value={fk.values.crm_address}
          onChange={fk.handleChange}
        />

        <TextField
          select
          label="Availability"
          name="crm_availability"
          value={fk.values.crm_availability}
          onChange={fk.handleChange}
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Rented">Rented</MenuItem>
        </TextField>
      </div>

      <div className="flex justify-end mt-5 gap-3">
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={fk.handleSubmit}>
          Update
        </Button>
      </div>
    </Paper>
  );
};

export default EditProperty;
