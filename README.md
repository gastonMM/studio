# Calculadora de Costos 3D Pro - Documentación Completa

## 1. Visión General

**Calculadora de Costos 3D Pro** es una aplicación web integral diseñada para asistir a profesionales y entusiastas de la impresión 3D en la tarea de calcular con precisión los costos de producción y determinar precios de venta sugeridos.

La aplicación centraliza la gestión de todos los recursos y parámetros que influyen en el costo final de una pieza impresa, permitiendo un control financiero detallado y una toma de decisiones informada.

---

## 2. Secciones Principales de la Aplicación

La navegación se estructura en torno a dos áreas principales: el **Catálogo de Proyectos** y la **Configuración** de recursos.

### 2.1. Catálogo de Proyectos (`/projects`)
Es la pantalla principal y el centro de operaciones. Muestra todos los proyectos guardados en tarjetas interactivas.

- **Visualización en Tarjetas:** Cada proyecto presenta una vista rápida con su imagen, nombre, costo total y precios de venta sugeridos.
- **Carrusel de Imágenes:** Soporte para múltiples imágenes por proyecto.
- **Filtrado y Búsqueda:**
    - **Búsqueda por Nombre:** Un campo de texto para encontrar proyectos rápidamente.
    - **Filtrado por Etiquetas:** Permite seleccionar una o más etiquetas para acotar los resultados.
- **Acciones por Proyecto:**
    - **Editar/Recalcular:** Abre el proyecto en el formulario de cálculo para ajustar parámetros y ver el impacto de los costos actualizados.
    - **Eliminar:** Borra el proyecto del catálogo.
- **Acciones Globales:**
    - **Recalcular Todos:** Un botón que actualiza los costos de *todos* los proyectos con los precios más recientes de materiales, perfiles, etc.
    - **Administrar Etiquetas:** Abre un gestor para crear, editar y eliminar las etiquetas usadas en los proyectos.
    - **Nueva Calculación:** Acceso directo para crear un nuevo proyecto.

### 2.2. Nueva Calculación (`/projects/calculate`)
El corazón de la aplicación. Un formulario detallado para introducir los parámetros de una pieza y obtener un desglose completo de costos.

- **Datos del Proyecto:** Nombre, descripción, imágenes y etiquetas.
- **Parámetros de Impresión:**
    - Selección de **Material** y **Perfil de Impresora**.
    - Peso de la pieza y tiempo de impresión.
    - Tiempos de labor (operativa y post-procesado).
- **Accesorios:** Permite añadir componentes adicionales (tornillos, imanes, etc.) con sus cantidades.
- **Perfil de Venta:** Selección de un perfil para calcular los precios de venta en diferentes canales (ej: Venta Directa, Mercado Libre).
- **Resultados en Tiempo Real:** Al presionar "Calcular", se muestra un desglose detallado de todos los costos y los precios de venta sugeridos.
- **Guardado:** Si el cálculo es satisfactorio, se puede guardar el proyecto, que aparecerá en el Catálogo.

### 2.3. Configuración (Menú Desplegable)
Esta sección agrupa la gestión de todos los recursos y perfiles que alimentan la calculadora.

#### 2.3.1. Gestión de Materiales (`/materials`)
Permite la gestión (CRUD) de los filamentos o resinas.
- **Campos Clave:** Nombre, Costo por Kg, Peso del Spool (bobina), URL del producto.

#### 2.3.2. Gestión de Accesorios (`/accessories`)
Permite la gestión (CRUD) de componentes adicionales.
- **Campos Clave:** Nombre, Precio del Paquete, Unidades por Paquete, URL del producto. El costo por unidad se calcula automáticamente.

#### 2.3.3. Perfiles de Impresora (`/printer-profiles`)
Configuración de los parámetros de cada impresora.
- **Campos Clave:** Nombre del perfil, Modelo, Consumo energético (Watts), Costo de adquisición, Vida útil (horas), Porcentaje de fallas, y Costos de hora de labor (operativa y post-procesado).
- **Asociación Clave:** Cada perfil de impresora debe estar asociado a un **Perfil de Electricidad**.

