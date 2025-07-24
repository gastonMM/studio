

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { fetchSalesProfiles } from "./actions";
import { SalesProfileList } from "./components/sales-profile-list";

export const metadata: Metadata = {
    title: "Perfiles de Venta - Calculadora Costos 3D Pro",
    description: "Administra tus perfiles de venta para distintos canales.",
};

export default async function SalesProfilesPage() {
  const profiles = await fetchSalesProfiles();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Perfiles de Venta</h1>
        <Button asChild>
          <Link href="/sales-profiles/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Perfil de Venta
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listado de Perfiles de Venta</CardTitle>
          <CardDescription>
            Administra tus configuraciones para calcular precios en distintos canales de venta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesProfileList profiles={profiles} />
        </CardContent>
      </Card>
    </div>
  );
}
