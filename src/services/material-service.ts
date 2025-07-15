// This is a mock store. In a real application, you'd use Firestore.
import type { Material, MaterialFormData } from "@/types";

let materialsDB: Material[] = [
  { id: "1", nombreMaterial: "PLA Blanco Económico", costoPorKg: 15000, pesoSpoolCompradoGramos: 1000, densidad: 1.24, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/pla-blanco" },
  { id: "2", nombreMaterial: "PETG Negro Premium", costoPorKg: 22000, pesoSpoolCompradoGramos: 1000, densidad: 1.27, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/petg-negro" },
];
let nextId = 3;

// --- Service Functions ---

export async function getMaterials(): Promise<Material[]> {
  // Simulate Firestore fetch
  return JSON.parse(JSON.stringify(materialsDB));
}

export async function getMaterialById(id: string): Promise<Material | undefined> {
  // Simulate Firestore fetch
  return JSON.parse(JSON.stringify(materialsDB.find(m => m.id === id)));
}

export async function createMaterial(formData: MaterialFormData): Promise<Material> {
    if (!formData.nombreMaterial || formData.costoPorKg <= 0) {
        throw new Error("Datos inválidos.");
    }
    const newMaterial: Material = {
        id: (nextId++).toString(),
        ...formData,
        fechaUltimaActualizacionCosto: new Date(),
    };
    materialsDB.push(newMaterial);
    return JSON.parse(JSON.stringify(newMaterial));
}

export async function updateMaterial(id: string, formData: Partial<MaterialFormData>): Promise<Material | null> {
    const index = materialsDB.findIndex(m => m.id === id);
    if (index > -1) {
        materialsDB[index] = { 
            ...materialsDB[index], 
            ...formData,
            fechaUltimaActualizacionCosto: new Date(),
        };
        return JSON.parse(JSON.stringify(materialsDB[index]));
    }
    return null;
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const index = materialsDB.findIndex(m => m.id === id);
  if (index > -1) {
    materialsDB.splice(index, 1);
    return true;
  }
  return false;
}
