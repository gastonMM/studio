
import type { ElectricityProfile, ElectricityProfileFormData } from "@/types";

let profiles: ElectricityProfile[] = [
    { 
        id: "ep1", 
        nombrePerfil: "Tarifa General", 
        consumoMensualKWh: 150,
        costoTotalFactura: 6825,
        costoPorKWh: 45.5,
    }
];

let nextId = 2;

export async function getElectricityProfiles(): Promise<ElectricityProfile[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return profiles.sort((a, b) => a.nombrePerfil.localeCompare(b.nombrePerfil));
}

export async function getElectricityProfileById(id: string): Promise<ElectricityProfile | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return profiles.find(p => p.id === id);
}

export async function createElectricityProfile(formData: ElectricityProfileFormData): Promise<ElectricityProfile> {
    if (!formData.nombrePerfil || !formData.consumoMensualKWh || !formData.costoTotalFactura) {
        throw new Error("Datos inválidos.");
    }
    const costoPorKWh = formData.costoTotalFactura / formData.consumoMensualKWh;
    
    const newProfile: ElectricityProfile = {
        id: `ep${nextId++}`,
        costoPorKWh,
        ...formData,
    };
    
    profiles.push(newProfile);
    return newProfile;
}

export async function updateElectricityProfile(id: string, formData: Partial<ElectricityProfileFormData>): Promise<ElectricityProfile | null> {
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) {
        return null;
    }
    
    const updatedProfile = { ...profiles[index], ...formData };

    if (formData.costoTotalFactura !== undefined || formData.consumoMensualKWh !== undefined) {
        updatedProfile.costoPorKWh = updatedProfile.costoTotalFactura / updatedProfile.consumoMensualKWh;
    }
    
    profiles[index] = updatedProfile;
    return updatedProfile;
}

export async function deleteElectricityProfile(id: string): Promise<boolean> {
    const initialLength = profiles.length;
    // You might want to check if this profile is being used by any printer profile before deleting
    profiles = profiles.filter(p => p.id !== id);
    return profiles.length < initialLength;
}
