import { mockStore } from "./mock-store";
import type { SalesProfile, SalesProfileFormData } from "@/types";

export async function getSalesProfiles(): Promise<SalesProfile[]> {
  return mockStore.getSalesProfiles();
}

export async function getSalesProfileById(id: string): Promise<SalesProfile | undefined> {
  return mockStore.getSalesProfileById(id);
}

export async function createSalesProfile(formData: SalesProfileFormData): Promise<SalesProfile> {
    if (!formData.nombrePerfil) {
        throw new Error("Datos inválidos.");
    }
    return mockStore.createSalesProfile(formData);
}

export async function updateSalesProfile(id: string, formData: Partial<SalesProfileFormData>): Promise<SalesProfile | undefined> {
    return mockStore.updateSalesProfile(id, formData);
}

export async function deleteSalesProfile(id: string): Promise<boolean> {
  const isUsed = await mockStore.isSalesProfileUsed(id);
  if (isUsed) {
     throw new Error("No se puede eliminar: el perfil está en uso por uno o más proyectos.");
  }
  return mockStore.deleteSalesProfile(id);
}
