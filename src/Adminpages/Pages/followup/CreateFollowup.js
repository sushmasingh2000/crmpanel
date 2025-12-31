import { Button, MenuItem, TextField, Paper } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";

const CreateFollowup = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const followup = location.state?.followup;

    const lead = location.state?.lead_id;

    const fk = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: followup?.id || null,
            crm_lead_id: lead,
            crm_status: followup?.crm_status || "",
            crm_remark: followup?.crm_remark || "",
            crm_next_followup_date: followup?.crm_next_followup_date
                ? moment(followup?.crm_next_followup_date)?.format("YYYY-MM-DD")
                : "",
            aadhaar: null,
            pan: null,
            rent_paper: null,
            agreement: null,
        },

        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();

                Object.keys(values).forEach((key) => {
                    if (values[key]) {
                        formData.append(key, values[key]);
                    }
                });

                const res = await axiosInstance.post(
                    API_URLS.add_followup,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (res.data.success) {
                    toast.success(res.data.message);
                    navigate(-1);
                }
            } catch (err) {
                toast.error("Something went wrong");
            }
            setLoading(false);
        }

    });

    const { data: statusList } = useQuery(
        ["get_followup_master"],
        () =>
            axiosInstance.post(API_URLS.get_followup_master, {
                count: 100000,
                status: 1
            }),
        {
            refetchOnWindowFocus: false,
        }
    );

    const status = statusList?.data?.response || [];

    const isClosed = fk.values.crm_status === "Closed";
    const handleFileChange = (e) => {
        fk.setFieldValue(e.target.name, e.target.files[0]);
    };



    return (
        <div className=" flex items-center justify-center p-4">
            <div className="w-full  p-6 bg-white bg-opacity-45">
                <p className="text-lg font-bold mb-4 text-center lg:mb-8">
                    {followup?.id ? "Update Follow-up" : "Add Follow-up"}</p>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                    <TextField
                        select
                        label="Select FollowUp Status"
                        name="crm_status"
                        value={fk.values.crm_status}
                        onChange={fk.handleChange}
                        fullWidth
                        required
                    >

                        {status?.data?.map((item) => (
                            <MenuItem key={item.followup_status_id} value={item.followup_status_name}>
                                {item.followup_status_name}
                            </MenuItem>
                        ))}

                    </TextField>

                    <TextField
                        type="date"
                        label="Next Follow-up Date"
                        name="crm_next_followup_date"
                        InputLabelProps={{ shrink: true }}
                        value={fk.values.crm_next_followup_date}
                        onChange={fk.handleChange}
                        fullWidth
                    />
                    {isClosed && (
                        <>
                            <TextField
                                fullWidth
                                type="file"
                                name="aadhaar"
                                onChange={handleFileChange}
                            />

                            <TextField fullWidth type="file" name="pan" onChange={handleFileChange} />
                            <TextField fullWidth type="file" name="rent_paper" onChange={handleFileChange} />
                            <TextField fullWidth type="file" name="agreement" onChange={handleFileChange} />

                        </>
                    )}
                    <TextField
                        label="Remark"
                        name="crm_remark"
                        value={fk.values.crm_remark}
                        onChange={fk.handleChange}
                        fullWidth
                        multiline
                        rows={2}
                    />
                </div>


                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => fk.resetForm()}
                        disabled={loading}
                    >
                        Clear
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fk.handleSubmit}
                        disabled={loading || !lead}
                    >
                        {loading ? "Saving..." : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateFollowup;
