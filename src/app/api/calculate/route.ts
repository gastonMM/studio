
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateProjectCost } from '@/lib/calculation';
import { getMaterials } from '@/services/material-service';
import { getAccessories } from '@/services/accessory-service';
import type { PrinterProfile } from '@/types';

const hhmmToHours = (hhmm: string): number => {
    if (!hhmm || !hhmm.includes(':')) return 0;
    const [hours, minutes] = hhmm.split(':').map(Number);
    return (hours || 0) + ((minutes || 0) / 60);
};

const webhookSchema = z.object({
  materialId: z.string(),
  printerProfileId: z.string(),
  weightGrams: z.coerce.number().positive(),
  printTimeHours: z.string().regex(/^\d{1,3}:\d{2}$/, "El formato debe ser HH:MM."),
  laborTimeHours: z.string().regex(/^\d{1,3}:\d{2}$/, "El formato debe ser HH:MM.").optional().default("00:00"),
  postProcessingTimeHours: z.string().regex(/^\d{1,3}:\d{2}$/, "El formato debe ser HH:MM.").optional().default("00:00"),
  accessories: z.array(z.object({
    accessoryId: z.string(),
    quantity: z.coerce.number().int().positive(),
  })).optional().default([]),
});

// Mocked data as actions for these don't exist yet
const mockPrinterProfiles: PrinterProfile[] = [
  { id: "pp1", nombrePerfilImpresora: "Ender 3 Pro - Standard", consumoEnergeticoImpresoraWatts: 200, costoKWhElectricidad: 40, costoAdquisicionImpresora: 1200000, vidaUtilEstimadaHorasImpresora: 4000, porcentajeFallasEstimado: 5, costoHoraLaborOperativa: 2500, costoHoraLaborPostProcesado: 2000, fechaUltimaActualizacionConfig: new Date() },
];

async function fetchPrinterProfiles(): Promise<PrinterProfile[]> {
    return mockPrinterProfiles;
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = webhookSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validation.error.formErrors }, { status: 400 });
    }

    const {
      materialId,
      printerProfileId,
      weightGrams,
      printTimeHours: printTimeHHMM,
      laborTimeHours: laborTimeHHMM,
      postProcessingTimeHours: postProcessingTimeHHMM,
      accessories: inputAccessories,
    } = validation.data;

    // Fetch master data
    const allMaterials = await getMaterials();
    const allAccessories = await getAccessories();
    const allPrinterProfiles = await fetchPrinterProfiles();

    const material = allMaterials.find(m => m.id === materialId);
    const printerProfile = allPrinterProfiles.find(p => p.id === printerProfileId);
    
    if (!material) {
        return NextResponse.json({ error: `Material with id ${materialId} not found` }, { status: 404 });
    }
    if (!printerProfile) {
        return NextResponse.json({ error: `Printer profile with id ${printerProfileId} not found` }, { status: 404 });
    }
    
    // Structure data for calculation function
    const calculationInput = {
      materialUsadoId: materialId,
      configuracionImpresoraIdUsada: printerProfileId,
      inputsOriginales: {
        pesoPiezaGramos: weightGrams,
        tiempoImpresionHoras: hhmmToHours(printTimeHHMM),
        tiempoLaborOperativaHoras: hhmmToHours(laborTimeHHMM),
        tiempoPostProcesadoHoras: hhmmToHours(postProcessingTimeHHMM),
        cantidadPiezasLote: 1, // Webhook calculates for a single piece
      },
      accesoriosUsadosEnProyecto: inputAccessories.map(acc => ({
          accesorioId: acc.accessoryId,
          cantidadUsadaPorPieza: acc.quantity
      }))
    };
    
    const results = calculateProjectCost(calculationInput, allMaterials, allPrinterProfiles, allAccessories);

    if (!results) {
       return NextResponse.json({ error: 'Could not calculate cost. Check accessory IDs.' }, { status: 400 });
    }

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("Webhook calculation error:", error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
