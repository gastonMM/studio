import { mockStore } from "./mock-store";
import type { Project, ProjectWithRelations } from "@/types";

export async function getProjects(): Promise<ProjectWithRelations[]> {
  return mockStore.getProjects();
}

export async function getProjectById(id: string): Promise<ProjectWithRelations | undefined> {
  return mockStore.getProjectById(id);
}

export type ProjectData = Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'>

export async function createProject(
  projectData: ProjectData
): Promise<Project> {
  return mockStore.createProject(projectData);
}

export async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<Project | undefined> {
 return mockStore.updateProject(id, projectData);
}


export async function deleteProject(id: string): Promise<boolean> {
  return mockStore.deleteProject(id);
}
