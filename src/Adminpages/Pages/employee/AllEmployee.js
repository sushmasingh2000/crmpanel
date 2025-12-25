import { Edit, FilterAlt, UploadFile } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomDialog from "../../Shared/CustomDialogBox";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import ExcelUploadButton from "../../Shared/ExcelUploadButton";

const EmployeeList = () => {
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditingEmployee(null);
    };

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

    const initialValues = { email: "", mobile: "", name: "", pass: "" };
    const formik = useFormik({
        initialValues,
        onSubmit: () => {
            const reqBody = {
                crm_mobile: formik.values.mobile,
                crm_email: formik.values.email,
                crm_password: formik.values.pass,
                crm_name: formik.values.name,
            };
            EmployeeReg(reqBody);
        },
    });

    const [editingEmployee, setEditingEmployee] = useState(null);

    const EmployeeReg = async (reqBody) => {
        try {
            const payload = editingEmployee
                ? { ...reqBody, employee_id: editingEmployee.id }
                : reqBody;

            const response = await axiosInstance.post(API_URLS.emp_registration, payload);
            toast(response?.data?.msg);
            if (response?.data?.success) {
                formik.resetForm();
                setEditingEmployee(null);
                handleClose();
                refetch();
            }
        } catch (e) {
            console.log(e);
            toast("Error connecting to server.");
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        formik.setValues({
            name: employee.name || "",
            email: employee.email || "",
            mobile: employee.mobile || "",
            pass: employee.password || "",
        });
        setOpen(true);
    };

    // ------------------ Excel Upload Function ------------------
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) {
            toast("Please choose a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            const response = await axiosInstance.post("/employee-excel", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast(response.data?.message || "Upload successful");
            setFile(null);
            refetch();
        } catch (err) {
            console.error(err);
            toast("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };
    // ------------------------------------------------------------

    const tableHead = ["S.No.", "Name", "Email", "Mobile", "Password", "Action"];
    const tableRow = allData?.map((f, idx) => [
        idx + 1,
        f.name,
        f.email || "--",
        f.mobile || "--",
        f.password || "--",
        <Edit style={{ cursor: "pointer", color: "green" }} onClick={() => handleEdit(f)} />,
    ]);

    return (
        <div className="">
            <div className="flex justify-between mb-3">
                <p className="font-bold text-xl">Employee Details</p>

                <div className="flex gap-2">
                    {/* <ExcelUploadButton onUploadSuccess={refetch} /> */}
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        + Add Employee
                    </Button>
                </div>
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
                    placeholder="Search by ....."
                    name="search"
                    value={fk.values.search}
                    onChange={fk.handleChange}
                />
                <Button variant="contained" startIcon={<FilterAlt />} onClick={fk.handleSubmit}>
                    Filter
                </Button>
            </div>

            <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
            <CustomToPagination page={currentPage} setPage={setCurrentPage} data={allData} />

            <CustomDialog
                open={open}
                onClose={handleClose}
                onSubmit={formik.handleSubmit}
                title={editingEmployee ? "Edit Employee" : "Add Employee"}
                formik={formik}
                fields={[
                    { name: "name", label: "Name", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "mobile", label: "Mobile", type: "text" },
                    { name: "pass", label: "Password", type: "password" },
                ]}
            />
        </div>
    );
};

export default EmployeeList;
