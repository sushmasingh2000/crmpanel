import { useState } from "react";
  import toast from "react-hot-toast";
  import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
  import { endpoint } from "../../../utils/APIRoutes";
import { useQuery } from "react-query";
  
  const Fund = () => {
    const [amount, setAmount] = useState("");
    const [wallet_address, setWalletAddress] = useState("");
    const [hex_code, setHexCode] = useState("");
    const [receiptFile, setReceiptFile] = useState(null);
  
    const handleFundRequestSubmit = async (e) => {
      e.preventDefault();
  
      if (!amount || !receiptFile || !wallet_address) {
        toast.error("Please enter amount and upload receipt.");
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append("deposit_amnt", amount);
        formData.append("wallet_address", wallet_address || "");
        formData.append("hex_code", hex_code);
        formData.append("file", receiptFile); 
  
        const res = await apiConnectorPost(
          endpoint?.copier_payment,
          formData,
          true 
        );
  
        toast.success(res.data?.message);
        if (res.data?.success) {
          setAmount("");
          setWalletAddress("");
          setHexCode("");
          setReceiptFile(null);
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error("Something went wrong!");
      }
    };
  
    const handleCopyAddress = () => {
      navigator.clipboard
        .writeText(address?.lgn_wallet_add || "")
        .then(() => toast("Wallet Address copied to clipboard!"))
        .catch((err) => console.error("Failed to copy address:", err));
    };

    const { data } = useQuery(
          ["get_address_user"],
          () => apiConnectorGet(endpoint?.member_profile_detail),
          {
            keepPreviousData: true,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            onError: (err) => console.error("Error fetching level data:", err),
          }
        );
      
        const address = data?.data?.result?.[0] || []

    return (
        <div className="p-2 min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white border border-gray-700 ">
          <div className="flex flex-col md:flex-row gap-10 w-full">
          {/* FUND REQUEST FORM */}
           <div className="bg-gray-700 p-4 flex flex-col items-start w-full rounded-md">
              <label className="text-sm font-medium text-gray-300 mb-2">
                QR Address
              </label>
  
              <img
                src={address?.qr_image}
                alt="QR Code"
                className="p-4 w-[250px] h-[250px]"
              />
  
              <label className="text-sm font-medium text-gray-300 mb-2">
                Wallet Address
              </label>
  
              <input
                type="text"
                value={address?.lgn_wallet_add || ""}
                readOnly
                className="w-full bg-gray-600 text-white border border-gray-500 rounded-md py-2 px-3"
              />
  
              <button
                type="button"
                onClick={handleCopyAddress}
                className="mt-3 px-4 py-1 text-sm bg-green-500 text-black rounded hover:bg-green-600"
              >
                Copy Address
              </button>
            </div> 
          <form onSubmit={handleFundRequestSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-1">
                Wallet Address
              </label>
              <input
                value={wallet_address}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Wallet Address"
                className="bg-gray-700 border border-gray-600 py-2 px-3 text-white"
              />
            </div>
  
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-1">
                Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-700 border border-gray-600 py-2 px-3 text-white"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-1">
                HexCode<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Enter HexCode"
                value={hex_code}
                onChange={(e) => setHexCode(e.target.value)}
                className="bg-gray-700 border border-gray-600 py-2 px-3 text-white"
                required
              />
            </div>
  
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-1">
                Receipt <span className="text-red-500">*</span>
              </label>
              <label className="bg-gray-700 text-white border border-gray-600 py-2 px-3 cursor-pointer hover:bg-gray-600 block text-center">
                {receiptFile ? receiptFile.name : "Choose File"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
  
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-gray-900 font-semibold hover:bg-green-600 self-end"
            >
              Submit
            </button>
          </form>
  
          {/* QR + WALLET ADDRESS */}
        
  
        </div>
  </div>
      </div>
    );
  };
  
  export default Fund;