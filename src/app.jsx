import React from 'react';
import './app.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Auth from './layout/Auth';
import LoadingPage from './pages/LoadingPage';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import { PrivateRoute } from './routes/PrivateRoutes';
import Dashboard from './layout/Dasboard';
import Main from './pages/Main';
import Sellers from './pages/Sellers';
import UpdateSeller from './pages/UpdateSeller';
import Products from './pages/Products';
import UpdateProduct from './pages/UpdateProducts';
import Orders from './pages/Orders';
import Proforma from './pages/Proforma';
import Clients from './pages/Clients';
import { AuthProvider } from './context/AuthProvider';
import RegisterProducts from './pages/RegisterProducts';
import RegisterCients from './pages/RegisterClients';
import UpdateClient from './pages/UpdateClient';


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                        {/* Rutas públicas */}
                        <Route index element={<LoadingPage />} />
                        <Route path="/" element={<Auth />}>
                            <Route path="login" element={<Login />} />
                            <Route path="recovery-account" element={<Forgot />} />
                        </Route>

                        {/* Rutas protegidas */}
                        <Route
                            path="dashboard/*"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<Main />} />
                            <Route path="sellers/" element={<Sellers />} />
                            <Route path="sellers/register" element={<Register />} />
                            <Route path="sellers/update/:id" element={<UpdateSeller />} />

                            <Route path="products/" element={<Products/>} />
                            <Route path="products/register" element={<RegisterProducts/>} />
                            <Route path="products/update/:id" element={<UpdateProduct/>} />
                            

                            <Route path="clients/" element={<Clients/>} />
                            <Route path="clients/register" element={<RegisterCients/>} />
                            <Route path="clients/update/:ruc" element={<UpdateClient/>} />

                            <Route path='orders/' element={<Orders/>}></Route>
                            <Route path='orders/:id' element={<Proforma/>}></Route>
                        </Route>
                    </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

