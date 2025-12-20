import axios from "axios";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { endpoint } from "../utils/APIRoutes";
import logo from "../assets/favicon.png";
import { useEffect, useState } from "react";
import Loader from "../Shared/Loader";
import { apiConnectorPost } from "../utils/APIConnector";
import bgVideo from "../assets/bluewhite.mp4";
import Swal from "sweetalert2";


const Registration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralId = searchParams.get("referral_id");
  const [data, setData] = useState("");
  const [loding, setLoading] = useState(false);

  const initialValue = {
    username: "",
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    referral_id: referralId || "",
  };
  const fk = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,

    onSubmit: () => {
      const reqbody = {
        username: fk.values.email,
        full_name: fk.values.full_name,
        email: fk.values.email,
        mobile: fk.values.mobile,
        password: fk.values.password,
        referral_id: fk.values.referral_id,
      };
      RegistrationFn(reqbody);
    },
  });
  const RegistrationFn = async (reqbody) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint?.registration_api, reqbody, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      toast(response?.data?.message);
      setLoading(false);
      if (response?.data?.success) {
        localStorage.setItem("logindataen", response?.data?.result?.[0]?.token);
        Swal.fire({
          title: "🎉 Congratulations!",
          html: `
            <p style="font-size:14px; margin-bottom:8px;">Registration Successfully</p>
            <p style="font-weight:bold; color:#f39c12; margin:0;">User Login Credentials </p>
            <p style="font-size:13px; word-break:break-all; color:#16a085; margin-top:4px;">
             Login ID:${response?.data?.result?.[0]?.cust_id}
             <br/>
             Password:${fk.values.password}
            </p>
          `,
          icon: "success",
          confirmButtonColor: "#75edf2",
        }).then((result) => {
          if (result.isConfirmed) {
            fk.handleReset();
            navigate("/dashboard");
            window.location.reload();
          }
        });
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const Customerfunction = async () => {
    const reqbody = {
      customer_id: fk.values.referral_id,
    };
    try {
      const res = await apiConnectorPost(endpoint?.customer_api, reqbody);
      setData(res?.data?.result?.[0]);
    } catch (e) {
      console.log("something went wrong");
    }
  };

  useEffect(() => {
    Customerfunction();
  }, [fk.values.referral_id]);

  return (
    <>
      <Loader isLoading={loding} />
      <div
        className="flex justify-center items-center min-h-screen">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className="w-full max-w-lg lg:p-6 p-4 border-border-color-green bg-[#000000db] bg-opacity-20 border rounded-xl shadow-2xl" >
          <div className="flex justify-center my-2 cursor-pointer" onClick={() => navigate("/")}>

            <img src={logo} alt="Logo" className="h-14 " />
          </div>
          <h2 className="text-sm font-bold text-center text-white mb-6">
            You might have already account ?
            <span
              className="text-white text-sm px-2 font-bold underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </h2>
          <form onSubmit={fk.handleSubmit}>
            <div className="mb-6">
              <input
                placeholder="Full Name"
                id="full_name"
                name="full_name"
                value={fk.values.full_name}
                onChange={fk.handleChange}
                className="w-full p-3 mt-1 border text-black placeholder:text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border-color-green "
                required
              />
            </div>
            <div className="grid grid-cols-2 place-items-center gap-2">
              <div className="mb-4">
                <input
                  placeholder="Email Id"
                  type="email"
                  id="email"
                  name="email"
                  value={fk.values.email}
                  onChange={fk.handleChange}
                  className="w-full p-3 mt-1 text-black placeholder:text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border-color-green "
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  placeholder="Mobile"
                  id="mobile"
                  name="mobile"
                  value={fk.values.mobile}
                  onChange={fk.handleChange}
                  className="w-full p-3 mt-1 border text-black placeholder:text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border-color-green "
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  placeholder="Password"
                  id="password"
                  value={fk.values.password}
                  onChange={fk.handleChange}
                  className="w-full p-3 mt-1 border text-black placeholder:text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border-color-green "
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  placeholder="Refferral Id"
                  id="referral_id"
                  name="referral_id"
                  value={fk.values.referral_id}
                  onChange={fk.handleChange}
                  className="w-full p-3 mt-1 border text-black placeholder:text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-border-color-green "
                  required
                />
                {fk.values.referral_id && (
                  <span className="text-white !px-2"><span className="text-white !px-2">
                    {data
                      ? (data.jnr_name ? "Active" : "")
                      : "Invalid Referral Id"}
                  </span> </span>
                )}


              </div>

            </div>
            <button
              type="submit"
              className="w-full py-3 text-white border-2 border-border-color-green font-semibold rounded-full hover:bg-black bg-[#e98d2c] focus:outline-none focus:ring-2 focus:ring-[#703f0a] "
              onClick={fk.handleSubmit}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
