import prisma from "@/lib/db";
import type { Material, MaterialFormData } from "@/types";

export async function getMaterials(): Promise<Material[]> {
  return prisma.material.findMany({
    orderBy: {
      nombreMaterial: 'asc'
    }
  });
}

export async function getMaterialById(id: string): Promise<Material | null> {
  return prisma.material.findUnique({
    where: { id },
  });
}

export async function createMaterial(formData: MaterialFormData): Promise<Material> {
    if (!formData.nombreMaterial || formData.costoPorKg <= 0) {
        throw new Error("Datos inválidos.");
    }
    return prisma.material.create({
        data: formData
    });
}

export async function updateMaterial(id: string, formData: Partial<MaterialFormData>): Promise<Material | null> {
    return prisma.material.update({
        where: { id },
        data: {
          ...formData,
          fechaUltimaActualizacionCosto: new Date(),
        },
    });
}

export async function deleteMaterial(id: string): Promise<boolean> {
    try {
        await prisma.material.delete({ where: { id } });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
