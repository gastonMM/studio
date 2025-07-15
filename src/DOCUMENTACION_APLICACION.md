
# Documentación Detallada - Calculadora Costos 3D Pro

## 1. Visión General

**Calculadora Costos 3D Pro** es una aplicación web integral diseñada para profesionales y entusiastas de la impresión 3D. Su objetivo principal es proporcionar una herramienta precisa y fácil de usar para calcular los costos de producción de piezas impresas en 3D y determinar precios de venta sugeridos, maximizando la rentabilidad.

La aplicación permite gestionar todos los recursos involucrados en el proceso de impresión: materiales (filamentos, resinas), accesorios (tornillos, imanes, etc.) y perfiles de impresora, para luego utilizarlos en cálculos detallados.

---

## 2. Secciones de la Aplicación (Componentes)

La aplicación está organizada en varias secciones principales, accesibles desde el menú de navegación lateral.

### 2.1. Dashboard (Página de Inicio)
- **Ruta:** `/`
- **Función:** Es la página de bienvenida. Ofrece una vista rápida y resumida del estado actual de la aplicación, mostrando tarjetas con estadísticas clave (ej: total de proyectos, materiales registrados). También sirve como punto de partida para que los nuevos usuarios entiendan las capacidades de la herramienta.

### 2.2. Gestión de Materiales
- **Ruta:** `/materials`
- **Función:** Permite la gestión completa (CRUD - Crear, Leer, Actualizar, Eliminar) de los materiales de impresión.
- **Campos Clave:**
    - `Nombre del Material`: Identificador descriptivo (ej: "PLA Rojo Brillante").
    - `Costo por Kg (ARS)`: El precio de compra del material. Es fundamental para el cálculo.
    - `Peso Spool Comprado (gramos)`: Generalmente 1000g, pero ajustable.
    - `Densidad (g/cm³)` y `Diámetro (mm)`: Parámetros técnicos del material.
- **Impacto:** Los datos aquí registrados son la base para el **Costo de Material** en cada cálculo.

### 2.3. Gestión de Accesorios
- **Ruta:** `/accessories`
- **Función:** Permite la gestión completa (CRUD) de componentes adicionales que no son el material de impresión.
- **Campos Clave:**
    - `Nombre del Accesorio`: Identificador (ej: "Imán de Neodimio 6x2mm").
    - `Precio del Paquete` y `Unidades por Paquete`: Se usan para calcular automáticamente el `Costo por Unidad`.
- **Impacto:** Permite añadir un costo adicional y preciso por cada accesorio utilizado en un proyecto.

### 2.4. Perfiles de Impresora
- **Ruta:** `/printer-profiles`
- **Función:** Centraliza la configuración de los parámetros relacionados con las impresoras 3D. Actualmente, existe un perfil por defecto.
- **Campos Clave:**
    - `Consumo Energético (Watts)`: Potencia de la impresora.
    - `Costo KWh Electricidad`: Tarifa eléctrica local.
    - `Costo Adquisición Impresora` y `Vida Útil Estimada (Horas)`: Se usan para calcular la amortización.
    - `Porcentaje de Fallas (%)`: Un colchón para impresiones fallidas.
    - `Costo Hora Labor`: Tarifas para el trabajo manual.
- **Impacto:** Estos datos son cruciales para calcular los costos de **electricidad, amortización, fallas y labor**.

### 2.5. Nueva Calculación
- **Ruta:** `/projects/calculate`
- **Función:** Es el corazón de la aplicación. Un formulario detallado donde el usuario introduce los parámetros de una pieza específica para obtener un desglose completo de costos.
- **Proceso:**
    1. El usuario completa los datos del proyecto: nombre, peso, tiempo de impresión, etc.
    2. Selecciona un material y un perfil de impresora de los previamente registrados.
    3. Opcionalmente, añade los accesorios utilizados.
    4. Al presionar "Calcular Costos", la aplicación ejecuta la lógica de cálculo y muestra los resultados en tiempo real.
    5. Si el resultado es satisfactorio, el usuario puede presionar "Guardar Cálculo" para añadir el proyecto al Catálogo.

