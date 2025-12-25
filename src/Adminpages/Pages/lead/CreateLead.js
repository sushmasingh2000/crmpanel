import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import Loader from "../../Shared/Loader";

const CreateLead = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const lead = location.state?.lead || {}

    const fk = useFormik({
        initialValues: {
            crm_lead_name: lead?.crm_lead_name || "",
            crm_mobile: lead?.crm_mobile || "",
            crm_email: lead?.crm_email || "",
            crm_service_type: lead?.crm_service_type || "",
            crm_property_type: lead?.crm_property_type || "",
            crm_locality: lead?.crm_locality || "",
            crm_city: lead?.crm_city || "Lucknow",
            crm_lead_date: lead.crm_lead_date ? lead.crm_lead_date.split("T")[0] : "",
            crm_bhk: lead?.crm_bhk || "",
            crm_price: lead?.crm_price || "",
            crm_building: lead?.crm_building || "",
            crm_address: lead?.crm_address || "",
        },

        onSubmit: async (values) => {
            setLoading(true);
            try {
                const payload = lead?.id ? { ...values, lead_id: lead.id } : values;
                const res = await axiosInstance.post(API_URLS.create_leads, payload);
                toast(res.data.message);
                if (res.data.success) {
                    navigate("/leads");
                    fk.resetForm();
                } else {
                    toast.error(res.data.message || "Failed to save lead");
                }
            } catch (e) {
                console.error(e);
                toast.error("Something went wrong");
            }
            setLoading(false);
        },
    });



    const { data: serviceList } = useQuery(
        ["get_service_type_master"],
        () =>
            axiosInstance.post(API_URLS.get_service_type, {
                count: 10000000000,
                status: 1
            }),
        {
            refetchOnWindowFocus: false,
        }
    );

    const services = serviceList?.data?.response || [];

    const { data: propertyList } = useQuery(
        ["get_property_master"],
        () =>
            axiosInstance.post(API_URLS.get_property_master, {
                count: 100000,
                status: 1,
            }),
        { refetchOnWindowFocus: false }
    );

    const properties = propertyList?.data?.response || [];


    return (
        <div className="flex justify-center items-center w-full p-5">
            <Loader isLoading={loading} />
            <div className=" rounded-lg p-5 w-full lg:max-w-6xl bg-white bg-opacity-45">
                <p className="text-center font-bold text-lg mb-5">
                    {lead?.id ? "Update Lead" : "Create Lead"} </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                        label="Select Service"
                        name="crm_service_type"
                        value={fk.values.crm_service_type}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_service_type && Boolean(fk.errors.crm_service_type)}
                        helperText={fk.touched.crm_service_type && fk.errors.crm_service_type}
                    >
                        {services?.data?.map((item) => (
                            <MenuItem key={item.service_type_id} value={item.service_type_name}>
                                {item.service_type_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Select Property"
                        name="crm_property_type"
                        value={fk.values.crm_property_type}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_property_type && Boolean(fk.errors.crm_property_type)}
                        helperText={fk.touched.crm_property_type && fk.errors.crm_property_type}
                    >
                        {properties?.data?.map((item) => (
                            <MenuItem key={item.property_type_id} value={item.property_type_name}>
                                {item.property_type_name}
                            </MenuItem>
                        ))}
                    </TextField>
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
                    <TextField
                        fullWidth
                        label="BHK"
                        name="crm_bhk"
                        value={fk.values.crm_bhk}
                        onChange={fk.handleChange}
                    />

                    <TextField
                        fullWidth
                        type="number"
                        label="Price"
                        name="crm_price"
                        value={fk.values.crm_price}
                        onChange={fk.handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Building (Optional)"
                        name="crm_building"
                        value={fk.values.crm_building}
                        onChange={fk.handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Address (Optional)"
                        name="crm_address"
                        value={fk.values.crm_address}
                        onChange={fk.handleChange}
                    />

                </div>
                <div className="flex justify-end gap-3 mt-5">
                    <Button variant="contained" color="error" onClick={() => fk.resetForm()}>
                        Clear
                    </Button>
                    <Button variant="contained" color="success" onClick={fk.handleSubmit}>
                        {lead?.id ? "Update" : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateLead;
