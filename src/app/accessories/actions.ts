
"use server";

import type { AccessoryFormData, Accessory } from "@/types";
import { revalidatePath } from "next/cache";

// This is a mock store. In a real application, you'd use Firestore.
let accessoriesDB: Accessory[] = [
  { id: "acc1", nombreAccesorio: "Argolla Llavero", costoPorUnidad: 50, unidadesPorPaqueteEnLink: 100, fechaUltimaActualizacionCosto: new Date() },
  { id: "acc2", nombreAccesorio: "Iman Neodimio 6x2mm", costoPorUnidad: 200, unidadesPorPaqueteEnLink: 10, fechaUltimaActualizacionCosto: new Date() },
];
let nextId = 3;

export async function fetchAccessories(): Promise<Accessory[]> {
  // Simulate Firestore fetch
  return JSON.parse(JSON.stringify(accessoriesDB)); // Deep copy
}

export async function fetchAccessoryById(id: string): Promise<Accessory | undefined> {
  // Simulate Firestore fetch
  return JSON.parse(JSON.stringify(accessoriesDB.find(a => a.id === id)));
}

export async function saveAccessoryAction(formData: AccessoryFormData, accessoryId?: string) {
  if (!formData.nombreAccesorio || formData.costoPorUnidad <= 0) {
    return { success: false, error: "Datos inválidos." };
  }

  if (accessoryId) {
    // Update existing
    const index = accessoriesDB.findIndex(a => a.id === accessoryId);
    if (index > -1) {
      accessoriesDB[index] = { 
        ...accessoriesDB[index], 
        ...formData,
        fechaUltimaActualizacionCosto: new Date(),
      };
    } else {
      return { success: false, error: "Accesorio no encontrado." };
    }
  } else {
    // Create new
    const newAccessory: Accessory = {
      id: `acc${nextId++}`,
      ...formData,
      fechaUltimaActualizacionCosto: new Date(),
    };
    accessoriesDB.push(newAccessory);
  }
  
  revalidatePath("/accessories");
  if (accessoryId) revalidatePath(`/accessories/edit/${accessoryId}`);
  revalidatePath("/projects/calculate"); // To update dropdowns
  return { success: true };
}

export async function deleteAccessoryAction(id: string) {
  const index = accessoriesDB.findIndex(a => a.id === id);
  if (index > -1) {
    accessoriesDB.splice(index, 1);
    revalidatePath("/accessories");
    revalidatePath("/projects/calculate"); // To update dropdowns
    return { success: true };
  }
  return { success: false, error: "Accesorio no encontrado." };
}
