
# Documentación Detallada - Calculadora Costos 3D Pro

## 1. Visión General

**Calculadora Costos 3D Pro** es una aplicación web integral diseñada para profesionales y entusiastas de la impresión 3D. Su objetivo principal es proporcionar una herramienta precisa y fácil de usar para calcular los costos de producción de piezas impresas en 3D y determinar precios de venta sugeridos, maximizando la rentabilidad.

La aplicación permite gestionar todos los recursos involucrados en el proceso de impresión: materiales (filamentos, resinas), accesorios (tornillos, imanes, etc.) y perfiles de impresora, para luego utilizarlos en cálculos detallados.

---

## 2. Secciones de la Aplicación (Componentes)

La aplicación está organizada en varias secciones principales, accesibles desde el menú de navegación lateral.

### 2.1. Gestión de Materiales
- **Ruta:** `/materials`
- **Función:** Permite la gestión completa (CRUD - Crear, Leer, Actualizar, Eliminar) de los materiales de impresión.
- **Campos Clave:**
    - `Nombre del Material`: Identificador descriptivo (ej: "PLA Rojo Brillante").
    - `Costo por Kg (ARS)`: El precio de compra del material. Es fundamental para el cálculo.
    - `Peso Spool Comprado (gramos)`: Generalmente 1000g, pero ajustable.
    - `Densidad (g/cm³)` y `Diámetro (mm)`: Parámetros técnicos del material.
- **Impacto:** Los datos aquí registrados son la base para el **Costo de Material** en cada cálculo.

### 2.2. Gestión de Accesorios
- **Ruta:** `/accessories`
- **Función:** Permite la gestión completa (CRUD) de componentes adicionales que no son el material de impresión.
- **Campos Clave:**
    - `Nombre del Accesorio`: Identificador (ej: "Imán de Neodimio 6x2mm").
    - `Precio del Paquete` y `Unidades por Paquete`: Se usan para calcular automáticamente el `Costo por Unidad`.
- **Impacto:** Permite añadir un costo adicional y preciso por cada accesorio utilizado en un proyecto.

### 2.3. Perfiles de Impresora
- **Ruta:** `/printer-profiles`
- **Función:** Centraliza la configuración de los parámetros relacionados con las impresoras 3D. Actualmente, existe un perfil por defecto.
- **Campos Clave:**
    - `Consumo Energético (Watts)`: Potencia de la impresora.
    - `Costo KWh Electricidad`: Tarifa eléctrica local.
    - `Costo Adquisición Impresora` y `Vida Útil Estimada (Horas)`: Se usan para calcular la amortización.
    - `Porcentaje de Fallas (%)`: Un colchón para impresiones fallidas.
    - `Costo Hora Labor`: Tarifas para el trabajo manual.
- **Impacto:** Estos datos son cruciales para calcular los costos de **electricidad, amortización, fallas y labor**.

### 2.4. Nueva Calculación
- **Ruta:** `/projects/calculate`
- **Función:** Es el corazón de la aplicación. Un formulario detallado donde el usuario introduce los parámetros de una pieza específica para obtener un desglose completo de costos.
- **Proceso:**
    1. El usuario completa los datos del proyecto: nombre, peso, tiempo de impresión, etc.
    2. Selecciona un material y un perfil de impresora de los previamente registrados.
    3. Opcionalmente, añade los accesorios utilizados.
    4. Al presionar "Calcular Costos", la aplicación ejecuta la lógica de cálculo y muestra los resultados en tiempo real.
    5. Si el resultado es satisfactorio, el usuario puede presionar "Guardar Cálculo" para añadir el proyecto al Catálogo.
- **Imágenes del Proyecto**: Permite subir múltiples imágenes que se convierten a formato PNG y se redimensionan a un máximo de 1024px.
- **Etiquetas**: Permite asignar etiquetas existentes o crear nuevas sobre la marcha para organizar los proyectos.

