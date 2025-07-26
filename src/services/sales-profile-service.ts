import prisma from "@/lib/db";
import type { SalesProfile, SalesProfileFormData } from "@/types";

export async function getSalesProfiles(): Promise<SalesProfile[]> {
  return prisma.salesProfile.findMany({
    orderBy: {
      nombrePerfil: 'asc'
    }
  });
}

export async function getSalesProfileById(id: string): Promise<SalesProfile | null> {
  return prisma.salesProfile.findUnique({
    where: { id },
  });
}

export async function createSalesProfile(formData: SalesProfileFormData): Promise<SalesProfile> {
    if (!formData.nombrePerfil) {
        throw new Error("Datos inválidos.");
    }
    return prisma.salesProfile.create({
        data: formData,
    });
}

export async function updateSalesProfile(id: string, formData: Partial<SalesProfileFormData>): Promise<SalesProfile | null> {
    return prisma.salesProfile.update({
        where: { id },
        data: formData,
    });
}

export async function deleteSalesProfile(id: string): Promise<boolean> {
  // Check if profile is used by any project
  const count = await prisma.project.count({
    where: { perfilVentaIdUsado: id }
  });
  if (count > 0) {
    throw new Error("No se puede eliminar: el perfil está en uso por uno o más proyectos.");
  }
  
  try {
    await prisma.salesProfile.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
