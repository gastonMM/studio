
import { NextResponse } from 'next/server';
import { getMaterialById, updateMaterial, deleteMaterial } from '@/services/material-service';
import { z } from 'zod';
import type { MaterialFormData } from '@/types';

// Schema for updates can be partial
const materialUpdateSchema = z.object({
  nombreMaterial: z.string().min(1).optional(),
  costoPorKg: z.number().positive().optional(),
  pesoSpoolCompradoGramos: z.number().positive().optional(),
  urlProducto: z.string().url().optional(),
  selectorPrecioCSS: z.string().optional(),
  densidad: z.number().positive().optional(),
  diametro: z.number().positive().optional(),
  notasAdicionales: z.string().optional(),
}).partial();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const material = await getMaterialById(id);

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    return NextResponse.json(material);
  } catch (error) {
    console.error(`Error fetching material ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: Partial<MaterialFormData> = await request.json();
    const validation = materialUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validation.error.formErrors }, { status: 400 });
    }

    const updatedMaterial = await updateMaterial(id, validation.data);

    if (!updatedMaterial) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json(updatedMaterial);
  } catch (error) {
    console.error(`Error updating material ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const success = await deleteMaterial(id);

    if (!success) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting material ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
