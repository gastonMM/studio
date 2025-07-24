
import { ElectricityProfileForm } from "../../components/electricity-profile-form";
import { fetchElectricityProfileById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditElectricityProfilePage({ params }: { params: { id: string } }) {
  const profile = await fetchElectricityProfileById(params.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <ElectricityProfileForm profile={profile} />
    </div>
  );
}
