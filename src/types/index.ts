import type { 
    Material as PrismaMaterial,
    Accessory as PrismaAccessory,
    ElectricityProfile as PrismaElectricityProfile,
    PrinterProfile as PrismaPrinterProfile,
    SalesProfile as PrismaSalesProfile,
    Tag as PrismaTag,
    Project as PrismaProject,
    AccessoryInProject as PrismaAccessoryInProject
} from '@prisma/client';
import type { ProjectWithRelations } from '@/services/project-service';

// Re-export Prisma types to be used throughout the application
export type Material = PrismaMaterial;
export type Accessory = PrismaAccessory;
export type ElectricityProfile = PrismaElectricityProfile;
export type PrinterProfile = PrismaPrinterProfile;
export type SalesProfile = PrismaSalesProfile;
export type Tag = PrismaTag;
export type Project = ProjectWithRelations; // Use the hydrated type for client components
export type AccessoryInProject = PrismaAccessoryInProject & { nombreAccesorio?: string };

// Form data types
// For react-hook-form, partial types are often useful
export type MaterialFormData = Omit<Material, 'id' | 'fechaUltimaActualizacionCosto'> & { id?: string };
export type AccessoryFormData = Omit<Accessory, 'id' | 'fechaUltimaActualizacionCosto' | 'costoPorUnidad'> & { id?: string };
export type ElectricityProfileFormData = Omit<ElectricityProfile, 'id' | 'costoPorKWh'> & { id?: string };
export type PrinterProfileFormData = Omit<PrinterProfile, 'id' | 'fechaUltimaActualizacionConfig' | 'tasaAmortizacionImpresoraPorHoraUso'> & { id?: string };
export type SalesProfileFormData = Omit<SalesProfile, 'id'> & { id?: string };
export type TagFormData = Omit<Tag, 'id'>;

// Project form data is more complex due to relations and JSON fields
// This is a representation of the data collected by the form before it's processed for the DB
export type ProjectFormDataForSumbit = Omit<PrismaProject, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo' | 'tags' | 'imageUrls' | 'inputsOriginales' | 'resultadosCalculados' | 'accesoriosUsadosEnProyecto'> & {
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
};
