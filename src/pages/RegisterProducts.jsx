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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <button
                    onClick={() => navigate("/dashboard/products")}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors mb-4"
                >
                    <i className="fas fa-arrow-left mr-2"></i>Atrás
                </button>
                <ToastContainer />
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Registrar Producto</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="id" className="block text-sm font-semibold mb-1">ID del Producto:</label>
                        <input
                            type="number"
                            id="id"
                            name="id"
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                        />
                        {formik.touched.id && formik.errors.id && (
                            <div className="text-red-500 text-sm">{formik.errors.id}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="product_name" className="block text-sm font-semibold mb-1">Nombre del Producto:</label>
                        <input
                            type="text"
                            id="product_name"
                            name="product_name"
                            value={formik.values.product_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                        />
                        {formik.touched.product_name && formik.errors.product_name && (
                            <div className="text-red-500 text-sm">{formik.errors.product_name}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="reference" className="block text-sm font-semibold mb-1">Referencia:</label>
                        <input
                            type="text"
                            id="reference"
                            name="reference"
                            value={formik.values.reference}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                        />
                        {formik.touched.reference && formik.errors.reference && (
                            <div className="text-red-500 text-sm">{formik.errors.reference}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold mb-1">Descripción:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 min-h-[80px]"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-500 text-sm">{formik.errors.description}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-semibold mb-1">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                        />
                        {formik.touched.price && formik.errors.price && (
                            <div className="text-red-500 text-sm">{formik.errors.price}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-semibold mb-1">Stock:</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                        />
                        {formik.touched.stock && formik.errors.stock && (
                            <div className="text-red-500 text-sm">{formik.errors.stock}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-semibold mb-1">Imagen del Producto:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full border border-gray-300 rounded-md py-2 px-3"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-xl hover:bg-green-400 hover:text-black transition">
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterProducts;