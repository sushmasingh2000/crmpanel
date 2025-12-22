import { Button, TextField, Autocomplete, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const CreateOwner = () => {

  const navigate = useNavigate();
  const { data: areaData } = useQuery(
    ["get_area"],
    () =>
      axiosInstance.post(API_URLS.get_area, {
        status: 1,
        count: 100000,
      }),
    { refetchOnWindowFocus: false }
  );

  const areas = areaData?.data?.response?.data || [];

  const fk = useFormik({
    initialValues: {
      crm_owner_name: "",
      crm_mobile: "",
      crm_area: "",
      crm_pincode: "",
      crm_owner_category: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post(API_URLS.add_owners, values);
        toast(res.data.msg);
        if (res.data.success) {
          navigate('/list-owner')
          fk.resetForm();
        }
      } catch {
        toast.error("Failed to create owner");
      }
    },
  });

  return (
    <div className="bg-white bg-opacity-40 mx-10 p-6 mt-6">
      <p className="font-bold text-xl text-center mb-4 lg:mb-8">Create Owner</p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        <TextField
          label="Owner Name"
          name="crm_owner_name"
          onChange={fk.handleChange}
          value={fk.values.crm_owner_name}
          fullWidth
        />

        <TextField
          label="Mobile"
          name="crm_mobile"
          onChange={fk.handleChange}
          value={fk.values.crm_mobile}
          fullWidth
        />

        {/* Autocomplete for Area */}
        <Autocomplete
          options={areas}
          getOptionLabel={(option) => option.area_name || ""}
          value={areas.find((a) => a.area_name === fk.values.crm_area) || null}
          onChange={(event, value) => {
            fk.setFieldValue("crm_area", value?.area_name || "");
            fk.setFieldValue("crm_pincode", value?.pincode || "");
          }}
          renderInput={(params) => (
            <TextField {...params} label="Area" fullWidth />
          )}
        />

        {/* Pincode (auto-filled) */}
        <TextField
          label="Pincode"
          name="crm_pincode"
          value={fk.values.crm_pincode}
          InputProps={{ readOnly: true }}
          fullWidth
        />

        {/* Owner Category */}
        <TextField
          select
          label="Owner Category"
          name="crm_owner_category"
          onChange={fk.handleChange}
          value={fk.values.crm_owner_category}
          fullWidth
        >
          <MenuItem value="Flat">Flat</MenuItem>
          <MenuItem value="Independent House">Independent House</MenuItem>
          <MenuItem value="Independent Floor">Independent Floor</MenuItem>
        </TextField>
      </div>

      <div className="flex justify-end mt-4 gap-3">
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

export default CreateOwner;
