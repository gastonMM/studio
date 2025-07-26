import prisma from "@/lib/db";
import type { Accessory, AccessoryFormData } from "@/types";

export async function getAccessories(): Promise<Accessory[]> {
  const accessories = await prisma.accessory.findMany({
    orderBy: {
      nombreAccesorio: 'asc'
    }
  });
  return accessories;
}

export async function getAccessoryById(id: string): Promise<Accessory | null> {
  return prisma.accessory.findUnique({
    where: { id },
  });
}

export async function createAccessory(formData: AccessoryFormData): Promise<Accessory> {
    if (!formData.nombreAccesorio || formData.precioPaqueteObtenido <= 0 || formData.unidadesPorPaqueteEnLink <= 0) {
        throw new Error("Datos inválidos.");
    }
    const costoPorUnidad = formData.precioPaqueteObtenido / formData.unidadesPorPaqueteEnLink;
    
    return prisma.accessory.create({
        data: {
            ...formData,
            costoPorUnidad,
        }
    });
}

export async function updateAccessory(id: string, formData: Partial<AccessoryFormData>): Promise<Accessory | null> {
    const dataToUpdate: Partial<Accessory> = { ...formData };
    
    if (formData.precioPaqueteObtenido !== undefined || formData.unidadesPorPaqueteEnLink !== undefined) {
        const currentAccessory = await getAccessoryById(id);
        if (!currentAccessory) throw new Error("Accessory not found");

        const price = formData.precioPaqueteObtenido ?? currentAccessory.precioPaqueteObtenido;
        const units = formData.unidadesPorPaqueteEnLink ?? currentAccessory.unidadesPorPaqueteEnLink;
        if (units > 0) {
            dataToUpdate.costoPorUnidad = price / units;
        }
    }
    
    return prisma.accessory.update({
        where: { id },
        data: dataToUpdate,
    });
}

export async function deleteAccessory(id: string): Promise<boolean> {
    try {
      await prisma.accessory.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
}
