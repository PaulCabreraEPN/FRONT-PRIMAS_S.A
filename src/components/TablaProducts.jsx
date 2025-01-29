import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Carga";

const TablaProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [productsIndices, setProductsIndices] = useState({});
    const [currentCategory, setCurrentCategory] = useState("all");
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Definir las categorías y sus palabras clave
    const categories = {
        all: { name: "Todos", keywords: [] },
        rollers: { name: "Rodillos", keywords: ["ROD", "ROLA", "ROLITO"] },
        brushes: { name: "Brochas", keywords: ["BROCHA", "PINCEL"] },
        spatulas: { name: "Espátulas", keywords: ["ESP", "ESPATULA"] },
        trowels: { name: "Llanas", keywords: ["LLANA"] },
        accessories: { name: "Accesorios", keywords: ["EXTENSION", "BANDEJA", "CUBETA", "MANGO"] }
    };



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
            console.log(response.data);
            setProducts(response.data);

            // Guardar los índices originales
            const indices = {};
            response.data.forEach((product, index) => {
                indices[product.id] = index;
            });
            setProductsIndices(indices);
        } catch (error) {
            console.error(error);
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

    // Función para filtrar productos por categoría
    const filterByCategory = (category) => {
        setCurrentCategory(category);
        if (category === "all") {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter(product =>
            categories[category].keywords.some(keyword =>
                product.product_name.toUpperCase().includes(keyword)
            )
        );
        setFilteredProducts(filtered);
    };

    // Modificar el useEffect para manejar la carga inicial y el filtrado
    useEffect(() => {
        const initializeProducts = async () => {
            await getProducts();
        };
        initializeProducts();
    }, []); // Solo se ejecuta al montar el componente

    // Agregar otro useEffect para manejar cambios en products o currentCategory
    useEffect(() => {
        filterByCategory(currentCategory);
    }, [products, currentCategory]);


    if (isLoading) {
        return (
            <Loader />
        )
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

            {/* Menú de categorías fijo */}
            <div className="sticky top-0 z-50 bg-white shadow-md p-4 mb-4">
                <div className="flex justify-center space-x-4">
                    {Object.entries(categories).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => setCurrentCategory(key)}
                            className={`px-4 py-2 rounded-lg transition-colors ${currentCategory === key
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            {value.name}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProducts.length == 0 ? (
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
                    {filteredProducts.map((product) => (
                        <div
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                            key={product.id}
                        >
                            <div className="absolute top-0 left-0 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-tl-xl">
                                {productsIndices[product.id] + 1}
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 p-4 flex items-center justify-center h-[200px]">
                                    <img
                                        src={product.imgUrl}
                                        alt="Imagen del producto"
                                        className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
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
