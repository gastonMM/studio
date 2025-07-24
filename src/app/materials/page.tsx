import type { Metadata } from "next";
import { MaterialList } from "./components/material-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { fetchMaterials } from "./actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Gestión de Materiales - Calculadora Costos 3D Pro",
  description: "Administra tus filamentos y resinas para impresión 3D.",
};

export default async function MaterialsPage() {
  const materials = await fetchMaterials();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Materiales</h1>
        <Button asChild>
          <Link href="/materials/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Material
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Materiales</CardTitle>
          <CardDescription>
            Estos son los materiales que tienes registrados. Serán usados en los cálculos de costos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialList materials={materials} />
        </CardContent>
      </Card>
    </div>
  );
}
