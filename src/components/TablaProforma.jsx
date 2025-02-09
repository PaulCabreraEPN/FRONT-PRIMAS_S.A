// src/components/Proforma.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Art/Header";
import Loader from "./Carga";

const TablaProforma = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    const [order, setOrder] = useState({});
    const [customer, setCustomer] = useState({});
    const [products, setProducts] = useState([]);
    const [seller, setSeller] = useState({
        _id: "",
		names: " ",
		lastNames: " ",
		numberID: "",
		email: "",
		username: ""
    });
    const { id } = useParams()

    const getOrder = async () => {
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/orders/${id}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            const data = response.data;
            setOrder(data);
            setCustomer(data.customer);
            setProducts(data.products)
            setSeller(data.seller);

        } catch (error) {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        getOrder()
},[])
    if (isLoading) {
        return <Loader />;
    }

    const { _id, netTotal, totalWithTax, discountApplied } = order;

    return (
        <>
        <button
                onClick={() => navigate('/dashboard/orders')}
                className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full sm:w-auto"
            >
                ← Atrás
            </button>
        <div className="container mx-auto p-5 border rounded-lg shadow-lg bg-white">
          <Header />
          <header className="text-center mb-4 mt-4">
            <h1 className="text-2xl font-bold">PROFORMA</h1>
          </header>
      
          <div className="flex justify-between text-sm mb-4">
            <p><strong>Código:</strong> {_id}</p>
          </div>
      
          <div className="bg-gray-100 p-4 rounded-md mb-4">
                <p className="flex justify-between">
                    <strong>Cliente:</strong>
                    <span className="ml-auto">{customer.Name}</span>
                </p>
                <p className="flex justify-between">
                    <strong>RUC:</strong>
                    <span className="ml-auto">{customer.Ruc}</span>
                </p>
                <p className="flex justify-between">
                    <strong>Dirección:</strong>
                    <span className="ml-auto">{customer.Address}</span>
                </p>
                <p className="flex justify-between">
                    <strong>Teléfono:</strong>
                    <span className="ml-auto">{customer.telephone}</span>
                </p>
                <p className="flex justify-between">
                    <strong>Email:</strong>
                    <span className="ml-auto">{customer.email}</span>
                </p>
            </div>
      
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Código</th>
                  <th className="border p-2">Descripción</th>
                  <th className="border p-2">Cantidad</th>
                  <th className="border p-2">Precio Unitario</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Desc %</th>
                  <th className="border p-2">Valor Desc</th>
                  <th className="border p-2">Total Final</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="text-center border">
                    <td className="border p-2">{product.productId}</td>
                    <td className="border p-2">{product.productDetails.product_name}</td>
                    <td className="border p-2">{product.quantity}</td>
                    <td className="border p-2">${product.productDetails.price.toFixed(2)}</td>
                    <td className="border p-2">${(product.quantity * product.productDetails.price).toFixed(2)}</td>
                    <td className="border p-2">-{discountApplied}%</td>
                    <td className="border p-2">-${(product.productDetails.price * (discountApplied / 100) * product.quantity).toFixed(2)}</td>
                    <td className="border p-2">${(product.quantity * product.productDetails.price * (1 - discountApplied / 100)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <p className="flex justify-between">
                    <strong>Descuento Aplicado:</strong>
                    <span className="ml-auto">{discountApplied} %</span>
                </p>
                <p className="flex justify-between">
                    <strong>Total Neto:</strong>
                    <span className="ml-auto">${netTotal}</span>
                </p>
                <p className="flex justify-between">
                    <strong>Total con IVA 15%:</strong>
                    <span className="ml-auto">${totalWithTax}</span>
                </p>
                <div className="flex justify-between items-center">
                    <p><strong>Vendedor:</strong></p>
                    <p className="text-right w-full">{seller.names} {seller.lastNames}</p>
                </div>
            </div>

        </div>
        </>
        
      );
    
};

export default TablaProforma;
