import { UploadFile } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRef, useState } from "react";
import { API_URLS } from "../config/APIUrls";
import axiosInstance from "../config/axios";

const ExcelUploadButton = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Trigger file dialog
  const handleButtonClick = () => {
    if (uploading) return; // Prevent multiple clicks during upload
    fileInputRef.current.click();
  };

  // File selected
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    // Optional: upload immediately on select, otherwise remove this line
    handleUpload(selectedFile);
  };

  // Upload to backend
const handleUpload = async (file) => {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axiosInstance.post(API_URLS?.employee_excel, formData);
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Button triggers file dialog */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFile />}
        onClick={handleButtonClick}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Excel"}
      </Button>
    </div>
  );
};

export default ExcelUploadButton;
