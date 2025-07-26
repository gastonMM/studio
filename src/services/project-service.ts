import prisma from "@/lib/db";
import type { Project } from "@/types";
import { Prisma } from '@prisma/client'

// Helper type to define Project with its relations
const projectWithRelations = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  include: { tags: true, accesoriosUsadosEnProyecto: { include: { accessory: true } } },
});
export type ProjectWithRelations = Prisma.ProjectGetPayload<typeof projectWithRelations>;


export async function getProjects(): Promise<ProjectWithRelations[]> {
  const projects = await prisma.project.findMany({
    orderBy: {
      fechaCreacion: 'desc'
    },
    include: {
      tags: true,
      accesoriosUsadosEnProyecto: {
        include: {
          accessory: true,
        }
      }
    }
  });

  return projects.map(p => ({
    ...p,
    imageUrls: p.imageUrls as string[],
    tags: p.tags.map(t => t.name),
    inputsOriginales: p.inputsOriginales as any,
    resultadosCalculados: p.resultadosCalculados as any,
    accesoriosUsadosEnProyecto: p.accesoriosUsadosEnProyecto.map(aip => ({
      ...aip.accessory,
      ...aip
    })),
  }));
}

export async function getProjectById(id: string): Promise<ProjectWithRelations | null> {
  const p = await prisma.project.findUnique({
    where: { id },
    include: {
      tags: true,
      accesoriosUsadosEnProyecto: {
        include: {
          accessory: true,
        }
      }
    }
  });
  if (!p) return null;

  return {
    ...p,
    imageUrls: p.imageUrls as string[],
    tags: p.tags.map(t => t.name),
    inputsOriginales: p.inputsOriginales as any,
    resultadosCalculados: p.resultadosCalculados as any,
    accesoriosUsadosEnProyecto: p.accesoriosUsadosEnProyecto.map(aip => ({
      ...aip.accessory,
      ...aip,
    })),
  };
}

// Type for creating/updating project
type ProjectData = Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'>

export async function createProject(
  projectData: ProjectData
): Promise<Project> {
  const { tags, accesoriosUsadosEnProyecto, ...rest } = projectData;

  return prisma.project.create({
    data: {
      ...rest,
      imageUrls: projectData.imageUrls as Prisma.JsonArray,
      inputsOriginales: projectData.inputsOriginales as Prisma.JsonObject,
      resultadosCalculados: (projectData.resultadosCalculados as Prisma.JsonObject) ?? Prisma.JsonNull,
      tags: {
        connect: tags?.map(tagName => ({ name: tagName })) ?? []
      },
      accesoriosUsadosEnProyecto: {
        create: accesoriosUsadosEnProyecto?.map(acc => ({
          cantidadUsadaPorPieza: acc.cantidadUsadaPorPieza,
          costoUnitarioAlMomentoDelCalculo: acc.costoUnitarioAlMomentoDelCalculo,
          accesorioId: acc.accesorioId
        })) ?? []
      }
    }
  });
}

export async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<Project | null> {
  const { tags, accesoriosUsadosEnProyecto, ...rest } = projectData;
  
  const updateData: Prisma.ProjectUpdateInput = {
    ...rest
  };
  
  if (rest.imageUrls) {
      updateData.imageUrls = rest.imageUrls as Prisma.JsonArray;
  }
  if (rest.inputsOriginales) {
      updateData.inputsOriginales = rest.inputsOriginales as Prisma.JsonObject;
  }
   if (rest.resultadosCalculados) {
      updateData.resultadosCalculados = rest.resultadosCalculados as Prisma.JsonObject;
  }
  
  if (tags) {
    updateData.tags = {
      set: tags.map(tagName => ({ name: tagName }))
    }
  }

  const tx = await prisma.$transaction(async (prisma) => {
    if (accesoriosUsadosEnProyecto) {
      await prisma.accessoryInProject.deleteMany({ where: { projectId: id }});
      await prisma.accessoryInProject.createMany({
        data: accesoriosUsadosEnProyecto.map(acc => ({
            projectId: id,
            accesorioId: acc.accesorioId,
            cantidadUsadaPorPieza: acc.cantidadUsadaPorPieza,
            costoUnitarioAlMomentoDelCalculo: acc.costoUnitarioAlMomentoDelCalculo,
        }))
      });
    }

    return prisma.project.update({
      where: { id },
      data: updateData
    })
  })

  return tx;
}


export async function deleteProject(id: string): Promise<boolean> {
  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
