
import { NextResponse } from 'next/server';
import { getMaterials, createMaterial } from '@/services/material-service';
import { z } from 'zod';
import type { MaterialFormData } from '@/types';

const materialSchema = z.object({
  nombreMaterial: z.string().min(1),
  costoPorKg: z.number().positive(),
  pesoSpoolCompradoGramos: z.number().positive(),
  urlProducto: z.string().url().optional(),
  selectorPrecioCSS: z.string().optional(),
  densidad: z.number().positive().optional(),
  diametro: z.number().positive().optional(),
  notasAdicionales: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const materials = await getMaterials();
    return NextResponse.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: MaterialFormData = await request.json();
    const validation = materialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validation.error.formErrors }, { status: 400 });
    }

    const newMaterial = await createMaterial(validation.data);
    return NextResponse.json(newMaterial, { status: 201 });

  } catch (error) {
    console.error("Error creating material:", error);
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
