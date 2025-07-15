
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateProjectCost } from '@/lib/calculation';
import { fetchMaterials } from '@/app/materials/actions';
import { fetchAccessories } from '@/app/accessories/actions';
import type { PrinterProfile } from '@/types';

const webhookSchema = z.object({
  materialId: z.string(),
  printerProfileId: z.string(),
  weightGrams: z.coerce.number().positive(),
  printTimeHours: z.coerce.number().positive(),
  postProcessingTimeHours: z.coerce.number().min(0).default(0),
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
      printTimeHours,
      postProcessingTimeHours,
      accessories: inputAccessories,
    } = validation.data;

    // Fetch master data
    const allMaterials = await fetchMaterials();
    const allAccessories = await fetchAccessories();
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
        tiempoImpresionHoras: printTimeHours,
        tiempoPostProcesadoHoras: postProcessingTimeHours,
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
