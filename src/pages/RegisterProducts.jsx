import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegisterProducts = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);

    const validationSchema = Yup.object({
        id: Yup.number().typeError("El ID debe ser numérico").required("El ID del producto es obligatorio"),
        product_name: Yup.string().required("El nombre del producto es obligatorio"),
        reference: Yup.string().required("La referencia es obligatoria"),
        description: Yup.string().required("La descripción es obligatoria"),
        price: Yup.number().typeError("El precio debe ser numérico").required("El precio es obligatorio").min(0, "El precio no puede ser negativo"),
        stock: Yup.number().typeError("El stock debe ser numérico").required("El stock es obligatorio").min(0, "El stock no puede ser negativo"),
    });

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
            try {
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/products/register`;

                const formData = new FormData();
                Object.keys(values).forEach((key) => {
                    formData.append(key, values[key]);
                });
                if (image) {
                    formData.append("image", image);
                }

                const options = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.post(url, formData, options);
                if (response.data.status === "success") {
                    toast.success(response.data.msg || "Producto creado correctamente.");
                    setTimeout(() => {
                        navigate("/dashboard/products");
                    }, 2000);
                } else {
                    toast.error(response.data.msg || "Error al registrar el producto");
                }
            } catch (error) {
                toast.error(error.response?.data?.msg || "Error al registrar el producto");
            }
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    return (
        <div className="flex">
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
                        <legend className="px-2 text-lg font-semibold text-gray-700">Registrar Producto</legend>
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
                                <button className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black">
                                    Registrar
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