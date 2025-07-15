// This is a mock store. In a real application, you'd use Firestore.
import type { Accessory, AccessoryFormData } from "@/types";

let accessoriesDB: Accessory[] = [
  { id: "acc1", nombreAccesorio: "Argolla Llavero", costoPorUnidad: 0.5, unidadesPorPaqueteEnLink: 100, precioPaqueteObtenido: 50, fechaUltimaActualizacionCosto: new Date() },
  { id: "acc2", nombreAccesorio: "Iman Neodimio 6x2mm", costoPorUnidad: 20, unidadesPorPaqueteEnLink: 10, precioPaqueteObtenido: 200, fechaUltimaActualizacionCosto: new Date() },
];
let nextId = 3;

// --- Service Functions ---

export async function getAccessories(): Promise<Accessory[]> {
  return JSON.parse(JSON.stringify(accessoriesDB));
}

export async function getAccessoryById(id: string): Promise<Accessory | undefined> {
  return JSON.parse(JSON.stringify(accessoriesDB.find(a => a.id === id)));
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
    accessoriesDB.push(newAccessory);
    return JSON.parse(JSON.stringify(newAccessory));
}

export async function updateAccessory(id: string, formData: Partial<AccessoryFormData>): Promise<Accessory | null> {
    const index = accessoriesDB.findIndex(a => a.id === id);
    if (index === -1) {
        return null;
    }
    
    const updatedAccessoryData = { ...accessoriesDB[index], ...formData };

    // Recalculate cost per unit if relevant fields are changed
    const priceChanged = formData.precioPaqueteObtenido !== undefined;
    const unitsChanged = formData.unidadesPorPaqueteEnLink !== undefined;
    if (priceChanged || unitsChanged) {
        updatedAccessoryData.costoPorUnidad = updatedAccessoryData.precioPaqueteObtenido / updatedAccessoryData.unidadesPorPaqueteEnLink;
    }
    
    accessoriesDB[index] = {
        ...updatedAccessoryData,
        fechaUltimaActualizacionCosto: new Date(),
    };
    
    return JSON.parse(JSON.stringify(accessoriesDB[index]));
}

export async function deleteAccessory(id: string): Promise<boolean> {
    const index = accessoriesDB.findIndex(a => a.id === id);
    if (index > -1) {
        accessoriesDB.splice(index, 1);
        return true;
    }
    return false;
}
