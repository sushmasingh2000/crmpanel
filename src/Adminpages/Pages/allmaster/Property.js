import { Add, Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Switch,
  Tooltip
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomDialog from "../../Shared/CustomDialogBox";
import CustomFilter from "../../Shared/CustomForFiler";
import CustomTable from "../../Shared/CustomTable";
import toast from "react-hot-toast";
import CustomToPagination from "../../../Shared/Pagination";

const PropertyMaster = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);

  /* ================= FILTER ================= */
  const filterFormik = useFormik({
    initialValues: {
      search: "",
      start_date: "",
      end_date: "",
    },
  });

  /* ================= LIST API ================= */
  const { isLoading, data: propertyList } = useQuery(
    ["get_property_master", page, filterFormik.values.search],
    () =>
      axiosInstance.post(API_URLS.get_property_master, {
        search: filterFormik.values.search,
        page,
        count: 10,
      }),
    { refetchOnWindowFocus: false }
  );

  const properties = propertyList?.data?.response || [];

  /* ================= ADD / EDIT FORM ================= */
  const fk = useFormik({
    initialValues: {
      name: "",
      desc: "",
    },
    onSubmit: async (values) => {
      if (editData) return updateProperty(values);
      return createProperty(values);
    },
  });

  /* ================= CREATE ================= */
  const createProperty = async (values) => {
    try {
      const res = await axiosInstance.post(API_URLS.create_property_master, {
        property_type_name: values.name,
        property_type_desc: values.desc,
        property_type_status: "1",
      });

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_property_master");
        handleClose();
      }
    } catch {
      toast.error("Failed to create property");
    }
  };

  /* ================= UPDATE ================= */
  const updateProperty = async (values) => {
    try {
      const res = await axiosInstance.post(API_URLS.update_property_master, {
        property_type_id: editData.property_type_id,
        property_type_name: values.name,
        property_type_desc: values.desc,
        property_type_status: String(editData.property_type_status),
      });

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_property_master");
        handleClose();
      }
    } catch {
      toast.error("Failed to update property");
    }
  };

  /* ================= STATUS TOGGLE ================= */
  const toggleStatus = async (row) => {
    try {
      const res = await axiosInstance.post(
        API_URLS.update_property_master_status,
        { property_type_id: row.property_type_id }
      );

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_property_master");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= HANDLERS ================= */
  const handleOpen = () => {
    fk.resetForm();
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    fk.setValues({
      name: row.property_type_name,
      desc: row.property_type_desc,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  /* ================= TABLE ================= */
  const tablehead = ["S.No", "Name", "Description",  "Status", "Actions", "Date"];

  const tablerow = properties?.data?.map((item, index) => [
    <span>{index + 1}</span>,
    <span>{item.property_type_name}</span>,
    <span>{item.property_type_desc}</span>,
    <Switch
      checked={item.property_type_status === 1}
      onChange={() => toggleStatus(item)}
      color="success"
    />,
    <Tooltip title="Edit">
      <IconButton onClick={() => handleEdit(item)}>
        <Edit className="text-blue-600" />
      </IconButton>
    </Tooltip>,
    <span>{moment(item.created_at).format("DD-MM-YYYY")}</span>,
  ]);

  return (
    <>
      <div className="mx-5">
        <div className="flex justify-between items-center p-4">
          <p className="font-bold text-xl">Property Master</p>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            className="!bg-gradient-to-b from-[#7981F9] to-[#5E60D0]"
          >
            Add Property
          </Button>
        </div>

        <CustomFilter
          formik={filterFormik}
          onFilter={() => {
            setPage(1);
            queryClient.invalidateQueries("get_property_master");
          }}
          onClear={() => {
            filterFormik.resetForm();
            setPage(1);
            queryClient.invalidateQueries("get_property_master");
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
          data={properties}
        />
      </div>

      <CustomDialog
        open={open}
        onClose={handleClose}
        onSubmit={fk.handleSubmit}
        title={editData ? "Edit Property" : "Add Property"}
        formik={fk}
        fields={[
          { name: "name", label: "Property Name", type: "text" },
          { name: "desc", label: "Description", type: "text" },
        ]}
      />
    </>
  );
};

export default PropertyMaster;
