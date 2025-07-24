
import type { Material, PrinterProfile, Accessory, ElectricityProfile } from '@/types';

// This type mirrors the schema from the calculation page for type safety.
type CalculationInput = {
    materialUsadoId: string;
    configuracionImpresoraIdUsada: string;
    inputsOriginales: {
        pesoPiezaGramos: number;
        tiempoImpresionHoras: number;
        tiempoLaborOperativaHoras?: number;
        tiempoPostProcesadoHoras?: number;
        cantidadPiezasLote: number;
        margenGananciaDeseadoPorcentaje?: number;
    };
    accesoriosUsadosEnProyecto?: Array<{
        accesorioId: string;
        cantidadUsadaPorPieza: number;
    }>;
}

export function calculateProjectCost(
    values: CalculationInput,
    materials: Material[],
    printerProfiles: PrinterProfile[],
    accessories: Accessory[],
    electricityProfiles: ElectricityProfile[]
) {
    const material = materials.find(m => m.id === values.materialUsadoId);
    const printerProfile = printerProfiles.find(p => p.id === values.configuracionImpresoraIdUsada);

    if (!material || !printerProfile) {
        return null; 
    }
    
    const electricityProfile = electricityProfiles.find(ep => ep.id === printerProfile.electricityProfileId);
    if (!electricityProfile) {
        return null;
    }

    const { 
        pesoPiezaGramos, 
        tiempoImpresionHoras, 
        tiempoLaborOperativaHoras = 0,
        tiempoPostProcesadoHoras = 0, 
        cantidadPiezasLote, 
        margenGananciaDeseadoPorcentaje = 0 
    } = values.inputsOriginales;

    const costoKWh = electricityProfile.costoPorKWh;
    const costoMaterialPieza = (material.costoPorKg / 1000) * pesoPiezaGramos;
    const costoElectricidadPieza = ((printerProfile.consumoEnergeticoImpresoraWatts || 0) / 1000) * tiempoImpresionHoras * costoKWh;
    const tasaAmortizacion = (printerProfile.costoAdquisicionImpresora || 0) / (printerProfile.vidaUtilEstimadaHorasImpresora || 1); // Avoid division by zero
    const costoAmortizacionPieza = tasaAmortizacion * tiempoImpresionHoras;
    const costoLaborOperativaPieza = (printerProfile.costoHoraLaborOperativa || 0) * tiempoLaborOperativaHoras;
    const costoLaborPostProcesadoPieza = (printerProfile.costoHoraLaborPostProcesado || 0) * tiempoPostProcesadoHoras;

    let costoTotalAccesoriosPieza = 0;
    if (values.accesoriosUsadosEnProyecto) {
        for (const accInput of values.accesoriosUsadosEnProyecto) {
            const accDetails = accessories.find(a => a.id === accInput.accesorioId);
            if (!accDetails) {
                console.error(`Accessory with ID ${accInput.accesorioId} not found.`);
                return null;
            }
            costoTotalAccesoriosPieza += (accDetails.costoPorUnidad || 0) * accInput.cantidadUsadaPorPieza;
        }
    }
    
    const subTotalCostoDirectoPieza = costoMaterialPieza + costoElectricidadPieza + costoAmortizacionPieza + costoLaborOperativaPieza + costoLaborPostProcesadoPieza + costoTotalAccesoriosPieza;
    const costoContingenciaFallasPieza = subTotalCostoDirectoPieza * ((printerProfile.porcentajeFallasEstimado || 0) / 100);
    const costoTotalPieza = subTotalCostoDirectoPieza + costoContingenciaFallasPieza;
    const costoTotalLote = costoTotalPieza * cantidadPiezasLote;
    
    const precioVentaSugeridoPieza = costoTotalPieza * (1 + (margenGananciaDeseadoPorcentaje / 100));
    const precioVentaSugeridoLote = costoTotalLote * (1 + (margenGananciaDeseadoPorcentaje / 100));

    return {
      costoMaterialPieza, costoElectricidadPieza, costoAmortizacionPieza, costoLaborOperativaPieza, costoLaborPostProcesadoPieza,
      costoTotalAccesoriosPieza, subTotalCostoDirectoPieza, costoContingenciaFallasPieza, costoTotalPieza, costoTotalLote,
      precioVentaSugeridoPieza, precioVentaSugeridoLote
    };
}
