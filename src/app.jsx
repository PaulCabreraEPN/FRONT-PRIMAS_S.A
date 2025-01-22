import React from 'react';
import './app.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Auth from './layout/Auth'
import LoadingPage from './pages/LoadingPage';
import Register from './pages/Register';
import Forgot from './pages/Forgot';

function App(){
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route index element = {<LoadingPage/>}/>
                <Route path='/' element={<Auth/>}>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='recovery-account' element={<Forgot/>}/>
                </Route> 
            </Routes>
        </BrowserRouter>
        </>  
    )
}

export default App
