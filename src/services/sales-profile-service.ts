
import type { SalesProfile, SalesProfileFormData } from "@/types";

let profiles: SalesProfile[] = [
    { 
        id: "sp1", 
        nombrePerfil: "Perfil General", 
        margenGananciaDirecta: 30,
        comisionMercadoLibre: 15,
        costoFijoMercadoLibre: 800,
    }
];

let nextId = 2;

export async function getSalesProfiles(): Promise<SalesProfile[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return profiles.sort((a, b) => a.nombrePerfil.localeCompare(b.nombrePerfil));
}

export async function getSalesProfileById(id: string): Promise<SalesProfile | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return profiles.find(p => p.id === id);
}

export async function createSalesProfile(formData: SalesProfileFormData): Promise<SalesProfile> {
    if (!formData.nombrePerfil) {
        throw new Error("Datos inválidos.");
    }
    
    const newProfile: SalesProfile = {
        id: `sp${nextId++}`,
        ...formData,
    };
    
    profiles.push(newProfile);
    return newProfile;
}

export async function updateSalesProfile(id: string, formData: Partial<SalesProfileFormData>): Promise<SalesProfile | null> {
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) {
        return null;
    }
    
    profiles[index] = { ...profiles[index], ...formData };
    return profiles[index];
}

export async function deleteSalesProfile(id: string): Promise<boolean> {
    const initialLength = profiles.length;
    // You might want to check if this profile is being used by any project before deleting
    profiles = profiles.filter(p => p.id !== id);
    return profiles.length < initialLength;
}
