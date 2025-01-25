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


function App() {
    return (
        <BrowserRouter>
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

