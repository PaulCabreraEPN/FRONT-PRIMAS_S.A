import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {

    return (
        <div>
            <style>
                {`
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .sidebar {
                        height: 100vh;
                        position: fixed;
                        width: 250px;
                        background-color: #343a40;
                        color: white;
                    }
                    .sidebar a {
                        color: white;
                        text-decoration: none;
                        padding: 10px 20px;
                        display: block;
                    }
                    .sidebar a:hover {
                        background-color: #495057;
                    }
                    .main-content {
                        margin-left: 250px;
                        padding: 20px;
                    }
                    .card {
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                `}
            </style>

            <div className="sidebar">
                <h3 className="text-center py-3">Admin Panel</h3>
                <a href={`/dashboard`}><i className="fas fa-home"></i> Inicio</a>
                <a href={`/dashboard/orders`}><i className="fas fa-shopping-cart"></i> Pedidos</a>
                <a href={`/dashboard/clients`}><i className="fas fa-users"></i> Clientes</a>
                <a href={`/dashboard/products`}><i className="fas fa-box"></i> Productos</a>
                <a href={`/dashboard/sellers`}><i className="fas fa-user-cog"></i> Vendedores</a>
            </div>

            <div className="main-content">
                {/* Encabezado */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Bienvenido, Administrador</h1>
                    <div>
                        <i className="fas fa-bell me-3"></i>
                        <i className="fas fa-user-circle"></i>
                    </div>
                </div>
                <Outlet></Outlet>
            </div>
            
            
        </div>
    );
}

export default Dashboard