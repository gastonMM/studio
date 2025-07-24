

"use server";

import type { Project } from "@/types";
import { revalidatePath } from "next/cache";
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from "@/services/project-service";

export async function fetchProjects(): Promise<Project[]> {
  return getProjects();
}

export async function fetchProjectById(id: string): Promise<Project | undefined> {
  return getProjectById(id);
}

export async function saveProjectAction(projectData: Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'> & { id?: string }) {
  try {
    if (projectData.id) {
      // For updates, we expect a full ProjectFormData object usually, but here we adapt
      const existingProject = await getProjectById(projectData.id);
      if (!existingProject) throw new Error("Proyecto no encontrado para actualizar.");
      
      const projectToUpdate: Project = {
        ...existingProject,
        ...projectData,
        fechaUltimoCalculo: new Date(),
      };
      await updateProject(projectData.id, projectToUpdate);

    } else {
      await createProject(projectData);
    }
    revalidatePath("/projects");
    if(projectData.id) revalidatePath(`/projects/edit/${projectData.id}`);
    
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await deleteProject(id);
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}
