import { Button, MenuItem, TextField, Paper } from "@mui/material";
import { useFormik } from "formik";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateOwner = () => {

  const fk = useFormik({
    initialValues: {
      crm_owner_name: "",
      crm_mobile: "",
      crm_area: "",
      crm_owner_category: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post( API_URLS.add_owners, values);
        if (res.data.success) {
          toast.success(res.data.msg);
        }
      } catch {
        toast.error("Failed to create owner");
      }
    },
  });

  return (
    <div className="bg-white bg-opacity-40 mx-10 p-6  mt-6">
      <p className="font-bold text-xl text-center mb-4 lg:mb-8">Create Owner</p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 ">
        <TextField label="Owner Name" name="crm_owner_name" onChange={fk.handleChange} />
        <TextField label="Mobile" name="crm_mobile" onChange={fk.handleChange} />
        <TextField label="Area" name="crm_area" onChange={fk.handleChange} />

        <TextField
          select
          label="Owner Category"
          name="crm_owner_category"
          onChange={fk.handleChange}
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
