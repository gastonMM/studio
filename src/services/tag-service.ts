
import type { Tag, TagFormData } from "@/types";
import { getProjects, updateProject } from './project-service';

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let tags: Tag[] = [
    { id: "tag-1", name: "Llaveros", color: "#3498db" },
    { id: "tag-2", name: "Decoración", color: "#e74c3c" },
    { id: "tag-3", name: "Funcional", color: "#2ecc71" },
];
let nextId = 4;

export async function getTags(): Promise<Tag[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return tags.sort((a,b) => a.name.localeCompare(b.name));
}

export async function getTagById(id: string): Promise<Tag | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return tags.find(t => t.id === id);
}

export async function createTag(formData: TagFormData): Promise<Tag> {
    const existingTag = tags.find(t => t.name.toLowerCase() === formData.name.toLowerCase());
    if (existingTag) {
        throw new Error("Ya existe una etiqueta con este nombre.");
    }

    const newTag: Tag = {
        id: `tag-${nextId++}`,
        name: formData.name,
        color: formData.color || generateRandomColor(),
    };
    tags.push(newTag);
    return newTag;
}

export async function updateTag(id: string, formData: Partial<TagFormData>): Promise<Tag | null> {
    const index = tags.findIndex(t => t.id === id);
    if (index === -1) return null;

    const oldTag = tags[index];
    const newName = formData.name;

    // If name is changing, update projects
    if (newName && oldTag.name !== newName) {
        const projects = await getProjects();
        for (const project of projects) {
            if (project.tags && project.tags.includes(oldTag.name)) {
                const updatedTags = project.tags.map(t => t === oldTag.name ? newName : t);
                const uniqueTags = Array.from(new Set(updatedTags));
                await updateProject(project.id, { tags: uniqueTags });
            }
        }
    }
    
    tags[index] = { ...oldTag, ...formData };
    return tags[index];
}


export async function deleteTag(id: string): Promise<boolean> {
    const tagToDelete = await getTagById(id);
    if (!tagToDelete) return false;

    // Delete from projects first
    const projects = await getProjects();
    for (const project of projects) {
        if (project.tags && project.tags.includes(tagToDelete.name)) {
            const updatedTags = project.tags.filter(t => t !== tagToDelete.name);
            await updateProject(project.id, { tags: updatedTags });
        }
    }

    // Then delete the tag itself
    const initialLength = tags.length;
    tags = tags.filter(t => t.id !== id);
    return tags.length < initialLength;
}
