import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegisterClients = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        Name: Yup.string().required("El nombre es obligatorio"),
        ComercialName: Yup.string(),
        Ruc: Yup.string()
            .required("El RUC es obligatorio")
            .matches(/^\d+$/, "El RUC debe contener solo números"),
        Address: Yup.string(),
        telephone: Yup.string(),
        email: Yup.string().email("Debe ser un correo válido").required("El correo es obligatorio"),
        state: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            Name: "",
            ComercialName: "",
            Ruc: "",
            Address: "",
            telephone: "",
            email: "",
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
                if (response.data.status === "success") {
                    toast.success(response.data.msg || "Cliente registrado con éxito.");
                    setTimeout(() => {
                        navigate("/dashboard/clients");
                    }, 2000);
                } else {
                    toast.error(response.data.msg || "Error al registrar cliente");
                }
            } catch (error) {
                toast.error(error.response?.data?.msg || "Error al registrar cliente");
            }
        },
    });

    return (
        <div className="flex">
            <div className="bg-white flex justify-center items-center w-full">
                <div className="md:w-1/2">
                    {/*
                    <div className="flex justify-start mb-8">
                        <button
                            onClick={() => navigate("/dashboard/clients")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Atrás
                        </button>
                    </div>
                    */}
                    <ToastContainer />
                    <form onSubmit={formik.handleSubmit}>
                        { [
                            { label: "Nombre", name: "Name", type: "text", required: true },
                            { label: "Nombre Comercial", name: "ComercialName", type: "text" },
                            { label: "RUC", name: "Ruc", type: "text", required: true },
                            { label: "Dirección", name: "Address", type: "text" },
                            { label: "Teléfono", name: "telephone", type: "text" },
                            { label: "Correo Electrónico", name: "email", type: "email", required: true },
                            { label: "Estado", name: "state", type: "text" },
                        ].map(({ label, name, type, required }) => (
                            <div className="mb-3" key={name}>
                                <label htmlFor={name} className="mb-2 block text-sm font-semibold">
                                    {label}{required && <span className="text-red-500">*</span>}:
                                </label>
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
                                {formik.touched[name] && formik.errors[name] ? (
                                    <div className="text-red-500 text-sm">{formik.errors[name]}</div>
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