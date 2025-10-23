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
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar Cliente</h1>

            <hr className='my-4' />


            <div className="container mx-auto mt-8 p-4">

                {/* 
            <div className="mb-4">
                <button
                    onClick={() => navigate("/dashboard/clients")}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    ← Atrás
                </button>
            </div>
            */}
                <ToastContainer />

                <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                    <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
                        <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                            <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Cliente</legend>
                            <form onSubmit={handleUpdate}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="Name" className="mb-2 block text-sm font-semibold">Nombre:</label>
                                        <input
                                            type="text"
                                            id="Name"
                                            name="Name"
                                            placeholder="Ingrese nombre"
                                            value={client.Name}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="Ruc" className="mb-2 block text-sm font-semibold">RUC:</label>
                                        <input
                                            type="text"
                                            id="Ruc"
                                            name="Ruc"
                                            value={client.Ruc}
                                            disabled
                                            className="block w-full rounded-md border border-gray-300 bg-gray-100 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="Address" className="mb-2 block text-sm font-semibold">Dirección:</label>
                                        <input
                                            type="text"
                                            id="Address"
                                            name="Address"
                                            placeholder="Ingrese dirección"
                                            value={client.Address}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="telephone" className="mb-2 block text-sm font-semibold">Teléfono:</label>
                                        <input
                                            type="number"
                                            id="telephone"
                                            name="telephone"
                                            placeholder="Ingrese teléfono"
                                            value={client.telephone}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Ingrese correo"
                                            value={client.email}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="credit" className="mb-2 block text-sm font-semibold">Crédito:</label>
                                        <input
                                            type="text"
                                            id="credit"
                                            name="credit"
                                            placeholder="N/D"
                                            value={client.credit}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="mb-2 block text-sm font-semibold">Estado:</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            placeholder="Ingrese estado"
                                            value={client.state}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button type="submit" disabled={isLoading} className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black disabled:opacity-50">
                                        {isLoading ? 'Actualizando...' : 'Actualizar'}
                                    </button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateClient;
