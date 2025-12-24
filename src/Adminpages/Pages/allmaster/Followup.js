import { Add, Edit } from "@mui/icons-material";
import { Button, IconButton, Switch, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { API_URLS } from "../../config/APIUrls"; // API endpoints file
import axiosInstance from "../../config/axios"; // axios with auth
import CustomDialog from "../../Shared/CustomDialogBox";
import CustomFilter from "../../Shared/CustomForFiler";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../../Shared/Pagination";
import toast from "react-hot-toast";

const FollowupMaster = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [page, setPage] = useState(1);
    

    /* ================= FILTER FORM ================= */
    const filterFormik = useFormik({
        initialValues: {
            search: "",
            start_date: "",
            end_date: "",
        },
    });

    /* ================= GET LIST ================= */
    const { isLoading, data: statusList } = useQuery(
        ["get_followup_master", page, filterFormik.values.search],
        () =>
            axiosInstance.post(API_URLS.get_followup_master, {
                search: filterFormik.values.search,
                page,
                count: 10,
            }),
        {
            refetchOnWindowFocus: false,
        }
    );

    const status = statusList?.data?.response || [];

    /* ================= ADD / EDIT FORM ================= */
    const fk = useFormik({
        initialValues: { name: "", desc: "" },
        onSubmit: async (values) => {
            if (editData) return updateStatus(values);
            return createStatus(values);
        },
    });

    /* ================= CREATE ================= */
    const createStatus = async (values) => {
        try {
            const res = await axiosInstance.post(API_URLS.create_followup_status, {
                followup_status_name: values.name,
                followup_status_desc: values.desc,
            });
            toast(res?.data?.message);
            if (res?.data?.success) {
                queryClient.invalidateQueries("get_followup_master");
                handleClose();
            }
        } catch {
            toast.error("Failed to create followup status");
        }
    };

    /* ================= UPDATE ================= */
    const updateStatus = async (values) => {
        try {
            const res = await axiosInstance.post(API_URLS.update_followup_status, {
                followup_status_id: editData.followup_status_id,
                followup_status_name: values.name,
                followup_status_desc: values.desc,
            });
            toast(res?.data?.msg);
            if (res?.data?.success) {
                queryClient.invalidateQueries("get_followup_master");
                handleClose();
            }
        } catch {
            toast.error("Failed to update followup status");
        }
    };

    /* ================= TOGGLE STATUS ================= */
    const toggleStatus = async (row) => {
        try {
            const res = await axiosInstance.post(API_URLS.toggle_followup_status, {
                followup_status_id: row.followup_status_id,
            });
            toast(res?.data?.msg);
            if (res?.data?.success) {
                queryClient.invalidateQueries("get_followup_master");
            }
        } catch {
            toast.error("Failed to toggle status");
        }
    };

    /* ================= HANDLERS ================= */
    const handleOpen = () => {
        fk.resetForm();
        setEditData(null);
        setOpen(true);
    };

    const handleEdit = (row) => {
        setEditData(row);
        fk.setValues({
            name: row.followup_status_name,
            desc: row.followup_status_desc,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditData(null);
    };

    /* ================= TABLE ================= */
    const tablehead = ["S.No", "Name", "Description", "Status", "Actions", "Date"];
    const tablerow = status?.data?.map((item, index) => [
        <span>{index + 1}</span>,
        <span>{item.followup_status_name}</span>,
        <span>{item.followup_status_desc || "--"}</span>,
        <Switch
            checked={item.followup_status_status === 1}
            onChange={() => toggleStatus(item)}
            color="success"
        />,
        <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(item)}>
                <Edit className="text-blue-600" />
            </IconButton>
        </Tooltip>,
        <span>{moment(item.created_at).format("DD-MM-YYYY")}</span>,
    ]);

    return (
        <>
            <div className="mx-5">
                <div className="flex justify-between items-center p-4">
                    <p className="font-bold text-xl">FollowUp</p>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpen}
                        className="!bg-gradient-to-b from-[#7981F9] to-[#5E60D0]"
                    >
                        Add FollowUp
                    </Button>
                </div>

                <CustomFilter
                    formik={filterFormik}
                    onFilter={() => {
                        setPage(1);
                        queryClient.invalidateQueries("get_followup_master");
                    }}
                    onClear={() => {
                        filterFormik.resetForm();
                        setPage(1);
                        queryClient.invalidateQueries("get_followup_master");
                    }}
                />

                <CustomTable
                    tablehead={tablehead}
                    tablerow={tablerow}
                    isLoading={isLoading}
                />

                <CustomToPagination setPage={setPage} page={page} data={statusList?.data} />
            </div>

            <CustomDialog
                open={open}
                onClose={handleClose}
                onSubmit={fk.handleSubmit}
                title={editData ? "Edit Status" : "Add Status"}
                formik={fk}
                fields={[
                    { name: "name", label: "Status Name", type: "text" },
                    { name: "desc", label: "Description", type: "text" },
                ]}
            />
        </>
    );
};

export default FollowupMaster;
