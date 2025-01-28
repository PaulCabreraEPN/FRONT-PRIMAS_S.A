import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Carga";

const SellerDetaill = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams()
    const navigate = useNavigate()

    const [seller, setSeller] = useState({
        names: "",
        lastNames: "",
        numberID: "",
        username: "",
        email: "",
        SalesCity: "",
        PhoneNumber: "",
        role: "Seller",
        status: true,
        token: null,
        confirmEmail: false
    });
    

    const getSeller = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token')
            const backUrl = import.meta.env.VITE_URL_BACKEND_API
            const url = `${backUrl}/sellers/${id}`;
            const options = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const response = await axios.get(url, options);
        
            const Seller = response.data.msg
            
            setSeller({
                names: Seller.names,
                lastNames: Seller.lastNames,
                numberID: Seller.numberID,
                username: Seller.username,
                email: Seller.email,
                SalesCity: Seller.SalesCity,
                PhoneNumber: Seller.PhoneNumber,
                status: true

            })

        } catch (error) {
            console.log(error);
        
            
        } finally {
            setIsLoading(false);
        }
    }

    const eliminarSeller = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este vendedor?");
        if (!confirmacion) return;

        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/deleteSellerinfo/${id}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.delete(url, options);
            alert(respuesta.data.msg);
            listarSellers(); // Actualizar la lista de vendedores
        } catch (error) {
            console.error(error);
            alert("Error al eliminar el vendedor");
        }
    };


    useEffect(()=>{
        getSeller()
    },[])

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <>
        <button
            onClick={() => navigate('/dashboard/sellers')}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
            ← Atrás
        </button>
        <h2 className="text-2xl font-bold">Perfil del Vendedor</h2>
        <div className="w-2/3 flex justify-center items-center mx-auto mb-4 ">
            <div className="container mx-auto p-4">

                <div className="image-container">
                    <img src="/images/seller.png" alt="Seller" className="circular-image" />
                    <style>
                    {`
                        .image-container {
                        display: flex;
                        justify-content: center;
                        }
                        .circular-image {
                        width: 150px; /* Ajusta el tamaño según necesites */
                        height: 150px;
                        border-radius: 50%; /* Hace los bordes circulares */
                        object-fit: cover; 
                        border: 3px solid #205598; /* Opcional: Agrega un borde alrededor */
                        }
                    `}
                    </style>
                </div>
            
                <div className="space-y-4 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-gray-700">Nombres:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.names || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700">Apellidos:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.lastNames || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700">Número de Identificación:</label>
                            <p className="text-gray-800 p-2 rounded ">{seller?.numberID || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700">Nombre de Usuario:</label>
                            <p className="text-gray-800 p-2 rounded ">{seller?.username || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700">Email:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.email || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700">Ciudad de Ventas:</label>
                            <p className="text-gray-800 p-2 rounded ">{seller?.SalesCity || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700">Teléfono:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.PhoneNumber || "N/A"}</p>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700">Estado:</label>
                            <p className="text-gray-800 p-2 rounded ">
                                {seller?.status ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <button
                        onClick={() => navigate(`/dashboard/sellers/update/${id}`)}
                        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Actualizar
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => eliminarSeller(id)}
                            className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>)  
}



export default SellerDetaill