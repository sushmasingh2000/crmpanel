import { TextField, MenuItem, Button } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import CustomDialog from "../../Shared/CustomDialogBox";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Lock } from "@mui/icons-material";

const AllOwnerProperty = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
      const type = localStorage.getItem("type")

    const handleClose = () => {
        setOpen(false);
    };

    const fk = useFormik({
        initialValues: {
            search: "",
            start_date: "",
            end_date: "",
            status: "",
            property_type: "",
            service_type: "",
            area: "",
            bhk: "",
            count: 10,
        },
        onSubmit: () => setCurrentPage(1),
    });


    const { data: propertyList } = useQuery(
        ["get_property_master"],
        () =>
            axiosInstance.post(API_URLS.get_property_master, {
                count: 100000,
                status: 1,
            }),
        { staleTime: Infinity, refetchOnWindowFocus: false }
    );
    const properties = propertyList?.data?.response || [];

    const { data: serviceList } = useQuery(
        ["get_service_type_master"],
        () =>
            axiosInstance.post(API_URLS.get_service_type, {
                count: 100000,
                status: 1,
            }),
        { staleTime: Infinity, refetchOnWindowFocus: false }
    );
    const services = serviceList?.data?.response || [];

    const { data: areaData } = useQuery(
        ["get_area"],
        () =>
            axiosInstance.post(API_URLS.get_area, {
                status: 1,
                count: 100000,
            }),
        { staleTime: Infinity, refetchOnWindowFocus: false }
    );
    const areas = areaData?.data?.response?.data || [];

    const { data: bhkData } = useQuery(
        ["get_bhk"],
        () =>
            axiosInstance.post(API_URLS.master_bhk, {
                status: 1,
                count: 100000,
            }),
        { staleTime: Infinity, refetchOnWindowFocus: false }
    );
    const bhk = bhkData?.data?.response || [];


    const { data, isLoading, refetch } = useQuery(
        [
            "get_all_properties_owner",
            fk.values,
            currentPage
        ],
        () =>
            axiosInstance.post(API_URLS.get_all_properties_owner, {
                search: fk.values.search,
                start_date: fk.values.start_date,
                end_date: fk.values.end_date,
                status: fk.values.crm_availability,
                property_type: fk.values.property_type,
                service_type: fk.values.service_type,
                area: fk.values.area,
                bhk: fk.values.bhk,
                page: currentPage,
                count: 10,
            }),
        {
            keepPreviousData: true,
        }
    );

    const allData = data?.data || [];

    const tableHead = [
        "S.No.",
        "Property ID",
        "Owner Name",
        "Mobile",
        "Status",
        "BHK",
        "Property",
        "Service",
        "Price",
        "City",
        "Area",
        "Pincode",
        "Address",
        "Tenant",
        "Date / Time",
        "Action",
    ];

    const tableRow = allData?.data?.map((prop, index) => [
        index + 1,
        prop.crm_property_unique_id || "--",
        prop.crm_owner_name || "--",
        prop.crm_mobile || "--",
        prop.crm_availability || "--",
        prop.crm_bhk || "--",
        prop.crm_property_type || "--",
        prop.crm_service_type || "--",
        prop.crm_expected_rent || "--",
        prop.crm_city || "--",
        prop.crm_area || "--",
        prop.crm_pincode || "--",
        prop.crm_address || "--",
        prop.crm_tenant_type || "--",
        prop.crm_created_at
            ? moment.utc(prop.crm_created_at).format("DD-MM-YYYY HH:mm:ss")
            : "--",
       <span>
        {type==="admin"? 
         <Button
            variant="contained"
            onClick={() => {
                setSelectedProperty(prop);
                setOpen(true);
            }}
        >
            Edit
        </Button>: <Lock/>}
       </span>,
    ]);

    const uniqueCities = [...new Set(areas.map(a => a.city_name))];

    const fkProperty = useFormik({
        initialValues: {
            id: selectedProperty?.id || "",
            crm_owner_id: selectedProperty?.crm_owner_id || "",
            crm_bhk: selectedProperty?.crm_bhk || "",
            crm_property_type: selectedProperty?.crm_property_type || "",
            crm_service_type: selectedProperty?.crm_service_type || "",
            crm_expected_rent: selectedProperty?.crm_expected_rent || "",
            crm_city: selectedProperty?.crm_city || "",
            crm_area: selectedProperty?.crm_area || "",
            crm_pincode: selectedProperty?.crm_pincode || "",
            crm_address: selectedProperty?.crm_address || "",
            crm_tenant_type: selectedProperty?.crm_tenant_type || "",
            crm_availability: selectedProperty?.crm_availability || "Available",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await axiosInstance.post(API_URLS.create_properties, values);
                toast(res?.data?.message);
                if (res.data.success) {
                    handleClose();
                    refetch();
                }
            } catch (err) {
                toast.error("Failed to update property");
            }
        },
    });
    const queryClient = useQueryClient();

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to upload this Excel file?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, upload it!",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        if (!result.isConfirmed) return;

        Swal.fire({
            title: "Uploading...",
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
        });

        try {
            const res = await axiosInstance.post(
                API_URLS.upload_property_excel,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            Swal.close();

            if (!res.data.success) {
                Swal.fire("Error!", res.data.message, "error");
                return;
            }

            Swal.fire("Uploaded!", res.data.message, "success");
            queryClient.invalidateQueries("get_all_properties_owner");

        } catch (error) {
            Swal.close();

            const errorMsg =
                error?.response?.data?.message ||
                "Something went wrong while uploading Excel";

            Swal.fire("Error!", errorMsg, "error");
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <p className="font-bold text-xl mb-4">Property</p>
                <div className="flex justify-end gap-5">
                    <Button
                        variant="contained"
                        onClick={() => window.open("/property-sample.xlsx", "_blank")}
                    >
                        View Sample Excel
                    </Button>

                    <Button variant="outlined" component="label">
                        Upload Excel
                        <input type="file" hidden accept=".xlsx,.xls" onChange={handleExcelUpload} />
                    </Button>
                </div>
            </div>
            <div className="flex gap-2 mb-4 flex-nowrap overflow-x-auto !my-5">
                <TextField
                    size="small"
                    type="date"
                    value={fk.values.start_date}
                    onChange={(e) => fk.setFieldValue("start_date", e.target.value)}
                />

                <TextField
                    size="small"
                    type="date"
                    value={fk.values.end_date}
                    onChange={(e) => fk.setFieldValue("end_date", e.target.value)}
                />

                <TextField
                    size="small"
                    type="search"
                    placeholder="Search name / mobile"
                    name="search"
                    value={fk.values.search}
                    onChange={fk.handleChange}
                    sx={{ minWidth: 200 }}
                />
            </div>
            <div className="flex gap-2 mb-4 flex-nowrap overflow-x-auto !my-5">
                <p className="flex items-center">Select  :</p>
                <TextField
                    size="small"
                    select
                    label="Status"
                    value={fk.values.crm_availability}
                    onChange={(e) => fk.setFieldValue("crm_availability", e.target.value)}
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Available"> Available</MenuItem>
                    <MenuItem value="Rented"> Rented</MenuItem>
                    <MenuItem value="Not Answering"> Not Answering</MenuItem>
                    <MenuItem value="Rejected"> Rejected</MenuItem>
                    <MenuItem value="Deal Success"> Deal Success</MenuItem>
                </TextField>

                <TextField
                    size="small"
                    select
                    label="Property"
                    value={fk.values.property_type}
                    onChange={(e) => fk.setFieldValue("property_type", e.target.value)}
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {properties.data?.map((p) => (
                        <MenuItem key={p.property_type_id} value={p.property_type_name}>
                            {p.property_type_name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    size="small"
                    select
                    label="Service"
                    value={fk.values.service_type}
                    onChange={(e) => fk.setFieldValue("service_type", e.target.value)}
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {services?.data?.map((s) => (
                        <MenuItem key={s.service_type_id} value={s.service_type_name}>
                            {s.service_type_name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    size="small"
                    select
                    label="Area"
                    value={fk.values.area}
                    onChange={(e) => fk.setFieldValue("area", e.target.value)}
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {areas.map((a) => (
                        <MenuItem key={a.id} value={a.area_name}>
                            {a.area_name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    size="small"
                    select
                    label="BHK"
                    value={fk.values.bhk}
                    onChange={(e) => fk.setFieldValue("bhk", e.target.value)}
                    sx={{ minWidth: 100 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {bhk?.data?.map((b) => (
                        <MenuItem key={b.bhk_id} value={b.bhk_name}>
                            {b.bhk_name}
                        </MenuItem>
                    ))}
                </TextField>
            </div>

            <CustomTable
                tablehead={tableHead}
                tablerow={tableRow}
                isLoading={isLoading}
            />

            <CustomToPagination
                page={currentPage}
                setPage={setCurrentPage}
                data={allData}
            />
            <CustomDialog
                open={open}
                onClose={handleClose}
                onSubmit={fkProperty.handleSubmit}
                title={"Update Property"}
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
                            { value: "Deal Success", label: "Deal Success" },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default AllOwnerProperty;
