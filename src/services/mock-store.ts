// In-memory store for development without a database.
// Data will be reset on server restart.

import type {
  Material, MaterialFormData,
  Accessory, AccessoryFormData,
  ElectricityProfile, ElectricityProfileFormData,
  PrinterProfile, PrinterProfileFormData,
  SalesProfile, SalesProfileFormData,
  Tag, TagFormData,
  Project, ProjectWithRelations
} from "@/types";

// Helper to generate a random ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class MockStore {
  private materials: Map<string, Material> = new Map();
  private accessories: Map<string, Accessory> = new Map();
  private electricityProfiles: Map<string, ElectricityProfile> = new Map();
  private printerProfiles: Map<string, PrinterProfile> = new Map();
  private salesProfiles: Map<string, SalesProfile> = new Map();
  private tags: Map<string, Tag> = new Map();
  private projects: Map<string, Project> = new Map();

  constructor() {
    // Initialize with some default data
    this.initDefaultData();
  }

  private initDefaultData() {
    // Default Electricity Profile
    const defaultElectricityId = generateId();
    this.createElectricityProfile({
      id: defaultElectricityId,
      nombrePerfil: "Tarifa General",
      consumoMensualKWh: 150,
      costoTotalFactura: 8500
    });

    // Default Printer Profile
    const defaultPrinterProfileId = generateId();
    this.createPrinterProfile({
        id: defaultPrinterProfileId,
        nombrePerfilImpresora: "Impresora por Defecto",
        modeloImpresora: "Ender 3 Pro",
        consumoEnergeticoImpresoraWatts: 200,
        costoAdquisicionImpresora: 1200000,
        vidaUtilEstimadaHorasImpresora: 4000,
        porcentajeFallasEstimado: 5,
        costoHoraLaborOperativa: 2500,
        costoHoraLaborPostProcesado: 2000,
        electricityProfileId: defaultElectricityId,
    });
    
    // Default Sales Profile
    const defaultSalesProfileId = generateId();
    this.createSalesProfile({
        id: defaultSalesProfileId,
        nombrePerfil: "Perfil General",
        margenGananciaDirecta: 30,
        comisionMercadoLibre: 15,
        costoFijoMercadoLibre: 800
    });

    // Default Material
    this.createMaterial({
        nombreMaterial: 'PLA Genérico Blanco',
        costoPorKg: 15000,
        pesoSpoolCompradoGramos: 1000,
        densidad: 1.24,
        diametro: 1.75
    });

     // Default Tag
     this.createTag({ name: 'Llavero', color: generateRandomColor() });
     this.createTag({ name: 'Decoración', color: generateRandomColor() });
     this.createTag({ name: 'Utilidad', color: generateRandomColor() });

  }

  // Material Methods
  getMaterials = async () => Array.from(this.materials.values()).sort((a, b) => a.nombreMaterial.localeCompare(b.nombreMaterial));
  getMaterialById = async (id: string) => this.materials.get(id);
  createMaterial = async (data: MaterialFormData) => {
    const id = data.id || generateId();
    const newMaterial: Material = {
      ...data,
      id: id,
      fechaUltimaActualizacionCosto: new Date(),
      pesoSpoolCompradoGramos: data.pesoSpoolCompradoGramos || 1000,
    };
    this.materials.set(id, newMaterial);
    return newMaterial;
  };
  updateMaterial = async (id: string, data: Partial<MaterialFormData>) => {
    const existing = this.materials.get(id);
    if (!existing) return undefined;
    const updated: Material = { ...existing, ...data, fechaUltimaActualizacionCosto: new Date() };
    this.materials.set(id, updated);
    return updated;
  };
  deleteMaterial = async (id: string) => this.materials.delete(id);

  // Accessory Methods
  getAccessories = async () => Array.from(this.accessories.values()).sort((a,b) => a.nombreAccesorio.localeCompare(b.nombreAccesorio));
  getAccessoryById = async (id: string) => this.accessories.get(id);
  createAccessory = async (data: AccessoryFormData) => {
    const id = data.id || generateId();
    const costoPorUnidad = data.precioPaqueteObtenido / data.unidadesPorPaqueteEnLink;
    const newAccessory: Accessory = {
      ...data,
      id,
      costoPorUnidad,
      fechaUltimaActualizacionCosto: new Date(),
    };
    this.accessories.set(id, newAccessory);
    return newAccessory;
  };
  updateAccessory = async (id: string, data: Partial<AccessoryFormData>) => {
    const existing = this.accessories.get(id);
    if (!existing) return undefined;
    const updatedData = { ...existing, ...data };
    const costoPorUnidad = updatedData.precioPaqueteObtenido / updatedData.unidadesPorPaqueteEnLink;
    const updatedAccessory: Accessory = {
        ...updatedData,
        costoPorUnidad,
        fechaUltimaActualizacionCosto: new Date(),
    };
    this.accessories.set(id, updatedAccessory);
    return updatedAccessory;
  };
  deleteAccessory = async (id: string) => this.accessories.delete(id);

  // ElectricityProfile Methods
  getElectricityProfiles = async () => Array.from(this.electricityProfiles.values()).sort((a,b) => a.nombrePerfil.localeCompare(b.nombrePerfil));
  getElectricityProfileById = async (id: string) => this.electricityProfiles.get(id);
  createElectricityProfile = async (data: ElectricityProfileFormData) => {
    const id = data.id || generateId();
    const costoPorKWh = data.costoTotalFactura / data.consumoMensualKWh;
    const newProfile: ElectricityProfile = { ...data, id, costoPorKWh };
    this.electricityProfiles.set(id, newProfile);
    return newProfile;
  };
  updateElectricityProfile = async (id: string, data: Partial<ElectricityProfileFormData>) => {
    const existing = this.electricityProfiles.get(id);
    if (!existing) return undefined;
    const updatedData = { ...existing, ...data };
    const costoPorKWh = updatedData.costoTotalFactura / updatedData.consumoMensualKWh;
    const updatedProfile: ElectricityProfile = { ...updatedData, costoPorKWh };
    this.electricityProfiles.set(id, updatedProfile);
    return updatedProfile;
  };
  deleteElectricityProfile = async (id: string) => this.electricityProfiles.delete(id);
  isElectricityProfileUsed = async (id: string) => {
    return Array.from(this.printerProfiles.values()).some(p => p.electricityProfileId === id);
  }

  // PrinterProfile Methods
  getPrinterProfiles = async () => Array.from(this.printerProfiles.values()).sort((a,b) => a.nombrePerfilImpresora.localeCompare(b.nombrePerfilImpresora));
  getPrinterProfileById = async (id: string) => this.printerProfiles.get(id);
  createPrinterProfile = async (data: PrinterProfileFormData) => {
    const id = data.id || generateId();
    const newProfile: PrinterProfile = { ...data, id, fechaUltimaActualizacionConfig: new Date() };
    this.printerProfiles.set(id, newProfile);
    return newProfile;
  };
  updatePrinterProfile = async (id: string, data: Partial<PrinterProfileFormData>) => {
    const existing = this.printerProfiles.get(id);
    if (!existing) return undefined;
    const updated: PrinterProfile = { ...existing, ...data, fechaUltimaActualizacionConfig: new Date() };
    this.printerProfiles.set(id, updated);
    return updated;
  };
  deletePrinterProfile = async (id: string) => this.printerProfiles.delete(id);
  isPrinterProfileUsed = async (id: string) => {
      return Array.from(this.projects.values()).some(p => p.configuracionImpresoraIdUsada === id);
  }

  // SalesProfile Methods
  getSalesProfiles = async () => Array.from(this.salesProfiles.values()).sort((a,b) => a.nombrePerfil.localeCompare(b.nombrePerfil));
  getSalesProfileById = async (id: string) => this.salesProfiles.get(id);
  createSalesProfile = async (data: SalesProfileFormData) => {
    const id = data.id || generateId();
    const newProfile: SalesProfile = { ...data, id };
    this.salesProfiles.set(id, newProfile);
    return newProfile;
  };
  updateSalesProfile = async (id: string, data: Partial<SalesProfileFormData>) => {
    const existing = this.salesProfiles.get(id);
    if (!existing) return undefined;
    const updated: SalesProfile = { ...existing, ...data };
    this.salesProfiles.set(id, updated);
    return updated;
  };
  deleteSalesProfile = async (id: string) => this.salesProfiles.delete(id);
  isSalesProfileUsed = async (id: string) => {
    return Array.from(this.projects.values()).some(p => p.perfilVentaIdUsado === id);
  }


  // Tag Methods
  getTags = async () => Array.from(this.tags.values()).sort((a,b) => a.name.localeCompare(b.name));
  getTagById = async (id: string) => this.tags.get(id);
  getTagByName = async (name: string) => Array.from(this.tags.values()).find(t => t.name === name);
  createTag = async (data: TagFormData) => {
    const id = data.id || generateId();
    const newTag: Tag = { ...data, id, color: data.color || generateRandomColor() };
    this.tags.set(id, newTag);
    return newTag;
  };
  updateTag = async (id: string, data: Partial<TagFormData>) => {
    const existing = this.tags.get(id);
    if (!existing) return undefined;
    const updated: Tag = { ...existing, ...data };
    this.tags.set(id, updated);
    return updated;
  };
  deleteTag = async (id: string) => this.tags.delete(id);

  // Project Methods
  getProjects = async (): Promise<ProjectWithRelations[]> => {
    const allProjects = Array.from(this.projects.values()).sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
    return allProjects.map(this.hydrateProject);
  };
  getProjectById = async (id: string): Promise<ProjectWithRelations | undefined> => {
    const project = this.projects.get(id);
    return project ? this.hydrateProject(project) : undefined;
  };
  createProject = async (data: any) => {
    const id = generateId();
    const newProject: Project = {
      ...data,
      id,
      fechaCreacion: new Date(),
      fechaUltimoCalculo: new Date(),
    };
    this.projects.set(id, newProject);
    return this.hydrateProject(newProject);
  };
  updateProject = async (id: string, data: Partial<any>) => {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    const updated: Project = { ...existing, ...data, fechaUltimoCalculo: new Date() };
    this.projects.set(id, updated);
    return this.hydrateProject(updated);
  };
  deleteProject = async (id: string) => this.projects.delete(id);

  private hydrateProject = (project: Project): ProjectWithRelations => {
    // In a real DB, this would be a join. Here, we manually "join" the data.
    const hydratedAccessories = project.accesoriosUsadosEnProyecto.map(accInProj => {
        const accessoryDetails = this.accessories.get(accInProj.accesorioId);
        return {
            ...accInProj,
            // Fallback details if accessory was deleted
            nombreAccesorio: accessoryDetails?.nombreAccesorio || 'Accesorio Eliminado',
            costoPorUnidad: accessoryDetails?.costoPorUnidad || accInProj.costoUnitarioAlMomentoDelCalculo,
        };
    });
    
    return {
        ...project,
        accesoriosUsadosEnProyecto: hydratedAccessories,
    };
  }
}

// Singleton instance of the mock store
export const mockStore = new MockStore();
