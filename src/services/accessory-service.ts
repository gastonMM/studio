import { mockStore } from "./mock-store";
import type { Accessory, AccessoryFormData } from "@/types";

export async function getAccessories(): Promise<Accessory[]> {
  return mockStore.getAccessories();
}

export async function getAccessoryById(id: string): Promise<Accessory | undefined> {
  return mockStore.getAccessoryById(id);
}

export async function createAccessory(formData: AccessoryFormData): Promise<Accessory> {
    if (!formData.nombreAccesorio || formData.precioPaqueteObtenido <= 0 || formData.unidadesPorPaqueteEnLink <= 0) {
        throw new Error("Datos inválidos.");
    }
    return mockStore.createAccessory(formData);
}

export async function updateAccessory(id: string, formData: Partial<AccessoryFormData>): Promise<Accessory | undefined> {
    return mockStore.updateAccessory(id, formData);
}

export async function deleteAccessory(id: string): Promise<boolean> {
  return mockStore.deleteAccessory(id);
}
