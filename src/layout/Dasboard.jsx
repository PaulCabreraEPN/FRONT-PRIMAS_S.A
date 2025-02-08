import { useState } from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#205599] text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex justify-between items-center md:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="hidden sm:block bg-[url('/images/mainlogoW.png')] bg-no-repeat bg-center bg-contain h-24 w-24 mx-auto" />
          <div className="hidden sm:block bg-[url('/images/atlasletterW.png')] bg-no-repeat bg-center bg-contain h-14 w-12 mx-auto" />
        </div>
        <nav>
          <a href="/dashboard" className="block px-6 py-3 hover:bg-[#2762b2]"><i className="fas fa-home"></i> Inicio</a>
          <a href="/dashboard/orders" className="block px-6 py-3 hover:bg-[#2762b2]"><i className="fas fa-shopping-cart"></i> Pedidos</a>
          <a href="/dashboard/clients" className="block px-6 py-3 hover:bg-[#2762b2]"><i className="fas fa-users"></i> Clientes</a>
          <a href="/dashboard/products" className="block px-6 py-3 hover:bg-[#2762b2]"><i className="fas fa-box"></i> Productos</a>
          <a href="/dashboard/sellers" className="block px-6 py-3 hover:bg-[#2762b2]"><i className="fas fa-user-cog"></i> Vendedores</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 p-6 md:ml-64 transition-all">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Bienvenido, Administrador</h1>
          <div>
            <i className="fas fa-bell mx-3"></i>
            <i className="fas fa-user-circle"></i>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
