// This is a mock store. In a real application, you'd use a database like Firestore.
import type { Material, MaterialFormData } from "@/types";

let materials: Material[] = [
  { id: "1", nombreMaterial: "PLA Blanco Económico", costoPorKg: 15000, pesoSpoolCompradoGramos: 1000, densidad: 1.24, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/pla-blanco" },
  { id: "2", nombreMaterial: "PETG Negro Premium", costoPorKg: 22000, pesoSpoolCompradoGramos: 1000, densidad: 1.27, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/petg-negro" },
];

let nextId = 3;

// --- Service Functions ---

export async function getMaterials(): Promise<Material[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return materials.sort((a,b) => a.nombreMaterial.localeCompare(b.nombreMaterial));
}

export async function getMaterialById(id: string): Promise<Material | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return materials.find(m => m.id === id);
}

export async function createMaterial(formData: MaterialFormData): Promise<Material> {
    if (!formData.nombreMaterial || formData.costoPorKg <= 0) {
        throw new Error("Datos inválidos.");
    }
    const newMaterial: Material = {
        id: String(nextId++),
        ...formData,
        fechaUltimaActualizacionCosto: new Date(),
    };
    materials.push(newMaterial);
    return newMaterial;
}

export async function updateMaterial(id: string, formData: Partial<MaterialFormData>): Promise<Material | null> {
    const index = materials.findIndex(m => m.id === id);
    if (index === -1) {
        return null;
    }
    materials[index] = { ...materials[index], ...formData, fechaUltimaActualizacionCosto: new Date() };
    return materials[index];
}

export async function deleteMaterial(id: string): Promise<boolean> {
    const initialLength = materials.length;
    materials = materials.filter(m => m.id !== id);
    return materials.length < initialLength;
}
