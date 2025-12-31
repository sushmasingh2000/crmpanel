import { FilterAlt } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URLS, domain } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";

const FollowupList = () => {

    const location = useLocation();
    const lead = location.state.lead_id
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const fk = useFormik({
        initialValues: {
            search: "",
            start_date: "",
            end_date: "",
            count: 10,
        },
        onSubmit: () => {
            setCurrentPage(1);
            refetch();
        },
    });

    const { data, isLoading, refetch } = useQuery(
        ["get_follow_up", lead, fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
        () =>
            axiosInstance.post(API_URLS.get_followup, {
                crm_lead_id: lead,
                search: fk.values.search,
                start_date: fk.values.start_date,
                end_date: fk.values.end_date,
                page: currentPage,
                count: 10,
            }),
        {
            keepPreviousData: true,
            enabled: !!lead,
        }
    );
    const allData = data?.data?.response || [];

    const FileLinks = ({ f }) => {
        if (f.crm_status !== "Closed") return "--";

        const BASE_URL = `${domain}/uploads/followups/`;

        return (
            <div className="flex flex-col gap-1 text-sm">
                {f.aadhaar && (
                    <a href={BASE_URL + f.aadhaar} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Aadhaar
                    </a>
                )}
                {f.pan && (
                    <a href={BASE_URL + f.pan} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        PAN
                    </a>
                )}
                {f.rent_paper && (
                    <a href={BASE_URL + f.rent_paper} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Rent Paper
                    </a>
                )}
                {f.agreement && (
                    <a href={BASE_URL + f.agreement} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Agreement
                    </a>
                )}
            </div>
        );
    };


    const tableHead = [
        "S.No.",
        "Status",
        "Remark",
        "Documents",
        "Follow-up Date",
        "Next Follow-up Date",
        "Action"
    ];

    const tableRow = allData?.data?.map((f, idx) => [
        idx + 1,
        f.crm_status_name || f.crm_status,
        f.crm_remark || "--",
        <FileLinks f={f} />,
        f.crm_created_at ? moment(f.crm_created_at).format("YYYY-MM-DD") : "--",
        f.crm_next_followup_date
            ? moment(f.crm_next_followup_date).format("YYYY-MM-DD")
            : "--",
        <Button
            size="small"
            variant="outlined"
            onClick={() =>
                navigate("/create-follow-up", {
                    state: {
                        lead_id: lead,
                        followup: f,
                    },
                })
            }
        >
            Edit
        </Button>
    ]);



    return (
        <div className="">
            <div className="flex justify-between mb-3">
                <p className="font-bold text-xl">FollowUp </p>
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
            <div className="flex gap-3 mb-4">
                <TextField
                    type="date"
                    value={fk.values.start_date}
                    onChange={(e) => fk.setFieldValue("start_date", e.target.value)}
                />
                <TextField
                    type="date"
                    value={fk.values.end_date}
                    onChange={(e) => fk.setFieldValue("end_date", e.target.value)}
                />
                <TextField
                    type="search"
                    placeholder="Search by Status"
                    name="search"
                    value={fk.values.search}
                    onChange={fk.handleChange}
                />
                <Button
                    variant="contained"
                    startIcon={<FilterAlt />}
                    onClick={fk.handleSubmit}
                >
                    Filter
                </Button>
            </div>

            <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
            <CustomToPagination
                page={currentPage}
                setPage={setCurrentPage}
                data={allData}
            />
        </div>
    );
};

export default FollowupList;
