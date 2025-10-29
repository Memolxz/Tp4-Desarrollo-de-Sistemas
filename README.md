# Sistema de Gestión de Eventos

## Integrantes del Grupo

- Kiara Micaela Koo
- Valentina Carera
- Lucía Saint Martin

## Descripción

Sistema web para la creación y gestión de eventos sociales. Permite a los usuarios crear eventos (gratuitos o pagos), inscribirse, y gestionar sus asistencias.

## Tecnologías

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticación

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Instalación

1. Instalar dependencias desde la raíz:
```bash
pnpm install
```

2. Configurar `.env` en `apps/api`:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/db"
JWT_SECRET="tu_clave_secreta"
PORT=3000
```

3. Configurar la base de datos:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

## Compilación y Ejecución

### Backend
```bash
cd apps/api
pnpm run dev
```
Corre en `http://localhost:3000`

### Frontend
```bash
cd apps/ui
pnpm run dev
```
Corre en `http://localhost:5173`

## Decisiones de Diseño

### Arquitectura
Usamos un monorepo con pnpm workspaces para mantener el frontend y backend en un mismo repositorio, facilitando el desarrollo y compartiendo configuraciones entre ambos proyectos.

### Tecnologías Frontend
Elegimos React con Tailwind CSS por nuestra experiencia previa en otros proyectos y porque Tailwind permite desarrollar interfaces rápidamente sin escribir CSS personalizado.

### Base de Datos
Usamos Prisma como ORM porque ofrece type-safety con TypeScript y simplifica las migraciones. Separamos los modelos `Attendance` (eventos gratuitos) y `Purchase` (eventos pagos) para diferenciar claramente entre inscripciones simples y transacciones monetarias.

### Sistema de Categorías
Los eventos se clasifican en categorías (Festivales, Recitales, Casamientos, etc.) para que los usuarios puedan filtrar y buscar eventos más fácilmente.

### Gestión de Asistencias
Los usuarios pueden darse de baja de eventos gratuitos pero no de eventos pagos. Esta decisión protege tanto a organizadores como a compradores, ya que una compra representa un compromiso monetario.

### Validación
Implementamos validación tanto en el frontend (para mejor experiencia de usuario) como en el backend con Zod (para garantizar la integridad de los datos).

## API Endpoints
Hay algunos endpoints que tal vez no usamos y debido a que nos quedamos sin tiempo no llegamos eliminarlos.

**Autenticación:**
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

**Eventos:**
- `GET /events` - Listar eventos
- `GET /events/:id` - Detalle de evento
- `POST /events` - Crear evento
- `PUT /events/:id` - Actualizar evento
- `DELETE /events/:id` - Eliminar evento

**Asistencias:**
- `POST /attendance/:eventId` - Confirmar asistencia
- `DELETE /attendance/:eventId` - Cancelar asistencia

**Compras:**
- `POST /purchases` - Comprar entradas
- `GET /purchases/my-purchases` - Mis compras

**Imágenes:**
- `POST /:id/image` - Subir imágen
- `GET /:id/image` - Descargar imágen
- `DELETE /:id/image` - Eliminar imágen

**Usuarios:**
- `GET /users/profile` - Perfil del usuario
- `POST /users/balance` - Modificar balance del usuario
- `GET /users/balance` - Obtener balance del usuario

## Tests
Los tests del proyecto presentan errores debido a que, durante el desarrollo, detectamos que las pruebas están interactuando con la base de datos real en lugar de utilizar mocks. Y debido a falta de tiempo, no pudimos arreglar este problema.