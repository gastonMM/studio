# Calculadora Costos 3D Pro

## Documentación de la Aplicación y API

Esta aplicación web integral, **Calculadora Costos 3D Pro**, está diseñada para ayudar a profesionales y entusiastas de la impresión 3D a calcular los costos de producción de piezas y determinar precios de venta sugeridos de manera precisa.

La aplicación permite gestionar todos los recursos necesarios para la impresión 3D: materiales, accesorios y perfiles de impresora. Posteriormente, estos recursos se utilizan para realizar cálculos detallados de costos por proyecto.

---

### Secciones Principales de la Aplicación

La aplicación se organiza en las siguientes secciones principales, accesibles desde el menú de navegación lateral:

- **Gestión de Materiales** (`/materials`): Permite gestionar materiales de impresión (CRUD). Los campos clave incluyen Nombre, Costo por Kg, Peso Spool Comprado, Densidad y Diámetro. Estos datos son fundamentales para calcular el Costo de Material en cada proyecto.

- **Gestión de Accesorios** (`/accessories`): Permite gestionar componentes adicionales (CRUD). Los campos clave incluyen Nombre, Precio del Paquete y Unidades por Paquete, utilizados para calcular el Costo por Unidad y añadir un costo adicional preciso por accesorio.

- **Perfiles de Impresora** (`/printer-profiles`): Centraliza la configuración de parámetros de la impresora. Los campos clave incluyen Consumo Energético, Costo KWh Electricidad, Costo Adquisición Impresora, Vida Útil Estimada (Horas), Porcentaje de Fallas y Costo Hora Labor. Estos datos son cruciales para calcular los costos de electricidad, amortización, fallas y labor.

- **Nueva Calculación** (`/projects/calculate`): Permite introducir los parámetros de una pieza para obtener un desglose completo de costos. Después de completar los datos del proyecto, seleccionar material y perfil de impresora, y opcionalmente añadir accesorios, la aplicación calcula y muestra los resultados. Si el resultado es satisfactorio, se puede guardar el proyecto en el Catálogo.

- **Catálogo** (`/projects`): Muestra todos los proyectos guardados. Cada proyecto se presenta en una tarjeta con vista rápida de nombre, costo total y precio de venta sugerido. Las tarjetas incluyen opciones para Editar/Recalcular, Eliminar y un botón global para Recalcular Todos los costos del catálogo.

---

### Detalle del Cálculo de Costos

El cálculo de costos considera varios factores para asegurar la precisión:

1.  **Costo del Material por Pieza:** Calculado en base al Costo por Kg del material y el peso de la pieza en gramos.
2.  **Costo de Electricidad por Pieza:** Basado en el consumo energético de la impresora, tiempo de impresión y costo por KWh.
3.  **Costo de Amortización de la Impresora:** Distribuye el costo de adquisición de la impresora a lo largo de su vida útil estimada por hora.
4.  **Costo de Labor Operativa:** Cuantifica el costo del tiempo dedicado a la preparación de la impresión.
5.  **Costo de Labor de Post-Procesado:** Cuantifica el costo del trabajo manual después de la impresión (soportes, lijado, etc.).
6.  **Costo Total de Accesorios:** Suma del costo de todos los accesorios utilizados en el proyecto.

Los cálculos finales incluyen el Subtotal Costo Directo, el Costo de Contingencia por Fallas (un margen para impresiones fallidas), el Costo Total por Pieza (costo final de producción) y el Precio de Venta Sugerido por Pieza (aplicando el margen de ganancia deseado).

---

### Configuración de la Base de Datos (PostgreSQL)

La aplicación está configurada para funcionar con una base de datos PostgreSQL utilizando Prisma como ORM. Para conectar la aplicación a tu base de datos, sigue estos pasos:

1.  **Crea un archivo `.env`** en la raíz del proyecto.
2.  **Añade la variable de entorno `DATABASE_URL`** a tu archivo `.env`. El formato debe ser el siguiente:
    ```
    DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BASE_DE_DATOS?schema=public"
    ```
    Reemplaza `USUARIO`, `CONTRASEÑA`, `HOST`, `PUERTO` y `NOMBRE_BASE_DE_DATOS` con las credenciales de tu base de datos PostgreSQL.

3.  **Crea la estructura de la base de datos**. El archivo `schema.sql` en la raíz del proyecto contiene todas las sentencias `CREATE TABLE` necesarias. Puedes ejecutar este script en tu base de datos para crear todas las tablas requeridas.

4.  **Instala las dependencias y genera el cliente de Prisma**:
    ```bash
    npm install
    ```
    El comando `npm install` ejecutará automáticamente `prisma generate`, que crea el cliente de Prisma basado en tu esquema.

---

### Arquitectura y Flujo de Datos

- **Tecnologías:** Frontend con Next.js (React), TypeScript, Tailwind CSS y ShadCN. Backend con Next.js API Routes y Server Actions. La capa de datos se gestiona con **Prisma** para interactuar con una base de datos PostgreSQL.

- **Flujo de Datos (Ejemplo: Guardar un Material):** Un usuario interactúa con el formulario, el componente cliente llama a una Server Action (`saveMaterialAction`) que se ejecuta en el servidor. Esta Server Action invoca una función en la capa de servicio (`material-service.ts`) que, a su vez, utiliza el **cliente de Prisma** para guardar el material en la base de datos. La Server Action responde con un estado de éxito y el componente cliente redirige y muestra una notificación.

---

### API Endpoints

- **Recalcular Todos los Proyectos** (`/api/recalculate-all`)
    - **Método:** `GET`
    - **Función:** Permite actualizar los costos de todos los proyectos guardados utilizando los precios más recientes de materiales, perfiles, etc.
    - **Parámetros de Consulta:** `secret` (obligatorio, clave secreta para autorización. En desarrollo: `SUPER_SECRET_KEY`).
    - **Respuesta Exitosa (200 OK):** JSON con `success: true`, `message`, y `count` de proyectos actualizados.
    - **Respuestas de Error:** 401 No Autorizado (clave secreta incorrecta o faltante) o 500 Error Interno del Servidor.

---

Para más detalles técnicos sobre la implementación de los cálculos, consulte el archivo `src/lib/calculation.ts`. Para el esquema de la base de datos, consulte `prisma/schema.prisma`.