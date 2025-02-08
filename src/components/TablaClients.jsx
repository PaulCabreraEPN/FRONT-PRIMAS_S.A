import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Carga";

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [searchRuc, setSearchRuc] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/clients`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            setClients(response.data);
        } catch (error) {
            toast.error("Error al obtener los clientes");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClientByRuc = async () => {
        if (!searchRuc) {
            toast.warn("Ingrese un RUC válido");
            return;
        }
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backendUrl}/clients/${searchRuc}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setClients([response.data.data]);
        } catch (error) {
            toast.error("Cliente no encontrado");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializeProducts = async () => {
            await fetchClients();
        };
        initializeProducts();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center justify-center">
                <input
                    type="text"
                    placeholder="Ingrese RUC"
                    value={searchRuc}
                    onChange={(e) => setSearchRuc(e.target.value)}
                    className="border p-2 rounded mb-2 sm:mb-0 sm:w-64 w-full sm:mr-2"
                />
                <button onClick={fetchClientByRuc} className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 sm:w-auto w-full sm:mr-2">
                    Buscar
                </button>
                <button onClick={fetchClients} className="bg-gray-500 text-white px-4 py-2 rounded sm:w-auto w-full">
                    Mostrar Todos
                </button>
            </div>
    
            {isLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {clients.map((client) => (
                        <div key={client.ruc} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                            <h2 className="text-xl font-bold text-blue-700">{client.Name}{client.name}</h2>
                            <p className="text-gray-700"><strong>RUC:</strong> {client.Ruc}{client.ruc}</p>
                            <p className="text-gray-700"><strong>Dirección:</strong> {client.Address} {client.address}</p>
                            <p className="text-gray-700"><strong>Teléfono:</strong> {client.telephone}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {client.email}</p>
                            <p className="text-gray-700"><strong>Crédito:</strong> {client.credit}</p>
                            <p className="text-gray-700"><strong>Estado:</strong> {client.state}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientList;
