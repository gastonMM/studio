import { mockStore } from "./mock-store";
import type { PrinterProfile, PrinterProfileFormData } from "@/types";

export async function getPrinterProfiles(): Promise<PrinterProfile[]> {
  return mockStore.getPrinterProfiles();
}

export async function getPrinterProfileById(id: string): Promise<PrinterProfile | undefined> {
  return mockStore.getPrinterProfileById(id);
}

export async function createPrinterProfile(formData: PrinterProfileFormData): Promise<PrinterProfile> {
    if (!formData.nombrePerfilImpresora) {
        throw new Error("El nombre del perfil es obligatorio.");
    }
    return mockStore.createPrinterProfile(formData);
}

export async function updatePrinterProfile(id: string, formData: Partial<PrinterProfileFormData>): Promise<PrinterProfile | undefined> {
    return mockStore.updatePrinterProfile(id, formData);
}

export async function deletePrinterProfile(id: string): Promise<boolean> {
    const profiles = await mockStore.getPrinterProfiles();
    if (profiles.length <= 1) {
        throw new Error("No se puede eliminar el último perfil de impresora.");
    }
    
    const isUsed = await mockStore.isPrinterProfileUsed(id);
    if(isUsed) {
      throw new Error("No se puede eliminar: el perfil está en uso por uno o más proyectos.");
    }
    
    return mockStore.deletePrinterProfile(id);
}
