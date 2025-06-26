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
        id: Yup.string().required("El ID del producto es obligatorio"),
        product_name: Yup.string().required("El nombre del producto es obligatorio"),
        measure: Yup.string().required("La unidad de medida es obligatoria"),
        price: Yup.number().required("El precio es obligatorio").positive("El precio debe ser positivo"),
        stock: Yup.number().required("El stock es obligatorio").min(1, "Debe haber al menos 1 unidad en stock"),
    });

    const formik = useFormik({
        initialValues: {
            id: "",
            product_name: "",
            measure: "",
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
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/dashboard/products");
                }, 2000);
            } catch (error) {
                toast.error(error.response?.data?.message || "Error al registrar el producto");
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
                    {[
                        { label: "ID del Producto", name: "id", type: "text" },
                        { label: "Nombre del Producto", name: "product_name", type: "text" },
                        { label: "Unidad de Medida", name: "measure", type: "text" },
                        { label: "Precio", name: "price", type: "number" },
                        { label: "Stock", name: "stock", type: "number" },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label htmlFor={name} className="block text-sm font-semibold mb-1">{label}:</label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={formik.values[name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700"
                            />
                            {formik.touched[name] && formik.errors[name] && (
                                <div className="text-red-500 text-sm">{formik.errors[name]}</div>
                            )}
                        </div>
                    ))}

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