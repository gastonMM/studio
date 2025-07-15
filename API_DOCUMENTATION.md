
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

**Respuesta Exitosa (200 OK):**

```json
[
  { "id": "1", "nombreMaterial": "PLA Blanco Económico", "costoPorKg": 15000, ... },
  { "id": "2", "nombreMaterial": "PETG Negro Premium", "costoPorKg": 22000, ... }
]
```

### `GET /api/materials/{id}`

Obtiene un material específico por su ID.

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

**Respuesta Exitosa (200 OK):**
Retorna el objeto del material completo y actualizado.

### `DELETE /api/materials/{id}`

Elimina un material.

**Respuesta Exitosa (204 No Content):**
No devuelve contenido en el cuerpo de la respuesta.

---

## 3. Endpoints de Accesorios

### `GET /api/accessories`

Obtiene una lista de todos los accesorios.

**Respuesta Exitosa (200 OK):**

```json
[
  { "id": "acc1", "nombreAccesorio": "Argolla Llavero", "costoPorUnidad": 0.5, ... },
  { "id": "acc2", "nombreAccesorio": "Iman Neodimio 6x2mm", "costoPorUnidad": 20, ... }
]
```

### `GET /api/accessories/{id}`

Obtiene un accesorio específico por su ID.

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

**Respuesta Exitosa (200 OK):**
Retorna el objeto del accesorio completo y actualizado.

### `DELETE /api/accessories/{id}`

Elimina un accesorio.

**Respuesta Exitosa (204 No Content):**
No devuelve contenido en el cuerpo de la respuesta.

---

## 4. Endpoints de Catálogo de Proyectos

### `GET /api/projects`

Obtiene una lista de todos los proyectos guardados en el catálogo.

**Respuesta Exitosa (200 OK):**
Retorna un array de objetos de proyecto.

### `GET /api/projects/{id}`

Obtiene un proyecto específico del catálogo por su ID.

**Respuesta Exitosa (200 OK):**
Retorna el objeto completo del proyecto.

### `POST /api/projects`

Crea un nuevo proyecto en el catálogo. Es similar a `/api/calculate` pero este endpoint guarda el resultado.

**Body (raw JSON):**
El cuerpo de la solicitud debe contener todos los datos necesarios para calcular y guardar el proyecto, excluyendo los campos que se generan automáticamente (`id`, fechas).

**Respuesta Exitosa (201 Created):**
Retorna el objeto del proyecto recién creado y guardado.

### `PUT /api/projects/{id}`

Actualiza un proyecto existente en el catálogo.

**Body (raw JSON):**
Proporciona los campos del proyecto a actualizar.

**Respuesta Exitosa (200 OK):**
Retorna el objeto del proyecto completo y actualizado.

### `DELETE /api/projects/{id}`

Elimina un proyecto del catálogo.

**Respuesta Exitosa (204 No Content):**
No devuelve contenido en el cuerpo de la respuesta.
