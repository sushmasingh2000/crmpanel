import { Button, TextField } from "@mui/material";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import CustomTable from "../../Shared/CustomTable";
import { useNavigate } from "react-router-dom";
import { Edit, FilterAlt } from "@mui/icons-material";
import { useState } from "react";
import { useFormik } from "formik";
import CustomToPagination from "../../../Shared/Pagination";

const OwnerList = () => {
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
        ["owners", fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
        () => axiosInstance.post(API_URLS.get_owner, {
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

    const owners = data?.data?.response || [];

    const tableHead = ["S.No.", "Name", "Mobile", "Area", "Category", "Property"];

    const tableRow = owners?.data?.map((o, index) => [
        index + 1,
        o.crm_owner_name,
        o.crm_mobile,
        o.crm_area,
        o.crm_owner_category,
        <span><Edit onClick={() => navigate('/list_properties', {
            state: {
                owner_id: o.id
            }
        })} /></span>
    ]);

    return (
        <div className="p-4">
            <div className="flex justify-between mb-3">
                <p className="font-bold text-xl">Owner </p>
                <Button
                    variant="contained"
                    onClick={() => navigate("/create-owner")}
                >
                    + Add Owner
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
                    placeholder="Search by name or mobile"
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
            <CustomTable
                tablehead={tableHead}
                tablerow={tableRow}
                isLoading={isLoading}
            />
            <CustomToPagination
                page={currentPage}
                setPage={setCurrentPage}
                totalPage={owners}
            />
        </div>
    );
};

export default OwnerList;
