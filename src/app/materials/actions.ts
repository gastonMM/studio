"use server";

import type { MaterialFormData, Material } from "@/types";
import { revalidatePath } from "next/cache";

// This is a mock store. In a real application, you'd use Firestore.
let materialsDB: Material[] = [
  { id: "1", nombreMaterial: "PLA Blanco Económico", costoPorKg: 15000, pesoSpoolCompradoGramos: 1000, densidad: 1.24, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/pla-blanco" },
  { id: "2", nombreMaterial: "PETG Negro Premium", costoPorKg: 22000, pesoSpoolCompradoGramos: 1000, densidad: 1.27, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/petg-negro" },
];
let nextId = 3;

export async function fetchMaterials(): Promise<Material[]> {
  // Simulate Firestore fetch
  return JSON.parse(JSON.stringify(materialsDB)); // Deep copy to avoid mutation issues if not using a real DB
}

export async function fetchMaterialById(id: string): Promise<Material | undefined> {
  // Simulate Firestore fetch
  return JSON.parse(JSON.stringify(materialsDB.find(m => m.id === id)));
}

export async function saveMaterialAction(formData: MaterialFormData, materialId?: string) {
  // Simulate input validation (Zod would handle this in the form, but good practice for server actions too)
  if (!formData.nombreMaterial || formData.costoPorKg <= 0) {
    return { success: false, error: "Datos inválidos." };
  }

  if (materialId) {
    // Update existing material
    const index = materialsDB.findIndex(m => m.id === materialId);
    if (index > -1) {
      materialsDB[index] = { 
        ...materialsDB[index], 
        ...formData,
        fechaUltimaActualizacionCosto: new Date(),
      };
    } else {
      return { success: false, error: "Material no encontrado." };
    }
  } else {
    // Create new material
    const newMaterial: Material = {
      id: (nextId++).toString(),
      ...formData,
      fechaUltimaActualizacionCosto: new Date(),
    };
    materialsDB.push(newMaterial);
  }
  
  revalidatePath("/materials"); // Revalidate the materials list page
  if (materialId) revalidatePath(`/materials/edit/${materialId}`);
  return { success: true };
}

export async function deleteMaterialAction(id: string) {
  const index = materialsDB.findIndex(m => m.id === id);
  if (index > -1) {
    materialsDB.splice(index, 1);
    revalidatePath("/materials");
    return { success: true };
  }
  return { success: false, error: "Material no encontrado." };
}
