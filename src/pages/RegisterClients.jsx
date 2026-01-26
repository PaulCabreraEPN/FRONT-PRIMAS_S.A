import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegisterClients = () => {
    const navigate = useNavigate();

    const [allClients, setAllClients] = useState([]);

    useEffect(() => {
        const getAllClients = async () => {
            try {
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/clients`;
                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const resp = await axios.get(url, options);
                const payload = resp.data;
                let clients = [];

                if (Array.isArray(payload)) {
                    clients = payload;
                } else if (Array.isArray(payload?.clients)) {
                    clients = payload.clients;
                } else if (Array.isArray(payload?.data)) {
                    clients = payload.data;
                } else {
                    // buscar la primera propiedad que sea un array
                    const maybeArray = Object.values(payload || {}).find(v => Array.isArray(v));
                    if (Array.isArray(maybeArray)) {
                        clients = maybeArray;
                    } else if (payload && typeof payload === 'object') {
                        // si es un objeto plano con clientes como propiedades, convertir a array
                        clients = Object.values(payload).filter(v => v && typeof v === 'object');
                    }
                }

                setAllClients(clients);
            } catch (err) {
                console.error("Error cargando clientes:", err?.response?.data?.msg || err.message);
            }
        };
        getAllClients();
    }, []);

    const validationSchema = useMemo(() => Yup.object({
        Name: Yup.string()
            .required("El nombre es obligatorio")
            .test("unique-name", "Ya existe un cliente con ese nombre", function (value) {
                if (!value) return true;
                if (!allClients || allClients.length === 0) return true; // no bloquear si no se cargaron clientes
                const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
                const valNorm = normalize(value);
                const exists = allClients.some(c => {
                    const name = c?.Name ?? c?.name ?? "";
                    return normalize(name) === valNorm;
                });
                return !exists;
            })
            .test("two-words", "Debe ingresar al menos dos nombres", value =>
                value && value.trim().split(/\s+/).length >= 2
            ),

        ComercialName: Yup.string()
            .required("El nombre comercial es obligatorio")
            .test("unique-comercial-name", "Ya existe un cliente con ese nombre comercial", function (value) {
                if (!value) return true;
                if (!allClients || allClients.length === 0) return true; // no bloquear si no se cargaron clientes
                const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
                const valNorm = normalize(value);
                const exists = allClients.some(c => {
                    const comercial = c?.ComercialName ?? c?.comercialName ?? c?.commercialName ?? c?.CommercialName ?? "";
                    return normalize(comercial) === valNorm;
                });
                return !exists;
            }),
        Ruc: Yup.string()
            .required("El RUC es obligatorio")
            .length(13, "El RUC debe tener exactamente 13 dígitos")
            .matches(/^\d+$/, "El RUC debe contener solo números")
            .test("unique-ruc", "Ya existe un cliente con ese RUC", function (value) {
                if (!value) return true;
                if (!allClients || allClients.length === 0) return true; // no bloquear si no se cargaron clientes
                const normalizeRuc = (s = "") => s.toString().replace(/\D/g, "").trim();
                const valNorm = normalizeRuc(value);
                const exists = allClients.some(c => {
                    const r = c?.Ruc ?? c?.ruc ?? c?.RUC ?? c?.document ?? "";
                    return normalizeRuc(r) === valNorm;
                });
                return !exists;
            }),
        
        
        
        Address: Yup.string()
            .required("La dirección es obligatoria")
            .min(15, "La dirección debe tener al menos 15 caracteres")
            .max(40, "La dirección debe tener como máximo 40 caracteres")
            .test("unique-address", "Ya existe un cliente con esa dirección", function (value) {
                if (!value) return true;
                if (!allClients || allClients.length === 0) return true; // no bloquear si no se cargaron clientes
                const normalize = (s = "") => s.toString().normalize?.("NFD")?.replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ").replace(/[^\w\s-]/g, "");
                const valNorm = normalize(value);
                const exists = allClients.some(c => {
                    const addr = c?.Address ?? c?.address ?? c?.direccion ?? c?.Direccion ?? "";
                    return normalize(addr) === valNorm;
                });
                return !exists;
            }),
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
            .length(10, "El número de teléfono debe tener exactamente 10 dígitos")
            .test("unique-telephone", "Ya existe un cliente con ese teléfono", function (value) {
                if (!value) return true;
                if (!allClients || allClients.length === 0) return true; // no bloquear si no se cargaron clientes
                const normalizePhone = (s = "") => s.toString().replace(/\D/g, "").trim();
                const valNorm = normalizePhone(value);
                const exists = allClients.some(c => {
                    const phone = c?.telephone ?? c?.Telephone ?? c?.phone ?? "";
                    return normalizePhone(phone) === valNorm;
                });
                return !exists;
            }),
        email: Yup.string().email("Debe ser un correo válido").required("El correo es obligatorio")
            .test("unique-email", "Ya existe un cliente con ese correo", function (value) {
                if (!value) return true;
                if (!allClients || allClients.length === 0) return true; // no bloquear si no se cargaron clientes
                const valNorm = value.toString().toLowerCase().trim();
                const exists = allClients.some(c => {
                    const mail = c?.email ?? c?.Email ?? c?.correo ?? "";
                    return mail.toString().toLowerCase().trim() === valNorm;
                });
                return !exists;
            }),
        state: Yup.string(),
    }), [allClients]);

    const formik = useFormik({
        initialValues: {
            Name: "",
            ComercialName: "",
            Ruc: "",
            Address: "",
            telephone: "",
            email: "",
            state: "al día",
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
                    console.error(response.data.msg || "Error al registrar cliente");
                }
            } catch (error) {
                console.error(error.response?.data?.msg || "Error al registrar cliente");
            }
        },
    });

    useEffect(() => {
        // cuando cambian los clientes recargados, revalidar los campos Name y ComercialName
        if (formik && formik.values) {
            if (formik.values.Name) formik.validateField("Name");
            if (formik.values.ComercialName) formik.validateField("ComercialName");
            if (formik.values.Ruc) formik.validateField("Ruc");
            if (formik.values.Address) formik.validateField("Address");
        }
    }, [allClients]);

    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Registrar Cliente</h1>
            <hr className='my-4' />
            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador registrar un nuevo cliente</h5>
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
                                    <label htmlFor="ComercialName" className="mb-2 block text-sm font-semibold">Nombre Comercial <span className="text-red-500">*</span>:</label>
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
                                    <label htmlFor="telephone" className="mb-2 block text-sm font-semibold">Teléfono <span className="text-red-500">*</span>:</label>
                                    <input
                                        type="text"
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
                                    <label htmlFor="Address" className="mb-2 block text-sm font-semibold">Dirección <span className="text-red-500">*</span>:</label>
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

                                <div className="md:col-span-1">
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

                                <div className="md:col-span-1">
                                    <label htmlFor="state" className="mb-2 block text-sm font-semibold">Estado:</label>
                                    <select
                                        id="state"
                                        name="state"
                                        value={formik.values.state}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full rounded-md border border-gray-300 bg-white focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 py-1 px-2 text-gray-500"
                                    >
                                        <option value="al día">al día</option>
                                        <option value="en deuda">en deuda</option>
                                    </select>
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