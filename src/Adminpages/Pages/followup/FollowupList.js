import React, { useEffect } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import moment from "moment";
import CustomTable from "../../Shared/CustomTable";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const FollowupList = () => {

    const location = useLocation();
    const lead = location.state.lead_id
    const navigate = useNavigate();

    const { data, isLoading } = useQuery(
        ["get_follow_up", lead],
        () =>
            axiosInstance.post(API_URLS.get_followup, {
                crm_lead_id: lead,
            }),
        {
            keepPreviousData: true,
            enabled: !!lead,
        }
    );

    const allData = data?.data?.response || [];


    const tableHead = ["S.No.", "Status", "Remark", "Follow-up Date", "Next Follow-up Date" ];

    const tableRow = allData?.map((f, idx) => [
        idx + 1,
        f.crm_status_name,
        f.crm_remark || "--",
        f.crm_created_at ? moment(f.crm_created_at).format("YYYY-MM-DD") : "--",
        f.crm_next_followup_date
            ? moment(f.crm_next_followup_date).format("YYYY-MM-DD")
            : "--",
    ]);


    return (
        <div className="">
            <div className="flex justify-end my-4">
                <Button
                    variant="contained"
                    onClick={() => navigate("/create-follow-up", {
                        state: {
                            lead_id: lead
                        }
                    })}
                >
                    + Add Followup
                </Button>
            </div>
            <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
        </div>
    );
};

export default FollowupList;
