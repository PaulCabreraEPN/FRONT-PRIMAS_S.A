import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegisterProducts = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/products`;
                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const resp = await axios.get(url, options);
                const payload = resp.data;
                let products = [];

                if (Array.isArray(payload)) {
                    products = payload;
                } else if (Array.isArray(payload?.products)) {
                    products = payload.products;
                } else if (Array.isArray(payload?.data)) {
                    products = payload.data;
                } else {
                    const maybeArray = Object.values(payload || {}).find(v => Array.isArray(v));
                    if (Array.isArray(maybeArray)) {
                        products = maybeArray;
                    } else if (payload && typeof payload === 'object') {
                        products = Object.values(payload).filter(v => v && typeof v === 'object');
                    }
                }

                setAllProducts(products);
            } catch (err) {
                console.error('Error cargando productos:', err?.response?.data?.msg || err.message);
            }
        };
        getAllProducts();
    }, []);

    const validationSchema = useMemo(() => Yup.object({
        // ID: requerido, exactamente 5 dígitos y único frente a los productos ya registrados
        id: Yup.string()
            .required("El ID del producto es obligatorio")
            .matches(/^\d{5}$/, "El ID debe tener exactamente 5 dígitos")
            .test('unique-product-id', 'Ya existe un producto con ese ID', function (value) {
                if (!value) return true;
                if (!allProducts || allProducts.length === 0) return true;
                const valStr = String(value).trim();
                const exists = allProducts.some(p => {
                    const pid = p?.id ?? p?._id ?? p?.product_id ?? p?.productId ?? p?.idProducto ?? p?.ID ?? "";
                    return String(pid).trim() === valStr;
                });
                return !exists;
            }),
        product_name: Yup.string()
            .required("El nombre del producto es obligatorio")
            .test('unique-product-name', 'Ya existe un producto con ese nombre', function (value) {
                if (!value) return true;
                if (!allProducts || allProducts.length === 0) return true;
                const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
                const valNorm = normalize(value);
                const exists = allProducts.some(p => {
                    const name = p?.product_name ?? p?.name ?? p?.productName ?? "";
                    return normalize(name) === valNorm;
                });
                return !exists;
            })
            .min(6, "El nombre del producto debe tener al menos 6 caracteres")
            .max(60, "El nombre del producto debe tener como máximo 60 caracteres"),
        reference: Yup.string()
            .required("La referencia es obligatoria")
            .test('unique-reference', 'Ya existe un producto con esa referencia', function (value) {
                if (!value) return true;
                if (!allProducts || allProducts.length === 0) return true;
                const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
                const valNorm = normalize(value);
                const exists = allProducts.some(p => {
                    const ref = p?.reference ?? p?.ref ?? p?.product_reference ?? p?.Reference ?? "";
                    const pid = p?._id ?? p?.id ?? p?.product_id ?? "";
                    if (pid && String(pid) === String(id)) return false; // excluir producto actual
                    return normalize(ref) === valNorm;
                });
                return !exists;
            }),
        description: Yup.string()
            .required("La descripción es obligatoria")
            .min(30, "La descripción debe tener al menos 30 caracteres")
            .max(300, "La descripción debe tener como máximo 300 caracteres"),
        price: Yup.number()
            .typeError("El precio debe ser numérico")
            .required("El precio es obligatorio")
            .test('no-negative', 'El precio no puede ser negativo', function (value) {
                if (value === undefined || value === null || value === '') return true;
                const n = Number(value.toString().replace(',', '.'));
                if (Number.isNaN(n)) return false;
                return n >= 0;
            })
            .test('not-zero', 'El precio no puede ser 0', function (value) {
                if (value === undefined || value === null || value === "") return true;
                return Number(value) !== 0;
            })
            .test(
                "price-format",
                "El precio puede tener hasta 4 dígitos enteros y hasta 2 decimales",
                function (value) {
                    if (value === undefined || value === null || value === "") return false;
                    const str = String(value);
                    // acepta hasta 4 dígitos en la parte entera y opcionalmente hasta 2 decimales
                    return /^\d{1,4}(\.\d{1,2})?$/.test(str);
                }
            ),
        stock: Yup.number()
            .typeError("El stock debe ser numérico")
            .required("El stock es obligatorio")
            .min(1, "El stock debe ser al menos 1")
            .test(
                "stock-format",
                "El stock debe ser un entero positivo sin decimales y hasta 3 dígitos",
                function (value) {
                    if (value === undefined || value === null || value === "") return false;
                    const str = String(value);
                    // acepta solo enteros de 1 a 3 dígitos (1 a 999)
                    return /^[1-9]\d{0,2}$/.test(str);
                }
            )
    }), [allProducts]);

    const formik = useFormik({
        initialValues: {
            id: "",
            product_name: "",
            reference: "",
            description: "",
            price: "",
            stock: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/products/register`;

                const formData = new FormData();

                // Asegurar que los campos numéricos se envían en formato correcto
                formData.append('id', String(values.id).trim());
                formData.append('product_name', values.product_name);
                formData.append('reference', values.reference);
                formData.append('description', values.description);
                formData.append('price', String(values.price).trim());
                formData.append('stock', String(values.stock).trim());

                if (image) {
                    formData.append("image", image);
                }

                const options = {
                    headers: {
                        // Dejar que el browser determine el boundary de multipart
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.post(url, formData, options);

                // Éxito: backend devuelve status 'success' y code 201
                if (response.status === 201 || response.data?.status === "success") {
                    toast.success(response.data.msg || "Producto creado correctamente.");
                    if (response.data?.info?.imageAction) {
                        toast.info(`Imagen: ${response.data.info.imageAction}`);
                    }
                    setTimeout(() => {
                        navigate("/dashboard/products");
                    }, 1500);
                } else {
                    toast.error(response.data?.msg || "Error al registrar el producto");
                }
            } catch (error) {
                const resp = error.response;
                if (resp) {
                    // Conflict: recurso ya existe (409)
                    if (resp.status === 409) {
                        toast.error(resp.data?.msg || 'El producto ya existe.');
                        if (resp.data?.info?.imageAction) {
                            toast.info(`Imagen: ${resp.data.info.imageAction}`);
                        }
                    } else {
                        // Otros errores del servidor o validación
                        toast.error(resp.data?.msg || 'Error al registrar el producto');
                        if (resp.data?.info?.imageAction) {
                            toast.info(`Imagen: ${resp.data.info.imageAction}`);
                        }
                    }
                } else {
                    toast.error(error.message || 'Error al registrar el producto');
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    return (
        <div>
             <h1 className='font-black text-4xl text-gray-500'>Registrar Producto</h1>
            <hr className='my-4' />
            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador registrar un nuevo producto</h5>
            <hr className='my-4' />

            <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
                    {/*
                    <div className="flex justify-start mb-8">
                        <button
                            onClick={() => navigate("/dashboard/products")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Atrás
                        </button>
                    </div>
                    */}
                    <ToastContainer />
                    <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                        <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Producto</legend>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="id" className="mb-2 block text-sm font-semibold">ID del Producto{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="number"
                                        id="id"
                                        name="id"
                                        placeholder="Ingrese id"
                                        value={formik.values.id}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.id && formik.errors.id && (
                                        <div className="text-red-500 text-sm">{formik.errors.id}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="product_name" className="mb-2 block text-sm font-semibold">Nombre del Producto{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="text"
                                        id="product_name"
                                        name="product_name"
                                        placeholder="Ingrese nombre"
                                        value={formik.values.product_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.product_name && formik.errors.product_name && (
                                        <div className="text-red-500 text-sm">{formik.errors.product_name}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="reference" className="mb-2 block text-sm font-semibold">Referencia{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="text"
                                        id="reference"
                                        name="reference"
                                        placeholder="Ingrese referencia"
                                        value={formik.values.reference}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.reference && formik.errors.reference && (
                                        <div className="text-red-500 text-sm">{formik.errors.reference}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="price" className="mb-2 block text-sm font-semibold">Precio{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        placeholder="Ingrese precio"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <div className="text-red-500 text-sm">{formik.errors.price}</div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="mb-2 block text-sm font-semibold">Descripción{<span className="text-red-500">*</span>}:</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Ingrese descripción"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500 min-h-[100px]"
                                    />
                                    {formik.touched.description && formik.errors.description && (
                                        <div className="text-red-500 text-sm">{formik.errors.description}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="stock" className="mb-2 block text-sm font-semibold">Stock{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        placeholder="Ingrese stock"
                                        value={formik.values.stock}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.stock && formik.errors.stock && (
                                        <div className="text-red-500 text-sm">{formik.errors.stock}</div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="image" className="mb-2 block text-sm font-semibold">Imagen del Producto:</label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`py-2 w-full block text-center ${isLoading ? 'bg-gray-400 cursor-wait' : 'bg-blue-900 hover:bg-green-300 hover:text-black'} text-slate-100 border rounded-xl duration-300`}
                                >
                                    {isLoading ? 'Registrando...' : 'Registrar'}
                                </button>
                            </div>
                        </form>
                    </fieldset>
                </div>
            </div>
        </div>
    );
};

export default RegisterProducts;