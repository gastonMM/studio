import prisma from "@/lib/db";
import type { Tag, TagFormData } from "@/types";

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export async function getTags(): Promise<Tag[]> {
  return prisma.tag.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function getTagById(id: string): Promise<Tag | null> {
  return prisma.tag.findUnique({
    where: { id },
  });
}

export async function createTag(formData: TagFormData): Promise<Tag> {
    const existingTag = await prisma.tag.findUnique({
        where: { name: formData.name }
    });
    if (existingTag) {
        throw new Error("Ya existe una etiqueta con este nombre.");
    }

    return prisma.tag.create({
        data: {
            name: formData.name,
            color: formData.color || generateRandomColor(),
        }
    });
}

export async function updateTag(id: string, formData: Partial<TagFormData>): Promise<Tag | null> {
    return prisma.tag.update({
        where: { id },
        data: formData
    });
}

export async function deleteTag(id: string): Promise<boolean> {
    try {
        await prisma.tag.delete({ where: { id } });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
