import { mockStore } from "./mock-store";
import type { Material, MaterialFormData } from "@/types";

export async function getMaterials(): Promise<Material[]> {
  return mockStore.getMaterials();
}

export async function getMaterialById(id: string): Promise<Material | undefined> {
  return mockStore.getMaterialById(id);
}

export async function createMaterial(formData: MaterialFormData): Promise<Material> {
    if (!formData.nombreMaterial || formData.costoPorKg <= 0) {
        throw new Error("Datos inválidos.");
    }
    return mockStore.createMaterial(formData);
}

export async function updateMaterial(id: string, formData: Partial<MaterialFormData>): Promise<Material | undefined> {
    return mockStore.updateMaterial(id, formData);
}

export async function deleteMaterial(id: string): Promise<boolean> {
  return mockStore.deleteMaterial(id);
}