### 2.6. Catálogo
- **Ruta:** `/projects`
- **Función:** Muestra todos los proyectos que han sido guardados desde la sección "Nueva Calculación". Funciona como un catálogo de productos finalizados.
- **Características:**
    - **Vista de Tarjetas:** Cada proyecto se muestra en una tarjeta visualmente atractiva.
    - **Carrusel de Imágenes:** Si un proyecto tiene múltiples imágenes, se muestran en un carrusel interactivo.
    - **Información Rápida:** Se muestra el nombre, costo total y precio de venta sugerido.
    - **Acciones:** Cada tarjeta tiene botones para:
        - **Editar/Recalcular:** Abre el proyecto en el formulario de cálculo para ajustar parámetros.
        - **Eliminar:** Borra el proyecto del catálogo (y de la base de datos).

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
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, ShadCN (para componentes UI).
- **Backend:** Next.js API Routes (Serverless Functions).
- **Base de Datos:** MySQL.
- **Comunicación con BD:** Paquete `mysql2`.

### 4.2. Flujo de Datos (Ejemplo: Guardar un Material)
1. **Usuario:** Interactúa con el formulario en la ruta `/materials/new`.
2. **Componente Cliente (React):** El formulario (`MaterialForm.tsx`) gestiona el estado y la validación de los campos.
3. **Envío:** Al presionar "Guardar", el componente llama a una **Server Action** (`saveMaterialAction`).
4. **Server Action (`actions.ts`):** Esta función se ejecuta exclusivamente en el servidor. Recibe los datos del formulario.
5. **Capa de Servicio (`material-service.ts`):** La Server Action invoca a la función `createMaterial` del servicio correspondiente.
6. **Capa de Base de Datos (`db.ts`):** El servicio utiliza la conexión a la base de datos para ejecutar una consulta `INSERT` en la tabla `materials`.
7. **Respuesta:** La base de datos responde, el servicio devuelve el nuevo material creado, la Server Action retorna un estado de éxito, y el componente cliente redirige al usuario y muestra una notificación (`toast`).

### 4.3. API REST
La aplicación también expone una API REST para la gestión programática de los recursos. La documentación detallada de los endpoints y ejemplos con `cURL` se encuentra a continuación.

---

# Documentación de la API - Calculadora Costos 3D Pro

Esta API permite interactuar con los recursos de la aplicación de forma programática. Todas las respuestas son en formato JSON.

## Autenticación

Actualmente, la API es abierta. En un futuro, se implementará un sistema de claves de API.

---

## 1. Endpoints de Cálculo

### `POST /api/calculate`

Calcula el costo y el precio de venta de un proyecto sin guardarlo.

**Body (raw JSON):**

```json
{
  "materialId": "1",
  "printerProfileId": "pp1",
  "weightGrams": 25.5,
  "printTimeHours": "03:30",
  "laborTimeHours": "00:10",
  "postProcessingTimeHours": "00:20",
  "accessories": [
    { "accessoryId": "acc1", "quantity": 1 },
    { "accessoryId": "acc2", "quantity": 4 }
  ]
}
```

- `printTimeHours`, `laborTimeHours`, `postProcessingTimeHours` deben estar en formato `"HH:MM"`.
- `laborTimeHours` y `postProcessingTimeHours` son opcionales.

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:9002/api/calculate \
-H "Content-Type: application/json" \
-d '{
  "materialId": "1",
  "printerProfileId": "pp1",
  "weightGrams": 25.5,
  "printTimeHours": "03:30",
  "laborTimeHours": "00:10",
  "postProcessingTimeHours": "00:20",
  "accessories": [
    { "accessoryId": "acc1", "quantity": 1 },
    { "accessoryId": "acc2", "quantity": 4 }
  ]
}'
```

**Respuesta Exitosa (200 OK):**

```json
{
    "costoMaterialPieza": 382.5,
    "costoElectricidadPieza": 28,
    "costoAmortizacionPieza": 1050,
    "costoLaborOperativaPieza": 416.6666666666667,
    "costoLaborPostProcesadoPieza": 666.6666666666666,
    "costoTotalAccesoriosPieza": 80.5,
    "subTotalCostoDirectoPieza": 2624.3333333333335,
    "costoContingenciaFallasPieza": 131.21666666666667,
    "costoTotalPieza": 2755.55,
    "costoTotalLote": 2755.55,
    "precioVentaSugeridoPieza": 3582.215,
    "precioVentaSugeridoLote": 3582.215
}
```

---

## 2. Endpoints de Materiales

### `GET /api/materials`

Obtiene una lista de todos los materiales.

**Ejemplo con cURL:**
```bash
curl http://localhost:9002/api/materials
```

**Respuesta Exitosa (200 OK):**

```json
[
  { "id": "1", "nombreMaterial": "PLA Blanco Económico", "costoPorKg": 15000, ... },
  { "id": "2", "nombreMaterial": "PETG Negro Premium", "costoPorKg": 22000, ... }
]
```

### `GET /api/materials/{id}`

Obtiene un material específico por su ID.

**Ejemplo con cURL:**
```bash
curl http://localhost:9002/api/materials/1
```

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "1",
  "nombreMaterial": "PLA Blanco Económico",
  "costoPorKg": 15000,
  "pesoSpoolCompradoGramos": 1000,
  ...
}
```

