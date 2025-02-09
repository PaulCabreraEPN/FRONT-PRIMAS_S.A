import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthProvider';

const Dashboard = () => {
  const { auth, cerrarSesion } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Verificar autenticación
  if (!auth?.token) {
    return null;
  }

  //Cerrar sesión
  const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/"); // Redirigir a la página principal
  };

  return (
    <div className="flex h-screen">
      {/* Navbar (Fijo y ocupa todo el ancho) */}
      <div className="bg-[#205599] text-white p-4 flex justify-between items-center fixed w-full top-0 left-0 z-50">
        {/* Botón para abrir/cerrar Sidebar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <h1 className="text-xl font-bold">Bienvenido, Administrador</h1>
        
        <div className="relative">
          <i className="fas fa-bell mx-3 cursor-pointer"></i>
          <i
            className="fas fa-user-circle text-2xl cursor-pointer"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          ></i>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                Perfil
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                Configuración
              </button>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-10 left-0 h-full w-64 bg-[#205599] text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="mt-4">
          <Link 
            to="/dashboard" 
            className="block px-6 py-3 hover:bg-[#2762b2]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-home"></i> Inicio
          </Link>
          <Link 
            to="/dashboard/orders" 
            className="block px-6 py-3 hover:bg-[#2762b2]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-shopping-cart"></i> Pedidos
          </Link>
          <Link 
            to="/dashboard/clients" 
            className="block px-6 py-3 hover:bg-[#2762b2]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-users"></i> Clientes
          </Link>
          <Link 
            to="/dashboard/products" 
            className="block px-6 py-3 hover:bg-[#2762b2]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-box"></i> Productos
          </Link>
          <Link 
            to="/dashboard/sellers" 
            className="block px-6 py-3 hover:bg-[#2762b2]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-user-cog"></i> Vendedores
          </Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 mt-16 md:ml-64">
        <main>
          <Outlet />
        </main>
      </div>

      {/* Overlay para cerrar el menú de perfil al hacer clic fuera */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;