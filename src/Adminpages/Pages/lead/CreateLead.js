import React, { useState } from "react";
import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import Loader from "../../../Shared/Loader";

const CreateLead = () => {
    const [loading, setLoading] = useState(false);

    const fk = useFormik({
        initialValues: {
            crm_lead_name: "",
            crm_mobile: "",
            crm_email: "",
            crm_service_type: "",
            crm_property_type: "",
            crm_locality: "",
            crm_city: "Lucknow",
            crm_lead_date: "",
        },  
        
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const res = await axiosInstance.post(API_URLS?.create_leads, values);
                if (res.data?.success) {
                    toast.success(res.data.message);
                    fk.resetForm();
                } else {
                    toast.error(res.data.message || "Failed to create lead");
                }
            } catch (e) {
                console.error(e);
                toast.error("Something went wrong");
            }
            setLoading(false);
        },
    });


    return (
        <div className="flex justify-center items-center w-full p-5">
            <Loader isLoading={loading}/>
            <div className=" rounded-lg p-5 w-full max-w-3xl">
                <p className="text-center font-bold text-lg mb-5">Create Lead</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        fullWidth
                        label="Lead Name"
                        name="crm_lead_name"
                        value={fk.values.crm_lead_name}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_lead_name && Boolean(fk.errors.crm_lead_name)}
                        helperText={fk.touched.crm_lead_name && fk.errors.crm_lead_name}
                    />
                    <TextField
                        fullWidth
                        label="Mobile"
                        name="crm_mobile"
                        value={fk.values.crm_mobile}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_mobile && Boolean(fk.errors.crm_mobile)}
                        helperText={fk.touched.crm_mobile && fk.errors.crm_mobile}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="crm_email"
                        value={fk.values.crm_email}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_email && Boolean(fk.errors.crm_email)}
                        helperText={fk.touched.crm_email && fk.errors.crm_email}
                    />
          
                    <TextField
                        select
                        fullWidth
                        label="Service Type"
                        name="crm_service_type"
                        value={fk.values.crm_service_type}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_service_type && Boolean(fk.errors.crm_service_type)}
                        helperText={fk.touched.crm_service_type && fk.errors.crm_service_type}
                    >
                        <MenuItem value="Rent">Rent</MenuItem>
                        <MenuItem value="Resale">Resale</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        label="Property Type"
                        name="crm_property_type"
                        value={fk.values.crm_property_type}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_property_type && Boolean(fk.errors.crm_property_type)}
                        helperText={fk.touched.crm_property_type && fk.errors.crm_property_type}
                    />
                    <TextField
                        fullWidth
                        label="Locality"
                        name="crm_locality"
                        value={fk.values.crm_locality}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_locality && Boolean(fk.errors.crm_locality)}
                        helperText={fk.touched.crm_locality && fk.errors.crm_locality}
                    />
                    <TextField
                        fullWidth
                        label="City"
                        name="crm_city"
                        value={fk.values.crm_city}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_city && Boolean(fk.errors.crm_city)}
                        helperText={fk.touched.crm_city && fk.errors.crm_city}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="Lead Date"
                        name="crm_lead_date"
                        InputLabelProps={{ shrink: true }}
                        value={fk.values.crm_lead_date}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_lead_date && Boolean(fk.errors.crm_lead_date)}
                        helperText={fk.touched.crm_lead_date && fk.errors.crm_lead_date}
                    />
                </div>
                <div className="flex justify-end gap-3 mt-5">
                    <Button variant="contained" color="error" onClick={() => fk.resetForm()}>
                        Clear
                    </Button>
                    <Button variant="contained" color="success" onClick={fk.handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateLead;
