import { DeleteForever, Edit } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { domain, endpoint } from "../../utils/APIRoutes";

const Gallery = () => {
    const [Gallerys, setGallerys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [formData, setFormData] = useState({
        g_id: "",
        gal_image: "",
        gal_sequence: "",
        gal_status: false,
    });

    // Fetch all Gallerys
    const fetchGallerys = async () => {
        try {
            setLoading(true);
            const res = await apiConnectorGet(endpoint.get_Gallery);
            setGallerys(res?.data?.result || []);
        } catch {
            toast.error("Failed to fetch Gallerys.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallerys();
    }, []);

    const resetForm = () => {
        setFormData({ g_id: "", gal_image: "", gal_status: false });
        setSelectedGallery(null);
    };

    // Create or Update Gallery
    const handleSubmit = async () => {
        const { gal_image, g_id } = formData;
        if (!gal_image) {
            toast.error("Gallery image are required.");
            return;
        }

        setLoading(true);
        const formPayload = new FormData();
        formPayload.append("gal_sequence", 0)
        formPayload.append("file", gal_image); // file
        if (selectedGallery) {
            formPayload.append("g_id", g_id);
        }

        const apiUrl = selectedGallery ? endpoint.update_Gallery : endpoint.create_Gallery;

        try {
            const res = await apiConnectorPost(apiUrl, formPayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(res?.data?.message || "Gallery saved.");
            fetchGallerys();
            setModalOpen(false);
            resetForm();
        } catch {
            toast.error("Operation failed.");
        } finally {
            setLoading(false);
        }
    };


    // Edit existing Gallery
    const handleEdit = (Gallery) => {
        setSelectedGallery(Gallery);
        setFormData({
            g_id: Gallery.gal_id,
            file: Gallery.gal_image,
            gal_status: Gallery.gal_status,
        });
        setModalOpen(true);
    };

    // Delete Gallery
    const handleDelete = async (id) => {
        try {
            const res = await apiConnectorPost(endpoint.delete_Gallery, {
                g_id: id
            })
            toast.success(res?.data?.message || "Gallery deleted.");
            fetchGallerys();
        } catch {
            toast.error("Delete failed.");
        }
    };

    // Toggle Gallery status
    const toggleStatus = async (id) => {
        try {
            const res = await apiConnectorPost(endpoint.status_Gallery, {
                g_id: id
            })
            toast.success(res?.data?.message || "Status updated.");
            fetchGallerys();
        } catch {
            toast.error("Could not change status.");
        }
    };

    return (
        <div className="p-6">
            <Loader isLoading={loading}/>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gallery</h1>
                <button
                    onClick={() => {
                        setModalOpen(true);
                        resetForm();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Gallery
                </button>
            </div>

            <div className="shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-black">
                        <tr>
                            <th className="px-4 py-3 text-left">S.No</th>
                            <th className="px-4 py-3 text-left">Image</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Gallerys.map((Gallery, index) => (
                            <tr key={Gallery.gal_id} className="border-t ">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">
                                    <img
                                        src={domain + Gallery.gal_image}
                                        alt={"ghgh"}
                                        className="w-16 h-auto rounded"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() =>
                                            toggleStatus(Gallery.gal_id, Gallery.gal_status === "Active" ? "Deactive" : "Active")
                                        }
                                    >
                                        <Switch checked={Gallery.gal_status === "Active"} />
                                    </button>
                                </td>

                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(Gallery)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        <Edit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(Gallery.gal_id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        <DeleteForever />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {Gallerys.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500">
                                    No Gallerys found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold">
                            {selectedGallery ? "Edit Gallery" : "Add Gallery"}
                        </h2>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFormData({ ...formData, gal_image: e.target.files[0] })
                            }
                            className="w-full border p-2 rounded"
                        />

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setModalOpen(false);
                                    resetForm();
                                }}
                                disabled={loading}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {loading ? "Saving..." : selectedGallery ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
