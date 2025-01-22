import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const LoadingPage = () => {
    const Navigate = useNavigate();
    const backendResourses = import.meta.env.VITE_URL_BACKEND;
    const [loading, setLoading] = useState(true);

    const loadResourses = async () => {
        try {
            const url = `${backendResourses}`;
            const respuesta = await axios.get(url);
            console.log(respuesta);
            Navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
     loadResourses()   
    },[])

    return (
        <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#21559a",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div style={{ textAlign: "center"}}>

            <div style={{display:"flex"}}>

                {/* Logo principal con animación */}
                <img
                    src="/images/mainlogoW.png"
                    alt="Logo"
                    style={{
                        width: "120px",
                        height: "120px",
                        animation: "bounce 1.5s infinite",
                        display:"flex"
                    }}
              
                />

                {/* Imagen secundaria */}
                <img
                    src="/images/atlasletterW.png"
                    alt="Atlas Letter"
                    style={{
                        height: "118px",
                        display:"flex"
                    }}
                />

            </div>
            
            <p
                style={{
                    marginTop: "20px",
                    fontSize: "18px",
                    color: "azure",
                }}
            >
                Cargando Recursos...
            </p>
          </div>
        </div>
        <style>
            {`
              @keyframes bounce {
                0%, 100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-20px);
                }
              }
            `}
        </style>
        </div>
      );
      
}

export default LoadingPage