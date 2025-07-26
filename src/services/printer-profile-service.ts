import prisma from "@/lib/db";
import type { PrinterProfile, PrinterProfileFormData } from "@/types";

export async function getPrinterProfiles(): Promise<PrinterProfile[]> {
  return prisma.printerProfile.findMany({
    orderBy: {
      nombrePerfilImpresora: 'asc'
    },
  });
}

export async function getPrinterProfileById(id: string): Promise<PrinterProfile | null> {
  return prisma.printerProfile.findUnique({
    where: { id },
  });
}

export async function createPrinterProfile(formData: PrinterProfileFormData): Promise<PrinterProfile> {
    if (!formData.nombrePerfilImpresora) {
        throw new Error("El nombre del perfil es obligatorio.");
    }
    return prisma.printerProfile.create({
        data: formData
    });
}

export async function updatePrinterProfile(id: string, formData: Partial<PrinterProfileFormData>): Promise<PrinterProfile | null> {
    return prisma.printerProfile.update({
        where: { id },
        data: {
          ...formData,
          fechaUltimaActualizacionConfig: new Date(),
        },
    });
}

export async function deletePrinterProfile(id: string): Promise<boolean> {
    const count = await prisma.printerProfile.count();
    if (count <= 1) {
        throw new Error("No se puede eliminar el último perfil de impresora.");
    }

    // Check if profile is used by any project
    const projectCount = await prisma.project.count({
      where: { configuracionImpresoraIdUsada: id }
    });

    if (projectCount > 0) {
      throw new Error("No se puede eliminar: el perfil está en uso por uno o más proyectos.");
    }

    try {
        await prisma.printerProfile.delete({ where: { id } });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
