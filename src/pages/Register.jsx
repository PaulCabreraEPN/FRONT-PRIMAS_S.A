import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();

    // Esquema de validación con Yup
    const validationSchema = Yup.object({
        names: Yup.string().required("El nombre es obligatorio"),
        lastNames: Yup.string().required("Los apellidos son obligatorios"),
        numberID: Yup.string()
            .required("El número de identificación es obligatorio")
            .length(10, "El número de identificación debe tener exactamente 10 dígitos") // Validación de 10 dígitos
            .matches(/^\d{10}$/, "El número de identificación debe ser un número de 10 dígitos"), // Validación para que sea un número
        email: Yup.string().email("El correo debe ser válido").required("El correo es obligatorio"),
        SalesCity: Yup.string().required("La ciudad de venta es obligatoria"),
        PhoneNumber: Yup.number()
            .required("El número de teléfono es obligatorio")
            .positive("El número de teléfono debe ser positivo")
            .integer("El número de teléfono debe ser un número entero")
            .min(1000000000, "El número de teléfono debe tener al menos 10 dígitos")
            .max(9999999999, "El número de teléfono debe tener como máximo 10 dígitos"),
    });

    // Lista de las principales ciudades de Ecuador
    const cities = [
        "Quito",
        "Guayaquil",
        "Cuenca",
        "Ambato",
        "Manta",
        "Loja",
        "Machala",
        "Riobamba",
        "Ibarra",
        "Durán",
        "Esmeraldas",
        "Portoviejo",
        "Babahoyo",
        "Tena",
        "Santo Domingo"
    ];

    // Usar Formik para gestionar el formulario
    const formik = useFormik({
        initialValues: {
            names: "",
            lastNames: "",
            numberID: "",
            email: "",
            SalesCity: "", // Cambiado a string
            PhoneNumber: "",
            role: "Seller",
            status: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/register`;
                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const formData = { role: "Seller", status: false, ...values };
                const response = await axios.post(url, formData, options);
                toast.success(response.data.msg);
                setTimeout(() => {
                    navigate("/dashboard/sellers");
                }, 2000);
            } catch (error) {
                toast.error(error.response?.data?.msg);
            }
        },
    });

    return (
        <div className="flex">
            <div className="bg-white flex justify-center items-center w-full">
                <div className="md:w-1/2">
                    <div className="flex justify-start mb-8">
                        <button
                            onClick={() => navigate("/dashboard/sellers")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Atrás
                        </button>
                    </div>
                    <ToastContainer />
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="names" className="mb-2 block text-sm font-semibold">
                                Nombres:
                            </label>
                            <input
                                type="text"
                                id="names"
                                name="names"
                                placeholder="Ana Maria"
                                value={formik.values.names}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                            {formik.touched.names && formik.errors.names ? (
                                <div className="text-red-500 text-sm">{formik.errors.names}</div>
                            ) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="lastNames" className="mb-2 block text-sm font-semibold">
                                Apellidos:
                            </label>
                            <input
                                type="text"
                                id="lastNames"
                                name="lastNames"
                                placeholder="Perez Rodriguez"
                                value={formik.values.lastNames}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                            {formik.touched.lastNames && formik.errors.lastNames ? (
                                <div className="text-red-500 text-sm">{formik.errors.lastNames}</div>
                            ) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="numberID" className="mb-2 block text-sm font-semibold">
                                N. Identificacion:
                            </label>
                            <input
                                type="text"
                                id="numberID"
                                name="numberID"
                                placeholder="1734567897"
                                value={formik.values.numberID}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                            {formik.touched.numberID && formik.errors.numberID ? (
                                <div className="text-red-500 text-sm">{formik.errors.numberID}</div>
                            ) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                                Correo Electronico:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Prima@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="SalesCity" className="mb-2 block text-sm font-semibold">
                                Ciudad de Venta:
                            </label>
                            <select
                                id="SalesCity"
                                name="SalesCity"
                                value={formik.values.SalesCity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            >
                                <option value="">Selecciona una ciudad</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.SalesCity && formik.errors.SalesCity ? (
                                <div className="text-red-500 text-sm">{formik.errors.SalesCity}</div>
                            ) : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="PhoneNumber" className="mb-2 block text-sm font-semibold">
                                Telefono:
                            </label>
                            <input
                                type="number"
                                id="PhoneNumber"
                                name="PhoneNumber"
                                placeholder="0987654324"
                                value={formik.values.PhoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                            {formik.touched.PhoneNumber && formik.errors.PhoneNumber ? (
                                <div className="text-red-500 text-sm">{formik.errors.PhoneNumber}</div>
                            ) : null}
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

export default Register;