**Respuesta de Error (404 Not Found):**
Si el ID no existe.

### `POST /api/materials`

Crea un nuevo material.

**Body (raw JSON):**
Los campos `id` y `fechaUltimaActualizacionCosto` son ignorados, se generan automáticamente.

```json
{
  "nombreMaterial": "ABS Naranja",
  "costoPorKg": 18000,
  "pesoSpoolCompradoGramos": 750,
  "densidad": 1.04
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:9002/api/materials \
-H "Content-Type: application/json" \
-d '{
  "nombreMaterial": "ABS Naranja",
  "costoPorKg": 18000,
  "pesoSpoolCompradoGramos": 750,
  "densidad": 1.04
}'
```

**Respuesta Exitosa (201 Created):**
Retorna el objeto del material recién creado, incluyendo su nuevo `id`.

### `PUT /api/materials/{id}`

Actualiza un material existente.

**Body (raw JSON):**
Proporciona los campos a actualizar. Los campos no proporcionados no se modificarán.

```json
{
  "costoPorKg": 18500,
  "notasAdicionales": "Proveedor actualizado."
}
```

**Ejemplo con cURL:**
```bash
curl -X PUT http://localhost:9002/api/materials/1 \
-H "Content-Type: application/json" \
-d '{
  "costoPorKg": 18500,
  "notasAdicionales": "Proveedor actualizado."
}'
```

**Respuesta Exitosa (200 OK):**
Retorna el objeto del material completo y actualizado.

### `DELETE /api/materials/{id}`

Elimina un material.

**Ejemplo con cURL:**
```bash
curl -X DELETE http://localhost:9002/api/materials/1
```

**Respuesta Exitosa (204 No Content):**
No devuelve contenido en el cuerpo de la respuesta.

---

## 3. Endpoints de Accesorios

### `GET /api/accessories`

Obtiene una lista de todos los accesorios.

**Ejemplo con cURL:**
```bash
curl http://localhost:9002/api/accessories
```

**Respuesta Exitosa (200 OK):**

```json
[
  { "id": "acc1", "nombreAccesorio": "Argolla Llavero", "costoPorUnidad": 0.5, ... },
  { "id": "acc2", "nombreAccesorio": "Iman Neodimio 6x2mm", "costoPorUnidad": 20, ... }
]
```

### `GET /api/accessories/{id}`

Obtiene un accesorio específico por su ID.

