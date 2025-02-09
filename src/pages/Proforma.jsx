import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TablaProforma from "../components/TablaProforma";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Proforma = () => {
    const { id } = useParams();
    const proformaRef = useRef();

    const generatePDF = () => {
        const input = proformaRef.current;
        
        // Ajustar la resolución con el parámetro scale
        const scale = 3;
    
        html2canvas(input, { scale: scale }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("l", "mm", "a4"); // Configuración en horizontal
            
            // Ajustar el tamaño de la página
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20;  // Márgenes
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
            pdf.save(`Proforma_${id}.pdf`);
            toast.success("Descargando Proforma...");
        });
    };
    
    return (
        <>  
            <ToastContainer />
            <div className="container mx-auto p-5 bg-white">
            
            <div ref={proformaRef} className="p-5">
                <TablaProforma />
            </div>
            <div className="flex justify-end">
                <button
                    onClick={generatePDF}
                    style={{
                        marginTop: "20px",
                        padding: "12px 25px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
                >
                    <i className="fas fa-download justify-end" style={{ marginRight: "8px" }}></i>
                    Descargar PDF
                </button>
            </div>
        </div>
        </>
        
    );
};

export default Proforma;


