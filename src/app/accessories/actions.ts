
"use server";

import type { AccessoryFormData, Accessory } from "@/types";
import { revalidatePath } from "next/cache";
import { getAccessories, getAccessoryById, createAccessory, updateAccessory, deleteAccessory } from "@/services/accessory-service";

export async function fetchAccessories(): Promise<Accessory[]> {
  return getAccessories();
}

export async function fetchAccessoryById(id: string): Promise<Accessory | undefined> {
  return getAccessoryById(id);
}

export async function saveAccessoryAction(formData: AccessoryFormData, accessoryId?: string) {
  try {
    if (accessoryId) {
      await updateAccessory(accessoryId, formData);
    } else {
      await createAccessory(formData);
    }
    revalidatePath("/accessories");
    if (accessoryId) revalidatePath(`/accessories/edit/${accessoryId}`);
    revalidatePath("/projects/calculate"); // To update dropdowns
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}

export async function deleteAccessoryAction(id: string) {
  const success = await deleteAccessory(id);
  if (success) {
    revalidatePath("/accessories");
    revalidatePath("/projects/calculate"); // To update dropdowns
    return { success: true };
  }
  return { success: false, error: "Accesorio no encontrado." };
}