**Ejemplo con cURL:**
```bash
curl http://localhost:9002/api/accessories/acc1
```

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "acc1",
  "nombreAccesorio": "Argolla Llavero",
  ...
}
```

### `POST /api/accessories`

Crea un nuevo accesorio. `costoPorUnidad` se calcula automáticamente.

**Body (raw JSON):**

```json
{
  "nombreAccesorio": "Tornillo M3x10",
  "precioPaqueteObtenido": 1500,
  "unidadesPorPaqueteEnLink": 100,
  "urlProducto": "https://ejemplo.com/tornillos"
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:9002/api/accessories \
-H "Content-Type: application/json" \
-d '{
  "nombreAccesorio": "Tornillo M3x10",
  "precioPaqueteObtenido": 1500,
  "unidadesPorPaqueteEnLink": 100,
  "urlProducto": "https://ejemplo.com/tornillos"
}'
```

**Respuesta Exitosa (201 Created):**
Retorna el objeto del accesorio recién creado, incluyendo su `id` y el `costoPorUnidad` calculado.

### `PUT /api/accessories/{id}`

Actualiza un accesorio. Si `precioPaqueteObtenido` o `unidadesPorPaqueteEnLink` cambian, `costoPorUnidad` se recalcula.

**Body (raw JSON):**

```json
{
  "precioPaqueteObtenido": 1650
}
```

**Ejemplo con cURL:**
```bash
curl -X PUT http://localhost:9002/api/accessories/acc1 \
-H "Content-Type: application/json" \
-d '{
  "precioPaqueteObtenido": 1650
}'
```

**Respuesta Exitosa (200 OK):**
Retorna el objeto del accesorio completo y actualizado.

### `DELETE /api/accessories/{id}`

Elimina un accesorio.

**Ejemplo con cURL:**
```bash
curl -X DELETE http://localhost:9002/api/accessories/acc1
```

**Respuesta Exitosa (204 No Content):**
No devuelve contenido en el cuerpo de la respuesta.

---

## 4. Endpoints de Catálogo de Proyectos

### `GET /api/projects`

Obtiene una lista de todos los proyectos guardados en el catálogo.

**Ejemplo con cURL:**
```bash
curl http://localhost:9002/api/projects
```

**Respuesta Exitosa (200 OK):**
Retorna un array de objetos de proyecto.

### `GET /api/projects/{id}`

Obtiene un proyecto específico del catálogo por su ID.

**Ejemplo con cURL:**
```bash
curl http://localhost:9002/api/projects/proj1
```

**Respuesta Exitosa (200 OK):**
Retorna el objeto completo del proyecto.

### `POST /api/projects`

Crea un nuevo proyecto en el catálogo. Es similar a `/api/calculate` pero este endpoint guarda el resultado. El cuerpo de la solicitud es complejo ya que contiene el objeto completo del proyecto, incluyendo los resultados calculados.

**Body (raw JSON):**
El cuerpo de la solicitud debe contener todos los datos necesarios para guardar el proyecto. El cálculo debe realizarse en el cliente (o con `/api/calculate`) y luego enviar el objeto completo a este endpoint.

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:9002/api/projects \
-H "Content-Type: application/json" \
-d '{
  "nombreProyecto": "Llavero de Prueba API",
  "imageUrls": ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."],
  "materialUsadoId": "1",
  "configuracionImpresoraIdUsada": "pp1",
  "accesoriosUsadosEnProyecto": [],
  "inputsOriginales": {
    "pesoPiezaGramos": 10,
    "tiempoImpresionHoras": 1,
    "cantidadPiezasLote": 1,
    "margenGananciaDeseadoPorcentaje": 30
  },
  "resultadosCalculados": {
    "costoMaterialPieza": 150,
    "costoElectricidadPieza": 8,
    "costoAmortizacionPieza": 300,
    "costoLaborOperativaPieza": 0,
    "costoLaborPostProcesadoPieza": 0,
    "costoTotalAccesoriosPieza": 0,
    "subTotalCostoDirectoPieza": 458,
    "costoContingenciaFallasPieza": 22.9,
    "costoTotalPieza": 480.9,
    "costoTotalLote": 480.9,
    "precioVentaSugeridoPieza": 625.17,
    "precioVentaSugeridoLote": 625.17
  }
}'
```

**Respuesta Exitosa (201 Created):**
Retorna el objeto del proyecto recién creado y guardado.

### `PUT /api/projects/{id}`

Actualiza un proyecto existente en el catálogo.

**Body (raw JSON):**
Proporciona los campos del proyecto a actualizar.

**Ejemplo con cURL:**
```bash
curl -X PUT http://localhost:9-d '{
  "nombreProyecto": "Nombre Actualizado del Llavero"
}'
```

**Respuesta Exitosa (200 OK):**
Retorna el objeto del proyecto completo y actualizado.

### `DELETE /api/projects/{id}`

Elimina un proyecto del catálogo.

**Ejemplo con cURL:**
```bash
curl -X DELETE http://localhost:9002/api/projects/proj1
```

**Respuesta Exitosa (204 No Content):**
No devuelve contenido en el cuerpo de la respuesta.
