import type { Metadata } from "next";
import { MaterialList } from "./components/material-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { fetchMaterials } from "./actions"; // Assuming this action exists and fetches data

export const metadata: Metadata = {
  title: "Gestión de Materiales - Calculadora Costos 3D Pro",
  description: "Administra tus filamentos y resinas para impresión 3D.",
};

// Mock data for now - replace with actual data fetching
const sampleMaterials = [
  { id: "1", nombreMaterial: "PLA Blanco Económico", costoPorKg: 15000, pesoSpoolCompradoGramos: 1000, densidad: 1.24, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/pla-blanco" },
  { id: "2", nombreMaterial: "PETG Negro Premium", costoPorKg: 22000, pesoSpoolCompradoGramos: 1000, densidad: 1.27, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/petg-negro" },
];


export default async function MaterialsPage() {
  // In a real app, you would fetch materials from Firestore here
  // const materials = await fetchMaterials();
  const materials = sampleMaterials; // Using mock data for now

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
      <MaterialList materials={materials} />
    </div>
  );
}
