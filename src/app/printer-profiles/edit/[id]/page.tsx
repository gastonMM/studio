
import { PrinterProfileForm } from "../../components/printer-profile-form";
import { fetchPrinterProfileById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditPrinterProfilePage({ params }: { params: { id: string } }) {
  const profile = await fetchPrinterProfileById(params.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <PrinterProfileForm profile={profile} />
    </div>
  );
}
