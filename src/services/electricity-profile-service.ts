import prisma from "@/lib/db";
import type { ElectricityProfile, ElectricityProfileFormData } from "@/types";

export async function getElectricityProfiles(): Promise<ElectricityProfile[]> {
  return prisma.electricityProfile.findMany({
    orderBy: {
      nombrePerfil: 'asc'
    }
  });
}

export async function getElectricityProfileById(id: string): Promise<ElectricityProfile | null> {
  return prisma.electricityProfile.findUnique({
    where: { id },
  });
}

export async function createElectricityProfile(formData: ElectricityProfileFormData): Promise<ElectricityProfile> {
    if (!formData.nombrePerfil || !formData.consumoMensualKWh || !formData.costoTotalFactura) {
        throw new Error("Datos inválidos.");
    }
    const costoPorKWh = formData.costoTotalFactura / formData.consumoMensualKWh;
    
    return prisma.electricityProfile.create({
        data: {
            ...formData,
            costoPorKWh,
        }
    });
}

export async function updateElectricityProfile(id: string, formData: Partial<ElectricityProfileFormData>): Promise<ElectricityProfile | null> {
    const dataToUpdate: Partial<ElectricityProfile> = { ...formData };

    if (formData.costoTotalFactura !== undefined || formData.consumoMensualKWh !== undefined) {
      const currentProfile = await getElectricityProfileById(id);
      if (!currentProfile) throw new Error("Profile not found");
      const cost = formData.costoTotalFactura ?? currentProfile.costoTotalFactura;
      const consumption = formData.consumoMensualKWh ?? currentProfile.consumoMensualKWh;
      if (consumption > 0) {
        dataToUpdate.costoPorKWh = cost / consumption;
      }
    }
    
    return prisma.electricityProfile.update({
        where: { id },
        data: dataToUpdate,
    });
}

export async function deleteElectricityProfile(id: string): Promise<boolean> {
  // Check if profile is used by any printer profile
  const count = await prisma.printerProfile.count({
    where: { electricityProfileId: id }
  });
  if (count > 0) {
    throw new Error("No se puede eliminar: el perfil está en uso por uno o más perfiles de impresora.");
  }
  
  try {
    await prisma.electricityProfile.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
