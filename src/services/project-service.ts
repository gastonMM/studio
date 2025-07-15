
import type { Project } from "@/types";

let projectsDB: Project[] = [];
let nextId = 1;

export async function getProjects(): Promise<Project[]> {
  return JSON.parse(JSON.stringify(projectsDB));
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return JSON.parse(JSON.stringify(projectsDB.find(p => p.id === id)));
}

export async function createProject(
  projectData: Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'>
): Promise<Project> {
  if (!projectData.nombreProyecto) {
    throw new Error("El nombre del proyecto es obligatorio.");
  }
  const now = new Date();
  const newProject: Project = {
    ...projectData,
    id: `proj${nextId++}`,
    fechaCreacion: now,
    fechaUltimoCalculo: now,
  };
  projectsDB.push(newProject);
  return JSON.parse(JSON.stringify(newProject));
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project | null> {
  const index = projectsDB.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }
  
  projectsDB[index] = {
    ...projectsDB[index],
    ...projectData,
    id: projectsDB[index].id, // Ensure ID is not changed
    fechaUltimoCalculo: new Date(),
  };
  
  return JSON.parse(JSON.stringify(projectsDB[index]));
}

export async function deleteProject(id: string): Promise<boolean> {
  const index = projectsDB.findIndex(p => p.id === id);
  if (index > -1) {
    projectsDB.splice(index, 1);
    return true;
  }
  return false;
}
