

import { SalesProfileForm } from "../../components/sales-profile-form";
import { fetchSalesProfileById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditSalesProfilePage({ params }: { params: { id: string } }) {
  const profile = await fetchSalesProfileById(params.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <SalesProfileForm profile={profile} />
    </div>
  );
}
