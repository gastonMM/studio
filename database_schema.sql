-- Este archivo contiene las sentencias SQL para crear la estructura de tablas
-- necesaria para la aplicación "Calculadora Costos 3D Pro" en una base de datos MySQL.

-- Tabla para gestionar los materiales (filamentos, resinas, etc.)
CREATE TABLE `materials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombreMaterial` VARCHAR(255) NOT NULL,
  `costoPorKg` DECIMAL(10, 2) NOT NULL,
  `pesoSpoolCompradoGramos` INT NOT NULL DEFAULT 1000,
  `urlProducto` TEXT,
  `selectorPrecioCSS` VARCHAR(255),
  `densidad` DECIMAL(5, 2),
  `diametro` DECIMAL(4, 2),
  `fechaUltimaActualizacionCosto` DATETIME NOT NULL,
  `notasAdicionales` TEXT
);

-- Tabla para gestionar los accesorios (tornillos, imanes, etc.)
CREATE TABLE `accessories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombreAccesorio` VARCHAR(255) NOT NULL,
  `costoPorUnidad` DECIMAL(12, 4) NOT NULL,
  `urlProducto` TEXT,
  `unidadesPorPaqueteEnLink` INT NOT NULL DEFAULT 1,
  `precioPaqueteObtenido` DECIMAL(10, 2) NOT NULL,
  `selectorPrecioCSS` VARCHAR(255),
  `fechaUltimaActualizacionCosto` DATETIME NOT NULL,
  `notasAdicionales` TEXT
);

-- Tabla para gestionar los perfiles de las impresoras 3D
CREATE TABLE `printer_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombrePerfilImpresora` VARCHAR(255) NOT NULL,
  `modeloImpresora` VARCHAR(255),
  `consumoEnergeticoImpresoraWatts` INT,
  `costoKWhElectricidad` DECIMAL(10, 2),
  `costoAdquisicionImpresora` DECIMAL(12, 2),
  `vidaUtilEstimadaHorasImpresora` INT,
  `porcentajeFallasEstimado` DECIMAL(5, 2),
  `costoHoraLaborOperativa` DECIMAL(10, 2),
  `costoHoraLaborPostProcesado` DECIMAL(10, 2),
  `fechaUltimaActualizacionConfig` DATETIME NOT NULL
);

-- Tabla para guardar los proyectos/cálculos realizados
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombreProyecto` VARCHAR(255) NOT NULL,
  `imageUrls` JSON,
  `fechaCreacion` DATETIME NOT NULL,
  `fechaUltimoCalculo` DATETIME NOT NULL,
  `materialUsadoId` INT NOT NULL,
  `configuracionImpresoraIdUsada` INT NOT NULL,
  `accesoriosUsadosEnProyecto` JSON,
  `inputsOriginales` JSON,
  `resultadosCalculados` JSON,
  `notasProyecto` TEXT,
  FOREIGN KEY (`materialUsadoId`) REFERENCES `materials`(`id`),
  FOREIGN KEY (`configuracionImpresoraIdUsada`) REFERENCES `printer_profiles`(`id`)
);

