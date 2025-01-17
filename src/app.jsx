import React from 'react';
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Auth from './layout/Auth'

function App(){
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route index element = {<Login/>}/>
                <Route path='/' element={<Auth/>}/>
            </Routes>
        </BrowserRouter>
        </>  
    )
}
export default App