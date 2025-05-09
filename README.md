# Next.js CRUD con Prisma

Este proyecto es una aplicación CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar usuarios y productos, construida con Next.js y Prisma ORM.

## Requisitos

- Node.js 18.x o superior
- npm o yarn
- PostgreSQL (se recomienda usar Neon para la base de datos)

## Configuración

1. Clona el repositorio
2. Instala las dependencias:

\`\`\`bash
npm install
# o
yarn install
\`\`\`

3. Copia el archivo `.env.example` a `.env.local` y configura la URL de conexión a tu base de datos:

\`\`\`
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
\`\`\`

4. Genera el cliente Prisma:

\`\`\`bash
npx prisma generate
\`\`\`

5. Crea las tablas en la base de datos:

\`\`\`bash
npx prisma db push
\`\`\`

## Ejecución

Para iniciar el servidor de desarrollo:

\`\`\`bash
npm run dev
# o
yarn dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del proyecto

- `/prisma`: Contiene el esquema de Prisma
- `/app`: Contiene las rutas y componentes de la aplicación
- `/components`: Componentes reutilizables
- `/lib`: Utilidades y configuración de Prisma

## Características

- Gestión completa de usuarios (CRUD)
- Gestión completa de productos (CRUD)
- Validación de formularios con Zod
- Interfaz de usuario con Tailwind CSS y shadcn/ui
- Diseño responsivo
