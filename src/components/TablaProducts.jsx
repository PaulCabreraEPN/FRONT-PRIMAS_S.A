import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const TablaProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [productsIndices, setProductsIndices] = useState({});

    const getProducts = async () => {
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/products`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            setProducts(response.data);

            // Guardar los índices originales
            const indices = {};
            response.data.forEach((product, index) => {
                indices[product.id] = index;
            });
            setProductsIndices(indices);

            toast.success(response.data.msg || "Productos cargados exitosamente");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al cargar los productos");
        } finally {
            setIsLoading(false);
        }
    };

    const getProductsById = async () => {
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/products/${searchId}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);
            setProducts([respuesta.data]);
            toast.success(respuesta.data.msg || "Producto encontrado");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al buscar el producto");
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    if (isLoading) {
        return (
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        {/* Logo principal con animación */}
                        <img
                            src="/images/mainlogo.png"
                            alt="Logo"
                            style={{
                                width: "120px",
                                height: "120px",
                                animation: "bounce 1.5s infinite",
                                marginBottom: "20px", // Espaciado entre la imagen y el texto
                            }}
                        />
                        <p
                            style={{
                                fontSize: "18px",
                                color: "#21559a",
                                textAlign: "center",
                            }}
                        >
                            Cargando...
                        </p>
                    </div>
                </div>
                <style>
                    {`
                      @keyframes bounce {
                        0%, 100% {
                          transform: translateY(0);
                        }
                        50% {
                          transform: translateY(-20px);
                        }
                      }
                    `}
                </style>
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="p-4 text-center rounded-lg mb-4">
                <span className="mr-2"></span>
                <input
                    type="text"
                    placeholder="ID del producto"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <button
                    onClick={getProductsById}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>
                <button
                    onClick={getProducts}
                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                >
                    Mostrar Todos
                </button>
            </div>

            {products.length == 0 ? (
                <div className="text-center p-4">
                    {toast.error("No existen registros")}
                    <p className="text-gray-500">No hay productos disponibles</p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                        gap: "1.5rem",
                        padding: "1rem",
                    }}
                >
                    {products.map((product) => (
                        <div
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                            key={product.id}
                        >
                            <div className="absolute top-0 left-0 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-tl-xl">
                                {productsIndices[product.id] + 1}
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 p-4">
                                    <img
                                        src={product.imgUrl}
                                        alt="Imagen del producto"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>

                                <div className="w-full md:w-2/3 p-6">
                                    <div className="space-y-2">
                                        <h1 className="text-lg font-semibold text-gray-800">
                                            ID: {product.id}
                                        </h1>
                                        <h1 className="text-lg text-gray-700">
                                            Producto: {product.product_name}
                                        </h1>
                                        <h1 className="text-lg text-gray-700">
                                            Precio: {product.price}
                                        </h1>
                                        <h1 className="text-lg text-gray-700">
                                            Stock: {product.stock}
                                        </h1>
                                        <h1 className="text-lg text-gray-700">
                                            Medida: {product.measure}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default TablaProducts;
