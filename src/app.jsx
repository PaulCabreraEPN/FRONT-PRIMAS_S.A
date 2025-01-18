import React from 'react';
import './app.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Auth from './layout/Auth'
import { Register } from './pages/Register';

function App(){
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route index element = {<Login/>}/>
                <Route path='/' element={<Auth/>}/>
                <Route path='/register' element={<Register/>}/>
            </Routes>
        </BrowserRouter>
        </>  
    )
}

export default App