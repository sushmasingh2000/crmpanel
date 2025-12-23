import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import moment from "moment";
import CustomTable from "../../Shared/CustomTable";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import { useFormik } from "formik";
import CustomToPagination from "../../../Shared/Pagination";

const EmployeeList = () => {

    const location = useLocation();
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
        ["get_employee", fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
        () =>
            axiosInstance.post(API_URLS.employee_list, {
                search: fk.values.search,
                start_date: fk.values.start_date,
                end_date: fk.values.end_date,
                page: currentPage,
                count: 10,
            }),
        {
            keepPreviousData: true,
        }
    );
    const allData = data?.data?.data || [];


    const tableHead = ["S.No.", "Name", "Email", "Mobile"];

    const tableRow = allData?.map((f, idx) => [
        idx + 1,
        f.name,
        f.email || "--",
        f.mobile || "--",
    ]);


    return (
        <div className="">
            <div className="flex justify-between mb-3">
                <p className="font-bold text-xl">Employee Details </p>
                
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

export default EmployeeList;
