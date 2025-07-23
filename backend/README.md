# Backend

Este proyecto es el backend de Keyra, desarrollado con NestJS y MongoDB. Proporciona una API robusta para autenticación, gestión de usuarios, productos, pedidos, pagos, notificaciones y más.

## Estructura del Proyecto

```
backend/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── api-gateway/
│   │   ├── api-gateway.controller.ts
│   │   └── api-gateway.module.ts
│   ├── core/
│   │   ├── core.module.ts
│   │   ├── application/
│   │   │   └── application.module.ts
│   │   ├── domain/
│   │   │   ├── domain.module.ts
│   │   │   └── entities/
│   │   │       ├── base.entity.ts
│   │   │       ├── cart.entity.ts
│   │   │       ├── order.entity.ts
│   │   │       ├── product.entity.ts
│   │   │       └── user.entity.ts
│   │   └── infrastructure/
│   │       └── infrastructure.module.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── test-user.dto.ts
│   │   │   └── strategies/
│   │   │       ├── jwt.strategy.ts
│   │   │       └── local.strategy.ts
│   │   ├── cart/
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.module.ts
│   │   │   ├── cart.service.ts
│   │   │   └── dto/
│   │   │       ├── add-to-cart.dto.ts
│   │   │       └── update-cart-item.dto.ts
│   │   ├── dev/
│   │   │   ├── dev.controller.ts
│   │   │   ├── dev.module.ts
│   │   │   └── dev.service.ts
│   │   ├── notifications/
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-notification.dto.ts
│   │   │   │   └── send-notification.dto.ts
│   │   │   └── entities/
│   │   │       └── notification.entity.ts
│   │   ├── orders/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.service.ts
│   │   │   └── dto/
│   │   ├── payments/
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.service.ts
│   │   │   └── dto/
│   │   │   └── entities/
│   │   ├── products/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.module.ts
│   │   │   ├── products.service.ts
│   │   │   └── dto/
│   │   └── users/
│   │       ├── users.controller.ts
│   │       ├── users.module.ts
│   │       ├── users.service.ts
│   │       └── dto/
│   └── shared/
│       ├── shared.module.ts
│       ├── decorators/
│       ├── filters/
│       ├── guards/
│       ├── interceptors/
│       ├── middleware/
│       ├── patterns/
│       ├── services/
│       └── utils/
├── uploads/
│   ├── products/
│   ├── temp/
│   └── users/
```
## Principales módulos

- **auth**: Autenticación y autorización (JWT, estrategias, registro, login)
- **users**: Gestión de usuarios
- **products**: Gestión de productos
- **cart**: Carrito de compras
- **orders**: Pedidos
- **payments**: Pagos
- **notifications**: Notificaciones (email, SMS, push)
- **shared**: Utilidades, decoradores, middlewares, servicios comunes
