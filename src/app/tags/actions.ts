
"use server";

import type { Tag, TagFormData } from "@/types";
import { revalidatePath } from "next/cache";
import { getTags, getTagById, updateTag, deleteTag } from "@/services/tag-service";

export async function fetchTags(): Promise<Tag[]> {
  return getTags();
}

export async function fetchTagById(id: string): Promise<Tag | undefined> {
  return getTagById(id);
}

export async function saveTagAction(formData: TagFormData, tagId: string) {
  try {
    await updateTag(tagId, formData);
    revalidatePath("/tags");
    revalidatePath(`/tags/edit/${tagId}`);
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
  const success = await deleteTag(id);
  if (success) {
    revalidatePath("/tags");
    revalidatePath("/projects");
    revalidatePath("/projects/calculate");
    return { success: true };
  }
  return { success: false, error: "Etiqueta no encontrada." };
}
