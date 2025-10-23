import axios from "axios";
import { useEffect, useState, useRef } from "react";
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
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [productsIndices, setProductsIndices] = useState({});
    const [currentCategory, setCurrentCategory] = useState("all");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 2 filas de 3 columnas
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [searchActive, setSearchActive] = useState(false);

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
            setAllProducts(productsArray);

            const indices = {};
            productsArray.forEach((product, index) => {
                indices[product.id] = index;
            });
            setProductsIndices(indices);
            return productsArray;
        } catch (error) {
            console.error(error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMostrarTodos = async () => {
        const all = await getProducts();
        // si getProducts falla, all puede ser undefined
        const arr = Array.isArray(all) ? all : [];
        setCurrentCategory("all");
        // Salimos del modo búsqueda cuando mostramos todos
        setSearchActive(false);
        setFilteredProducts(arr);
        setCurrentPage(1);
    };

    const getProductsById = async () => {
        const id = String(searchId || "").trim();
        // Validación: campo vacío -> mensaje específico
        if (!id) {
            toast.warn("Ingrese un producto en el cuadro de busqueda");
            return;
        }
        // Validación: exactamente 5 dígitos y solo números
        if (!/^[0-9]{5}$/.test(id)) {
            toast.warn("Ingrese un ID válido de 5 dígitos (solo números)");
            return;
        }
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/products/${id}`;
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
                // Activar modo búsqueda antes de actualizar productos
                setSearchActive(true);
                setProducts([producto]);
                setFilteredProducts([producto]);
                setCurrentPage(1);
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

    const filterByCategory = async (category) => {
        setCurrentCategory(category);
        // Si no tenemos la lista maestra, la cargamos primero (incluso si `products` contiene solo el resultado de búsqueda)
        if (!allProducts || allProducts.length === 0) {
            await getProducts();
        }
        // Al filtrar por categoría usamos la lista maestra `allProducts` para que
        // las categorías funcionen correctamente incluso después de una búsqueda
        const source = Array.isArray(allProducts) && allProducts.length ? allProducts : products;
        const selectedCategory = categories[category];
        if (!selectedCategory || !selectedCategory.keywords) {
            setFilteredProducts(source);
            return;
        }
        const filtered = source.filter((product) => {
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
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const handleKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKey);
        };
    }, [menuRef]);

    useEffect(() => {
        const applyCategory = async () => {
            if (searchActive) {
                setFilteredProducts(products);
                return;
            }
            if (!currentCategory) {
                setFilteredProducts(products);
            } else {
                await filterByCategory(currentCategory);
            }
        };
        applyCategory();
    }, [products, currentCategory, searchActive]);

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
            {/* Cabecera: menú desplegable (izq), búsqueda (centro), registrar (derecha) */}
            <div className="p-4 mb-4 w-full">
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-3">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="p-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                                id="menu-button-products"
                            >
                                <span className="text-xl">☰</span>
                            </button>
                            {menuOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button-products">
                            <button onClick={async () => { setCurrentCategory('all'); await handleMostrarTodos(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Todos</button>
                            <button onClick={async () => { setSearchActive(false); await filterByCategory('rollers'); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Rodillos</button>
                            <button onClick={async () => { setSearchActive(false); await filterByCategory('brushes'); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Brochas</button>
                            <button onClick={async () => { setSearchActive(false); await filterByCategory('spatulas'); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Espátulas</button>
                            <button onClick={async () => { setSearchActive(false); await filterByCategory('trowels'); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Llanas</button>
                            <button onClick={async () => { setSearchActive(false); await filterByCategory('accessories'); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Accesorios</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="ID del producto"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="border p-2 rounded w-44 max-w-xs"
                            />
                            <button onClick={getProductsById} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Buscar</button>
                        </div>
                    </div>

                    <div className="ml-auto">
                        <button onClick={() => navigate("register")} className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                            <i className="fas fa-user-plus mr-2"></i>
                            Registrar Producto
                        </button>
                    </div>
                </div>
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
