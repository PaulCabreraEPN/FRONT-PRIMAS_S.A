import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Carga";

const UpdateProduct = () => {
    const [product, setProduct] = useState({
        product_name: "",
        measure: "",
        price: "",
        stock: "",
        imgUrl: ""
    });
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const getProduct = async () => {
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/products/${id}`;
            const options = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(url, options);
            // backend devuelve { status, code, msg, data: { ... } }
            const productData = response.data?.data || response.data || null;
            if (productData) {
                setProduct({
                    product_name: productData.product_name || "",
                    measure: productData.measure || "",
                    price: productData.price || "",
                    stock: productData.stock || "",
                    imgUrl: productData.imgUrl || "",
                    reference: productData.reference || "",
                    description: productData.description || ""
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || error.response?.data?.message || 'Error al obtener el producto');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setImage(file);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/products/update/${id}`;
            // Enviar como multipart/form-data si se adjunta imagen (y siempre para compatibilidad con upload.single)
            const formData = new FormData();
            // Agregar campos actualizables
            if (product.product_name !== undefined) formData.append('product_name', product.product_name);
            if (product.reference !== undefined) formData.append('reference', product.reference);
            if (product.description !== undefined) formData.append('description', product.description);
            if (product.price !== undefined) formData.append('price', product.price);
            if (product.stock !== undefined) formData.append('stock', product.stock);
            if (image) formData.append('image', image);

            const options = {
                headers: {
                    // Dejar que axios establezca el Content-Type con boundary automáticamente
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.patch(url, formData, options);
            toast.success(response.data?.msg || 'Producto actualizado');
            navigate("/dashboard/products");
        } catch (error) {
            toast.error(error.response?.data?.msg || error.response?.data?.error || 'Error al actualizar');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getProduct();
        }
    }, [id]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar Producto</h1>

            <hr className='my-4' />

            <div className="container mx-auto p-4">
                

                <ToastContainer />
                <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                    <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
                        <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                            <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Producto</legend>
                            <form onSubmit={handleUpdate}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="product_name" className="mb-2 block text-sm font-semibold">Nombre del Producto:</label>
                                        <input
                                            type="text"
                                            id="product_name"
                                            name="product_name"
                                            placeholder="Nombre del producto"
                                            value={product.product_name}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="reference" className="mb-2 block text-sm font-semibold">Referencia:</label>
                                        <input
                                            type="text"
                                            id="reference"
                                            name="reference"
                                            placeholder="Referencia"
                                            value={product.reference || ""}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="mb-2 block text-sm font-semibold">Precio:</label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            placeholder="0.00"
                                            value={product.price}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="stock" className="mb-2 block text-sm font-semibold">Stock:</label>
                                        <input
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            placeholder="0"
                                            value={product.stock}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="mb-2 block text-sm font-semibold">Descripción:</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Descripción del producto"
                                            value={product.description || ""}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="image" className="mb-2 block text-sm font-semibold">Imagen del Producto:</label>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                        {product.imgUrl && !image && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Imagen actual:</p>
                                                <img src={product.imgUrl} alt="Imagen actual" className="w-32 h-32 object-contain rounded mt-1" />
                                            </div>
                                        )}
                                        {image && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Vista previa de la nueva imagen:</p>
                                                <img src={URL.createObjectURL(image)} alt="Preview" className="w-32 h-32 object-contain rounded mt-1" />
                                            </div>
                                        )}
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
};

export default UpdateProduct;
