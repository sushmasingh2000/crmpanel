import { useFormik } from "formik";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import Loader from "../../Shared/Loader";
import { useQuery, useQueryClient } from "react-query";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CopierTrade = () => {
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const client = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ["copier_data"],
    () => apiConnectorGet(endpoint?.copier_profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    }
  );

  const copier_data = data?.data?.result?.[0] || {};

  useEffect(() => {
    if (
      copier_data?.cd_active_status === "Verified" &&
      copier_data?.cd_status_updated_at
    ) {
      const updatedAt = new Date(copier_data.cd_status_updated_at);
      const expiryDate = new Date(updatedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

      const timer = setInterval(() => {
        const now = new Date();
        const diff = expiryDate - now;

        if (diff <= 0) {
          setRemainingTime("Expired");
          clearInterval(timer);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [copier_data]);

  // Show Activate button when created_at is NULL / not present
  const showActivateButton = !copier_data?.cd_created_at;

  // -------------------------------------------------------------------
  // FORM FIELDS
  // -------------------------------------------------------------------
  const initialValue = {
    master_name: copier_data?.cd_ma_name || "",
    master_email: copier_data?.cd_ma_email || "",
    master_mobile: copier_data?.cd_ma_mob || "",
    master_account_id: copier_data?.cd_ma_acc_type || "",
    master_wallet_amount: copier_data?.cd_ma_deposit_amnt || "",
    master_server_name: copier_data?.cd_ma_server_name || "",
    master_broker_name: copier_data?.cd_ma_broker_name || "",
    master_password: copier_data?.cd_ma_trading_password || "",

    follower_name: copier_data?.cd_fl_name || "",
    follower_email: copier_data?.cd_fl_email || "",
    follower_mobile: copier_data?.cd_fl_mob || "",
    follower_account_id: copier_data?.cd_fl_acc_type || "",
    follower_wallet_amount: copier_data?.cd_fl_deposit_amnt || "",
    follower_server_name: copier_data?.cd_fl_server_name || "",
    follower_broker_name: copier_data?.cd_fl_broker_name || "",
    follower_password: copier_data?.cd_fl_trading_password || "",
  };

  const fk = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,

    onSubmit: async (values) => {
      const reqbody = {
        ma_name: values.master_name,
        ma_email: values.master_email,
        ma_mob: values.master_mobile,
        ma_acc_type: values.master_account_id,
        ma_deposit: values.master_wallet_amount,
        ma_broker: values.master_broker_name,
        ma_server: values.master_server_name,
        ma_trading_pass: values.master_password,

        fl_name: values.follower_name,
        fl_email: values.follower_email,
        fl_mob: values.follower_mobile,
        fl_acc_type: values.follower_account_id,
        fl_deposit: values.follower_wallet_amount,
        fl_broker: values.follower_broker_name,
        fl_server: values.follower_server_name,
        fl_trading_pass: values.follower_password,
      };

      try {
        setLoading(true);
        const response = await apiConnectorPost(endpoint.copier_trade_api, reqbody);
        toast(response?.data?.message, { id: 1 });
        if (response?.data?.success) fk.handleReset();
        client.refetchQueries("copier_data");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const MasterFields = [
    { id: "master_name", label: "Name" },
    { id: "master_email", label: "Email" },
    { id: "master_mobile", label: "Mobile" },
    { id: "master_account_id", label: "(MT5/4) ID" },
    { id: "master_wallet_amount", label: "Deposit Amount", type: "number" },
    { id: "master_server_name", label: "Server Name" },
    { id: "master_broker_name", label: "Broker Name" },
    { id: "master_password", label: "Trade Password" },
  ];

  const FollowerFields = [
    { id: "follower_name", label: "Name" },
    { id: "follower_email", label: "Email" },
    { id: "follower_mobile", label: "Mobile" },
    { id: "follower_account_id", label: "(MT5/4) ID" },
    { id: "follower_wallet_amount", label: "Deposit Amount", type: "number" },
    { id: "follower_server_name", label: "Server Name" },
    { id: "follower_broker_name", label: "Broker Name" },
    { id: "follower_password", label: "Trade Password" },
  ];

  // -------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------
  return (
    <>
      <Loader isLoading={loading} />

      <div className="flex flex-col items-center justify-center px-4 py-5">
        <div className="w-full bg-gray-900 shadow-xl p-8">

          {/* ACTIVATE BUTTON */}
          <div className="flex justify-end">
            {showActivateButton && (
              <Button className="!bg-white" onClick={() => navigate("/fund")}>
                Activate Account
              </Button>
            )}
          </div>

          {/* TIMER DISPLAY */}
          {copier_data?.cd_active_status === "Verified" && (
            <div className="text-white flex justify-end  text-center p-3 rounded-md mt-3">
              <p className="text-xs">Time Remaining: <span className="text-red-500">{remainingTime}</span></p>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-10 text-center text-white">
            Master Account Details
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {MasterFields.map(({ id, label, type = "text" }) => (
              <div key={id}>
                <label className="block text-sm font-medium text-white mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={id}
                  placeholder={label}
                  value={fk.values[id]}
                  onChange={fk.handleChange}
                  className="w-full px-4 py-2 border focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            ))}
          </form>
        </div>

        {/* FOLLOWER FORM */}
        <div className="w-full bg-gray-900 shadow-xl p-8 mt-5">
          <h2 className="text-2xl font-bold mb-10 text-center text-white">
            Follower Account Details
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {FollowerFields.map(({ id, label, type = "text" }) => (
              <div key={id}>
                <label className="block text-sm font-medium text-white mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={id}
                  placeholder={label}
                  value={fk.values[id]}
                  onChange={fk.handleChange}
                  className="w-full px-4 py-2 border focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            ))}
          </form>

          <div className="flex justify-end">
            {copier_data?.cd_active_status === "Verified" ?
              <button
                className="p-2 px-10 bg-gold-color text-white font-semibold rounded-md mt-50"
              >

                Account Activated
              </button>
              :
              <button
                onClick={fk.handleSubmit}
                className="p-2 px-10 bg-gold-color text-white font-semibold rounded-md mt-5 hover:bg-blue-700"
              >

                {loading ? "Processing..." : "Submit"}
              </button>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default CopierTrade;
