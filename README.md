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

### 2. Configurar variables de entorno

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Database
MONGO_URI=mongodb+srv://usuario:clave@cluster.mongodb.net/fashion-store

# JWT
JWT_SECRET=tu-jwt-secret-muy-seguro
JWT_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001

# Email Service (SendGrid)
SENDGRID_API_KEY=tu-sendgrid-api-key
FROM_EMAIL=noreply@tudominio.com
FROM_NAME=Fashion Store

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=tu-twilio-account-sid
TWILIO_AUTH_TOKEN=tu-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Push Notifications (Firebase)
FIREBASE_PROJECT_ID=tu-firebase-project-id
FIREBASE_PRIVATE_KEY=tu-firebase-private-key
FIREBASE_CLIENT_EMAIL=tu-firebase-client-email
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

# En otra terminal, inicializar datos
curl -X POST http://localhost:3000/api/dev/seed-all
```

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

#### Opción 2: Docker

```bash
docker-compose up -d
```

## 📡 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario

### Productos

- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Detalle de producto
- `GET /api/products/featured` - Productos destacados
- `GET /api/products/category/:category` - Productos por categoría

### Carrito

- `GET /api/cart` - Obtener carrito
- `POST /api/cart/add` - Agregar al carrito
- `PATCH /api/cart/item/:id` - Actualizar item
- `DELETE /api/cart/item/:id` - Eliminar item

### Órdenes

- `POST /api/orders` - Crear orden
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/:id` - Detalle de orden

### Pagos

- `POST /api/payments/process` - Procesar pago
- `POST /api/payments/:id/refund` - Reembolso

### Desarrollo (solo en desarrollo)

- `POST /api/dev/seed-users` - Crear usuarios de prueba
- `POST /api/dev/seed-products` - Crear productos de prueba
- `POST /api/dev/seed-all` - Crear todos los datos de prueba
- `GET /api/dev/stats` - Estadísticas del sistema
- `POST /api/dev/test-notification` - Probar notificaciones

## 🔧 Configuración de Servicios Externos

### MongoDB Atlas

1. Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com)
2. Crear un cluster gratuito
3. Configurar acceso de red (0.0.0.0/0 para desarrollo)
4. Crear usuario de base de datos
5. Obtener string de conexión

### SendGrid (Email)

1. Crear cuenta en [SendGrid](https://sendgrid.com)
2. Crear API Key
3. Verificar dominio de envío
4. Configurar en `.env`



## 🧪 Pruebas


### Probar registro de usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Probar login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@demo.com",
    "password": "password123"
  }'
```

## 🌐 URLs de la Aplicación

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Health**: http://localhost:3000/api/health
- **API Info**: http://localhost:3000/api

## 🐳 Docker

### Desarrollo

```bash
docker-compose up -d
```

### Producción

```bash
docker-compose -f docker-compose.prod.yml up -d
```
## 🚀 Despliegue

### Azure App Service

1. Crear App Service para backend
2. Configurar variables de entorno
3. Desplegar desde GitHub Actions

### Vercel (Frontend)

1. Conectar repositorio
2. Configurar variables de entorno
3. Desplegar automáticamente

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

