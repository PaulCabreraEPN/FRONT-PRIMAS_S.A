import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Carga";
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdateClient = () => {
    const [client, setClient] = useState({
        Name: "",
        Ruc: "",
        Address: "",
        telephone: "",
        email: "",
        credit: "",
        state: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const { ruc } = useParams();
    const navigate = useNavigate();

    const getClient = async () => {
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/clients/${ruc}`;
            const options = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(url, options);
            const clientData = response.data.data;
            if (clientData) {
                setClient({
                    Name: clientData.Name || "",
                    Ruc: clientData.Ruc || "",
                    Address: clientData.Address || "",
                    telephone: clientData.telephone || "",
                    email: clientData.email || "",
                    credit: clientData.credit || "",
                    state: clientData.state || ""
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Migrated to Formik + Yup
    const validationSchema = Yup.object({
        Name: Yup.string()
            .required("El nombre es obligatorio")
            .min(3, "El nombre debe tener al menos 3 caracteres"),
        Address: Yup.string()
            .required("La dirección es obligatoria")
            .min(20, "La dirección debe tener al menos 20 caracteres")
            .max(60, "La dirección debe tener como máximo 60 caracteres"),
        telephone: Yup.string()
            .required("El teléfono es obligatorio")
            .test("no-negative", "El teléfono no puede contener '-'", value => !value || !value.includes('-'))
            .matches(/^\d{10}$/, "El teléfono debe contener exactamente 10 dígitos"),
        email: Yup.string().email("El correo debe ser válido").required("El correo es obligatorio"),
        credit: Yup.string().nullable(),
        state: Yup.string().nullable()
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            Name: client.Name || "",
            Ruc: client.Ruc || "",
            Address: client.Address || "",
            telephone: client.telephone || "",
            email: client.email || "",
            credit: client.credit || "",
            state: client.state || ""
        },
        validationSchema,
        onSubmit: async (values, { setErrors }) => {
            let success = false;
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                const backUrl = import.meta.env.VITE_URL_BACKEND_API;
                const url = `${backUrl}/clients/update/${ruc}`;
                const options = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.patch(url, values, options);
                if (response.data.status === "success") {
                    toast.success(response.data.msg || 'Cliente actualizado');
                    success = true;
                } else {
                    toast.error(response.data.msg || 'Error al actualizar cliente');
                }
            } catch (error) {
                const resp = error.response?.data || {};
                const generalMsg = resp.msg || resp.error || resp.message;
                if (generalMsg) toast.error(generalMsg);

                if (resp.errors && typeof resp.errors === 'object' && !Array.isArray(resp.errors)) {
                    setErrors(resp.errors);
                } else if (Array.isArray(resp.errors)) {
                    const byField = {};
                    resp.errors.forEach(e => { if (e.param) byField[e.param] = e.msg || e.message; });
                    setErrors(byField);
                    resp.errors.forEach(e => { if (e.msg) toast.error(e.msg); });
                } else {
                    console.log('UpdateClient error:', error);
                }
            } finally {
                setIsLoading(false);
                if (success) setTimeout(() => navigate('/dashboard/clients'), 2000);
            }
        }
    });

    useEffect(() => {
        if (ruc) {
            getClient();
        }
    }, [ruc]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar Cliente</h1>

            <hr className='my-4' />


            <div className="container mx-auto mt-8 p-4">

                {/* 
            <div className="mb-4">
                <button
                    onClick={() => navigate("/dashboard/clients")}
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
                            <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Cliente</legend>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="Name" className="mb-2 block text-sm font-semibold">Nombre:</label>
                                        <input
                                            type="text"
                                            id="Name"
                                            name="Name"
                                            placeholder="Ingrese nombre"
                                            value={formik.values.Name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.Name && formik.errors.Name ? (
                                            <div className="text-red-500 text-sm">{formik.errors.Name}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="Ruc" className="mb-2 block text-sm font-semibold">RUC:</label>
                                        <input
                                            type="text"
                                            id="Ruc"
                                            name="Ruc"
                                            value={formik.values.Ruc}
                                            disabled
                                            className="block w-full rounded-md border border-gray-300 bg-gray-100 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="Address" className="mb-2 block text-sm font-semibold">Dirección:</label>
                                        <input
                                            type="text"
                                            id="Address"
                                            name="Address"
                                            placeholder="Ingrese dirección"
                                            value={formik.values.Address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.Address && formik.errors.Address ? (
                                            <div className="text-red-500 text-sm">{formik.errors.Address}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="telephone" className="mb-2 block text-sm font-semibold">Teléfono:</label>
                                        <input
                                            type="text"
                                            id="telephone"
                                            name="telephone"
                                            placeholder="Ingrese teléfono"
                                            value={formik.values.telephone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.telephone && formik.errors.telephone ? (
                                            <div className="text-red-500 text-sm">{formik.errors.telephone}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Ingrese correo"
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
                                        <label htmlFor="credit" className="mb-2 block text-sm font-semibold">Crédito:</label>
                                        <input
                                            type="text"
                                            id="credit"
                                            name="credit"
                                            placeholder="N/D"
                                            value={formik.values.credit}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
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
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {formik.touched.state && formik.errors.state ? (
                                            <div className="text-red-500 text-sm">{formik.errors.state}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button type="submit" disabled={isLoading} className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black disabled:opacity-50">
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
};

export default UpdateClient;