#### 2.3.4. Perfiles de Electricidad (`/electricity-profiles`)
Permite definir diferentes tarifas eléctricas.
- **Campos Clave:** Nombre del perfil (ej: "Tarifa Edesur"), Consumo total de la factura (kWh) y Monto total pagado ($). El costo por kWh se calcula automáticamente.

#### 2.3.5. Perfiles de Venta (`/sales-profiles`)
Configuración de los canales de venta y sus costos asociados.
- **Campos Clave:** Nombre del perfil (ej: "Venta General", "Productos Premium").
- **Venta Directa:** Margen de ganancia deseado (%).
- **Mercado Libre:** Comisión variable (%) y Cargo fijo ($) por venta.

---

## 3. Detalle del Cálculo de Costos

La lógica de cálculo (`src/lib/calculation.ts`) combina todos los parámetros para ofrecer un resultado preciso.

1.  **Costo de Material:** `(CostoPorKg / 1000) * PesoPiezaGramos`
2.  **Costo de Electricidad:** `(ConsumoWatts / 1000) * TiempoImpresionHoras * CostoPorKWh`
3.  **Costo de Amortización:** `(CostoAdquisicionImpresora / VidaUtilHoras) * TiempoImpresionHoras`
4.  **Costos de Labor:** Se multiplica el tiempo de labor (operativa y post-procesado) por la tarifa/hora definida en el perfil de la impresora.
5.  **Costo de Accesorios:** Suma del `CostoPorUnidad` de cada accesorio multiplicado por la cantidad usada.
6.  **Subtotal y Contingencia:** Se suman todos los costos directos para obtener un subtotal. A este se le aplica el **Porcentaje de Fallas** para obtener el **Costo de Contingencia**.
7.  **Costo Total por Pieza:** `Subtotal + CostoContingencia`

### Cálculo de Precios de Venta

- **Precio Venta Directa:** `CostoTotalPieza * (1 + (MargenGanancia / 100))`
- **Precio Venta Mercado Libre:** Se calcula para que, después de descontar la **comisión variable** y el **cargo fijo** de ML, el vendedor reciba el `CostoTotalPieza` más su ganancia deseada.
  - **Fórmula:** `(CostoTotalPieza + GananciaDeseada + CargoFijoML) / (1 - (ComisionML / 100))`

---

## 4. Arquitectura y Flujo de Datos

- **Tecnologías:**
    - **Frontend:** Next.js (con App Router), React, TypeScript.
    - **UI:** Tailwind CSS y ShadCN para componentes.
    - **Estado y Lógica de Cliente:** React Hook Form para formularios.
- **Backend y Datos:**
    - **Lógica de Servidor:** Next.js Server Actions.
    - **Capa de Datos:** Se utiliza un **almacenamiento en memoria (mock store)** para simular una base de datos, lo que permite un desarrollo rápido sin necesidad de configurar una base de datos externa. **Importante: los datos se reinician con cada recarga del servidor.**

- **Flujo de Datos (Ejemplo: Guardar un Material):**
    1. El usuario rellena el formulario en `/materials/new`.
    2. El componente cliente (`MaterialForm.tsx`) valida los datos y llama a una **Server Action** (`saveMaterialAction`).
    3. La Server Action se ejecuta en el servidor y llama a la función `createMaterial` del servicio correspondiente (`material-service.ts`).
    4. El servicio interactúa con el `mockStore` para crear el registro en memoria.
    5. La Server Action devuelve una respuesta de éxito, y el cliente redirige y muestra una notificación (`toast`).

---

## 5. API Endpoints

### 5.1. Recalcular Todos los Proyectos

- **Ruta:** `/api/recalculate-all`
- **Método:** `GET`
- **Función:** Expone la funcionalidad del botón "Recalcular Todos" para que pueda ser invocada a través de una URL, ideal para automatización.
- **Parámetros de Consulta:**
    - `secret`: Una clave secreta para autorizar la ejecución. En desarrollo: `SUPER_SECRET_KEY`.
- **Respuesta Exitosa (200 OK):** JSON con `success: true` y la cantidad de proyectos actualizados.
- **Respuesta de Error:** 401 (No autorizado) o 500 (Error interno).
