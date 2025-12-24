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
import CustomToPagination from "../../Shared/Pagination";

const ServiceTypeMaster = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);

  /* ================= FILTER FORM ================= */
  const filterFormik = useFormik({
    initialValues: {
      search: "",
      start_date: "",
      end_date: "",
    },
  });

  const { isLoading, data: serviceList } = useQuery(
    ["get_service_type_master", page, filterFormik.values.search],
    () =>
      axiosInstance.post(API_URLS.get_service_type, {
          search: filterFormik.values.search,
          page,
          count: 10,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const services = serviceList?.data?.response || [];

  /* ================= ADD / EDIT FORM ================= */
  const fk = useFormik({
    initialValues: {
      name: "",
      desc: "",
    },
    onSubmit: async (values) => {
      if (editData) return updateService(values);
      return createService(values);
    },
  });

  /* ================= CREATE ================= */
  const createService = async (values) => {
    try {
      const res = await axiosInstance.post(API_URLS.create_service_type, {
        service_type_name: values.name,
        service_type_desc: values.desc,
        service_type_status: "1",
      });

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_service_type_master");
        handleClose();
      }
    } catch {
      toast.error("Failed to create service type");
    }
  };

  /* ================= UPDATE ================= */
  const updateService = async (values) => {
    try {
      const res = await axiosInstance.post(API_URLS.update_service_type, {
        service_type_id: editData.service_type_id,
        service_type_name: values.name,
        service_type_desc: values.desc,
        service_type_status: String(editData.service_type_status),
      });

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_service_type_master");
        handleClose();
      }
    } catch {
      toast.error("Failed to update service type");
    }
  };

  const toggleStatus = async (row) => {
    try {
      const res = await axiosInstance.post(
        API_URLS.update_service_type_status,
        { service_type_id: row.service_type_id }
      );

      toast(res?.data?.msg);
      if (res?.data?.success) {
        queryClient.invalidateQueries("get_service_type_master");
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
      name: row.service_type_name,
      desc: row.service_type_desc,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  /* ================= TABLE ================= */
  const tablehead = ["S.No", "Name ", "Description" , "Status", "Actions", "Date"];

  const tablerow = services?.data?.map((item, index) => [
    <span>{index + 1}</span>,
    <span>{item.service_type_name}</span>,
    <span>{item.service_type_desc}</span>,
    <Switch
      checked={item.service_type_status === 1}
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
          <p className="font-bold text-xl">Service  Master</p>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            className="!bg-gradient-to-b from-[#7981F9] to-[#5E60D0]"
          >
            Add Service 
          </Button>
        </div>

        <CustomFilter
          formik={filterFormik}
          onFilter={() => {
            setPage(1);
            queryClient.invalidateQueries("get_service_type_master");
          }}
          onClear={() => {
            filterFormik.resetForm();
            setPage(1);
            queryClient.invalidateQueries("get_service_type_master");
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
          data={services}
        />
      </div>

      <CustomDialog
        open={open}
        onClose={handleClose}
        onSubmit={fk.handleSubmit}
        title={editData ? "Edit Service " : "Add Service "}
        formik={fk}
        fields={[
          { name: "name", label: "Service  Name", type: "text" },
          { name: "desc", label: "Description", type: "text" },
        ]}
      />
    </>
  );
};

export default ServiceTypeMaster;
