import { MaterialForm } from "../../components/material-form";
import { fetchMaterialById } from "../../actions"; // Server action to fetch material
import { notFound } from "next/navigation";


export default async function EditMaterialPage({ params }: { params: { id: string } }) {
  const material = await fetchMaterialById(params.id);

  if (!material) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <MaterialForm material={material} />
    </div>
  );
}
