

"use server";

import type { Project } from "@/types";
import { revalidatePath } from "next/cache";
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from "@/services/project-service";
import { getMaterials } from "@/services/material-service";
import { getAccessories } from "@/services/accessory-service";
import { getPrinterProfiles } from "@/services/printer-profile-service";
import { getElectricityProfiles } from "@/services/electricity-profile-service";
import { getSalesProfiles } from "@/services/sales-profile-service";
import { calculateProjectCost } from "@/lib/calculation";

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

export async function recalculateAllProjectsAction() {
    try {
        const [
            projects,
            materials,
            accessories,
            printerProfiles,
            electricityProfiles,
            salesProfiles
        ] = await Promise.all([
            getProjects(),
            getMaterials(),
            getAccessories(),
            getPrinterProfiles(),
            getElectricityProfiles(),
            getSalesProfiles()
        ]);

        for (const project of projects) {
             const results = calculateProjectCost(
                project,
                materials,
                printerProfiles,
                accessories,
                electricityProfiles,
                salesProfiles
            );

            if (results) {
                await updateProject(project.id, {
                    ...project,
                    resultadosCalculados: results,
                    fechaUltimoCalculo: new Date()
                });
            } else {
                console.warn(`Could not recalculate project ${project.id} (${project.nombreProyecto}). Skipping.`);
            }
        }
        revalidatePath('/projects');
        return { success: true, count: projects.length };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
        return { success: false, error: errorMessage };
    }
}
