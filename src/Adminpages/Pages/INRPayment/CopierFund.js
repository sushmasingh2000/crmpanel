import { MenuItem, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import moment from 'moment';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import CustomToPagination from '../../../Shared/Pagination';
import { apiConnectorPost } from '../../../utils/APIConnector';
import { domain, endpoint, frontend } from '../../../utils/APIRoutes';
import CustomTable from '../../Shared/CustomTable';
import toast from 'react-hot-toast';
import SweetAlert from "sweetalert2";
import { Lock } from '@mui/icons-material';

const CopierFund = () => {
    const [page, setPage] = useState(1);
    const client = useQueryClient();

    const initialValues = {
        search: '',
        count: 10,
        page: 1,
        start_date: '',
        end_date: '',
        type: 'ALL',
    };

    const fk = useFormik({
        initialValues,
        enableReinitialize: true,
    });

    const { data, isLoading, refetch } = useQuery(
        ['get_paying_Admin', fk.values.search, fk.values.start_date, fk.values.end_date, page, fk.values.type],
        () =>
            apiConnectorPost(endpoint?.copier_fund_report, {
                search: fk.values.search,
                start_date: fk.values.start_date,
                end_date: fk.values.end_date,
                page: page,
                count: 10,
                type: fk.values.type,
            }),
        {
            keepPreviousData: true,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            onError: (err) => console.error("Error fetching data:", err),
        }
    );

    const allData = data?.data?.result || [];

    const changeStatusFunction = async (id, status) => {
        try {
            const res = await apiConnectorPost(endpoint?.update_copier_apyment_status, {
                t_id: id,
                status: status,
            });
            toast.success(res?.data?.msg || "Status updated successfully");
            client.invalidateQueries("get_paying_Admin");
        } catch (e) {
            toast.error("Error updating status");
            console.log(e);
        }
    };

    const handleStatusChange = (id, status) => {
        const actionText = status === "Success" ? "approve" : "reject";
        SweetAlert.fire({
            title: "Are you sure?",
            text: `You want to ${actionText} this amount?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                changeStatusFunction(id, status);
            }
        });
    };

    const tablehead = [
        <span key="sno">S.No.</span>,
        <span key="userId">User Id</span>,
        <span key="name">Name</span>,
        <span key="amount">Amount ($)</span>,
        <span key="payment">Reciept </span>,
        <span key="hash">Hash </span>,
        <span key="wallet">Address </span>,
        <span key="status">Status</span>,
        <span key="date">Date</span>,
        <span key="action">Action</span>,
    ];

    const tablerow = allData?.data?.map((row, index) => [
        <span key={`sno-${index}`}>{(page - 1) * 10 + index + 1}</span>,
        <span key={`userId-${index}`}>{row?.lgn_cust_id || "--"}</span>,
        <span key={`name-${index}`}>{row?.jnr_name || "--"}</span>,
        <span key={`amount-${index}`}>{row?.tr_amount || "--"}</span>,
        <span key={`payment-${index}`}>
            {row?.tr_payment_slip ? (
                <a
                    href={domain + row?.tr_payment_slip}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={domain + row?.tr_payment_slip}
                        alt="Payment Slip"
                        style={{ cursor: "pointer" }}
                        className='h-10 w-20'
                    />
                </a>
            ) : "--"}
        </span>,


        <span key={`hash-${index}`}>{row?.tr_trans_hash || "N/A"}</span>,
        <span key={`wallet-${index}`}>{row?.tr_deposit_from || "N/A"}</span>,
        <span key={`status-${index}`}>{row?.tr_status || "N/A"}</span>,

        <span key={`date-${index}`}>{row?.tr_date ? moment(row?.tr_date).format("DD-MM-YYYY") : "--"}</span>,
        <span key={`action-${index}`}>
            {row?.tr_status === "Pending" ? (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatusChange(row?.tr_id, "2")}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleStatusChange(row?.tr_id, "3")}
                    >
                        Reject
                    </Button>
                </div>
            ) : <Lock />}
        </span>,
    ]);

    return (
        <div className="p-2">
            <div className="bg-white bg-opacity-50 rounded-lg shadow-lg p-3 text-white mb-6">
                <div className="flex flex-col sm:flex-wrap md:flex-row items-center gap-3 sm:gap-4 w-full text-sm sm:text-base mt-2">
                    <input
                        type="date"
                        name="start_date"
                        value={fk.values.start_date}
                        onChange={fk.handleChange}
                        className="bg-white bg-opacity-50 border border-gray-600 rounded-md py-2 px-3 text-black w-full sm:w-auto"
                    />
                    <input
                        type="date"
                        name="end_date"
                        value={fk.values.end_date}
                        onChange={fk.handleChange}
                        className="bg-white bg-opacity-50 border border-gray-600 rounded-md py-2 px-3 text-black w-full sm:w-auto"
                    />
                    <input
                        type="text"
                        name="search"
                        value={fk.values.search}
                        onChange={fk.handleChange}
                        placeholder="User ID"
                        className="bg-white bg-opacity-50 border border-gray-600 rounded-full py-2 px-3 text-black w-full sm:w-auto"
                    />

                    <TextField
                        select
                        name="type"
                        value={fk.values.type}
                        onChange={fk.handleChange}
                        variant="outlined"
                        size="small"
                        className="text-black border px-2 py-1 rounded"
                    >
                        <MenuItem key="all" value="ALL">All</MenuItem>
                        <MenuItem key="pending" value="Pending">Pending</MenuItem>
                        <MenuItem key="success" value="Success">Success</MenuItem>
                        <MenuItem key="failed" value="Failed">Failed</MenuItem>
                    </TextField>

                    <button
                        onClick={() => {
                            setPage(1);
                            refetch();
                        }}
                        className="bg-blue-500 text-gray-900 font-bold py-2 px-4 rounded-full w-full sm:w-auto"
                    >
                        Search
                    </button>
                    <button
                        onClick={() => {
                            fk.resetForm();
                            setPage(1);
                            refetch();
                        }}
                        className="bg-gray-500 text-gray-900 font-bold py-2 px-4 rounded-full w-full sm:w-auto"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <CustomTable tablehead={tablehead} tablerow={tablerow} isLoading={isLoading} />
            <CustomToPagination page={page} setPage={setPage} data={allData} />
        </div>
    );
};

export default CopierFund;
