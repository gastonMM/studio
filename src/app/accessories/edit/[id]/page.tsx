
import { AccessoryForm } from "../../components/accessory-form";
import { fetchAccessoryById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditAccessoryPage({ params }: { params: { id: string } }) {
  const accessory = await fetchAccessoryById(params.id);

  if (!accessory) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <AccessoryForm accessory={accessory} />
    </div>
  );
}