### 2.5. Catálogo
- **Ruta:** `/projects`
- **Función:** Muestra todos los proyectos que han sido guardados desde la sección "Nueva Calculación". Funciona como un catálogo de productos finalizados.
- **Características:**
    - **Vista de Tarjetas:** Cada proyecto se muestra en una tarjeta visualmente atractiva.
    - **Carrusel de Imágenes:** Si un proyecto tiene múltiples imágenes, se muestran en un carrusel interactivo con botones de navegación (flechas a izquierda y derecha) que permiten al usuario desplazarse entre ellas.
    - **Información Rápida:** Se muestra el nombre, costo total y precios de venta sugeridos para cada canal (Directa, ML).
    - **Descripción**: Muestra una descripción corta del proyecto si fue proporcionada.
    - **Etiquetas**: Muestra las etiquetas asociadas al proyecto con sus respectivos colores.
    - **Acciones por Tarjeta:**
        - **Editar/Recalcular:** Abre el proyecto en el formulario de cálculo para ajustar parámetros.
        - **Eliminar:** Borra el proyecto del catálogo.
    - **Acciones Globales:**
        - **Recalcular Todos:** Un botón global que actualiza los costos de todos los proyectos del catálogo con los precios más recientes de materiales, perfiles, etc.
        - **Administrar Etiquetas:** Abre un diálogo para gestionar todas las etiquetas. Permite crear, editar (nombre y color) y eliminar etiquetas.
        - **Filtros:** Permite buscar proyectos por nombre y/o filtrar por una o más etiquetas.

---

## 3. Detalle del Cálculo de Costos

La fórmula de cálculo se ejecuta en el servidor (en `src/lib/calculation.ts`) y se compone de varios elementos clave para asegurar la precisión.

#### 1. **Costo del Material por Pieza**
   - **Fórmula:** `(CostoPorKg / 1000) * PesoPiezaGramos`
   - **Explicación:** Se calcula el costo por gramo del material seleccionado y se multiplica por el peso de la pieza.

#### 2. **Costo de Electricidad por Pieza**
   - **Fórmula:** `(ConsumoWatts / 1000) * TiempoImpresionHoras * CostoKWh`
   - **Explicación:** Se convierte el consumo de la impresora a Kilowatts, se multiplica por las horas de impresión para obtener el consumo total en kWh, y finalmente se multiplica por la tarifa eléctrica.

#### 3. **Costo de Amortización de la Impresora**
   - **Tasa de Amortización por Hora:** `CostoAdquisicionImpresora / VidaUtilEstimadaHoras`
   - **Fórmula por Pieza:** `TasaAmortizacionPorHora * TiempoImpresionHoras`
   - **Explicación:** Se distribuye el costo de la impresora a lo largo de su vida útil. Cada hora de impresión "gasta" una porción del valor de la máquina.

#### 4. **Costo de Labor Operativa**
   - **Fórmula:** `CostoHoraLaborOperativa * TiempoLaborOperativaHoras`
   - **Explicación:** Cuantifica el costo del tiempo dedicado a preparar la impresión (cargar filamento, preparar la cama, etc.).

#### 5. **Costo de Labor de Post-Procesado**
   - **Fórmula:** `CostoHoraLaborPostProcesado * TiempoPostProcesadoHoras`
   - **Explicación:** Cuantifica el costo del trabajo manual después de la impresión (quitar soportes, lijar, pintar, ensamblar).

#### 6. **Costo Total de Accesorios**
   - **Fórmula:** `SUMA(CostoPorUnidad_Accesorio * CantidadUsada_Accesorio)`
   - **Explicación:** Se suma el costo de todos los accesorios añadidos al proyecto.

#### 7. **Cálculos Finales**
   - **Subtotal Costo Directo:** Es la suma de los puntos 1 al 6.
   - **Costo de Contingencia por Fallas:** `SubtotalCostoDirecto * (PorcentajeFallas / 100)`
     - **Explicación:** Un margen para cubrir el costo de impresiones fallidas.
   - **Costo Total por Pieza:** `SubtotalCostoDirecto + CostoContingenciaFallas`
     - **Explicación:** El costo final y real de producir una sola unidad de la pieza.
   - **Precio de Venta Sugerido por Pieza:** `CostoTotalPieza * (1 + (MargenGanancia / 100))`
     - **Explicación:** Se aplica el margen de ganancia deseado sobre el costo total para obtener el precio de venta final.

---

## 4. Arquitectura y Flujo de Datos

### 4.1. Tecnologías
- **Frontend:**
    - **Framework:** Next.js 14+ con App Router.
    - **Lenguaje:** TypeScript.
    - **UI y Estilos:**
        - **Tailwind CSS:** Para un enfoque "utility-first" en los estilos.
        - **ShadCN:** Para un conjunto de componentes UI reutilizables y accesibles, construidos sobre Radix UI. La configuración del tema se encuentra en `src/app/globals.css`.
    - **Gestión de Formularios:** Se utiliza `React Hook Form` para la gestión de formularios complejos, junto con `Zod` para la validación de esquemas tanto en el cliente como en el servidor.

- **Backend:**
    - **Lógica de Servidor:** Se emplean **Next.js Server Actions** para todas las operaciones de mutación de datos (Crear, Actualizar, Eliminar). Esto permite llamar a funciones del servidor directamente desde los componentes de cliente, simplificando la arquitectura al no necesitar una capa de API tradicional.

- **Capa de Datos:**
    - **Almacenamiento en Memoria (`mock store`)**: Para facilitar el desarrollo y evitar dependencias de bases de datos externas, la aplicación utiliza un "mock store" que se encuentra en `src/services/mock-store.ts`.
    - **Importante**: Este enfoque implica que **todos los datos se reinician cada vez que el servidor de desarrollo se recarga**. Es ideal para prototipado y desarrollo, pero debería ser reemplazado por una base de datos persistente (como Firestore, Supabase o una base de datos SQL) para un entorno de producción.

### 4.2. Flujo de Datos (Ejemplo: Guardar un Material)
El siguiente diagrama ilustra el flujo de datos desde la interacción del usuario hasta el guardado de la información:

1.  **Usuario (Cliente)**: El usuario interactúa con el formulario en la ruta `/materials/new`.
2.  **Componente React (`MaterialForm.tsx`)**:
    *   Este es un **Componente de Cliente** (`"use client"`).
    *   Utiliza `React Hook Form` para gestionar el estado del formulario, las entradas del usuario y la validación en tiempo real.
    *   `Zod` define el esquema de validación que se comparte entre cliente y servidor.
3.  **Envío del Formulario**:
    *   Al presionar "Guardar", el evento `onSubmit` del formulario se activa.
    *   El componente llama a la **Server Action** `saveMaterialAction`, pasándole los datos del formulario ya validados por Zod.
4.  **Server Action (`/materials/actions.ts`)**:
    *   Esta función, marcada con `"use server"`, se ejecuta **exclusivamente en el servidor**.
    *   Recibe los datos del formulario y actúa como un controlador.
5.  **Capa de Servicio (`/services/material-service.ts`)**:
    *   La Server Action invoca a la función `createMaterial` del servicio correspondiente.
    *   Esta capa de abstracción contiene la lógica de negocio principal. Por ejemplo, podría realizar validaciones adicionales o transformar los datos antes de guardarlos.
6.  **Capa de Datos (`/services/mock-store.ts`)**:
    *   El servicio interactúa con la instancia del `mockStore` para crear un nuevo registro de material en el mapa de memoria.
7.  **Respuesta y Actualización de UI**:
    *   La Server Action retorna un objeto indicando el resultado (`{ success: true }` o `{ success: false, error: '...' }`).
    *   El componente cliente (`MaterialForm.tsx`) recibe esta respuesta de forma asíncrona.
    *   Si la operación fue exitosa, utiliza el `router` de `next/navigation` para redirigir al usuario (ej: de vuelta a `/materials`) y muestra una notificación de éxito (`toast`).
    *   Si hubo un error, muestra un `toast` con el mensaje de error devuelto por el servidor.
    *   Se llama a `revalidatePath` en la Server Action para que Next.js invalide la caché y obtenga los datos actualizados en la página de listado.

---

## 5. API Endpoints

### 5.1. Recalcular Todos los Proyectos

- **Ruta:** `/api/recalculate-all`
- **Método:** `GET`
- **Función:** Expone la funcionalidad del botón "Recalcular Todos" para que pueda ser invocada a través de una URL. Esto es ideal para la automatización (por ejemplo, con un `cron job`) para mantener los precios de todos los proyectos actualizados.

- **Parámetros de Consulta (Query Params):**
    - `secret` (obligatorio): Una clave secreta para autorizar la ejecución y prevenir el uso no autorizado del endpoint. Para el entorno de desarrollo, el valor por defecto es `SUPER_SECRET_KEY`.
    - **Ejemplo de URL:** `https://<dominio>/api/recalculate-all?secret=SUPER_SECRET_KEY`

- **Respuesta Exitosa (200 OK):**
  Un objeto JSON que confirma el éxito de la operación y la cantidad de proyectos actualizados.
  ```json
  {
    "success": true,
    "message": "Recalculados 5 proyectos exitosamente.",
    "count": 5
  }
  ```

- **Respuestas de Error:**
    - **401 No Autorizado:** Si el parámetro `secret` es incorrecto o no se proporciona.
      ```json
      {
        "error": "No autorizado."
      }
      ```
    - **500 Error Interno del Servidor:** Si ocurre un problema durante el proceso de recálculo.
      ```json
      {
        "success": false,
        "error": "Mensaje detallado del error."
      }
      ```
