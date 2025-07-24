

"use server";

import type { Tag, TagFormData } from "@/types";
import { revalidatePath } from "next/cache";
import { getTags, getTagById, createTag, updateTag, deleteTag } from "@/services/tag-service";

export async function fetchTags(): Promise<Tag[]> {
  return getTags();
}

export async function fetchTagById(id: string): Promise<Tag | undefined> {
  return getTagById(id);
}

export async function saveTagAction(formData: TagFormData, tagId?: string) {
  try {
    if (tagId) {
        await updateTag(tagId, formData);
    } else {
        await createTag(formData);
    }
    revalidatePath("/tags");
    if(tagId) revalidatePath(`/tags/edit/${tagId}`);
    revalidatePath("/projects"); // Tags might be displayed there
    revalidatePath("/projects/calculate"); // Tags might be used there
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}

export async function deleteTagAction(id: string) {
  try {
    await deleteTag(id);
    revalidatePath("/tags");
    revalidatePath("/projects");
    revalidatePath("/projects/calculate");
    return { success: true };
  } catch(error) {
     const errorMessage =
      error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { success: false, error: errorMessage };
  }
}
