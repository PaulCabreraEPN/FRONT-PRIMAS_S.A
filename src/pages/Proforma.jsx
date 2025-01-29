// src/App.js
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import axios from "axios";
import TablaProforma from "../components/TablaProforma";

const Proforma = () => {

    

    const generatePDF = () => {
        const input = document.getElementById("proforma");
        html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("proforma.pdf");
        });
    };

    

  return (
    <div>
        <TablaProforma/>
        
    </div>
  );
};

export default Proforma;
