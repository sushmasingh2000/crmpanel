import { Add, Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Switch
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import { CITIES } from "../../Shared/CityList";
import { COUNTRIES } from "../../Shared/CountryList";
import CustomDialog from "../../Shared/CustomDialogBox";
import CustomFilter from "../../Shared/CustomForFiler";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import { STATES } from "../../Shared/StateList";


const AreaMaster = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);

  /* ================= FORMIK ================= */
  const fk = useFormik({
    initialValues: {
      country: "IN",
      state: "",
      city: "",
      area_name: "",
      pincode: "",
    },
    onSubmit: (values) => {
      editData ? updateArea(values) : createArea(values);
    },
  });

  const filteredStates = STATES.filter(
    (s) => s.country_id === fk.values.country
  );

  const filteredCities = CITIES.filter(
    (c) => c.state_id === fk.values.state
  );

  /* ================= API ================= */
  const createArea = async (values) => {

    try {
      const stateName = STATES.find((s) => s.id === values.state)?.name;

      const res = await axiosInstance.post(API_URLS.create_area, {
        country_code: values.country,
        state_code: stateName,
        city_name: values.city,
        area_name: values.area_name,
        pincode: values.pincode,
      });

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_area");
        handleClose();
      }
    } catch {
      toast.error("Create failed");
    }
  };

  const updateArea = async (values) => {
    try {
      const stateName = STATES.find((s) => s.id === values.state)?.name;

      const res = await axiosInstance.post(API_URLS.update_area, {
        area_id: editData.area_id,
        country_code: values.country,
        state_code: stateName,
        city_name: values.city,
        area_name: values.area_name,
        pincode: values.pincode,
      });

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_area");
        handleClose();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const toggleStatus = async (row) => {
    try {
      const res = await axiosInstance.post(
        API_URLS.toggle_area,
        { area_id: row.area_id }
      );
      toast(res?.data?.msg);
      queryClient.invalidateQueries("get_area");
    } catch {
      toast.error("Status update failed");
    }
  };

  /* ================= HANDLERS ================= */
  const handleOpen = () => {
    fk.resetForm();
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (row) => {
  // Get country from COUNTRIES list
  const countryObj = COUNTRIES.find((c) => c.id === row.country_code) || { id: "IN" };

  // Get state id from STATES list based on name
  const stateObj = STATES.find((s) => s.name === row.state_code);

  setEditData(row);
  
  fk.setValues({
    country: countryObj.id,
    state: stateObj?.id || "",
    city: row.city_name,
    area_name: row.area_name,
    pincode: row.pincode,
  });

  // Mark all fields as touched so buttons enable
  fk.setTouched({
    country: true,
    state: true,
    city: true,
    area_name: true,
    pincode: true,
  });

  setOpen(true);
};



  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };


  const filterFormik = useFormik({
    initialValues: {
      search: "",
      start_date: "",
      end_date: "",
    },
  });
  const { isLoading, data } = useQuery(
    ["get_area", page, filterFormik.values.search],
    () =>
      axiosInstance.post(API_URLS.get_area, {
        search: filterFormik.values.search,
        page,
        count: 10,
      }),
    { refetchOnWindowFocus: false }
  );

  const areas = data?.data?.response || [];

  /* ================= TABLE ================= */
  const tablehead = [
    "S.No",
    "State",
    "City",
    "Area",
    "Pincode",
    "Status",
    "Action",
    "Date",
  ];

  const tablerow = areas?.data?.map((row, i) => [
    i + 1,
    row.state_code,
    row.city_name,
    row.area_name,
    row.pincode,
    <Switch
      checked={row.area_status === 1}
      onChange={() => toggleStatus(row)}
    />,
    <IconButton onClick={() => handleEdit(row)}>
      <Edit />
    </IconButton>,
    moment(row.created_at).format("DD-MM-YYYY"),
  ]);

  return (
    <>
      <div className="mx-5">
        <div className="flex justify-between items-center p-4">
          <p className="font-bold text-xl">Area Master</p>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            className="!bg-gradient-to-b from-[#7981F9] to-[#5E60D0]"
          >
            Area
          </Button>
        </div>

        <CustomFilter
          formik={filterFormik}
          onFilter={() => {
            setPage(1);
            queryClient.invalidateQueries("get_area");
          }}
          onClear={() => {
            filterFormik.resetForm();
            setPage(1);
            queryClient.invalidateQueries("get_area");
          }}
        />

        <CustomTable
          tablehead={tablehead}
          tablerow={tablerow}
          isLoading={isLoading}
        />

        <CustomToPagination
          setPage={setPage}
          page={page}
          data={areas}
        />
      </div>

      <CustomDialog
        open={open}
        onClose={handleClose}
        onSubmit={fk.handleSubmit}
        title={editData ? "Edit Area" : "Add Area"}
        formik={fk}
        fields={[
          {
            name: "country",
            label: "Country",
            type: "select",
            options: (COUNTRIES || []).map((c) => ({
              label: c.name,
              value: c.id,
            })),
            onChange: (e) => {
              fk.setFieldValue("country", e.target.value);
              fk.setFieldValue("state", "");
              fk.setFieldValue("city", "");
            },
          },
          {
            name: "state",
            label: "State",
            type: "select",
            options: (filteredStates || []).map((s) => ({
              label: s.name,
              value: s.id,
            })),
            onChange: (e) => {
              fk.setFieldValue("state", e.target.value);
              fk.setFieldValue("city", "");
            },
          },
          {
            name: "city",
            label: "City",
            type: "select",
            options: (filteredCities || []).map((c) => ({
              label: c.name,
              value: c.name,
            })),
          },
          { name: "area_name", label: "Area Name", type: "text" },
          { name: "pincode", label: "Pincode", type: "number" },
        ]}

      />

    </>
  );
};

export default AreaMaster;
