
import { NextResponse } from 'next/server';
import { getAccessoryById, updateAccessory, deleteAccessory } from '@/services/accessory-service';
import { z } from 'zod';
import type { AccessoryFormData } from '@/types';

const accessoryUpdateSchema = z.object({
  nombreAccesorio: z.string().min(1).optional(),
  precioPaqueteObtenido: z.number().positive().optional(),
  unidadesPorPaqueteEnLink: z.number().int().positive().optional(),
  urlProducto: z.string().url().optional(),
  selectorPrecioCSS: z.string().optional(),
  notasAdicionales: z.string().optional(),
}).partial();


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const accessory = await getAccessoryById(id);

    if (!accessory) {
      return NextResponse.json({ error: 'Accessory not found' }, { status: 404 });
    }
    return NextResponse.json(accessory);
  } catch (error) {
    console.error(`Error fetching accessory ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: Partial<AccessoryFormData> = await request.json();
    const validation = accessoryUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validation.error.formErrors }, { status: 400 });
    }

    const updatedAccessory = await updateAccessory(id, validation.data);

    if (!updatedAccessory) {
      return NextResponse.json({ error: 'Accessory not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAccessory);
  } catch (error) {
    console.error(`Error updating accessory ${params.id}:`, error);
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
    const success = await deleteAccessory(id);

    if (!success) {
      return NextResponse.json({ error: 'Accessory not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting accessory ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
