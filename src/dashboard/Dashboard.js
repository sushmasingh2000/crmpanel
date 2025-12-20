import { Cancel, CopyAll } from "@mui/icons-material";
import copy from "copy-to-clipboard";
import moment from "moment";
import toast from "react-hot-toast";
import {
  FaChartLine,
  FaDollarSign,
  FaSitemap,
  FaUserFriends,
  FaUsers,
  FaWallet
} from "react-icons/fa";
import { useQuery } from "react-query";
import { apiConnectorGet } from "../utils/APIConnector";
import { domain, endpoint, frontend } from "../utils/APIRoutes";
import { useState } from "react";
import { Dialog, IconButton } from "@mui/material";

const Dashboard = () => {

  const [showPopup, setShowPopup] = useState(true);

  const { data } = useQuery(["get_dashboard"], () =>
    apiConnectorGet(endpoint?.dashboard_data)
  );

  const dashboard = data?.data?.result?.[0];

  const { data: profile } = useQuery(["get_profile"], () =>
    apiConnectorGet(endpoint?.member_profile_detail)
  );

  const user_profile = profile?.data?.result?.[0] || {};

  const statCjhgbjbards = [
    // { title: "Main Wallet", value: Number(user_profile?.jnr_curr_wallet || 0)?.toFixed(2), icon: <FaWallet /> },
    // { title: "Fund Wallet", value: Number(dashboard?.td_wallet_amount || 0)?.toFixed(2), icon: <FaChartLine /> },
    { title: "Current Rank", value: user_profile?.rank_name || "--", icon: <FaDollarSign /> },
    // { title: "Level Income", value: Number(dashboard?.levelinc || 0)?.toFixed(2), icon: <FaChartLine /> },
    // { title: "ROI Income", value: Number(dashboard?.satcking_bonus || 0)?.toFixed(2), icon: <FaRocket /> },
    { title: "Total Income", value: Number(user_profile?.jnr_total_income || 0)?.toFixed(2), icon: <FaDollarSign /> },
    { title: "Total Team", value: Number(dashboard?.jnr_total_team || 0)?.toFixed(2), icon: <FaUsers /> },
    { title: "Total Team Business", value: Number(dashboard?.jnr_total_team_buss || 0)?.toFixed(2), icon: <FaSitemap /> },
    { title: "Direct Team", value: Number(dashboard?.jnr_direct_team || 0)?.toFixed(2), icon: <FaUserFriends /> },
    { title: " Direct Business", value: Number(dashboard?.jnr_direct_business || 0)?.toFixed(2), icon: <FaUserFriends /> },
    // { title: " Withdrawal Reject", value: Number(dashboard?.total_reject_withdrawal || 0)?.toFixed(2), icon: <FaUserFriends /> },
    // { title: "Withdrawal Success", value: Number(dashboard?.total_success_withdrawal || 0)?.toFixed(2), icon: <FaUserFriends /> },
    // { title: "Withdrawal Pending", value: Number(dashboard?.total_pending_withdrawal || 0)?.toFixed(2), icon: <FaUserFriends /> },

  ];
  const statCards = [
    { title: "Current Rank", value: user_profile?.rank_name || "--", icon: <FaDollarSign />, isCurrency: false },
    { title: "Total Income", value: Number(user_profile?.jnr_total_income || 0)?.toFixed(2), icon: <FaDollarSign />, isCurrency: true },
    { title: "Total Team", value: Number(dashboard?.jnr_total_team || 0)?.toFixed(0,2), icon: <FaUsers />, isCurrency: false },
    { title: " Team Business", value: Number(dashboard?.jnr_total_team_buss || 0)?.toFixed(2), icon: <FaSitemap />, isCurrency: true },
    { title: "Direct Team", value: Number(dashboard?.jnr_direct_team || 0)?.toFixed(0,2), icon: <FaUserFriends />, isCurrency: false },
    { title: " Direct Business", value: Number(dashboard?.jnr_direct_business || 0)?.toFixed(2), icon: <FaUserFriends />, isCurrency: true },
    { title: " Level Income", value: Number(dashboard?.jnr_level_business || 0)?.toFixed(2), icon: <FaUserFriends />, isCurrency: true },
    { title: " Reward Income", value: Number(dashboard?.jnr_reward_business || 0)?.toFixed(2), icon: <FaUserFriends />, isCurrency: true },
  ];

  const functionTOCopy = (value) => {
    copy(value);
    toast.success("Copied to clipboard!", { id: 1 });
  };
  const summaryData = [
    { label: "Money Manager", value: user_profile?.jnr_name },
    { label: "Created", value: user_profile?.lgn_created_at ? moment(user_profile?.lgn_created_at)?.format("DD-MM-YYYY") : "--" },
    { label: "Activation Date", value: user_profile?.jnr_topup_date ? moment(user_profile?.jnr_topup_date)?.format("DD-MM-YYYY") : "--" },
    // { label: "Current Trade Interval Profit", value: Number(dashboard?.curr_trade_interval_profit || 0)?.toFixed(2) || 0 },
    { label: "Net Deposit", value: Number(user_profile?.jnr_topup_wallet || 0)?.toFixed(2) || 0 },
    { label: "Net Withdrawal", value: Number(user_profile?.total_withdrawal || 0)?.toFixed(2) || 0 },
    { label: "Main Wallet", value: Number(user_profile?.jnr_curr_wallet || 0)?.toFixed(2) || 0 },
    { label: "Profit Wallet", value: Number(user_profile?.jnr_total_income || 0)?.toFixed(2) || 0 },
  ];

  return (
    <div className="h-screen bg-[#0f172a] font-sans text-white ">
      <div className="overflow-y-auto max-h-screen example">
        <div className="pt-2">
          <div className="lg:flex  gap-5 items-center justify-start  w-fit  rounded m-4">
            <span className="text-sm overflow-x-auto border border-white p-2 text-white">
              {frontend}/register?referral_id={user_profile?.lgn_cust_id}
            </span>
            <button
              onClick={() => functionTOCopy(frontend + "/register?referral_id=" + user_profile?.lgn_cust_id)}
              className="border border-white p-1 text-sm ">
                <CopyAll className="!text-white" />
              </button>
            {/* <div className="flex space-x-4 text-xl">
              <i className="fab fa-whatsapp"></i>
              <i className="fab fa-telegram"></i>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div> */}
          </div>
        </div>

        {/* News & Updates Tab */}
        <div className="bg-[#1e293b] px-4 py-2 flex">
          <div className="bg-[#e98d2c] text-white px-4 py-1 rounded-t-md text-sm  flex font-semibold">
            News & Updates
          </div>
          <div className="w-full">
            <marquee className="text-white text-sm mx-5 mt-2">
              {dashboard?.news_updates}
            </marquee>
          </div>
        </div>


        {/* Main Content Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 mb-10">
          {/* Summary Panel */}
          <div className="bg-white p-4 rounded-md col-span-1 shadow h-fit ">
            <h2 className="text-xl text-black font-semibold mb-2">Summary</h2>
            <p className="text-sm text-gray-400 mb-3">Last Update</p>
            {summaryData.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 !text-black text-sm border-dotted border-b  border-gray-500 last:border-none">
                <span>{item.label}</span>
                <span className={item.highlight ? "text-green-400 font-semibold" : ""}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Stat Cards Panel */}
          <div className="col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center transition duration-300 hover:shadow-lg"
              >
                <img
                  src={"https://trade4you.uk/application/libraries/icons/wallet.png"}
                  alt=""
                  className="w-10 h-10 mb-3"
                />
                <div className="text-[14px] font-semibold text-gray-700">{card.title}</div>
                <div className="text-[16px] text-black font-bold mt-1">
                  {card.isCurrency ? `$${card.value}` : card.value}
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
      { }
      {showPopup && user_profile?.popup_status === "Active" && (

        <Dialog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          PaperProps={{
            className: "bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-md text-center relative",
          }}
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4"> 📰 News & Updates</h2>
            <img
              src={domain + user_profile?.popup_img}
              alt="Welcome"
              className="w-full h-72 object-contain rounded"
            />

            <div className="mt-4 flex justify-center">
              <IconButton onClick={() => setShowPopup(false)}>
                <Cancel className="text-red-500" />
              </IconButton>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
