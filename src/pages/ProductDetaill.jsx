import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Carga";
import { ToastContainer, toast } from "react-toastify";

const ProductDetail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});

    const obtenerProducto = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/products/${id}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            
            const response = await axios.get(url, options);
            setProduct(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar el producto");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        obtenerProducto();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <>
            <ToastContainer />

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate("/dashboard/products")}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    ← Volver
                </button>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">Detalles del Producto</h2>

            <div className="w-full max-w-screen-lg mx-auto px-4">
                <div className="space-y-4 mt-8">

                    <div className="flex justify-center mb-6">
                        <img
                            src={product.imgUrl || "/images/default-product.png"}
                            alt={product.product_name}
                            className="w-32 h-32 object-cover rounded border-4 border-blue-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(product).map(([key, value]) => (
                            key !== "_id" && (
                                <div key={key}>
                                    <label className="block font-bold text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</label>
                                    <p className="text-gray-800 p-2 rounded">{value || "N/A"}</p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
