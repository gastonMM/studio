
import { NextResponse } from 'next/server';
import { getAccessories, createAccessory } from '@/services/accessory-service';
import { z } from 'zod';
import type { AccessoryFormData } from '@/types';

const accessorySchema = z.object({
  nombreAccesorio: z.string().min(1),
  precioPaqueteObtenido: z.number().positive(),
  unidadesPorPaqueteEnLink: z.number().int().positive(),
  urlProducto: z.string().url().optional(),
  selectorPrecioCSS: z.string().optional(),
  notasAdicionales: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const accessories = await getAccessories();
    return NextResponse.json(accessories);
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: AccessoryFormData = await request.json();
    const validation = accessorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validation.error.formErrors }, { status: 400 });
    }

    const newAccessory = await createAccessory(validation.data);
    return NextResponse.json(newAccessory, { status: 201 });

  } catch (error) {
    console.error("Error creating accessory:", error);
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
