import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "./Carga";

// Asigna keywords según el nombre del producto
function obtenerKeywords(nombre) {
    const nombreMayus = (nombre || "").toUpperCase();
    if (nombreMayus.includes("ROD") || nombreMayus.includes("ROLA") || nombreMayus.includes("ROLITO")) return ["ROD", "ROLA", "ROLITO"];
    if (nombreMayus.includes("BROCHA") || nombreMayus.includes("PINCEL")) return ["BROCHA", "PINCEL"];
    if (nombreMayus.includes("ESP") || nombreMayus.includes("ESPATULA")) return ["ESP", "ESPATULA"];
    if (nombreMayus.includes("LLANA")) return ["LLANA"];
    if (nombreMayus.includes("EXTENSION") || nombreMayus.includes("BANDEJA") || nombreMayus.includes("CUBETA") || nombreMayus.includes("MANGO")) return ["EXTENSION", "BANDEJA", "CUBETA", "MANGO"];
    return [];
}

const TablaProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [productsIndices, setProductsIndices] = useState({});
    const [currentCategory, setCurrentCategory] = useState("all");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 2 filas de 3 columnas

    const categories = {
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
            const productsArray = Array.isArray(response.data.data)
                ? response.data.data.map(product => ({
                    ...product,
                    keywords: obtenerKeywords(product.product_name)
                }))
                : [];
            setProducts(productsArray);
            return productsArray;

            const indices = {};
            productsArray.forEach((product, index) => {
                indices[product.id] = index;
            });
            setProductsIndices(indices);
        } catch (error) {
            console.error(error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar todos: recarga productos y fuerza filteredProducts a todos
    const handleMostrarTodos = async () => {
        const all = await getProducts();
        // si getProducts falla, all puede ser undefined
        const arr = Array.isArray(all) ? all : [];
        setCurrentCategory("all");
        setFilteredProducts(arr);
        setCurrentPage(1);
    };

    const getProductsById = async () => {
        if (!searchId) {
            toast.warn("Ingrese un ID válido");
            return;
        }
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
            if (respuesta.data && respuesta.data.status === "success" && respuesta.data.data) {
                const producto = {
                    ...respuesta.data.data,
                    keywords: obtenerKeywords(respuesta.data.data.product_name)
                };
                setProducts([producto]);
                toast.success(respuesta.data.msg || "Producto encontrado");
            } else {
                setProducts([]);
                toast.warn(respuesta.data.msg || "No se encontró el producto");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al buscar el producto");
            setProducts([]);
        }
    };

    const filterByCategory = (category) => {
        setCurrentCategory(category);
        const selectedCategory = categories[category];
        if (!selectedCategory || !selectedCategory.keywords) {
            setFilteredProducts(products);
            return;
        }
        const filtered = products.filter((product) => {
            return (
                Array.isArray(product.keywords) &&
                product.keywords.some((keyword) => selectedCategory.keywords.includes(keyword))
            );
        });
        setFilteredProducts(filtered);
    };

    useEffect(() => {
        const initializeProducts = async () => {
            await getProducts();
        };
        initializeProducts();
    }, []);

    useEffect(() => {
        if (!currentCategory) {
            setFilteredProducts(products);
        } else {
            filterByCategory(currentCategory);
        }
    }, [products, currentCategory]);

    useEffect(() => {
        setCurrentPage(1);
    }, [products, currentCategory]);

    if (isLoading) return <Loader />;

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <ToastContainer />
            <div className="p-4 text-center rounded-lg mb-4">
                <input
                    type="text"
                    placeholder="ID del producto"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border p-2 rounded mb-2 sm:mb-0 sm:w-64 w-full sm:mr-2"
                />
                <button onClick={getProductsById} className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 sm:w-auto w-full sm:mr-2">Buscar</button>
                <button onClick={handleMostrarTodos} className="bg-gray-500 text-white px-4 py-2 rounded sm:w-auto w-full">Mostrar Todos</button>
            </div>

            <div className="p-4 mb-4">
                <div className="flex flex-wrap justify-center gap-2">
                    {Object.entries(categories).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => setCurrentCategory(key)}
                            className={`px-4 py-2 rounded-lg transition-colors ${currentCategory === key ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {value.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end mb-4 px-4">
                <button onClick={() => navigate("register")} className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                    <i className="fas fa-user-plus mr-2"></i>
                    Registrar Producto
                </button>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-gray-500">No hay productos disponibles</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
                        {currentItems.map((product) => (
                            <div key={product.id} className="w-full p-6 bg-white cursor-pointer transform transition duration-300 rounded-lg overflow-hidden min-h-[190px] hover:shadow-xl hover:-translate-y-1 border-l-4 border-blue-500 shadow-lg">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="flex-1 text-left">
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                <p className="text-sm text-gray-800"><strong>ID:</strong> <span className="font-semibold">{product.id}</span></p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-800"><strong>Producto:</strong> <span className="font-semibold">{product.product_name}</span></p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-700"><strong>Precio:</strong> <span className="font-semibold">{product.price}</span></p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-700"><strong>Stock:</strong> <span className="font-semibold">{product.stock}</span></p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-700"><strong>Medida:</strong> <span className="font-semibold">{product.measure}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center">
                                        <img src={product.imgUrl} alt={`Imagen de ${product.product_name}`} className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-lg shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Anterior
                            </button>

                            <div className="flex gap-1 sm:gap-2 items-center">
                                {Array.from({ length: totalPages }).map((_, idx) => {
                                    const pageNum = idx + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default TablaProducts;
