import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();

    const [allSellers, setAllSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getAllSellers = async () => {
            try {
                const token = localStorage.getItem('token');
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/sellers`;
                const options = { headers: { Authorization: `Bearer ${token}` } };
                const resp = await axios.get(url, options);
                const payload = resp.data;
                let sellers = [];
                if (Array.isArray(payload)) sellers = payload;
                else if (Array.isArray(payload?.sellers)) sellers = payload.sellers;
                else if (Array.isArray(payload?.data)) sellers = payload.data;
                else {
                    const maybeArray = Object.values(payload || {}).find(v => Array.isArray(v));
                    if (Array.isArray(maybeArray)) sellers = maybeArray;
                    else if (payload && typeof payload === 'object') sellers = Object.values(payload).filter(v => v && typeof v === 'object');
                }
                setAllSellers(sellers);
            } catch (err) {
                console.error('Error cargando vendedores:', err?.response?.data?.msg || err.message);
            }
        };
        getAllSellers();
    }, []);

    const validationSchema = useMemo(() => {
        const digits = (s = "") => s.toString().replace(/\D/g, "");
        const validateEcuadorianCedula = (ci) => {
            if (!ci && ci !== 0) return false;
            const str = ci.toString().trim();
            if (!/^\d{10}$/.test(str)) return false;
            const province = parseInt(str.substring(0, 2), 10);
            if (isNaN(province) || province < 1 || province > 24) return false;
            const third = parseInt(str.charAt(2), 10);
            if (isNaN(third) || third >= 6) return false;
            const digitsArr = str.split('').map(d => parseInt(d, 10));
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                let val = digitsArr[i];
                if (i % 2 === 0) {
                    val = val * 2;
                    if (val > 9) val -= 9;
                }
                sum += val;
            }
            const remainder = sum % 10;
            const check = remainder === 0 ? 0 : 10 - remainder;
            return check === digitsArr[9];
        };
        const onlyLettersAndSpaces = (s = "") => /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/.test(s);
        const isObviousPhoneSequence = (s = "") => {
            const v = s.toString().replace(/\D/g, "");
            if (!v) return false;
            if (/^0{10}$/.test(v)) return true; // 0000000000
            if (v === "1234567890") return true;
            return false;
        };

        return Yup.object({
        names: Yup.string()
            .required("Los nombres son obligatorios")
            .test("only-letters", "Los nombres solo pueden contener letras y espacios", value =>
                !value || onlyLettersAndSpaces(value)
            )
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
            .test("only-letters", "Los apellidos solo pueden contener letras y espacios", value =>
                !value || onlyLettersAndSpaces(value)
            )
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
            .matches(/^\d{10}$/, "El número de identificación debe contener únicamente números")
            .test('ecuador-cedula', 'La cédula ecuatoriana no válida', function (value) {
                if (!value) return false;
                return validateEcuadorianCedula(value);
            })
            .test('unique-cedula', 'La cédula ya está registrada', function (value) {
                // si el campo está vacío o no tenemos la lista, dejar que otras validaciones lo manejen
                if (!value) return true;
                if (!allSellers || allSellers.length === 0) return true;
                const valDigits = digits(value);
                const exists = allSellers.some(s => {
                    const ced = s?.cedula ?? s?.numberID ?? s?.ci ?? s?.identification ?? s?.ruc ?? "";
                    return digits(ced) === valDigits;
                });
                return !exists;
            }),
        email: Yup.string()
            .email("El correo debe ser válido")
            .required("El correo es obligatorio")
            .test('unique-email', 'El correo ya está registrado', function (value) {
                if (!value) return true;
                if (!allSellers || allSellers.length === 0) return true;
                const val = value.toString().toLowerCase().trim();
                const exists = allSellers.some(s => {
                    const mail = s?.email ?? s?.Email ?? s?.correo ?? "";
                    return (mail || "").toString().toLowerCase().trim() === val;
                });
                return !exists;
            }),
        SalesCity: Yup.string()
            .required("La ciudad de venta es obligatoria"),
        PhoneNumber: Yup.string()
            .required("El número de teléfono es obligatorio")
            .matches(/^\d+$/, "El número de teléfono debe contener solo dígitos")
            .test("starts-with-0", "El número de teléfono debe empezar con 0", value =>
                !value || value.toString().startsWith("0")
            )
            .test("not-obvious-seq", "El número de teléfono no puede ser una secuencia inválida", value =>
                !value || !isObviousPhoneSequence(value)
            )
            .test(
                "no-negative",
                "El número de teléfono no puede ser negativo",
                function (value) {
                    if (!value) return false;
                    // si contiene '-' será negativo o formato inválido
                    return !value.includes("-");
                }
            )
            .length(10, "El número de teléfono debe tener exactamente 10 dígitos")
            .test('unique-phone', 'El número de teléfono ya está registrado', function (value) {
                if (!value) return true;
                if (!allSellers || allSellers.length === 0) return true;
                const valDigits = digits(value);
                const exists = allSellers.some(s => {
                    const phone = s?.PhoneNumber ?? s?.phone ?? s?.Phone ?? s?.telefono ?? "";
                    return digits(phone) === valDigits;
                });
                return !exists;
            }),
    });
    }, [allSellers]);

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
            status: true,
        },
        validationSchema,
        onSubmit: async (values) => {
            let success = false;
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/register`;
                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const formData = { role: "Seller", ...values };
                const response = await axios.post(url, formData, options);
                const successMsg = response.data?.notification || response.data?.msg || (typeof response.data === 'string' ? response.data : JSON.stringify(response.data?.data || response.data));
                toast.success(successMsg, { autoClose: 6000 });
                toast.success(response.data.msg);
                success = true;
            } catch (error) {
                // Registrar en consola en lugar de mostrar un toast: usar únicamente Yup para validaciones
                console.error('Register error:', error.response?.data?.msg || error.message || error);
                            const resp = error.response?.data || {};
                            const errMsg = resp?.notification || resp?.msg || resp?.message || error.message || 'Error al registrar vendedor';
                            if (resp?.status === 'warning') {
                                toast.warn(errMsg, { autoClose: 6000 });
                            } else {
                                toast.error(errMsg, { autoClose: 6000 });
                            }
                            console.error('Register error:', errMsg);
            } finally {
                setIsLoading(false);
                if (success) setTimeout(() => navigate("/dashboard/sellers"), 7000);
            }
        },
    });

    return (
        <div>
             <h1 className='font-black text-4xl text-gray-500'>Registrar Vendedor</h1>
            <hr className='my-4' />
            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador registrar un nuevo vendedor</h5>
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
                                        placeholder="Pérez Rodríguez"
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
                                    <label htmlFor="cedula" className="mb-2 block text-sm font-semibold">N° Identificación <span className="text-red-500">*</span>:</label>
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
                                    <label htmlFor="PhoneNumber" className="mb-2 block text-sm font-semibold">Teléfono <span className="text-red-500">*</span>:</label>
                                    <input
                                        type="Text"
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
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo Electrónico <span className="text-red-500">*</span>:</label>
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
                                    <label htmlFor="status" className="mb-2 block text-sm font-semibold">Estado :</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formik.values.status?.toString()}
                                        onChange={(e) => formik.setFieldValue('status', e.target.value === 'true')}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-1.5 text-gray-500"
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                    {formik.touched.status && formik.errors.status && (
                                        <div className="text-red-500 text-sm">{formik.errors.status}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <button type="submit" className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black">
                                    {isLoading ? 'Registrando...' : 'Registrar'}
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


