
"use server";

import type { ElectricityProfile, ElectricityProfileFormData } from "@/types";
import { revalidatePath } from "next/cache";
import { 
    getElectricityProfiles, 
    getElectricityProfileById, 
    createElectricityProfile, 
    updateElectricityProfile, 
    deleteElectricityProfile 
} from "@/services/electricity-profile-service";

export async function fetchElectricityProfiles(): Promise<ElectricityProfile[]> {
  return getElectricityProfiles();
}

export async function fetchElectricityProfileById(id: string): Promise<ElectricityProfile | undefined> {
  return getElectricityProfileById(id);
}

export async function saveElectricityProfileAction(formData: ElectricityProfileFormData, profileId?: string) {
  try {
    if (profileId) {
      await updateElectricityProfile(profileId, formData);
    } else {
      await createElectricityProfile(formData);
    }
    revalidatePath("/electricity-profiles");
    if (profileId) revalidatePath(`/electricity-profiles/edit/${profileId}`);
    revalidatePath("/printer-profiles"); // To update dropdowns
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}

export async function deleteElectricityProfileAction(id: string) {
  try {
    await deleteElectricityProfile(id);
    revalidatePath("/electricity-profiles");
    revalidatePath("/printer-profiles");
    return { success: true };
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}
