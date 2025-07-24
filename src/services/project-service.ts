
import type { Project } from "@/types";

let projects: Project[] = [];
let nextId = 1;

export async function getProjects(): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return projects.sort((a,b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return projects.find(p => p.id === id);
}

export async function createProject(
  projectData: Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'>
): Promise<Project> {
  if (!projectData.nombreProyecto) {
    throw new Error("El nombre del proyecto es obligatorio.");
  }

  const now = new Date();
  const newProject: Project = {
    id: `proj${nextId++}`,
    ...projectData,
    tags: projectData.tags || [],
    fechaCreacion: now,
    fechaUltimoCalculo: now,
  };
  projects.push(newProject);
  return newProject;
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project | null> {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }
  
  const updatedProject = {
    ...projects[index],
    ...projectData,
    fechaUltimoCalculo: new Date(),
  };

  projects[index] = updatedProject;
  return updatedProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== id);
  return projects.length < initialLength;
}
