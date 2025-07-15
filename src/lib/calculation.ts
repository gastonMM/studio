
import type { Material, PrinterProfile, Accessory } from '@/types';
import type { z } from 'zod';
import type { projectSchema } from '@/app/projects/calculate/page'; // We can't import the schema itself, but we can use its inferred type.

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
    accessories: Accessory[]
) {
    const material = materials.find(m => m.id === values.materialUsadoId);
    const profile = printerProfiles.find(p => p.id === values.configuracionImpresoraIdUsada);

    if (!material || !profile) {
        // This case should be handled by the caller, but we return null for safety.
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

    const costoMaterialPieza = (material.costoPorKg / 1000) * pesoPiezaGramos;
    const costoElectricidadPieza = ((profile.consumoEnergeticoImpresoraWatts || 0) / 1000) * tiempoImpresionHoras * (profile.costoKWhElectricidad || 0);
    const tasaAmortizacion = (profile.costoAdquisicionImpresora || 0) / (profile.vidaUtilEstimadaHorasImpresora || 1); // Avoid division by zero
    const costoAmortizacionPieza = tasaAmortizacion * tiempoImpresionHoras;
    const costoLaborOperativaPieza = (profile.costoHoraLaborOperativa || 0) * tiempoLaborOperativaHoras;
    const costoLaborPostProcesadoPieza = (profile.costoHoraLaborPostProcesado || 0) * tiempoPostProcesadoHoras;

    let costoTotalAccesoriosPieza = 0;
    if (values.accesoriosUsadosEnProyecto) {
        for (const accInput of values.accesoriosUsadosEnProyecto) {
            const accDetails = accessories.find(a => a.id === accInput.accesorioId);
            if (!accDetails) {
                // If any accessory is not found, the calculation is invalid.
                console.error(`Accessory with ID ${accInput.accesorioId} not found.`);
                return null;
            }
            costoTotalAccesoriosPieza += (accDetails.costoPorUnidad || 0) * accInput.cantidadUsadaPorPieza;
        }
    }
    
    const subTotalCostoDirectoPieza = costoMaterialPieza + costoElectricidadPieza + costoAmortizacionPieza + costoLaborOperativaPieza + costoLaborPostProcesadoPieza + costoTotalAccesoriosPieza;
    const costoContingenciaFallasPieza = subTotalCostoDirectoPieza * ((profile.porcentajeFallasEstimado || 0) / 100);
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
