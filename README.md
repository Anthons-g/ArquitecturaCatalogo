# E-Commerce de Moda - Backend Modular con MongoDB

## Descripción

E-commerce de moda especializado en venta de ropa con catálogo de productos, carrito de compras y procesamiento de pagos. Backend monolítico modular construido con NestJS y frontend con Next.js, siguiendo el modelo arc42 para documentación arquitectónica.

## 🚀 Características Principales

- **Catálogo de productos** con filtros avanzados
- **Sistema de autenticación** JWT completo
- **Carrito de compras** persistente
- **Procesamiento de pagos** (Stripe, PayPal, Tarjetas)
- **Notificaciones funcionales** (Email, SMS, Push)
- **Panel de administración** con roles
- **API Gateway** con rate limiting
- **Arquitectura modular** siguiendo arc42

## 🛠️ Tecnologías

### Backend

- **NestJS** - Framework Node.js
- **MongoDB Atlas** - Base de datos en la nube
- **JWT** - Autenticación
- **SendGrid** - Servicio de email
- **Twilio** - Servicio de SMS
- **Firebase** - Push notifications
- **Docker** - Contenedores

### Frontend

- **Next.js 14** - Framework React
- **Tailwind CSS** - Estilos y animaciones
- **React Query** - Gestión de estado servidor
- **Zustand** - Gestión de estado cliente
- **TypeScript** - Tipado estático

## 📁 Estructura del Proyecto

```
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── api-gateway/       # Gateway principal
│   │   ├── core/              # Lógica de dominio
│   │   ├── modules/           # Módulos de funcionalidad
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── users/         # Gestión de usuarios
│   │   │   ├── products/      # Catálogo de productos
│   │   │   ├── cart/          # Carrito de compras
│   │   │   ├── orders/        # Gestión de órdenes
│   │   │   ├── payments/      # Procesamiento de pagos
│   │   │   ├── notifications/ # Sistema de notificaciones
│   │   │   └── dev/           # Herramientas de desarrollo
│   │   └── shared/            # Servicios compartidos
├── frontend/                   # Aplicación Next.js
│   ├── src/
│   │   ├── app/               # Páginas de la aplicación
│   │   ├── components/        # Componentes reutilizables
│   │   ├── contexts/          # Contextos de React
│   │   └── lib/               # Utilidades y APIs
└── docker-compose.yml         # Configuración Docker
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd fashion-store
```
#### Frontend (.env.local)

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local
```

### 3. Instalar dependencias

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 4. Inicializar datos de prueba

```bash
# Iniciar el backend
cd backend
npm run start:dev
### 5. Iniciar la aplicación

#### Opción 1: Desarrollo local

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```
