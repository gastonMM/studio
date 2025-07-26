// Base types for form data, matching the old schema structure
export type MaterialFormData = { id?: string, nombreMaterial: string, costoPorKg: number, pesoSpoolCompradoGramos?: number, urlProducto?: string, selectorPrecioCSS?: string, densidad?: number, diametro?: number, notasAdicionales?: string };
export type AccessoryFormData = { id?: string, nombreAccesorio: string, precioPaqueteObtenido: number, unidadesPorPaqueteEnLink: number, urlProducto?: string, notasAdicionales?: string };
export type ElectricityProfileFormData = { id?: string, nombrePerfil: string, consumoMensualKWh: number, costoTotalFactura: number };
export type PrinterProfileFormData = { id?: string, nombrePerfilImpresora: string, modeloImpresora?: string, consumoEnergeticoImpresoraWatts?: number, electricityProfileId: string, costoAdquisicionImpresora?: number, vidaUtilEstimadaHorasImpresora?: number, porcentajeFallasEstimado?: number, costoHoraLaborOperativa?: number, costoHoraLaborPostProcesado?: number };
export type SalesProfileFormData = { id?: string, nombrePerfil: string, margenGananciaDirecta: number, comisionMercadoLibre: number, costoFijoMercadoLibre: number };
export type TagFormData = { id?: string, name: string, color: string };

// Data types as stored in the mock store (similar to DB models)
export type Material = MaterialFormData & { id: string, fechaUltimaActualizacionCosto: Date };
export type Accessory = AccessoryFormData & { id: string, fechaUltimaActualizacionCosto: Date, costoPorUnidad: number };
export type ElectricityProfile = ElectricityProfileFormData & { id: string, costoPorKWh: number };
export type PrinterProfile = PrinterProfileFormData & { id: string, fechaUltimaActualizacionConfig: Date, tasaAmortizacionImpresoraPorHoraUso?: number };
export type SalesProfile = SalesProfileFormData & { id: string };
export type Tag = TagFormData & { id: string };

export type AccessoryInProject = {
    id: string; // This would be the ID of the accessory itself
    projectId: string;
    accesorioId: string;
    cantidadUsadaPorPieza: number;
    costoUnitarioAlMomentoDelCalculo: number;
    // Include accessory details for easy access
    nombreAccesorio: string;
    costoPorUnidad: number;
};

export type Project = {
    id: string;
    nombreProyecto: string;
    descripcionProyecto?: string;
    imageUrls: string[];
    tags: string[];
    materialUsadoId: string;
    configuracionImpresoraIdUsada: string;
    perfilVentaIdUsado: string;
    inputsOriginales: {
        pesoPiezaGramos: number;
        tiempoImpresionHoras: number;
        tiempoLaborOperativaHoras?: number;
        tiempoPostProcesadoHoras?: number;
        cantidadPiezasLote: number;
    };
    accesoriosUsadosEnProyecto: AccessoryInProject[];
    resultadosCalculados?: {
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
    fechaCreacion: Date;
    fechaUltimoCalculo: Date;
};


// A hydrated project type that includes the full objects for related items.
// This is useful for client-side components.
export type ProjectWithRelations = Project & {
    // In the mock store, relations will be handled by the getProjectById/getProjects functions
};


// This is a representation of the data collected by the form before it's processed for the DB/store
export type ProjectFormDataForSumbit = Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo' | 'tags' | 'imageUrls' | 'inputsOriginales' | 'resultadosCalculados' | 'accesoriosUsadosEnProyecto'> & {
    id?: string,
    tags: string[],
    imageUrls: string[],
    inputsOriginales: {
        pesoPiezaGramos: number;
        tiempoImpresionHoras: number;
        tiempoLaborOperativaHoras?: number;
        tiempoPostProcesadoHoras?: number;
        cantidadPiezasLote: number;
    };
    accesoriosUsadosEnProyecto: {
        accesorioId: string;
        cantidadUsadaPorPieza: number;
        costoUnitarioAlMomentoDelCalculo?: number;
    }[];
     resultadosCalculados?: Project['resultadosCalculados'];
};
