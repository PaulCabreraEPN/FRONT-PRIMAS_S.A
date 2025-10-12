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
            <div className="bg-white flex justify-center items-center w-full">
                <div className="md:w-1/2 p-8">
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
                    <form onSubmit={formik.handleSubmit}>
                        {[
                            { label: "ID del Producto", name: "id", type: "number", required: true },
                            { label: "Nombre del Producto", name: "product_name", type: "text", required: true },
                            { label: "Referencia", name: "reference", type: "text", required: true },
                            { label: "Descripción", name: "description", type: "textarea", required: true },
                            { label: "Precio", name: "price", type: "number", required: true },
                            { label: "Stock", name: "stock", type: "number", required: true },
                        ].map(({ label, name, type, required }) => (
                            <div className="mb-3" key={name}>
                                <label htmlFor={name} className="mb-2 block text-sm font-semibold">
                                    {label}{required && <span className="text-red-500">*</span>}:
                                </label>
                                {type === "textarea" ? (
                                    <textarea
                                        id={name}
                                        name={name}
                                        placeholder={`Ingrese ${label.toLowerCase()}`}
                                        value={formik.values[name]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500 min-h-[80px]"
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        id={name}
                                        name={name}
                                        placeholder={`Ingrese ${label.toLowerCase()}`}
                                        value={formik.values[name]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                )}
                                {formik.touched[name] && formik.errors[name] ? (
                                    <div className="text-red-500 text-sm">{formik.errors[name]}</div>
                                ) : null}
                            </div>
                        ))}

                        <div className="mb-3">
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

                        <div className="mb-3">
                            <button className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black">
                                Registrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterProducts;