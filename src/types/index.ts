

export interface Material {
  id: string; // Corresponds to AUTO_INCREMENT PRIMARY KEY
  nombreMaterial: string;
  costoPorKg: number; // ARS
  pesoSpoolCompradoGramos: number; // Default: 1000g
  urlProducto?: string; // Link ML
  selectorPrecioCSS?: string; // Opcional
  densidad?: number; // g/cm³
  diametro?: number; // mm, e.g. 1.75 or 2.85
  fechaUltimaActualizacionCosto: Date; // Timestamp
  notasAdicionales?: string;
}

export interface Accessory {
  id: string; // Corresponds to AUTO_INCREMENT PRIMARY KEY
  nombreAccesorio: string;
  costoPorUnidad: number; // ARS (calculado)
  urlProducto?: string; // Link a la página donde se compra
  unidadesPorPaqueteEnLink: number; // Default: 1
  precioPaqueteObtenido: number; // ARS (obtenido de URL o manual)
  selectorPrecioCSS?: string; // Opcional
  fechaUltimaActualizacionCosto: Date; // Timestamp
  notasAdicionales?: string;
}

export interface ElectricityProfile {
  id: string;
  nombrePerfil: string;
  consumoMensualKWh: number;
  costoTotalFactura: number;
  costoPorKWh: number; // Calculated
}

export interface PrinterProfile {
  id: string; // Corresponds to AUTO_INCREMENT PRIMARY KEY
  nombrePerfilImpresora: string;
  modeloImpresora?: string; // Ej: "Creality Ender 3 Pro"
  consumoEnergeticoImpresoraWatts?: number; // Ej: 200W
  electricityProfileId?: string; // FK to ElectricityProfile
  costoAdquisicionImpresora?: number; // Ej: 1,200,000 ARS
  vidaUtilEstimadaHorasImpresora?: number; // Ej: 4000h
  tasaAmortizacionImpresoraPorHoraUso?: number; // calculado
  porcentajeFallasEstimado?: number; // Ej: 5% (input as 5, used as 0.05 in calcs)
  costoHoraLaborOperativa?: number; // ARS
  costoHoraLaborPostProcesado?: number; // ARS
  fechaUltimaActualizacionConfig: Date; // Timestamp
}

export interface SalesProfile {
  id: string;
  nombrePerfil: string;
  margenGananciaDirecta: number; // Porcentaje para venta directa
  comisionMercadoLibre: number; // Porcentaje de comisión de ML
  costoFijoMercadoLibre: number; // Costo fijo por venta de ML en ARS
}


export interface AccessoryInProject {
  accesorioId: string; // Referencia al accesorio
  cantidadUsadaPorPieza: number;
  costoUnitarioAlMomentoDelCalculo?: number; // Snapshot of cost
  // transient properties for display
  nombreAccesorio?: string; 
}

export interface Tag {
  id: string;
  name: string;
  color: string; // e.g., "#FF5733"
}

export interface Project {
  id: string; // Corresponds to AUTO_INCREMENT PRIMARY KEY
  nombreProyecto: string;
  descripcionProyecto?: string;
  imageUrls: string[]; // Stored as JSON string in DB
  tags: string[]; // Stored as an array of tag names
  fechaCreacion: Date;
  fechaUltimoCalculo: Date;
  
  materialUsadoId: string;
  configuracionImpresoraIdUsada: string;
  perfilVentaIdUsado: string;
  
  accesoriosUsadosEnProyecto: AccessoryInProject[]; // Stored as JSON string
  
  inputsOriginales: { // Stored as JSON string
    pesoPiezaGramos: number;
    tiempoImpresionHoras: number;
    tiempoLaborOperativaHoras?: number; // Opcional
    tiempoPostProcesadoHoras?: number; // Opcional
    cantidadPiezasLote: number; // Default: 1
  };
  
  resultadosCalculados?: { // Stored as JSON string
    costoMaterialPieza: number;
    costoElectricidadPieza: number;
    costoAmortizacionPieza: number;
    costoLaborOperativaPieza: number;
    costoLaborPostProcesadoPieza: number;
    costoTotalAccesoriosPieza: number;
    subTotalCostoDirectoPieza: number;
    costoContingenciaFallasPieza: number;
    costoTotalPieza: number;
    costoTotalLote: number;
    precioVentaDirecta?: number;
    precioVentaMercadoLibre?: number;
  };
  notasProyecto?: string;
}

// For react-hook-form, partial types are often useful
export type MaterialFormData = Omit<Material, 'id' | 'fechaUltimaActualizacionCosto'> & { id?: string };
export type AccessoryFormData = Omit<Accessory, 'id' | 'fechaUltimaActualizacionCosto' | 'costoPorUnidad'> & { id?: string };
export type ElectricityProfileFormData = Omit<ElectricityProfile, 'id' | 'costoPorKWh'> & { id?: string };
export type PrinterProfileFormData = Omit<PrinterProfile, 'id' | 'fechaUltimaActualizacionConfig' | 'tasaAmortizacionImpresoraPorHoraUso'> & { id?: string };
export type SalesProfileFormData = Omit<SalesProfile, 'id'> & { id?: string };
export type ProjectFormData = Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo' | 'resultadosCalculados'> & { id?: string };
export type TagFormData = Omit<Tag, 'id'>;

