import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { fetchPrinterProfiles } from "./actions";
import { PrinterProfileList } from "./components/printer-profile-list";

export const metadata: Metadata = {
    title: "Perfiles de Impresora - Calculadora Costos 3D Pro",
    description: "Administra la configuración de tus impresoras 3D.",
};

export default async function PrinterProfilesPage() {
  const profiles = await fetchPrinterProfiles();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Perfiles de Impresora</h1>
        <Button asChild>
          <Link href="/printer-profiles/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Perfil
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listado de Perfiles</CardTitle>
          <CardDescription>
            Administra las configuraciones de tus impresoras 3D. Estos perfiles se usarán en los cálculos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PrinterProfileList profiles={profiles} />
        </CardContent>
      </Card>
    </div>
  );
}
