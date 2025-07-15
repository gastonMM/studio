
"use server";

import type { PrinterProfileFormData, PrinterProfile } from "@/types";
import { revalidatePath } from "next/cache";
import { getPrinterProfiles, getPrinterProfileById, createPrinterProfile, updatePrinterProfile, deletePrinterProfile } from "@/services/printer-profile-service";

export async function fetchPrinterProfiles(): Promise<PrinterProfile[]> {
  return getPrinterProfiles();
}

export async function fetchPrinterProfileById(id: string): Promise<PrinterProfile | undefined> {
  return getPrinterProfileById(id);
}

export async function savePrinterProfileAction(formData: PrinterProfileFormData, profileId?: string) {
  try {
    if (profileId) {
      await updatePrinterProfile(profileId, formData);
    } else {
      await createPrinterProfile(formData);
    }
    revalidatePath("/printer-profiles");
    if (profileId) revalidatePath(`/printer-profiles/edit/${profileId}`);
    revalidatePath("/projects/calculate"); // To update dropdowns
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}

export async function deletePrinterProfileAction(id: string) {
  try {
    await deletePrinterProfile(id);
    revalidatePath("/printer-profiles");
    revalidatePath("/projects/calculate"); // To update dropdowns
    return { success: true };
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}
