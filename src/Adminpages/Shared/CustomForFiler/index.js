import React from "react";
import { TextField, Button } from "@mui/material";
import { FilterAlt, FileDownload } from "@mui/icons-material";

const CustomFilter = ({ formik, onFilter, onClear, onExport }) => {
  return (
    <div className="grid grid-cols-2 sm:flex gap-3 md:gap-3 px-3 py-1 bg-[#EBE9FD] bg-opacity-45 mb-5">
      
      <div className="flex">
        <span className="text-xs text-center mr-3">From:</span>
        <TextField
          size="small"
          type="date"
          id="start_date"
          name="start_date"
          value={formik.values.start_date}
          onChange={formik.handleChange}
          className="!min-w-[110px] !md:min-w-[200px]"
        />
      </div>

      <div className="flex">
        <span className="text-xs text-center mr-3">To:</span>
        <TextField
          size="small"
          type="date"
          id="end_date"
          name="end_date"
          value={formik.values.end_date}
          onChange={formik.handleChange}
          className="!min-w-[110px] !md:min-w-[200px]"
        />
      </div>

      <div className="flex">
        <TextField
          size="small"
          type="search"
          id="search"
          name="search"
          placeholder="Search"
          value={formik.values.search}
          onChange={formik.handleChange}
        />
      </div>

      <div className="flex gap-2 !ml-7 md:!ml-0">
        <Button
          onClick={onFilter}
          variant="contained"
          startIcon={<FilterAlt />}
        >
          Filter
        </Button>

        <Button
          onClick={onClear}
          variant="outlined"
          color="secondary"
        >
          Clear
        </Button>

        {/* <Button
          onClick={onExport}
          variant="contained"
          color="success"
          startIcon={<FileDownload />}
        >
          Export
        </Button> */}
      </div>
    </div>
  );
};

export default CustomFilter;
