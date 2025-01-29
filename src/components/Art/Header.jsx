import React from "react";

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        {/* Reemplaza 'ruta-de-tu-imagen' con la ubicación real de la imagen */}
        <img src="/images/CasaPintorLogo.png" alt="Logo La Casa del Pintor" width={110} />
        
      </div>
      <div style={styles.centerSection}>
        <p>PROMOCION INTERNACIONAL Y MATERIAL PRIMA S.A.</p>
        <p><strong>RUC: 1790510689001</strong></p>
        <p>AV. DE LOS SHYRIS N38 - 11 (215) Y EL TELEGRAFO</p>
        <p>Tel.: 243-9841 / 243-3843 - FAX: 593-2 243-3900</p>
        <p>QUITO - ECUADOR</p>
      </div>
      <div style={styles.rightSection}>
        <h2>PROFORMA</h2>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "2px solid #ddd",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "60px", // Ajusta según el tamaño de la imagen
    marginRight: "10px",
  },
  title: {
    fontSize: "20px",
    color: "#003399", // Azul similar al de la imagen
  },
  centerSection: {
    textAlign: "center",
    fontSize: "12px",
    color: "#003399"
  },
  rightSection: {
    fontSize: "18px",
    color: "#003399",
    fontWeight: "bold",
  },
};

export default Header;