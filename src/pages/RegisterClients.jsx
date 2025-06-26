import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegisterClients = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        Name: Yup.string().required("El nombre es obligatorio"),
        Ruc: Yup.string()
            .required("El RUC es obligatorio")
            .matches(/^\d+$/, "El RUC debe contener solo números"),
        Address: Yup.string().required("La dirección es obligatoria"),
        telephone: Yup.string()
            .required("El teléfono es obligatorio")
            .matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
        email: Yup.string().email("Debe ser un correo válido").required("El correo es obligatorio"),
        credit: Yup.string().required("El crédito es obligatorio"),
        state: Yup.string().required("El estado es obligatorio"),
    });

    const formik = useFormik({
        initialValues: {
            Name: "",
            Ruc: "",
            Address: "",
            telephone: "",
            email: "",
            credit: "",
            state: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/clients/register`;
                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.post(url, values, options);
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/dashboard/clients");
                }, 2000);
            } catch (error) {
                toast.error(error.response?.data?.message || "Error al registrar cliente");
            }
        },
    });

    return (
        <div className="flex">
            <div className="bg-white flex justify-center items-center w-full">
                <div className="md:w-1/2">
                    <div className="flex justify-start mb-8">
                        <button
                            onClick={() => navigate("/dashboard/clients")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Atrás
                        </button>
                    </div>
                    <ToastContainer />
                    <form onSubmit={formik.handleSubmit}>
                        {Object.keys(formik.initialValues).map((field) => (
                            <div className="mb-3" key={field}>
                                <label htmlFor={field} className="mb-2 block text-sm font-semibold">
                                    {field === "Name" ? "Nombre" :
                                     field === "Ruc" ? "RUC" :
                                     field === "Address" ? "Dirección" :
                                     field === "telephone" ? "Teléfono" :
                                     field === "email" ? "Correo Electrónico" :
                                     field === "credit" ? "Crédito" :
                                     field === "state" ? "Estado" : field}:
                                </label>
                                <input
                                    type={field === "email" ? "email" : "text"}
                                    id={field}
                                    name={field}
                                    placeholder={`Ingrese ${field === "Name" ? "nombre" :
                                                                field === "Ruc" ? "RUC" :
                                                                field === "Address" ? "dirección" :
                                                                field === "telephone" ? "teléfono" :
                                                                field === "email" ? "correo electrónico" :
                                                                field === "credit" ? "crédito" :
                                                                field === "state" ? "estado" : field}`}
                                    value={formik.values[field]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                />
                                {formik.touched[field] && formik.errors[field] ? (
                                    <div className="text-red-500 text-sm">{formik.errors[field]}</div>
                                ) : null}
                            </div>
                        ))}
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

export default RegisterClients;