// This is a mock store. In a real application, you'd use a database like Firestore.
import type { PrinterProfile, PrinterProfileFormData } from "@/types";

let profiles: PrinterProfile[] = [
    { 
        id: "pp1", 
        nombrePerfilImpresora: "Perfil por Defecto", 
        modeloImpresora: "Genérica",
        consumoEnergeticoImpresoraWatts: 250,
        costoKWhElectricidad: 45.5,
        costoAdquisicionImpresora: 1200000,
        vidaUtilEstimadaHorasImpresora: 4000,
        porcentajeFallasEstimado: 5,
        costoHoraLaborOperativa: 2500,
        costoHoraLaborPostProcesado: 4000,
        fechaUltimaActualizacionConfig: new Date()
    }
];

let nextId = 2;

export async function getPrinterProfiles(): Promise<PrinterProfile[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return profiles.sort((a, b) => a.nombrePerfilImpresora.localeCompare(b.nombrePerfilImpresora));
}

export async function getPrinterProfileById(id: string): Promise<PrinterProfile | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return profiles.find(p => p.id === id);
}

export async function createPrinterProfile(formData: PrinterProfileFormData): Promise<PrinterProfile> {
    if (!formData.nombrePerfilImpresora) {
        throw new Error("El nombre del perfil es obligatorio.");
    }
    const newProfile: PrinterProfile = {
        id: `pp${nextId++}`,
        ...formData,
        fechaUltimaActualizacionConfig: new Date(),
    };
    profiles.push(newProfile);
    return newProfile;
}

export async function updatePrinterProfile(id: string, formData: Partial<PrinterProfileFormData>): Promise<PrinterProfile | null> {
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) {
        return null;
    }
    profiles[index] = { ...profiles[index], ...formData, fechaUltimaActualizacionConfig: new Date() };
    return profiles[index];
}

export async function deletePrinterProfile(id: string): Promise<boolean> {
    // Prevent deleting the last profile
    if (profiles.length <= 1) {
        throw new Error("No se puede eliminar el último perfil de impresora.");
    }
    const initialLength = profiles.length;
    profiles = profiles.filter(p => p.id !== id);
    return profiles.length < initialLength;
}
