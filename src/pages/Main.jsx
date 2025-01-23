const Main = () => {
    return (
        <>
        
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Dos columnas iguales
                gap: "20px", // Espaciado entre elementos
            }}
        >
            <div className="card text-center p-3">
                <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                <h5>Total Pedidos</h5>
                <p className="fs-4">120</p>
            </div>
            <div className="card text-center p-3">
                <i className="fas fa-users fa-2x mb-2"></i>
                <h5>Clientes Registrados</h5>
                <p className="fs-4">85</p>
            </div>
            <div className="card text-center p-3">
                <i className="fas fa-box fa-2x mb-2"></i>
                <h5>Productos Activos</h5>
                <p className="fs-4">50</p>
            </div>
            <div className="card text-center p-3">
                <i className="fas fa-user-cog fa-2x mb-2"></i>
                <h5>Vendedores Activos</h5>
                <p className="fs-4">10</p>
            </div>
        </div>
        <div>
        <iframe title="Reporte videojuegos" width="1024" height="1060" src="https://app.powerbi.com/view?r=eyJrIjoiMmQ5MzFhNjEtY2NhNC00MDgxLTljZWQtOWFhMTVlYzVjMjgyIiwidCI6IjY4MmE0ZTZhLWE3N2YtNDk1OC1hM2FjLTllMjY2ZDE4YWEzNyIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
        </div>

        </>
    );
    
}

export default Main