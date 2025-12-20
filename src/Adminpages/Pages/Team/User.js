import { Edit } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import Loader from "../../../Shared/Loader";
import CustomToPagination from "../../../Shared/Pagination";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import CustomTable from "../../Shared/CustomTable";
const UserDetail = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const client = useQueryClient();
  const initialValues = {
    income_Type: "",
    search: "",
    count: 10,
    page: "",
    start_date: "",
    end_date: "",
  };

  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
  });
  const { data, isLoading, refetchProfile } = useQuery(
    [
      "get_user_admin",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      page,
    ],
    () =>
      apiConnectorPost(endpoint?.member_list_details, {
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

  const changestatus = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the account status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const response = await apiConnectorPost(endpoint?.change_general_status, {
        u_id: id,
        status_type: "login",
      });
      setLoading(false);

      if (response?.data?.success) {
        toast.success("Account status updated successfully.");
        client.invalidateQueries(["get_user_admin"]);
      } else {
        toast.error("Failed to update account status.");
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fkProfile = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedUser?.jnr_name || "",
      email: selectedUser?.lgn_email || "",
      mobile: selectedUser?.lgn_mobile || "",
      password: selectedUser?.lgn_pass || "",
    },
    onSubmit: () => {
      const reqbody = {
        customer_id:  selectedUser?.lgn_cust_id,
        name: fkProfile.values.name,
        email: fkProfile.values.email,
        password: fkProfile.values.password,
      };
      UpdateProfileFn(reqbody);
    },
  });

  const [loding, setLoding] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  async function UpdateProfileFn(reqbody) {
    setLoding(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.update_user_profile,
        reqbody
      );
      toast.success(res?.data?.message || "Profile updated successfully");
      if (res?.data?.success) {
        setShowProfileModal(false);
        setSelectedUser(null);
        client.invalidateQueries(["get_user_admin"]);
      }
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoding(false);
    }
  }

  const tablehead = [
    <span>S.No.</span>,
    <span>User ID</span>,
    <span>User Name</span>,
    // <span>Email</span>,
    <span>Mobile No</span>,
    <span>Fund Wallet ($)</span>,
    // <span>Income Wallet ($)</span>,
    <span>Total Income ($)</span>,
    <span>Password</span>,
    <span> Status</span>,
    <span>Join. Date</span>,
    <span>Action</span>,
  ];

  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {(page - 1) * 10 + index + 1}</span>,
      <span>{row.lgn_cust_id}</span>,
      <span>{row.jnr_name}</span>,
      // <span>{row.lgn_email}</span>,
      // <span>{row.lgn_mobile}</span>,
      <span>{row?.lgn_mobile}</span>,
      <span>{row.jnr_curr_wallet}</span>,
      <span>{row.jnr_total_income}</span>,
      <span>{row?.lgn_pass}</span>,

      <span>
        <Switch
          checked={row?.lgn_is_blocked === "No"}
          onChange={() => changestatus(row?.lgn_jnr_id)}
          color="primary"
        />
      </span>,
      <span>
        {row.lgn_created_at
          ? moment?.utc(row.lgn_created_at).format("DD-MM-YYYY")
          : "--"}
      </span>,
      <span>
        <button
          className="  text-gray-900 font-semibold"
          onClick={() => {
            setSelectedUser(row); // set full row object
            setShowProfileModal(true);
          }}
        >
          <Edit/>
        </button>
      </span>,
    ];
  });
  return (
    <div className="p-2">
      <Loader isLoading={loading || isLoading} />
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
            placeholder="User ID"
            className="bg-white bg-opacity-50 border border-gray-600 rounded-full py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
          <button
            onClick={() => {
              setPage(1);
              client.invalidateQueries(["get_user_admin"]);
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
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit  Profile</h2>
            <form onSubmit={fkProfile.handleSubmit} className="space-y-4">
              <div className="flex  flex-col gap-2">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={fkProfile.values.name}
                onChange={fkProfile.handleChange}
                placeholder="Name"
                className="w-full border border-gray-300 p-2 rounded"
              />
              </div>
              <div className="flex  flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={fkProfile.values.email}
                onChange={fkProfile.handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 p-2 rounded"
              />
              </div>
              {/* <input
                type="text"
                name="mobile"
                value={fkProfile.values.mobile}
                onChange={fkProfile.handleChange}
                placeholder="Mobile"
                className="w-full border border-gray-300 p-2 rounded"
                disabled
              /> */}
               <div className="flex  flex-col gap-2">
               <label>Password</label>
              <input
                type="text"
                name="password"
                value={fkProfile.values.password}
                onChange={fkProfile.handleChange}
                placeholder="Password"
                className="w-full border border-gray-300 p-2 rounded"
              />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    fkProfile.resetForm();
                    setShowProfileModal(false);
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Table Section */}

      <CustomTable
        tablehead={tablehead}
        tablerow={tablerow}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <CustomToPagination page={page} setPage={setPage} data={allData} />
    </div>
  );
};

export default UserDetail;
