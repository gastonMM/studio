// This is a mock store. In a real application, you'd use a database like Firestore.
import type { Accessory, AccessoryFormData } from "@/types";

let accessories: Accessory[] = [
    { id: "acc1", nombreAccesorio: "Argolla Llavero", costoPorUnidad: 15.5, precioPaqueteObtenido: 1550, unidadesPorPaqueteEnLink: 100, fechaUltimaActualizacionCosto: new Date() },
    { id: "acc2", nombreAccesorio: "Iman Neodimio 6x2mm", costoPorUnidad: 80.0, precioPaqueteObtenido: 8000, unidadesPorPaqueteEnLink: 100, fechaUltimaActualizacionCosto: new Date() },
];

let nextId = 3;

// --- Service Functions ---

export async function getAccessories(): Promise<Accessory[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return accessories.sort((a, b) => a.nombreAccesorio.localeCompare(b.nombreAccesorio));
}

export async function getAccessoryById(id: string): Promise<Accessory | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return accessories.find(acc => acc.id === id);
}

export async function createAccessory(formData: AccessoryFormData): Promise<Accessory> {
    if (!formData.nombreAccesorio || formData.precioPaqueteObtenido <= 0 || formData.unidadesPorPaqueteEnLink <= 0) {
        throw new Error("Datos inválidos.");
    }
    const costoPorUnidad = formData.precioPaqueteObtenido / formData.unidadesPorPaqueteEnLink;
    
    const newAccessory: Accessory = {
        id: `acc${nextId++}`,
        ...formData,
        costoPorUnidad,
        fechaUltimaActualizacionCosto: new Date(),
    };
    
    accessories.push(newAccessory);
    return newAccessory;
}

export async function updateAccessory(id: string, formData: Partial<AccessoryFormData>): Promise<Accessory | null> {
    const index = accessories.findIndex(acc => acc.id === id);
    if (index === -1) {
        return null;
    }
    
    const updatedAccessory = { ...accessories[index], ...formData, fechaUltimaActualizacionCosto: new Date() };

    // Recalculate cost per unit if relevant fields are changed
    if (formData.precioPaqueteObtenido !== undefined || formData.unidadesPorPaqueteEnLink !== undefined) {
        updatedAccessory.costoPorUnidad = updatedAccessory.precioPaqueteObtenido / updatedAccessory.unidadesPorPaqueteEnLink;
    }
    
    accessories[index] = updatedAccessory;
    return updatedAccessory;
}

export async function deleteAccessory(id: string): Promise<boolean> {
    const initialLength = accessories.length;
    accessories = accessories.filter(acc => acc.id !== id);
    return accessories.length < initialLength;
}
