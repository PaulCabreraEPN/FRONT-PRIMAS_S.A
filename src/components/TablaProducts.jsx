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
    const [modalOpen, setModalOpen] = useState(false);
    const [modalProduct, setModalProduct] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmDeleteProductId, setConfirmDeleteProductId] = useState(null);
    const [confirmDeleting, setConfirmDeleting] = useState(false);

    const categories = {
        rollers: { name: "Rodillos", keywords: ["ROD", "ROLA", "ROLITO"] },
        brushes: { name: "Brochas", keywords: ["BROCHA", "PINCEL"] },
        spatulas: { name: "Espátulas", keywords: ["ESP", "ESPATULA"] },
        trowels: { name: "Llanas", keywords: ["LLANA"] },
        accessories: { name: "Accesorios", keywords: ["EXTENSION", "BANDEJA", "CUBETA", "MANGO"] }
    };

    // Clase para badges de categoría (mismo alto que el input: py-2)
    const getCategoryBadgeClasses = (cat) => {
        if (!cat || cat === 'all') return 'text-sm font-medium px-3 py-2 rounded bg-gray-100 text-gray-800 border border-gray-200';
        return 'text-sm font-medium px-3 py-2 rounded bg-blue-50 text-blue-700 border border-blue-100';
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

    const openProductModal = async (id) => {
        try {
            setModalLoading(true);
            setModalOpen(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/products/${id}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const res = await axios.get(url, options);
            const data = res.data?.data || null;
            if (data) {
                setModalProduct({ ...data, keywords: obtenerKeywords(data.product_name) });
            } else {
                toast.warn(res.data?.msg || 'No se encontró el producto');
                setModalProduct(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.msg || 'Error al obtener detalle del producto');
            setModalProduct(null);
            setModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    // Abrir modal de confirmación para eliminar producto
    const requestDeleteProduct = (id) => {
        setConfirmDeleteProductId(id);
        setConfirmDeleteOpen(true);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteOpen(false);
        setConfirmDeleteProductId(null);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteProductId) return;
        setConfirmDeleting(true);
        setModalLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/products/delete/${confirmDeleteProductId}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const res = await axios.delete(url, options);
            if (res.data && (res.data.status === 'success' || res.data.status === 'warning')) {
                toast.success('Producto eliminado correctamente.');
                // refrescar lista
                await handleMostrarTodos();
                setModalOpen(false);
            } else {
                toast.warn(res.data?.msg || 'No se pudo eliminar el producto');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.msg || 'Error al eliminar el producto');
        } finally {
            setConfirmDeleting(false);
            setConfirmDeleteOpen(false);
            setModalLoading(false);
            setConfirmDeleteProductId(null);
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
            const term = String(searchId || "").trim();
            if (term) return; // no sobrescribir resultados de búsqueda
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
    }, [products, currentCategory, searchActive, searchId]);

    // Filtrado en vivo: mientras se escribe en el input de búsqueda
    useEffect(() => {
        const term = String(searchId || "").trim();
        // Si no hay lista maestra, no intentamos filtrar (inicialice primero)
        if (!Array.isArray(allProducts) || allProducts.length === 0) return;

        if (!term) {
            // Restaurar según la categoría actual
            if (!currentCategory || currentCategory === 'all') {
                setFilteredProducts(allProducts);
            } else {
                // Aplicar filtro por categoría sobre la lista maestra
                const selectedCategory = categories[currentCategory];
                if (!selectedCategory) {
                    setFilteredProducts(allProducts);
                } else {
                    const filtered = allProducts.filter((product) =>
                        Array.isArray(product.keywords) && product.keywords.some(k => selectedCategory.keywords.includes(k))
                    );
                    setFilteredProducts(filtered);
                }
            }
            setSearchActive(false);
            setCurrentPage(1);
            return;
        }

        const lower = term.toLowerCase();
        // Base: respetar la categoría seleccionada
        const base = (currentCategory && currentCategory !== 'all')
            ? allProducts.filter((product) => Array.isArray(product.keywords) && product.keywords.some(k => categories[currentCategory]?.keywords.includes(k)))
            : allProducts;

        const filtered = base.filter((p) => {
            return (
                String(p.id || '').includes(term) ||
                String(p.product_name || '').toLowerCase().includes(lower) ||
                String(p.reference || '').toLowerCase().includes(lower)
            );
        });

        setFilteredProducts(filtered);
        setSearchActive(true);
        setCurrentPage(1);
    }, [searchId, allProducts, currentCategory]);

    useEffect(() => {
        setCurrentPage(1);
    }, [products, currentCategory]);

    if (isLoading) {
        return (
            <>
                <ToastContainer />
                <Loader />
            </>
        );
    }
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // Paginación truncada: devuelve array con números y '...' (max botones incluye first/last)
    const getPagination = (totalPages, current, maxButtons = 5) => {
        if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        const side = Math.floor((maxButtons - 3) / 2); // para maxButtons=5 => side=1
        const start = Math.max(2, current - side);
        const end = Math.min(totalPages - 1, current + side);
        pages.push(1);
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    return (
        <>
            <ToastContainer />
            {/* Cabecera: menú desplegable (izq), búsqueda (centro), registrar (derecha) */}
            <div className="p-4 mb-4 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    <div className="flex items-center gap-3 w-full sm:w-auto">
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

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Consultar producto"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="border p-2 rounded w-full sm:w-44 max-w-xs"
                                aria-label="Buscar producto por ID, nombre o referencia"
                            />
                        </div>

                        {/* Badge que muestra la categoría actual */}
                        <div className="ml-3">
                            <span className={getCategoryBadgeClasses(currentCategory)} aria-live="polite" title={`Categoría: ${categories[currentCategory]?.name || 'Todos'}`}>
                                <span className="mr-2 text-xs text-gray-500">Categoría</span>
                                <span className="font-semibold">{categories[currentCategory]?.name || 'Todos'}</span>
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-0 sm:ml-auto">
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
                    <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pb-4">
                        {currentItems.map((product) => (
                            <div
                                key={product.id}
                                className="w-full p-6 bg-white cursor-pointer transform transition duration-300 rounded-lg overflow-hidden min-h-[190px] hover:shadow-xl hover:-translate-y-1 border-l-4 border-blue-500 shadow-lg"
                                onClick={() => openProductModal(product.id)}
                                role="button"
                                tabIndex={0}
                            >
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
                                                <p className="text-sm text-gray-700"><strong>Referencia:</strong> <span className="font-semibold">{product.reference}</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center">
                                        <img
                                            loading="lazy"
                                            src={product.imgUrl}
                                            alt={`Imagen de ${product.product_name}`}
                                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 border-t pt-3 flex items-center justify-between bg-white">
                                    <div />
                                    <span className={`text-sm font-medium px-3 py-1 rounded ${product.stock > 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        {product.stock > 0 ? 'Disponible' : 'Agotado'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modal de detalle de producto */}
                    {modalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setModalOpen(false)}></div>
                            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 sm:mx-0">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h3 className="text-lg font-semibold">Detalle del Producto</h3>
                                    <button className="text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>✕</button>
                                </div>
                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                                    <div className="flex-shrink-0 w-full sm:w-48 flex items-center justify-center">
                                        {modalLoading ? (
                                            <div>Cargando...</div>
                                        ) : modalProduct ? (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <img loading="lazy" src={modalProduct.imgUrl} alt={modalProduct.product_name} className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain rounded-md shadow-sm" />
                                            </div>
                                        ) : (
                                            <div className="text-gray-500">No hay datos</div>
                                        )}
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">ID</p>
                                            <p className="text-xs text-gray-500">{modalProduct?.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Nombre</p>
                                            <p className="text-xs text-gray-500">{modalProduct?.product_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Referencia</p>
                                            <p className="text-xs text-gray-500">{modalProduct?.reference}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Precio</p>
                                            <p className="text-xs text-gray-500">{modalProduct?.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Stock</p>
                                            <p className="text-xs text-gray-500">{modalProduct?.stock}</p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <p className="text-sm font-medium text-gray-800">Descripción</p>
                                            <p className="text-xs text-gray-500">{modalProduct?.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 p-4 border-t">
                                    <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-white border rounded text-gray-700 hover:bg-gray-50">Cancelar</button>
                                    <button onClick={() => { setModalOpen(false); navigate(`/dashboard/products/update/${modalProduct?.id}`); }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Actualizar</button>
                                    <button onClick={() => requestDeleteProduct(modalProduct?.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirmación de eliminación (modal visual) */}
                    {confirmDeleteOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                            <div className="absolute inset-0 bg-black/50" onClick={handleCancelDelete} />

                            <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-1">¿Estás seguro?</h3>
                                    <p className="text-sm text-gray-500 mb-4">No podrás revertir esto!</p>
                                    <div className="flex gap-3">
                                        <button onClick={handleConfirmDelete} disabled={confirmDeleting} className={`px-4 py-2 rounded ${confirmDeleting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>Sí, eliminarlo!</button>
                                        <button onClick={handleCancelDelete} disabled={confirmDeleting} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                                {getPagination(totalPages, currentPage, 5).map((item, idx) => {
                                    if (item === '...') return <span key={'dots-' + idx} className="px-2 text-sm text-gray-500">...</span>;
                                    const pageNum = item;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            aria-label={`Ir a la página ${pageNum}`}
                                            aria-current={currentPage === pageNum ? 'page' : undefined}
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
