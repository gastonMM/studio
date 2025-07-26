import { mockStore } from "./mock-store";
import type { Tag, TagFormData } from "@/types";

export async function getTags(): Promise<Tag[]> {
  return mockStore.getTags();
}

export async function getTagById(id: string): Promise<Tag | undefined> {
  return mockStore.getTagById(id);
}

export async function createTag(formData: TagFormData): Promise<Tag> {
    const existingTag = await mockStore.getTagByName(formData.name);
    if (existingTag) {
        throw new Error("Ya existe una etiqueta con este nombre.");
    }
    return mockStore.createTag(formData);
}

export async function updateTag(id: string, formData: Partial<TagFormData>): Promise<Tag | undefined> {
    return mockStore.updateTag(id, formData);
}

export async function deleteTag(id: string): Promise<boolean> {
  return mockStore.deleteTag(id);
}
