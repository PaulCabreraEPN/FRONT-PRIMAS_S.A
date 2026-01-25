import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'
import Loader from "../components/Carga";
import { useFormik } from "formik";
import * as Yup from "yup";
// Cambio reciente 

const UpdateSeller = () => {
    const [seller, setSeller] = useState({
        names: "",
        lastNames: "",
        numberID: "",
        username: "",
        email: "",
        SalesCity: "",
        PhoneNumber: "",
        role: "Seller",
        status: true,
        token: null,
        confirmEmail: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [allSellers, setAllSellers] = useState([]);
    const { id } = useParams()
    const navigate = useNavigate()

    const getSeller = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token')
            const backUrl = import.meta.env.VITE_URL_BACKEND_API
            const url = `${backUrl}/sellers/${id}`;
            const options = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await axios.get(url, options);
            // Mantener el console.log para asegurar que la respuesta llegue
            const DataResponse = response.data

            const sellerData = DataResponse.data;
            // Verificar que sellerData existe antes de actualizar
            if (sellerData) {
                setSeller({
                    names: sellerData.names || "",
                    lastNames: sellerData.lastNames || "",
                    numberID: sellerData.cedula || "",
                    username: sellerData.username || "",
                    email: sellerData.email || "",
                    SalesCity: sellerData.SalesCity || "",
                    PhoneNumber: sellerData.PhoneNumber || "",
                    status: sellerData.status
                });
            }
            toast.success(response.data.data)
        } catch (error) {
            toast.error(error.response?.data?.data)
        } finally {
            setIsLoading(false);
        }
    }

    // formik will handle changes; keep seller state as source for initialValues

    useEffect(() => {
        const getAllSellers = async () => {
            try {
                const token = localStorage.getItem('token');
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/sellers`;
                const options = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const resp = await axios.get(url, options);
                const payload = resp.data;
                let sellers = [];
                if (Array.isArray(payload)) {
                    sellers = payload;
                } else if (Array.isArray(payload?.sellers)) {
                    sellers = payload.sellers;
                } else if (Array.isArray(payload?.data)) {
                    sellers = payload.data;
                } else {
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
        return Yup.object({
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
                )
                .test('unique-name', 'Los nombres ya están registrados en otro vendedor', function (value) {
                    if (!value) return true;
                    if (!allSellers || allSellers.length === 0) return true;
                    const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
                    const val = normalize(value);
                    const exists = allSellers.some(s => {
                        const name = s?.names ?? s?.Names ?? s?.name ?? "";
                        const pid = s?._id ?? s?.id ?? s?.seller_id ?? "";
                        if (pid && String(pid) === String(id)) return false; // excluir vendedor actual
                        return normalize(name) === val;
                    });
                    return !exists;
                }),
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
                )
                .test('unique-lastnames', 'Los apellidos ya están registrados en otro vendedor', function (value) {
                    if (!value) return true;
                    if (!allSellers || allSellers.length === 0) return true;
                    const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
                    const val = normalize(value);
                    const exists = allSellers.some(s => {
                        const lname = s?.lastNames ?? s?.LastNames ?? s?.lastname ?? s?.lastName ?? "";
                        const pid = s?._id ?? s?.id ?? s?.seller_id ?? "";
                        if (pid && String(pid) === String(id)) return false; // excluir vendedor actual
                        return normalize(lname) === val;
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
                        const pid = s?._id ?? s?.id ?? s?.seller_id ?? "";
                        if (pid && String(pid) === String(id)) return false; // excluir vendedor actual
                        return (mail || "").toString().toLowerCase().trim() === val;
                    });
                    return !exists;
                }),
            SalesCity: Yup.string().required("La ciudad de venta es obligatoria"),
            PhoneNumber: Yup.string()
                .required("El número de teléfono es obligatorio")
                .test(
                    "no-negative",
                    "El número de teléfono no puede ser negativo",
                    function (value) {
                        if (!value) return false;
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
                        const pid = s?._id ?? s?.id ?? s?.seller_id ?? "";
                        if (pid && String(pid) === String(id)) return false; // excluir vendedor actual
                        return digits(phone) === valDigits;
                    });
                    return !exists;
                })
        });
    }, [allSellers, id]);
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
        enableReinitialize: true,
        initialValues: {
            names: seller.names || "",
            lastNames: seller.lastNames || "",
            numberID: seller.numberID || "",
            username: seller.username || "",
            email: seller.email || "",
            SalesCity: seller.SalesCity || "",
            PhoneNumber: seller.PhoneNumber || "",
            status: seller.status === undefined ? true : seller.status
        },
        validationSchema,
        onSubmit: async (values, { setErrors }) => {
            let success = false;
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/updateSeller/${id}`;
                const options = {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.patch(url, values, options);
                const successMsg = response.data?.msg || "Vendedor actualizado correctamente.";
                toast.success(successMsg, { autoClose: 6000 });
                success = true;
            } catch (error) {
                const resp = error.response?.data || {};
                const generalMsg = resp.msg || resp.error || resp.message;
                if (generalMsg) toast.error(generalMsg);

                // errors as object { field: 'msg' }
                if (resp.errors && typeof resp.errors === 'object' && !Array.isArray(resp.errors)) {
                    setErrors(resp.errors);
                } else if (Array.isArray(resp.errors)) {
                    const byField = {};
                    resp.errors.forEach(e => {
                        if (e.param) byField[e.param] = e.msg || e.message;
                    });
                    setErrors(byField);
                    resp.errors.forEach(e => { if (e.msg) toast.error(e.msg); });
                } else {
                    console.log('UpdateSeller error:', error);
                }
            } finally {
                setIsLoading(false);
                if (success) setTimeout(() => navigate('/dashboard/sellers'), 4000);
            }
        }
    });

    // handlePartialUpdate removed — Formik maneja el submit

    useEffect(() => {
        if (id) {
            getSeller();
        }
    }, [id])

    if (isLoading) {
        return (
            <Loader />
        );
    }

    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar Vendedor</h1>
            <hr className='my-4' />
            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador actualizar los datos del vendedor</h5>
            <hr className='my-4' />

            <div className="container mx-auto p-4">
                {/* 
                
                
                <div className="mb-4">
                    <button
                        onClick={() => navigate(`/dashboard/sellers/${id}`)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        ← Atrás
                    </button>
                </div>
                */}
                <ToastContainer />
                <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                    <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
                        <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                            <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Vendedor</legend>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="names" className="mb-2 block text-sm font-semibold">Nombres:</label>
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
                                        <label htmlFor="lastNames" className="mb-2 block text-sm font-semibold">Apellidos:</label>
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
                                        <label htmlFor="numberID" className="mb-2 block text-sm font-semibold">N° Identificación:</label>
                                        <input
                                            type="number"
                                            id="numberID"
                                            name="numberID"
                                            placeholder="1734567897"
                                            value={formik.values.numberID}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500 bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="username" className="mb-2 block text-sm font-semibold">Nombre de Usuario:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="usuario123"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500 bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo Electrónico:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="correo@ejemplo.com"
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
                                        <label htmlFor="SalesCity" className="mb-2 block text-sm font-semibold">Ciudad de Ventas:</label>
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

                                    <div>
                                        <label htmlFor="PhoneNumber" className="mb-2 block text-sm font-semibold">Teléfono:</label>
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

                                    <div>
                                        <label htmlFor="status" className="mb-2 block text-sm font-semibold">Estado:</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formik.values.status.toString()}
                                            onChange={(e) => formik.setFieldValue('status', e.target.value === 'true')}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        >
                                            <option value={true}>Activo</option>
                                            <option value={false}>Inactivo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button type="submit" className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black">
                                        {isLoading ? 'Actualizando...' : 'Actualizar'}
                                    </button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateSeller;
