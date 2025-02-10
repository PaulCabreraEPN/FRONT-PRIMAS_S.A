# 🏢 PRIMA S.A. - Sistema de Gestión de Ventas

## 📝 Descripción
Sistema web para la gestión de vendedores, productos, clientes y pedidos de la empresa PRIMA S.A. Desarrollado con React, Tailwind CSS y Vite.

## 👨‍💻 Autores
* **Paúl Sebastián Cabrera Cruz**
* **Mathías Agustín Terán Alcívar**
* **Ariel David Catucuamba Díaz**

## 🛠️ Tecnologías Utilizadas
- React 19.0.0
- Tailwind CSS 3.4.17
- Vite 4.0.0
- Chart.js 4.4.7
- Formik 2.4.6
- React Router DOM 7.1.1
- Axios 1.7.9

## 📁 Estructura del Proyecto
```
src/
├── components/     # Componentes reutilizables
├── context/       # Contexto de autenticación
├── layout/        # Layouts principales
├── pages/         # Páginas de la aplicación
├── routes/        # Configuración de rutas
└── services/      # Servicios de API
```

## ⭐ Características
- Autenticación y autorización
- Dashboard con estadísticas
- Gestión de vendedores
- Control de inventario
- Manejo de pedidos
- Administración de clientes
- Generación de proformas en PDF
- Visualización de datos con gráficos

## 📋 Requisitos
- Node.js >= 16
- npm o yarn
- Variables de entorno configuradas:
  - VITE_URL_BACKEND_API
  - VITE_URL_BACKEND

## 🚀 Instalación

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Iniciar en desarrollo
```bash
npm run dev
```

## ⚡ Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la versión de producción

## 🌐 Despliegue
La aplicación está configurada para despliegue con redirecciones para SPA en el archivo `public/_redirects`.
