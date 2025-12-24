import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import Loader from "../../../Shared/Loader";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: "",
    mobile: "",
    name: "",
    pass: "",
  };

  const fk = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      const reqBody = {
        crm_mobile: fk.values.mobile,
        crm_email: fk.values.email,
        crm_password: fk.values.pass,
        crm_name: fk.values.name,
      };
      signupFunction(reqBody);
    },
  });

  const signupFunction = async (reqBody) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_URLS.emp_registration, reqBody);
        toast(response?.data?.msg);
      if (response?.data?.success) {
        fk.handleReset();
        navigate("/");
      } 
    } catch (e) {
      console.log(e);
      toast("Error connecting to server.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#397EF3] via-[#060C95] to-[#00008B]">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-8 py-10 w-full max-w-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">
          Sign Up
        </h2>

        {/* Form Grid */}
        <form
          onSubmit={fk.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white"
        >
          {/* Name */}
          <div>
            <p className="font-bold mb-1">Name</p>
            <TextField
              fullWidth
              id="name"
              name="name"
              placeholder="Name"
              value={fk.values.name}
              onChange={fk.handleChange}
              InputProps={{ style: { color: 'white' } }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <p className="font-bold mb-1">Phone Number</p>
            <TextField
              fullWidth
              type="number"
              id="mobile"
              name="mobile"
              placeholder="Mobile"
              value={fk.values.mobile}
              onChange={fk.handleChange}
              InputProps={{ style: { color: 'white' } }}
            />
          </div>

          {/* Email */}
          <div>
            <p className="font-bold mb-1">Email</p>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="Email"
              value={fk.values.email}
              onChange={fk.handleChange}
              InputProps={{ style: { color: 'white' } }}
            />
          </div>

          {/* Password */}
          <div>
            <p className="font-bold mb-1">Password</p>
            <TextField
              fullWidth
              type="password"
              id="pass"
              name="pass"
              placeholder="Password"
              value={fk.values.pass}
              onChange={fk.handleChange}
              InputProps={{ style: { color: 'white' } }}
            />
          </div>

          {/* Buttons (span full width) */}
          <div className="col-span-1 md:col-span-2 flex justify-start gap-3 mt-4">
            <Button
              onClick={() => fk.handleReset()}
              variant="contained"
              className="!bg-[#E74C3C]"
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="!bg-[#07BC0C]"
            >
              Submit
            </Button>
          </div>
        </form>

        {/* Loader */}
        <Loader isLoading={loading} />
      </div>
    </div>
  );
};

export default SignUp;
