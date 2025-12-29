import { FilterAlt } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/APIUrls";
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


   const tableHead = [
  "S.No.",
  "Status",
  "Remark",
  "Follow-up Date",
  "Next Follow-up Date",
  "Action"
];

const tableRow = allData?.data?.map((f, idx) => [
  idx + 1,
  f.crm_status_name || f.crm_status,
  f.crm_remark || "--",
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
