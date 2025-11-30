import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Carga";
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdateProduct = () => {
    const [product, setProduct] = useState({
        product_name: "",
        measure: "",
        price: "",
        stock: "",
        imgUrl: ""
    });
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
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
            // backend devuelve { status, code, msg, data: { ... } }
            const productData = response.data?.data || response.data || null;
            if (productData) {
                setProduct({
                    product_name: productData.product_name || "",
                    measure: productData.measure || "",
                    price: productData.price || "",
                    stock: productData.stock || "",
                    imgUrl: productData.imgUrl || "",
                    reference: productData.reference || "",
                    description: productData.description || ""
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || error.response?.data?.message || 'Error al obtener el producto');
        } finally {
            setIsLoading(false);
        }
    };

    // formik will handle change/submit; keep product state as source for initialValues

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setImage(file);
    };

    const validationSchema = useMemo(() => {
        const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");

        return Yup.object({
        product_name: Yup.string()
            .required('El nombre del producto es obligatorio')
            .test('unique-product-name', 'Ya existe un producto con ese nombre', function (value) {
                if (!value) return true;
                if (!allProducts || allProducts.length === 0) return true; // no bloquear si no hay lista
                const valNorm = normalize(value);
                // permitir el valor si es igual al nombre actual del producto (no es un duplicado)
                if (product?.product_name && normalize(product.product_name) === valNorm) return true;
                const exists = allProducts.some(p => {
                    const name = p?.product_name ?? p?.name ?? p?.productName ?? "";
                    const pid = p?._id ?? p?.id ?? p?.product_id ?? "";
                    if (pid && String(pid) === String(id)) return false; // excluir el producto actual
                    return normalize(name) === valNorm;
                });
                return !exists;
            })
            .min(6, 'El nombre debe tener al menos 6 caracteres')
            .max(60, 'El nombre debe tener como máximo 60 caracteres'),
        price: Yup.string()
            .required('El precio es obligatorio')
            .test('price-format', 'El precio puede tener hasta 4 dígitos enteros y hasta 2 decimales', value => {
                if (!value) return false;
                return /^\d{1,4}(\.\d{1,2})?$/.test(value.toString());
            }),
        stock: Yup.string()
            .required('El stock es obligatorio')
            .test('min-1', 'El stock no puede ser menor a 1', value => {
                if (value === undefined || value === null || value === '') return false;
                const n = Number(value);
                if (Number.isNaN(n)) return false;
                return n >= 1;
            })
            .test('stock-format', 'El stock debe ser un número entero de hasta 3 dígitos', value => {
                if (value === undefined || value === null || value === '') return false;
                return /^\d{1,3}$/.test(value.toString());
            }),
        description: Yup.string()
            .required('La descripción es obligatoria')
            .min(30, 'La descripción debe tener al menos 30 caracteres')
            .max(300, 'La descripción debe tener como máximo 300 caracteres'),
        reference: Yup.string()
            .required('La referencia es obligatoria')
            .test('unique-reference', 'Ya existe un producto con esa referencia', function (value) {
                if (!value) return true;
                if (!allProducts || allProducts.length === 0) return true;
                const valNorm = normalize(value);
                // no hacer return temprano; la exclusión del producto actual
                // se realiza comparando el id dentro del `some(...)`.
                const exists = allProducts.some(p => {
                    const ref = p?.reference ?? p?.ref ?? p?.product_reference ?? p?.Reference ?? "";
                    const pid = p?._id ?? p?.id ?? p?.product_id ?? "";
                    if (pid && String(pid) === String(id)) return false; // excluir producto actual
                    return normalize(ref) === valNorm;
                });
                return !exists;
            }),
        measure: Yup.string().nullable()

        });
    }, [allProducts, id, product]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            product_name: product.product_name || '',
            reference: product.reference || '',
            description: product.description || '',
            price: product.price !== undefined && product.price !== null ? String(product.price) : '',
                stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '',
                image: null,
            measure: product.measure || ''
        },
        validationSchema,
        onSubmit: async (values, { setErrors }) => {
            let success = false;
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/products/update/${id}`;
                const formData = new FormData();
                // Append only provided fields
                if (values.product_name !== undefined) formData.append('product_name', values.product_name);
                if (values.reference !== undefined) formData.append('reference', values.reference);
                if (values.description !== undefined) formData.append('description', values.description);
                if (values.price !== undefined) formData.append('price', values.price);
                if (values.stock !== undefined) formData.append('stock', values.stock);
                if (image) formData.append('image', image);

                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.patch(url, formData, options);
                toast.success(response.data?.msg || 'Producto actualizado');
                success = true;
            } catch (error) {
                const resp = error.response?.data || {};
                const generalMsg = resp.msg || resp.error || resp.message;
                if (generalMsg) toast.error(generalMsg);

                if (resp.errors && typeof resp.errors === 'object' && !Array.isArray(resp.errors)) {
                    setErrors(resp.errors);
                } else if (Array.isArray(resp.errors)) {
                    const byField = {};
                    resp.errors.forEach(e => { if (e.param) byField[e.param] = e.msg || e.message; });
                    setErrors(byField);
                    resp.errors.forEach(e => { if (e.msg) toast.error(e.msg); });
                } else {
                    console.log('UpdateProduct error:', error);
                }
            } finally {
                setIsLoading(false);
                if (success) setTimeout(() => navigate('/dashboard/products'), 2000);
            }
        }
    });

    useEffect(() => {
        if (id) {
            getProduct();
        }
    }, [id]);

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

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar Producto</h1>

            <hr className='my-4' />

            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador actualizar los productos </h5>

            <div className="container mx-auto p-4">
                

                <ToastContainer />
                <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                    <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
                        <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                            <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Producto</legend>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="product_name" className="mb-2 block text-sm font-semibold">Nombre del Producto:</label>
                                        <input
                                            type="text"
                                            id="product_name"
                                            name="product_name"
                                            placeholder="Nombre del producto"
                                            value={formik.values.product_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.product_name && formik.errors.product_name ? (
                                            <div className="text-red-500 text-sm">{formik.errors.product_name}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="reference" className="mb-2 block text-sm font-semibold">Referencia:</label>
                                        <input
                                            type="text"
                                            id="reference"
                                            name="reference"
                                            placeholder="Referencia"
                                            value={formik.values.reference || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.reference && formik.errors.reference ? (
                                            <div className="text-red-500 text-sm">{formik.errors.reference}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="mb-2 block text-sm font-semibold">Precio:</label>
                                        <input
                                            type="text"
                                            id="price"
                                            name="price"
                                            placeholder="0.00"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.price && formik.errors.price ? (
                                            <div className="text-red-500 text-sm">{formik.errors.price}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="stock" className="mb-2 block text-sm font-semibold">Stock:</label>
                                        <input
                                            type="text"
                                            id="stock"
                                            name="stock"
                                            placeholder="0"
                                            value={formik.values.stock}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.stock && formik.errors.stock ? (
                                            <div className="text-red-500 text-sm">{formik.errors.stock}</div>
                                        ) : null}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="mb-2 block text-sm font-semibold">Descripción:</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Descripción del producto"
                                            value={formik.values.description || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.description && formik.errors.description ? (
                                            <div className="text-red-500 text-sm">{formik.errors.description}</div>
                                        ) : null}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="image" className="mb-2 block text-sm font-semibold">Imagen del Producto:</label>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleImageChange(e);
                                                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                                formik.setFieldValue('image', file);
                                            }}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.image && formik.errors.image && (
                                            <div className="text-red-500 text-sm">{formik.errors.image}</div>
                                        )}
                                        {product.imgUrl && !image && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Imagen actual:</p>
                                                <img src={product.imgUrl} alt="Imagen actual" className="w-32 h-32 object-contain rounded mt-1" />
                                            </div>
                                        )}
                                        {image && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Vista previa de la nueva imagen:</p>
                                                <img src={URL.createObjectURL(image)} alt="Preview" className="w-32 h-32 object-contain rounded mt-1" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button type="submit" className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black">
                                        {isLoading ? 'Actualizando...' : 'Actualizar'}
                                    </button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
