// This is a mock store. In a real application, you'd use a database.
import type { Tag, TagFormData } from "@/types";
import { getProjects, updateProject } from './project-service';

// We will derive the tags from the projects themselves
// to ensure consistency.
async function getAllTagsFromProjects(): Promise<Tag[]> {
    const projects = await getProjects();
    const tagNames = new Set<string>();
    projects.forEach(p => p.tags?.forEach(t => tagNames.add(t)));
    
    // Create Tag objects with unique IDs from their names
    const tags: Tag[] = Array.from(tagNames).map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'), // simple slug for ID
        name: name,
    }));
    return tags.sort((a,b) => a.name.localeCompare(b.name));
}


export async function getTags(): Promise<Tag[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return await getAllTagsFromProjects();
}

export async function getTagById(id: string): Promise<Tag | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const tags = await getAllTagsFromProjects();
  return tags.find(t => t.id === id);
}

// Creating a tag doesn't really make sense in this model,
// as tags are created organically when added to projects.
// This function could be used for a dedicated tag creation UI if needed in the future.
// For now, we won't implement createTag as tags are managed via projects.

export async function updateTag(id: string, formData: TagFormData): Promise<Tag | null> {
    const oldTag = await getTagById(id);
    if (!oldTag) return null;

    const newName = formData.name;
    if (!newName || oldTag.name === newName) return oldTag;

    const projects = await getProjects();

    for (const project of projects) {
        if (project.tags && project.tags.includes(oldTag.name)) {
            const updatedTags = project.tags.map(t => t === oldTag.name ? newName : t);
            // In case the new tag name already exists, remove duplicates
            const uniqueTags = Array.from(new Set(updatedTags));
            await updateProject(project.id, { tags: uniqueTags });
        }
    }

    return { id: newName.toLowerCase().replace(/\s+/g, '-'), name: newName };
}


export async function deleteTag(id: string): Promise<boolean> {
    const tagToDelete = await getTagById(id);
    if (!tagToDelete) return false;

    const projects = await getProjects();
    let wasDeleted = false;
    for (const project of projects) {
        if (project.tags && project.tags.includes(tagToDelete.name)) {
            const updatedTags = project.tags.filter(t => t !== tagToDelete.name);
            await updateProject(project.id, { tags: updatedTags });
            wasDeleted = true;
        }
    }

    return wasDeleted;
}

