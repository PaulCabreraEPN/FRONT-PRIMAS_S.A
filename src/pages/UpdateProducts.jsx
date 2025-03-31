import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Carga";

const UpdateProduct = () => {
    const [product, setProduct] = useState({
        product_name: "",
        measure: "",
        price: "",
        stock: "",
        imgUrl: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const getProduct = async () => {
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/products/${id}`;
            const options = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(url, options);
            const productData = response.data;
            if (productData) {
                setProduct({
                    product_name: productData.product_name || "",
                    measure: productData.measure || "",
                    price: productData.price || "",
                    stock: productData.stock || "",
                    imgUrl: productData.imgUrl || ""
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/products/update/${id}`;
            const options = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.patch(url, product, options);
            toast.success(response.data.message);
            setTimeout(() => navigate("/dashboard/products"), 2000);
        } catch (error) {
            toast.error(error.response?.data?.error);
        }
    };

    useEffect(() => {
        if (id) {
            getProduct();
        }
    }, [id]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto mt-8 p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate("/dashboard/products")}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    ← Atrás
                </button>
                <h2 className="text-2xl font-bold">Actualizar Producto</h2>
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
                        <label className="block mb-2">Nombre del Producto:</label>
                        <input
                            type="text"
                            name="product_name"
                            value={product.product_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Medida:</label>
                        <input
                            type="text"
                            name="measure"
                            value={product.measure}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Precio:</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;
