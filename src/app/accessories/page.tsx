
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { fetchAccessories } from "./actions";
import { AccessoryList } from "./components/accessory-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Gestión de Accesorios - Calculadora Costos 3D Pro",
  description: "Administra tus componentes adicionales como tornillos, imanes, etc.",
};

export default async function AccessoriesPage() {
  const accessories = await fetchAccessories();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Accesorios</h1>
        <Button asChild>
          <Link href="/accessories/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Accesorio
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Accesorios</CardTitle>
          <CardDescription>
            Administra los componentes adicionales para tus proyectos de impresión 3D.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <AccessoryList accessories={accessories} />
        </CardContent>
      </Card>
    </div>
  );
}
