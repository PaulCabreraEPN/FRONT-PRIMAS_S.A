import React from 'react';
import './app.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Auth from './layout/Auth'
import { Register } from './pages/Register';
import LoadingPage from './pages/LoadingPage';

function App(){
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route index element = {<LoadingPage/>}/>
                <Route path='/' element={<Auth/>}>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                </Route> 
            </Routes>
        </BrowserRouter>
        </>  
    )
}

export default App