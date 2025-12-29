import { FilterAlt } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomDialog from "../../Shared/CustomDialogBox";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";

const OwnerList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [open, setOpen] = useState(false);
    const [ownerId, setOwnerId] = useState(null);

    const handleOpen = (id) => {
        setOwnerId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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

    const fkProperty = useFormik({
        initialValues: {
            crm_owner_id: ownerId || "",
            crm_bhk: "",
            crm_property_type: "",
            crm_service_type: "",
            crm_expected_rent: "",
            crm_city: "",
            crm_area: "",
            crm_pincode: "",
            crm_address: "",
            crm_tenant_type: "",
            crm_availability: "Available",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await axiosInstance.post(
                    API_URLS.create_properties,
                    values
                );
                if (res.data.success) {
                    toast.success(res.data.message);
                    handleClose();
                    refetch(); // owner list refresh
                }
            } catch (err) {
                toast.error("Failed to create property");
            }
        },
    });

    const handleOpenOwnerDialog = (owner = null) => {
        setSelectedOwner(owner);
        setOwnerDialogOpen(true);
    };

    const handleCloseOwnerDialog = () => {
        setSelectedOwner(null);
        setOwnerDialogOpen(false);
    };

    const fkOwner = useFormik({
        initialValues: {
            crm_owner_name: selectedOwner?.crm_owner_name || "",
            crm_mobile: selectedOwner?.crm_mobile || "",
            crm_area: selectedOwner?.crm_area || "",
            crm_pincode: selectedOwner?.crm_pincode || "",
            crm_owner_email: selectedOwner?.crm_owner_email || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const payload = { ...values };
                if (selectedOwner?.id) payload.crm_owner_id = selectedOwner.id;
                const res = await axiosInstance.post(API_URLS.add_owners, payload);
                toast[res.data.success ? "success" : "error"](res.data.msg);
                if (res.data.success) {
                    refetch();
                    handleCloseOwnerDialog();
                }
            } catch (err) {
                toast.error("Failed to save owner");
            }
        },
    });


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

    const { data: areaData } = useQuery(
        ["get_area"],
        () =>
            axiosInstance.post(API_URLS.get_area, {
                status: 1,
                count: 100000,
            }),
        { refetchOnWindowFocus: false }
    );

    const areas = areaData?.data?.response?.data || [];

    const { data: bhkData } = useQuery(
        ["get_bhk"],
        () =>
            axiosInstance.post(API_URLS.master_bhk, {
                status: 1,
                count: 100000,
            }),
        { refetchOnWindowFocus: false }
    );

    const bhk = bhkData?.data?.response || [];


    const uniqueCities = [...new Set(areas.map(a => a.city_name))];


    const tableHead = ["S.No.", "Name", "Mobile", "Email", "Date", "Property", "Owner"];

    const tableRow = owners?.data?.map((o, index) => [
        index + 1,
        <span onClick={() => navigate('/list_properties', {
            state: { owner_id: o?.id }
        })} className="text-blue-600 underline">{o.crm_owner_name}</span>,
        o.crm_mobile,
        o.crm_owner_email,
        moment(o.crm_created_at)?.format("DD-MM-YYYY"),
        <Button onClick={() => handleOpen(o.id)} className="!bg-green-500 !text-white"> + ADD </Button>,
        <div className="flex gap-2">
            <Button
                className="!bg-blue-500 !text-white"
                onClick={() => handleOpenOwnerDialog(o)}
            >
                Edit
            </Button>
        </div>
    ]);


    return (
        <div className="p-4">
            <div className="flex justify-between mb-3">
                <p className="font-bold text-xl">Owner </p>
                <Button
                    variant="contained"
                    onClick={() => handleOpenOwnerDialog(null)}
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
                data={owners}
            />
            <CustomDialog
                open={ownerDialogOpen}
                onClose={handleCloseOwnerDialog}
                onSubmit={fkOwner.handleSubmit}
                title={selectedOwner ? "Update Owner" : "Add Owner"}
                formik={fkOwner}
                fields={[
                    { name: "crm_owner_name", label: "Owner Name", type: "text" },
                    { name: "crm_mobile", label: "Mobile", type: "text" },
                    { name: "crm_owner_email", label: "Email", type: "text" },
                ]}
            />

            <CustomDialog
                open={open}
                onClose={handleClose}
                onSubmit={fkProperty.handleSubmit}
                title={"Add Property"}
                formik={fkProperty}
                fields={[

                    {
                        name: "crm_property_type",
                        label: "Select Property ",
                        type: "select",
                        options: properties?.data?.map(item => ({
                            value: item.property_type_name,
                            label: item.property_type_name,
                        })) || []
                    },
                    {
                        name: "crm_bhk",
                        label: "BHK Type ",
                        type: "select",
                        options: bhk?.data?.map(item => ({
                            value: item.bhk_name,
                            label: item.bhk_name,
                        })) || []
                    },
                    {
                        name: "crm_service_type",
                        label: "Select Service ",
                        type: "select",
                        options: services?.data?.map(item => ({
                            value: item.service_type_name,
                            label: item.service_type_name,
                        })) || []
                    },
                    {
                        name: "crm_tenant_type",
                        label: "Tenant ",
                        type: "select",
                        options: [
                            { value: "Family", label: "Family" },
                            { value: "Bachelor", label: "Bachelor" },
                            { value: "Both", label: "Both" },
                        ],
                    },
                    {
                        name: "crm_expected_rent",
                        label: "Expected Rent",
                        type: "text",
                    },
                    {
                        name: "crm_city",
                        label: "City",
                        type: "select",
                        options: uniqueCities.map(city => ({ value: city, label: city })),
                        onChange: (e) => {
                            fkProperty.setFieldValue("crm_city", e.target.value);
                            // Reset area & pincode when city changes
                            fkProperty.setFieldValue("crm_area", "");
                            fkProperty.setFieldValue("crm_pincode", "");
                        }
                    },
                    {
                        name: "crm_area",
                        label: "Area",
                        type: "select",
                        options: areas
                            .filter(a => a.city_name === fkProperty.values.crm_city)
                            .map(a => ({ value: a.area_name, label: a.area_name })),
                        onChange: (e) => {
                            const selectedArea = areas.find(a => a.area_name === e.target.value);
                            fkProperty.setFieldValue("crm_area", selectedArea.area_name);
                            fkProperty.setFieldValue("crm_pincode", selectedArea.pincode);
                            fkProperty.setFieldValue("crm_city", selectedArea.city_name);
                        }
                    },
                    {
                        name: "crm_pincode",
                        label: "PinCode",
                        type: "text",
                        disabled: true,
                    },

                    {
                        name: "crm_address",
                        label: "Address",
                        type: "text",
                    },

                    {
                        name: "crm_availability",
                        label: "Status",
                        type: "select",
                        options: [
                            { value: "Available", label: "Available" },
                            { value: "Rented", label: "Rented" },
                            { value: "Not Answering", label: "Not Answering" },
                            { value: "Rejected", label: "Rejected" },
                            { value: "Closed", label: "Closed" },
                        ],
                    },
                ]}
            />

        </div>
    );
};

export default OwnerList;
