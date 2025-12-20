import { Button, MenuItem, TextField, Paper } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import { useLocation, useNavigate } from "react-router-dom";

const CreateFollowup = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const lead = location.state?.lead_id;

    const fk = useFormik({
        enableReinitialize: true,
        initialValues: {
            crm_lead_id: lead,
            crm_status: "",
            crm_remark: "",
            crm_next_followup_date: "",
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const res = await axiosInstance.post(API_URLS.add_followup, values);
                if (res.data.success) {
                    toast.success(res.data.message);
                    navigate(-1); // 🔥 back to followup list
                }
            } catch (err) {
                toast.error("Something went wrong");
            }
            setLoading(false);
        },
    });

    return (
        <div className=" flex items-center justify-center p-4">
            <div  className="w-full max-w-md p-6 bg-white bg-opacity-45">
                <p className="text-lg font-bold mb-4 text-center">Add Follow-up</p>

                <div className="flex flex-col gap-4">
                    <TextField
                        select
                        label="Status"
                        name="crm_status"
                        value={fk.values.crm_status}
                        onChange={fk.handleChange}
                        fullWidth
                        required
                    >
                        <MenuItem value="Followup / Callback">Followup / Callback</MenuItem>
                        <MenuItem value="Interested">Interested</MenuItem>
                        <MenuItem value="Site Visit">Site Visit</MenuItem>
                        <MenuItem value="Deal Success">Deal Success</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </TextField>

                    <TextField
                        label="Remark"
                        name="crm_remark"
                        value={fk.values.crm_remark}
                        onChange={fk.handleChange}
                        fullWidth
                        multiline
                        rows={2}
                    />

                    <TextField
                        type="date"
                        label="Next Follow-up Date"
                        name="crm_next_followup_date"
                        InputLabelProps={{ shrink: true }}
                        value={fk.values.crm_next_followup_date}
                        onChange={fk.handleChange}
                        fullWidth
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
