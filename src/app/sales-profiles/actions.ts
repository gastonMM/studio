
"use server";

import type { SalesProfile, SalesProfileFormData } from "@/types";
import { revalidatePath } from "next/cache";
import { 
    getSalesProfiles,
    getSalesProfileById,
    createSalesProfile,
    updateSalesProfile,
    deleteSalesProfile
} from "@/services/sales-profile-service";

export async function fetchSalesProfiles(): Promise<SalesProfile[]> {
  return getSalesProfiles();
}

export async function fetchSalesProfileById(id: string): Promise<SalesProfile | undefined> {
  return getSalesProfileById(id);
}

export async function saveSalesProfileAction(formData: SalesProfileFormData, profileId?: string) {
  try {
    if (profileId) {
      await updateSalesProfile(profileId, formData);
    } else {
      await createSalesProfile(formData);
    }
    revalidatePath("/sales-profiles");
    if (profileId) revalidatePath(`/sales-profiles/edit/${profileId}`);
    revalidatePath("/projects/calculate"); // To update dropdowns
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}

export async function deleteSalesProfileAction(id: string) {
  try {
    await deleteSalesProfile(id);
    revalidatePath("/sales-profiles");
    revalidatePath("/projects/calculate");
    return { success: true };
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}
