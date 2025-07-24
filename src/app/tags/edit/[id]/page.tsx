
import { TagForm } from "../../components/tag-form";
import { fetchTagById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditTagPage({
  params,
}: {
  params: { id: string };
}) {
  const tag = await fetchTagById(params.id);

  if (!tag) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <TagForm tag={tag} />
    </div>
  );
}
