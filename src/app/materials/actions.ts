
"use server";

import type { MaterialFormData, Material } from "@/types";
import { revalidatePath } from "next/cache";
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from "@/services/material-service";

export async function fetchMaterials(): Promise<Material[]> {
  return getMaterials();
}

export async function fetchMaterialById(id: string): Promise<Material | undefined> {
  return getMaterialById(id);
}

export async function saveMaterialAction(formData: MaterialFormData, materialId?: string) {
  try {
    if (materialId) {
      await updateMaterial(materialId, formData);
    } else {
      await createMaterial(formData);
    }
    revalidatePath("/materials");
    if (materialId) revalidatePath(`/materials/edit/${materialId}`);
    return { success: true };
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}

export async function deleteMaterialAction(id: string) {
  const success = await deleteMaterial(id);
  if (success) {
    revalidatePath("/materials");
    return { success: true };
  }
  return { success: false, error: "Material no encontrado." };
}
