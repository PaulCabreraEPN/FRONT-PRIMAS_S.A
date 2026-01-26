# FRONTEND-PRIMAS_S.A
# 🏢 PRIMA S.A. - Sistema de Gestión de Ventas

## 📝 Descripción
DESARROLLO DE SISTEMA PARA LA GESTIÓN Y CONTROL DE PEDIDOS EN LA EMPRESA PRIMA S.A. 

## 👨‍💻 Autores
* **Componente Frontend :Ariel David Catucuamba Diaz**
* **Componente Móvil : Paúl Sebastián Cabrera Cruz**
* **Componente Backend :Mathías Agustín Terán Alcívar**

## 🛠️ Tecnologías Utilizadas
Ruteo
  - React 18.2.0
  - React Dom 18.2.0
  - React Router DOM 7.1.1

Solicitudes HTTP
  - Axios 1.7.9

Iconos
  - React - Icons 5.4.0
    
Notificaciones
  - React-Toastify 11.0.3
    
Estilos
  - Tailwind CSS 3.4.17
    
Graficas
  - Chart.js 4.4.7
    
Desarrollo 
  - Vite 4.0.0
    
Pruebas 
  - Vitest 1.6.1
    
Formularios/Validaciones
  - Formik 2.4.6
  - Yup 1.6.1

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
- Gestión de productos
- Gestión de clientes
- Gestión de pedidos
- Manejo del estado de pedidos
- Generación de proformas en PDF


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
