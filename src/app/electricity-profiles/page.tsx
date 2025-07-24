
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { fetchElectricityProfiles } from "./actions";
import { ElectricityProfileList } from "./components/electricity-profile-list";

export const metadata: Metadata = {
    title: "Perfiles de Electricidad - Calculadora Costos 3D Pro",
    description: "Administra tus tarifas eléctricas.",
};

export default async function ElectricityProfilesPage() {
  const profiles = await fetchElectricityProfiles();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Perfiles de Electricidad</h1>
        <Button asChild>
          <Link href="/electricity-profiles/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Perfil
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listado de Perfiles</CardTitle>
          <CardDescription>
            Administra tus tarifas de electricidad. Estos perfiles se usarán en los perfiles de impresora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ElectricityProfileList profiles={profiles} />
        </CardContent>
      </Card>
    </div>
  );
}
