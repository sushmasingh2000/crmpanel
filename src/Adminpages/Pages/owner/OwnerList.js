import { Button } from "@mui/material";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import CustomTable from "../../Shared/CustomTable";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";

const OwnerList = () => {
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useQuery(
        ["owners"],
        () => axiosInstance.post(API_URLS.get_owner)
    );

    const owners = data?.data?.response || [];

    const tableHead = ["S.No.", "Name", "Mobile", "Area", "Category", "Property"];

    const tableRow = owners?.map((o, index) => [
        index + 1,
        o.crm_owner_name,
        o.crm_mobile,
        o.crm_area,
        o.crm_owner_category,
        <span><Edit onClick={() => navigate('/list_properties' , {
            state : {
                owner_id : o.id
            }
        })} /></span>
    ]);

    return (
        <div className="p-4">
            <div className="flex justify-end mb-3">
                <Button
                    variant="contained"
                    onClick={() => navigate("/create-owner")}
                >
                    + Add Owner
                </Button>
            </div>

            <CustomTable
                tablehead={tableHead}
                tablerow={tableRow}
                isLoading={isLoading}
            />
        </div>
    );
};

export default OwnerList;
