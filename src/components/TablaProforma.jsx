// src/components/Proforma.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Art/Header";

const TablaProforma = () => {
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
        }
    }

    useEffect(()=>{
        getOrder()
},[])

    const { netTotal, totalWithTax, discountApplied } = order;

    return (
        <div id="proforma" style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "800px", margin: "auto", border: "1px solid #ddd" }}>
        <Header/>
        <br />
        <h1 style={{ textAlign: "center" }}>PROFORMA</h1>
        <br/>
        <p><strong>Cliente:</strong> {customer.Name}</p>
        <p><strong>RUC:</strong> {customer.Ruc}</p>
        <p><strong>Dirección:</strong> {customer.Address}</p>
        <p><strong>Teléfono:</strong> {customer.telephone}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <hr />
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
            <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Código</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Descripción</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Cantidad</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Precio Unitario</th>
                <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Total</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product, index) => (
                <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.productId}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.productDetails.product_name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{product.quantity}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>${product.productDetails.price.toFixed(2)}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                    ${(product.quantity * product.productDetails.price).toFixed(2)}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        <hr />
        <div
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr", // Dos columnas
            gap: "20px",
            }}
            className="mt-3"
        >
            <strong>Descuento Aplicado:</strong>
            <p className="flex justify-end mr-3"> ${discountApplied}</p>
            <strong>Total Neto:</strong> 
            <p className="flex justify-end mr-3">${netTotal}</p>
            <strong>Total con IVA:</strong>
            <p className="flex justify-end mr-3">${totalWithTax}</p>
            <strong>Vendedor:</strong>
            <p className="flex justify-end mr-3">{seller.names} {seller.lastNames}</p>
        </div>
        
        
        
        
        </div>
    );
};

export default TablaProforma;
