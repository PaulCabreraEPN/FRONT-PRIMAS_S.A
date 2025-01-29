import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TablaProforma from "../components/TablaProforma";
import { useParams } from "react-router-dom";

const Proforma = () => {
    const { id } = useParams();
    const generatePDF = () => {
        const input = document.getElementById("proforma");
        
        // Ajustar la resolución con el parámetro scale
        const scale = 5;
    
        html2canvas(input, { scale: scale }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            
            // Ajustar el tamaño de la página
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20;  // Restamos 20mm para márgenes
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
           
            const marginX = 10; // margen izquierdo
            const marginY = 10; // margen superior
            
            const scaledHeight = pdfHeight > pdf.internal.pageSize.getHeight() - marginY * 2
                ? (pdf.internal.pageSize.getHeight() - marginY * 2) * (canvas.width / canvas.height)
                : pdfHeight;
    
            pdf.addImage(imgData, "PNG", marginX, marginY, pdfWidth, scaledHeight);
            pdf.save(`Proforma_${id}.pdf`);
        });
    };
    

  return (
    <div>
        <TablaProforma/>
        <div className="flex justify-end">
            <button
                onClick={generatePDF}
                style={{
                    marginTop: "20px",
                    padding: "12px 25px",
                    backgroundColor: "#4CAF50", // Color de fondo verde
                    color: "white", // Color del texto
                    fontSize: "16px", // Tamaño de fuente
                    border: "none", // Sin bordes
                    borderRadius: "5px", // Bordes redondeados
                    cursor: "pointer", // El puntero cambia a mano
                    display: "flex", // Para alinear el ícono y el texto
                    alignItems: "center", // Centrado vertical
                    justifyContent: "center", // Centrado horizontal
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra para un poco de profundidad
                    transition: "background-color 0.3s", // Transición de color de fondo
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"} // Cambio de color al pasar el mouse
                onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"} // Restaurar el color al quitar el mouse
            >
                <i className="fas fa-download justify-end" style={{ marginRight: "8px" }}></i> {/* Ícono de descarga */}
                Descargar PDF
            </button>
        </div>
        

    </div>
  );
};

export default Proforma;
