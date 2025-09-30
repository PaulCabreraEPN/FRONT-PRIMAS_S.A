import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Carga";

const UpdateClient = () => {
    const [client, setClient] = useState({
        Name: "",
        Ruc: "",
        Address: "",
        telephone: "",
        email: "",
        credit: "",
        state: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const { ruc } = useParams();
    const navigate = useNavigate();

    const getClient = async () => {
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/clients/${ruc}`;
            const options = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(url, options);
            const clientData = response.data.data;
            if (clientData) {
                setClient({
                    Name: clientData.Name || "",
                    Ruc: clientData.Ruc || "",
                    Address: clientData.Address || "",
                    telephone: clientData.telephone || "",
                    email: clientData.email || "",
                    credit: clientData.credit || "",
                    state: clientData.state || ""
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/clients/update/${ruc}`;
            const options = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.patch(url, client, options);
            if (response.data.status === "success") {
                toast.success(response.data.msg);
                setTimeout(() => navigate("/dashboard/clients"), 2000);
            } else {
                toast.error(response.data.msg || "Error al actualizar cliente");
            }
        } catch (error) {
            toast.error(error.response?.data?.error);
        }
    };

    useEffect(() => {
        if (ruc) {
            getClient();
        }
    }, [ruc]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto mt-8 p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate("/dashboard/clients")}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    ← Atrás
                </button>
                <h2 className="text-2xl font-bold">Actualizar Cliente</h2>
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Actualizar
                </button>
            </div>
            <ToastContainer />
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Nombre:</label>
                        <input
                            type="text"
                            name="Name"
                            value={client.Name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">RUC:</label>
                        <input
                            type="text"
                            name="Ruc"
                            value={client.Ruc}
                            disabled
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Dirección:</label>
                        <input
                            type="text"
                            name="Address"
                            value={client.Address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Teléfono:</label>
                        <input
                            type="number"
                            name="telephone"
                            value={client.telephone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={client.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Crédito:</label>
                        <input
                            type="text"
                            name="credit"
                            value={client.credit}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Estado:</label>
                        <input
                            type="text"
                            name="state"
                            value={client.state}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateClient;
