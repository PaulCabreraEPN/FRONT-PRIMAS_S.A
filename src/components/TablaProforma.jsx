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

    const { _id, netTotal, totalWithTax, discountApplied } = order;

    return (
        <div id="proforma" style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "800px", margin: "auto", border: "1px solid #ddd" }}>
            <Header />
            <br />
            <div className="flex justify-end">
                <p><strong>Código: </strong>{_id}</p>
            </div>
            <br />
            <h1 style={{ textAlign: "center" }}>PROFORMA</h1>
            <br />
            <p><strong>Cliente:</strong> {customer.Name}</p>
            <p><strong>RUC:</strong> {customer.Ruc}</p>
            <p><strong>Dirección:</strong> {customer.Address}</p>
            <p><strong>Teléfono:</strong> {customer.telephone}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <br />
            <hr />
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Código</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Descripción</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Cantidad</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Precio Unitario</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Total</th>
                        <th colSpan="2" style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Desc % - Valor</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px 20px" }}>Total Final</th>
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
                            <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>-{discountApplied}%</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>-${(product.productDetails.price * (discountApplied / 100) * product.quantity).toFixed(2)}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                                ${(product.quantity * product.productDetails.price * (1 - discountApplied / 100)).toFixed(2)}
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
                <p className="flex justify-end mr-3"> {discountApplied} %</p>
                <strong>Total Neto:</strong>
                <p className="flex justify-end mr-3">${netTotal}</p>
                <strong>Total con IVA 15%:</strong>
                <strong className="flex justify-end mr-3">${(totalWithTax)}</strong>
                <strong>Vendedor:</strong>
                <p className="flex justify-end mr-3">{seller.names} {seller.lastNames}</p>
            </div>
    
            {/* Media Queries for Responsiveness */}
            <style jsx>{`
                @media (max-width: 768px) {
                    table, th, td {
                        display: block;
                        width: 100%;
                    }
                    th {
                        background-color: #f4f4f4;
                        text-align: left;
                        padding: 10px;
                    }
                    td {
                        padding: 10px;
                        text-align: left;
                        border: none;
                        border-bottom: 1px solid #ddd;
                    }
                    td:before {
                        content: attr(data-label);
                        font-weight: bold;
                        display: inline-block;
                        width: 120px;
                    }
                    .flex {
                        display: block;
                        margin-bottom: 10px;
                    }
                    .flex.justify-end {
                        text-align: right;
                    }
                }
            `}</style>
    
        </div>
    );
    
};

export default TablaProforma;
