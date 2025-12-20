import { useFormik } from 'formik';
import moment from 'moment';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';
import Swal from 'sweetalert2';
import Loader from '../../../Shared/Loader';
import CustomToPagination from '../../../Shared/Pagination';
import { apiConnectorPost } from '../../../utils/APIConnector';
import { endpoint } from '../../../utils/APIRoutes';
import CustomTable from '../../Shared/CustomTable';

const CopierList = () => {
    const isSwalOpenRef = useRef(false);

    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const client = useQueryClient();
    const initialValues = {
        income_Type: "",
        search: '',
        count: 10,
        page: "",
        start_date: '',
        end_date: '',
    };

    const fk = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,

    })
    const { data, isLoading } = useQuery(
        ['get_copier_trade', fk.values.search, fk.values.start_date, fk.values.end_date, page, fk.values.group_type],
        () =>
            apiConnectorPost(endpoint?.copier_list_details, {
                search: fk.values.search,
                start_date: fk.values.start_date,
                end_date: fk.values.end_date,
                page: page,
                count: 10,
            }),
        {
            keepPreviousData: true,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            onError: (err) => console.error("Error fetching level data:", err),
        }
    );

    const allData = data?.data?.result || [];

    const VerificationStatusChange = useCallback(async (userId, newStatus, statusType = "verification") => {
        if (isSwalOpenRef.current) return;

        const actionLabel =
            statusType === "verification"
                ? newStatus === "1"
                    ? "set to Pending"
                    : newStatus === "2"
                        ? "Reject"
                        : "Verify"
                : newStatus === "1"
                    ? "Activate Account"
                    : "Deactivate Account";

        isSwalOpenRef.current = true;

        try {
            const confirm = await Swal.fire({
                title: `Are you sure?`,
                text: `You are about to change the status for this user.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Yes, ${actionLabel}`,
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            });

            if (!confirm.isConfirmed) return;

            setLoading(true);
            const response = await apiConnectorPost(endpoint.change_copier_verification, {
                u_id: userId,
                verification_status: newStatus,
                status_type: statusType,
            });

            if (response?.data?.success) {
                client.invalidateQueries({ queryKey: ['get_copier_trade'], exact: false });
                toast.success("Status updated successfully.");
            } else {
                toast.error("Failed to update status.");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            isSwalOpenRef.current = false;
        }
    }, [client, setLoading]);

    const tablehead = [
        <span>S.No.</span>,

        <span>User Name</span>,
        <span>User ID</span>,
        <span>User Email</span>,
        <span>User Mobile</span>,

        // MASTER DETAILS
        <span>Master Name</span>,
        <span>Master Email</span>,
        <span>Master Mobile</span>,
        <span>Master Acc Type</span>,
        <span>Master Deposit</span>,
        <span>Master Broker</span>,
        <span>Master Server</span>,
        <span>Master MT5 Password</span>,

        // FOLLOWER DETAILS
        <span>Follower Name</span>,
        <span>Follower Email</span>,
        <span>Follower Mobile</span>,
        <span>Follower Acc Type</span>,
        <span>Follower Deposit</span>,
        <span>Follower Broker</span>,
        <span>Follower Server</span>,
        <span>Follower MT5 Password</span>,
        <span>Verification Status</span>,
        <span> Created Date</span>,
        <span> Updated Date</span>,
    ];


    const tablerow = allData?.data?.map((row, index) => {
        return [
            <span>{(page - 1) * 10 + index + 1}</span>,

            // USER DETAILS
            <span>{row.jnr_name || "--"}</span>,
            <span>{row.lgn_cust_id || "--"}</span>,
            <span>{row.lgn_email || "--"}</span>,
            <span>{row.lgn_mobile || "--"}</span>,

            // MASTER DETAILS
            <span>{row.cd_ma_name || "--"}</span>,
            <span>{row.cd_ma_email || "--"}</span>,
            <span>{row.cd_ma_mob || "--"}</span>,
            <span>{row.cd_ma_acc_type || "--"}</span>,
            <span>{Number(row.cd_ma_deposit_amnt || 0)?.toFixed(2)}</span>,
            <span>{row.cd_ma_broker_name || "--"}</span>,
            <span>{row.cd_ma_server_name || "--"}</span>,
            <span>{row.cd_ma_trading_password || "--"}</span>,

            // FOLLOWER DETAILS
            <span>{row.cd_fl_name || "--"}</span>,
            <span>{row.cd_fl_email || "--"}</span>,
            <span>{row.cd_fl_mob || "--"}</span>,
            <span>{row.cd_fl_acc_type || "--"}</span>,
            <span>{Number(row.cd_fl_deposit_amnt || 0)?.toFixed(2)}</span>,
            <span>{row.cd_fl_broker_name || "--"}</span>,
            <span>{row.cd_fl_server_name || "--"}</span>,
            <span>{row.cd_fl_trading_password || "--"}</span>,

            <span>
                <select
                    value={
                        row?.cd_active_status === "Pending"
                            ? 1
                            : row?.cd_active_status === "Verified"
                                ? 3
                                : row?.cd_active_status === "Reject"
                                    ? 2
                                    : ""
                    }
                    onChange={(e) => {
                        const currentValue = e.target.value;
                        const currentStatus =
                            row?.cd_active_status === "Pending"
                                ? 1
                                : row?.cd_active_status === "Verified"
                                    ? 3
                                    : row?.cd_active_status === "Reject"
                                        ? 2
                                        : "";

                        if (currentValue !== currentStatus) {
                            VerificationStatusChange(row?.cd_reg_id, currentValue);
                        }
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                    <option value={1}>Pending</option>
                    <option value={3}>Verified</option>
                    <option value={2}>Reject</option>
                </select>
            </span>,

            <span>
                {row.cd_created_at
                    ? moment(row.cd_created_at).format("DD-MM-YYYY ")
                    : "--"}
            </span>,
              <span>
                {row.cd_updated_at
                    ? moment(row.cd_updated_at).format("DD-MM-YYYY ")
                    : "--"}
            </span>,
            


        ];
    });


    return (
        <div className="p-2">
            <Loader isLoading={isLoading} />
            <div className="bg-white bg-opacity-50 rounded-lg shadow-lg p-3 text-white mb-6">
                <div className="flex flex-col sm:flex-wrap md:flex-row items-center gap-3 sm:gap-4 w-full text-sm sm:text-base">
                    <input
                        type="date"
                        name="start_date"
                        id="start_date"
                        value={fk.values.start_date}
                        onChange={fk.handleChange}
                        className="bg-white bg-opacity-50 border border-gray-600 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
                    />
                    <input
                        type="date"
                        name="end_date"
                        id="end_date"
                        value={fk.values.end_date}
                        onChange={fk.handleChange}
                        className="bg-white bg-opacity-50 border border-gray-600 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={fk.values.search}
                        onChange={fk.handleChange}
                        placeholder="search"
                        className="bg-white bg-opacity-50 border border-gray-600 rounded-full py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
                    />

                    <button
                        onClick={() => {
                            setPage(1);
                            client.invalidateQueries(["get_copier_trade"]);
                        }}
                        type="submit"
                        className="bg-blue-500 text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-dark-color transition-colors w-full sm:w-auto text-sm"
                    >
                        Search
                    </button>
                    <button
                        onClick={() => {
                            fk.handleReset();
                            setPage(1);
                        }}
                        className="bg-gray-color text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-black hover:text-white transition-colors w-full sm:w-auto text-sm"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <CustomTable
                tablehead={tablehead}
                tablerow={tablerow}
                isLoading={isLoading}
            />

            <CustomToPagination
                page={page}
                setPage={setPage}
                data={allData}
            />

        </div>
    );
};

export default CopierList;
