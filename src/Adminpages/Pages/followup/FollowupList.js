// import { FilterAlt } from "@mui/icons-material";
// import { Button, TextField } from "@mui/material";
// import { useFormik } from "formik";
// import moment from "moment";
// import { useState } from "react";
// import { useQuery } from "react-query";
// import { useLocation, useNavigate } from "react-router-dom";
// import { API_URLS, domain } from "../../config/APIUrls";
// import axiosInstance from "../../config/axios";
// import CustomTable from "../../Shared/CustomTable";
// import CustomToPagination from "../../Shared/Pagination";

// const FollowupList = ({ leadId }) => {
//     // const lead = leadId
//     const location = useLocation();
//     const lead = location.state.lead_id
//     const navigate = useNavigate();
//     const [currentPage, setCurrentPage] = useState(1);
//     const fk = useFormik({
//         initialValues: {
//             search: "",
//             start_date: "",
//             end_date: "",
//             count: 10,
//         },
//         onSubmit: () => {
//             setCurrentPage(1);
//             refetch();
//         },
//     });

//     const { data, isLoading, refetch } = useQuery(
//         ["get_follow_up", lead, fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
//         () =>
//             axiosInstance.post(API_URLS.get_followup, {
//                 crm_lead_id: lead,
//                 search: fk.values.search,
//                 start_date: fk.values.start_date,
//                 end_date: fk.values.end_date,
//                 page: currentPage,
//                 count: 10,
//             }),
//         {
//             keepPreviousData: true,
//             enabled: !!lead,
//         }
//     );
//     const allData = data?.data?.response || [];

//     const FileLinks = ({ f }) => {
//         if (f.crm_status !== "Closed") return "--";

//         const BASE_URL = `${domain}/uploads/followups/`;

//         return (
//             <div className="flex flex-col gap-1 text-sm">
//                 {f.aadhaar && (
//                     <a href={BASE_URL + f.aadhaar} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                         Aadhaar
//                     </a>
//                 )}
//                 {f.pan && (
//                     <a href={BASE_URL + f.pan} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                         PAN
//                     </a>
//                 )}
//                 {f.rent_paper && (
//                     <a href={BASE_URL + f.rent_paper} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                         Rent Paper
//                     </a>
//                 )}
//                 {f.agreement && (
//                     <a href={BASE_URL + f.agreement} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                         Agreement
//                     </a>
//                 )}
//             </div>
//         );
//     };


//     const tableHead = [
//         "S.No.",
//         "Status",
//         "Remark",
//         "Documents",
//         "Follow-up Date",
//         "Next Follow-up Date",
//         "Action"
//     ];

//     const tableRow = allData?.data?.map((f, idx) => [
//         idx + 1,
//         f.crm_status_name || f.crm_status,
//         f.crm_remark || "--",
//         <FileLinks f={f} />,
//         f.crm_created_at ? moment(f.crm_created_at).format("YYYY-MM-DD") : "--",
//         f.crm_next_followup_date
//             ? moment(f.crm_next_followup_date).format("YYYY-MM-DD")
//             : "--",
//         <Button
//             size="small"
//             variant="outlined"
//             onClick={() =>
//                 navigate("/create-follow-up", {
//                     state: {
//                         lead_id: lead,
//                         followup: f,
//                     },
//                 })
//             }
//         >
//             Edit
//         </Button>
//     ]);



//     return (
//         <div className="">
//             <div className="flex justify-between mb-3">
//                 <p className="font-bold text-xl">FollowUp </p>
//                 <Button
//                     variant="contained"
//                     onClick={() => navigate("/create-follow-up", {
//                         state: {
//                             lead_id: lead
//                         }
//                     })}
//                 >
//                     + Add Followup
//                 </Button>
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
//                     placeholder="Search by Status"
//                     name="search"
//                     value={fk.values.search}
//                     onChange={fk.handleChange}
//                 />
//                 <Button
//                     variant="contained"
//                     startIcon={<FilterAlt />}
//                     onClick={fk.handleSubmit}
//                 >
//                     Filter
//                 </Button>
//             </div>

//             <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
//             <CustomToPagination
//                 page={currentPage}
//                 setPage={setCurrentPage}
//                 data={allData}
//             />
//         </div>
//     );
// };

// export default FollowupList;

import { MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { API_URLS, domain } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import { useQuery, useQueryClient } from "react-query";
import moment from "moment";
import toast from "react-hot-toast";

const FollowupChat = ({ messages }) => {

    const formatDateLabel = (date) => {
        const d = moment(date).startOf("day");
        if (d.isSame(moment(), "day")) return "Today";
        if (d.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
        return d.format("DD MMM YYYY");
    };

    let lastDate = null;

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4  bg-gradient-to-b from-slate-50 to-blue-50 no-scrollbar">

            {messages?.map((f, i) => {
                const msgDate = formatDateLabel(f.crm_created_at);
                const showDate = msgDate !== lastDate;
                lastDate = msgDate;

                return (
                    <div key={i} className="hide-scrollbar">
                        {showDate && (
                            <div className="flex justify-center my-4">
                                <span className="text-xs px-3 py-1 rounded-full bg-gray-300 text-gray-700">
                                    {msgDate}
                                </span>
                            </div>
                        )}
                        <div className="mb-4 max-w-[75%] rounded-2xl p-4 bg-white shadow-md border-l-4 border-t-4 border-blue-500">

                            <p className="text-[15px] font-semibold text-green-700 uppercase mb-1">
                                {f.crm_status}
                            </p>

                            <p className="text-blue-900 text-xs"> <span className="text-black text-xs mb-1">Next FollowUp -  </span>{f.crm_next_followup_date ? moment(f.crm_next_followup_date)?.format("DD-MM-YYYY") : "No Date"}</p>
                            <p className="text-sm text-blue-800 mt-1 whitespace-pre-wrap">
                                <span className="text-black">Remark - </span> {f.crm_remark || "No Remark"}
                            </p>

                            {f.crm_status === "Deal Success" && (
                                <div className="mt-2 border-t pt-2">
                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                        Attached Documents
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {f.aadhaar && (
                                            <a
                                                href={`${domain}/uploads/followups/${f.aadhaar}`}
                                                target="_blank"
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                            >
                                                Aadhaar
                                            </a>
                                        )}
                                        {f.pan && (
                                            <a
                                                href={`${domain}/uploads/followups/${f.pan}`}
                                                target="_blank"
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                            >
                                                Police Verification
                                            </a>
                                        )}
                                        {f.rent_paper && (
                                            <a
                                                href={`${domain}/uploads/followups/${f.rent_paper}`}
                                                target="_blank"
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                            >
                                                Rent Paper
                                            </a>
                                        )}
                                        {f.agreement && (
                                            <a
                                                href={`${domain}/uploads/followups/${f.agreement}`}
                                                target="_blank"
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                            >
                                                Agreement
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TIME */}
                            <p className="text-[10px] text-gray-500 text-right mt-1">
                                {moment(f.crm_created_at).format("hh:mm A")}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const FollowupInput = ({ leadId, onSent }) => {

    const client = useQueryClient();
    const fk = useFormik({
        initialValues: {
            crm_lead_id: leadId,
            crm_status: "",
            crm_remark: "",
            crm_next_followup_date: "",
            aadhaar: null,
            pan: null,
            agreement: null,
        },
        onSubmit: async (values, { resetForm }) => {
            if (!values.crm_status) {
                return toast("Select FollowUp Status")
            }
            if (
                values.crm_status === "Deal Success" &&
                (!values.aadhaar || !values.pan || !values.agreement)
            ) {
                toast("Please upload Aadhaar, Police Verification & Rent Agreement!", { id: 1 });
                return;
            }

            const formData = new FormData();
            Object.entries(values).forEach(([k, v]) => v && formData.append(k, v));

            const res = await axiosInstance.post(API_URLS.add_followup, formData);
            onSent();
            if (res?.data?.success) {
                client.refetchQueries("dashboard_followups");
                client.refetchQueries("get_leads");
            }
            resetForm();
            toast.success("Follow-up added successfully!", { id: 1 });
        },
    });

    const isClosed = fk.values.crm_status === "Deal Success";

    const { data: statusList } = useQuery(
        ["get_followup_master"],
        () =>
            axiosInstance.post(API_URLS.get_followup_master, {
                count: 100000,
                status: 1,
            }),
        { refetchOnWindowFocus: false }
    );

    const status = statusList?.data?.response || [];

    return (
        <div className="sticky bottom-0 backdrop-blur-md bg-white/80 border-t px-4 py-3">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <TextField
                    select
                    name="crm_status"
                    label="Followup Status"
                    value={fk.values.crm_status}
                    onChange={fk.handleChange}
                    size="small"
                    fullWidth
                >
                    {status?.data?.map((item) => (
                        <MenuItem
                            key={item.followup_status_id}
                            value={item.followup_status_name}
                        >
                            {item.followup_status_name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    type="date"
                    name="crm_next_followup_date"
                    size="small"
                    label="Next Follow-up"
                    InputLabelProps={{ shrink: true }}
                    value={fk.values.crm_next_followup_date}
                    onChange={fk.handleChange}
                    fullWidth
                />
            </div>

            {isClosed && (
                <div className="flex gap-5 mb-3">
                    <p>Select Document:</p>
                    <div className="flex gap-2">
                        {[
                            { key: "aadhaar", label: "Aadhaar" },
                            { key: "pan", label: "Police Verification" },
                            { key: "agreement", label: "Agreement" },
                        ].map((file) => (
                            <label
                                key={file.key}
                                className={`px-3 py-1 text-xs rounded-full border border-dashed cursor-pointer transition
                  ${fk.values[file.key]
                                        ? "bg-green-100 border-green-400 text-green-700"
                                        : "border-blue-400 text-blue-700 hover:bg-blue-50"
                                    }`}
                            >
                                📎 {file.label}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) =>
                                        fk.setFieldValue(file.key, e.target.files[0])
                                    }
                                />
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-end gap-2">
                <TextField
                    fullWidth
                    multiline
                    rows={1}
                    size="small"
                    placeholder="Type your message..."
                    name="crm_remark"
                    value={fk.values.crm_remark}
                    onChange={fk.handleChange}
                    className="bg-white rounded-full shadow-sm"
                />

                {/* SEND BUTTON */}
                <button
                    onClick={fk.handleSubmit}
                    className="h-11 w-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white flex items-center justify-center shadow-lg transition"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

const FollowupChatPage = ({ leadId }) => {
    const { data, refetch } = useQuery(
        ["get_follow_up", leadId],
        () =>
            axiosInstance.post(API_URLS.get_followup, {
                crm_lead_id: leadId,
                page: 1,
                count: 200,
            }),
        { enabled: !!leadId }
    );

    const messages = data?.data?.response?.data || [];

    return (
        <div className="flex flex-col h-[75vh] rounded-xl shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">

            {/* CHAT */}
            <FollowupChat messages={messages} />

            {/* INPUT */}
            <FollowupInput leadId={leadId} onSent={refetch} />
        </div>
    );
};

export default FollowupChatPage;






















