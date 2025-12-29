// import { TextField } from "@mui/material";
// import { useFormik } from "formik";
// import moment from "moment";
// import { useState } from "react";
// import { useQuery } from "react-query";
// import { API_URLS } from "../../config/APIUrls";
// import axiosInstance from "../../config/axios";
// import CustomTable from "../../Shared/CustomTable";
// import CustomToPagination from "../../Shared/Pagination";

// const ALlOwnerProperty = () => {

//     const [currentPage, setCurrentPage] = useState(1);

//     const fk = useFormik({
//         initialValues: { search: "", start_date: "", end_date: "", count: 10 },
//         onSubmit: () => setCurrentPage(1),
//     });

//     // Fetch leads
//     const { data, isLoading } = useQuery(
//         ["get_all_properties_owner", fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
//         () =>
//             axiosInstance.post(API_URLS.get_all_properties_owner, {
//                 search: fk.values.search,
//                 start_date: fk.values.start_date,
//                 end_date: fk.values.end_date,
//                 page: currentPage,
//                 count: 10,
//             }),
//         { keepPreviousData: true }
//     );

//     const allData = data?.data?.data || [];

//     const tableHead = [
//         "S.No.",
//         "Property ID",
//         "Owner Name",
//         "Mobile",
//         "BHK",
//         "Property ",
//         "Service ",
//         "Price",
//         "City",
//         "Area",
//         "Pincode",
//         "Address",
//         "Tenant ",
//         "Status",
//         "Created At",
//     ];

//     const tableRow = allData?.map((prop, index) => [
//         index + 1,
//         prop.crm_property_unique_id || "--",
//         prop.crm_owner_name || "--",
//         prop.crm_mobile || "--",
//         prop.crm_bhk || "--",
//         prop.crm_property_type || "--",
//         prop.crm_service_type || "--",
//         prop.crm_expected_rent || "--",
//         prop.crm_city || "--",
//         prop.crm_area || "--",
//         prop.crm_pincode || "--",
//         prop.crm_address || "--",
//         prop.crm_tenant_type || "--",
//         prop.crm_availability || "--",
//         prop.crm_created_at ? moment.utc(prop.crm_created_at).format("DD-MM-YYYY HH:mm:ss") : "--",
//     ]);

//     return (
//         <div>
//             <div className="flex justify-between mb-4">
//                 <p className="font-bold text-xl">Property</p>
//             </div>

//             <div className="flex gap-3 mb-4">
//                 <TextField
//                     type="date"
//                     value={fk.values.start_date}
//                     onChange={(e) => fk.setFieldValue("start_date", e.target.value)}
//                 />
//                 <TextField
//                     type="date"
//                     value={fk.values.end_date}
//                     onChange={(e) => fk.setFieldValue("end_date", e.target.value)}
//                 />
//                 <TextField
//                     type="search"
//                     placeholder="Search by name or mobile"
//                     name="search"
//                     value={fk.values.search}
//                     onChange={fk.handleChange}
//                 />
//             </div>

//             <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
//             <CustomToPagination page={currentPage} setPage={setCurrentPage} data={allData} />

//         </div>
//     );
// };

// export default ALlOwnerProperty;


import { TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";

const AllOwnerProperty = () => {
    const [currentPage, setCurrentPage] = useState(1);

    /* =======================
        FORM STATE
    ======================== */
    const fk = useFormik({
        initialValues: {
            search: "",
            start_date: "",
            end_date: "",
            property_type: "",
            service_type: "",
            area: "",
            bhk: "",
            count: 10,
        },
        onSubmit: () => setCurrentPage(1),
    });

    /* =======================
        MASTER APIs
    ======================== */

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

    /* =======================
        LISTING API
    ======================== */
    const { data, isLoading } = useQuery(
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

    const allData = data?.data?.data || [];

    /* =======================
        TABLE CONFIG
    ======================== */
    const tableHead = [
        "S.No.",
        "Property ID",
        "Owner Name",
        "Mobile",
        "BHK",
        "Property",
        "Service",
        "Price",
        "City",
        "Area",
        "Pincode",
        "Address",
        "Tenant",
        "Status",
        "Created At",
    ];

    const tableRow = allData?.map((prop, index) => [
        index + 1,
        prop.crm_property_unique_id || "--",
        prop.crm_owner_name || "--",
        prop.crm_mobile || "--",
        prop.crm_bhk || "--",
        prop.crm_property_type || "--",
        prop.crm_service_type || "--",
        prop.crm_expected_rent || "--",
        prop.crm_city || "--",
        prop.crm_area || "--",
        prop.crm_pincode || "--",
        prop.crm_address || "--",
        prop.crm_tenant_type || "--",
        prop.crm_availability || "--",
        prop.crm_created_at
            ? moment.utc(prop.crm_created_at).format("DD-MM-YYYY HH:mm:ss")
            : "--",
    ]);

    return (
        <div>
            <p className="font-bold text-xl mb-4">Property</p>
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
        </div>
    );
};

export default AllOwnerProperty;
