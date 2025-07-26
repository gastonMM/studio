import { mockStore } from "./mock-store";
import type { ElectricityProfile, ElectricityProfileFormData } from "@/types";

export async function getElectricityProfiles(): Promise<ElectricityProfile[]> {
  return mockStore.getElectricityProfiles();
}

export async function getElectricityProfileById(id: string): Promise<ElectricityProfile | undefined> {
  return mockStore.getElectricityProfileById(id);
}

export async function createElectricityProfile(formData: ElectricityProfileFormData): Promise<ElectricityProfile> {
    if (!formData.nombrePerfil || !formData.consumoMensualKWh || !formData.costoTotalFactura) {
        throw new Error("Datos inválidos.");
    }
    return mockStore.createElectricityProfile(formData);
}

export async function updateElectricityProfile(id: string, formData: Partial<ElectricityProfileFormData>): Promise<ElectricityProfile | undefined> {
    return mockStore.updateElectricityProfile(id, formData);
}

export async function deleteElectricityProfile(id: string): Promise<boolean> {
  const isUsed = await mockStore.isElectricityProfileUsed(id);
  if (isUsed) {
    throw new Error("No se puede eliminar: el perfil está en uso por uno o más perfiles de impresora.");
  }
  return mockStore.deleteElectricityProfile(id);
}
