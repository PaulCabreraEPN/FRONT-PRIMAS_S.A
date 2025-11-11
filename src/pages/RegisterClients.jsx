import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegisterClients = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        Name: Yup.string()
            .required("El nombre es obligatorio")
            .test("two-words", "Debe ingresar al menos dos nombres", value =>
                value && value.trim().split(/\s+/).length >= 2
            ),
        ComercialName: Yup.string()
        .required("El nombre comercial es obligatorio"),
        Ruc: Yup.string()
            .required("El RUC es obligatorio")
            .length(13,"El RUC debe tener exactamente 13 digitos")
            .matches(/^\d+$/, "El RUC debe contener solo números"),
        Address: Yup.string()
            .required("La dirección es obligatoria")
            .min(20, "La dirección debe tener al menos 20 caracteres")
            .max(60, "La dirección debe tener como máximo 60 caracteres"),
        telephone: Yup.string()
            .required("El número de teléfono es obligatorio")
            
            .test(
                "no-negative",
                "El número de teléfono no puede ser negativo",
                function (value) {
                    if (!value) return false;
                    // si contiene '-' será negativo o formato inválido
                    return !value.includes("-");
                }
            )
            .length(10, "El número de teléfono debe tener exactamente 10 dígitos"),
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
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Registrar Cliente</h1>

            <hr className='my-4' />

            <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
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
                    <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                        <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Cliente</legend>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="Name" className="mb-2 block text-sm font-semibold">Nombre{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="text"
                                        id="Name"
                                        name="Name"
                                        placeholder="Ingrese nombre"
                                        value={formik.values.Name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.Name && formik.errors.Name && (
                                        <div className="text-red-500 text-sm">{formik.errors.Name}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="ComercialName" className="mb-2 block text-sm font-semibold">Nombre Comercial:</label>
                                    <input
                                        type="text"
                                        id="ComercialName"
                                        name="ComercialName"
                                        placeholder="Ingrese nombre comercial"
                                        value={formik.values.ComercialName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.ComercialName && formik.errors.ComercialName && (
                                        <div className="text-red-500 text-sm">{formik.errors.ComercialName}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="Ruc" className="mb-2 block text-sm font-semibold">RUC{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="number"
                                        id="Ruc"
                                        name="Ruc"
                                        placeholder="Ingrese RUC"
                                        value={formik.values.Ruc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.Ruc && formik.errors.Ruc && (
                                        <div className="text-red-500 text-sm">{formik.errors.Ruc}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="telephone" className="mb-2 block text-sm font-semibold">Teléfono:</label>
                                    <input
                                        type="number"
                                        id="telephone"
                                        name="telephone"
                                        placeholder="Ingrese teléfono"
                                        value={formik.values.telephone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.telephone && formik.errors.telephone && (
                                        <div className="text-red-500 text-sm">{formik.errors.telephone}</div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="Address" className="mb-2 block text-sm font-semibold">Dirección:</label>
                                    <input
                                        type="text"
                                        id="Address"
                                        name="Address"
                                        placeholder="Ingrese dirección"
                                        value={formik.values.Address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.Address && formik.errors.Address && (
                                        <div className="text-red-500 text-sm">{formik.errors.Address}</div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo Electrónico{<span className="text-red-500">*</span>}:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Ingrese correo"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="state" className="mb-2 block text-sm font-semibold">Estado:</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        placeholder="Ingrese estado"
                                        value={formik.values.state}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.state && formik.errors.state && (
                                        <div className="text-red-500 text-sm">{formik.errors.state}</div>
                                    )}
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

export default RegisterClients;