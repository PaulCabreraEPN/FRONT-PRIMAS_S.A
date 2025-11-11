import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        names: Yup.string()
            .required("Los nombres son obligatorios")
            .min(3, "Los nombres deben tener al menos 3 caracteres")
            .max(41, "Los nombres deben tener como máximo 20 caracteres")
            .test("two-words", "Debe ingresar exactamente dos nombres", value =>
                value && value.trim().split(/\s+/).length === 2
            )
            .test(
                "each-name-length",
                "Cada nombre debe tener entre 3 y 20 caracteres",
                function (value) {
                    if (!value) return false;
                    const parts = value.trim().split(/\s+/);
                    if (parts.length !== 2) return false;
                    const first = parts[0];
                    const second = parts[1];
                    return (
                        first.length >= 3 &&
                        first.length <= 20 &&
                        second.length >= 3 &&
                        second.length <= 20
                    );
                }
            ),
        lastNames: Yup.string()
            .required("Los apellidos son obligatorios")
            .min(3, "Los apellidos deben tener al menos 3 caracteres")
            .max(41, "Los apellidos deben tener como máximo 20 caracteres")
            .test("two-words", "Debe ingresar exactamente dos apellidos", value =>
                value && value.trim().split(/\s+/).length === 2
            )
            .test(
                "each-lastname-length",
                "Cada apellido debe tener entre 3 y 20 caracteres",
                function (value) {
                    if (!value) return false;
                    const parts = value.trim().split(/\s+/);
                    if (parts.length !== 2) return false;
                    const first = parts[0];
                    const second = parts[1];
                    return (
                        first.length >= 3 &&
                        first.length <= 20 &&
                        second.length >= 3 &&
                        second.length <= 20
                    );
                }
            ),
        cedula: Yup.string()
            .required("El número de identificación es obligatorio")
            .length(10, "El número de identificación debe tener exactamente 10 dígitos")
            .matches(/^\d{10}$/, "El número de identificación debe contener unicamente números"),
        email: Yup.string()
            .email("El correo debe ser válido")
            .required("El correo es obligatorio"),
        SalesCity: Yup.string()
            .required("La ciudad de venta es obligatoria"),
        PhoneNumber: Yup.string()
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
    });

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

    const formik = useFormik({
        initialValues: {
            names: "",
            lastNames: "",
            cedula: "",
            email: "",
            SalesCity: "",
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
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Registrar Vendedor</h1>

            <hr className='my-4' />

            <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
                    <ToastContainer />
                    <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                        <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Vendedor</legend>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="names" className="mb-2 block text-sm font-semibold">Nombres <span className="text-red-500">*</span>:</label>
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

                                <div>
                                    <label htmlFor="lastNames" className="mb-2 block text-sm font-semibold">Apellidos <span className="text-red-500">*</span>:</label>
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

                                <div>
                                    <label htmlFor="cedula" className="mb-2 block text-sm font-semibold">N° Identificacion <span className="text-red-500">*</span>:</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        name="cedula"
                                        placeholder="1734567897"
                                        value={formik.values.cedula}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                    />
                                    {formik.touched.cedula && formik.errors.cedula ? (
                                        <div className="text-red-500 text-sm">{formik.errors.cedula}</div>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="PhoneNumber" className="mb-2 block text-sm font-semibold">Telefono <span className="text-red-500">*</span>:</label>
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

                                <div className="md:col-span-2">
                                    <label htmlFor="SalesCity" className="mb-2 block text-sm font-semibold">Ciudad de Venta<span className="text-red-500">*</span>:</label>
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

                                <div className="md:col-span-2">
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo Electronico <span className="text-red-500">*</span>:</label>
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

export default Register;


